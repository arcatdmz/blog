---
title: "レンタルサーバのMediaWikiにJava製SVGレンダラを設定した"
date: "2014-01-13"
categories: 
  - "programming"
  - "server"
---

MediaWikiに画像をアップロードすると、その縮小版をImageMagickで作ってくれます。デフォルトでは[$wgFileExtensions](http://www.mediawiki.org/wiki/Manual:$wgFileExtensions "Manual:$wgFileExtensions - MediaWiki")にjpg/jpeg/png/gifの拡張子が登録されており、JPEG/PNG/GIF画像しかアップロードできないようになっていますが、Wikipediaではグラフなども含め最近ベクター形式のSVGフォーマットの画像がたくさん見られるようになっています。[SVGを可読性のあるXMLとして記述しておけば翻訳が簡単だから](http://en.wikipedia.org/wiki/Wikipedia:Collaboration_to_convert_graphs_to_SVG "Wikipedia:Collaboration to convert graphs to SVG - Wikipedia")、という理由もあるようです。

ただし、僕がMediaWikiを設置しているさくらのレンタルサーバでSVGをアップロードできるようにするには、$wgFileExtensionsにsvgを足すだけでは不十分でした。レンタルサーバにインストールされているImageMagickが、SVGの他フォーマットへの変換をサポートしていなかったのです。

そこで、この記事では、SVG画像のレンダリングに使うエンジンをImageMagickからApache BatikというJavaで動作するものに差し替えた手順を紹介します。(これで、[前日](http://junkato.jp/ja/blog/2014/01/13/mediawiki-import-templates-from-wikipedia/ "Wikipediaのテンプレートを自前のMediaWikiに追加した")、[前々日](http://junkato.jp/ja/blog/2014/01/12/mediawiki/ "MediaWikiの多言語対応を調べた")から続いたMediaWikiのセットアップ記録は終わりです。)

## ImageMagickとlibrsvgの関係

さくらのレンタルサーバにインストールされているImageMagickは、SVGのレンダリングに必要なlibrsvgに依存する設定になっていました。ただ、そのlibrsvgが存在していなかったのです。単なる設定ミスか、サーバ負荷が重くなるからわざと外したんでしょうか。それとも何かほかの理由が…(**フラグ**)

試しにSVGフォーマットの画像をPNGに変換しようとすると以下のエラーが出ます。この状態でMediaWikiにSVG画像をアップロードしても、Webインタフェース上で同じエラーメッセージが出ます。

\[code lang="shell"\]% convert -o test.png test.svg 6a: delegate failed \`"rsvg-convert" -o "%o" "%i"' @ error/delegate.c/InvokeDelegate/1065. 6a: unable to open image \`/tmp/magick-33161aUu\_YCemoI0c': No such file or directory @ error/blob.c/OpenBlob/2638. 6a: unable to open file \`/tmp/magick-33161aUu\_YCemoI0c': No such file or directory @ error/constitute.c/ReadImage/589. 6a: unrecognized option \`-o' @ error/convert.c/ConvertImageCommand/2139.\[/code\]

ImageMagickがSVG画像のレンダリングに関してrsvg-convertを内部呼び出ししていることは、次のコマンドでも確認できます。

\[code lang="shell"\]% convert -list delegate | grep "svg =" svg => "rsvg-convert" -o "%o" "%i"\[/code\]

そこで、レンタルサーバのユーザとして取れる対処法は以下の二つです。

- ImageMagickを正しく動作させるためにlibrsvgをインストールする
- MediaWikiがSVG画像の変換にImageMagick以外のエンジンを使うようにする

結論から言って、一つ目の方法は挫折しました。librsvg → Cairo → gdk-pixbuf, pixman → glib2.0, libffi, …という具合にビルドとインストールの作業を進めようとするたびに必要なモジュールが出てきて、しかも各モジュールのバージョン間の相性がわりとシビアだったためです。いろいろ苦労したあとで見つけたのですが、MediaWikiのマニュアルにもlibrsvgには**とち狂った膨大な依存関係**([a ridiculously large chain of dependencies](http://www.mediawiki.org/wiki/Manual:Image_Administration#SVG "Manual:Image administration - MediaWiki"))があってお勧めできないと書かれています。ああ、だからさくらのレンタルサーバにはlibrsvgが入ってないんですね。(**フラグ回収**)

ここからは二つ目の方法について書いていきます。

## SVG変換エンジンの選定

MediaWikiのマニュアルによれば、SVG変換エンジンは[$wgSVGConverter](http://www.mediawiki.org/wiki/Manual:$wgSVGConverter "Manual:$wgSVGConverter - MediaWiki")にImageMagick、sodipodi、inkscape、batik、rsvg、imgservのいずれかを設定すれば切り替えられるようです。また、[$wgSVGConverters](http://www.mediawiki.org/wiki/Manual:$wgSVGConverters "Manual:$wgSVGConverters - MediaWiki")に適切なコマンド名を記述すればその他の変換エンジンも使えるようになるそうです。とくにSVGレンダラに詳しいわけでもないので、この中から選ぶことにしました。

ImageMagick以外はどれも使ったことがない…[Inkscape](http://www.inkscape.org/ja/ "Inkscape")はデスクトップアプリの印象が強いんですが、WindowsでPHP動かしている場合には使いやすいのかもしれません。その他もざっと調べてみたところ、batikは[Apache Batik](http://xmlgraphics.apache.org/batik/ "Apache Batik SVG Toolkit")という名前で開発されているJava製SVGレンダラとのこと。Java VMの立ち上げコストを考えると動作が重そうですが、Java厨としては心くすぐられるところがあります。とりあえず、Batikを使ってみることにしました。

## JDK 1.6のインストール

さくらのレンタルサーバにはJavaは入っていません。まずJDKをインストールするためにアーキテクチャを調べます。

\[code lang="shell"\]% uname -rsm FreeBSD 9.1-RELEASE-p7 amd64\[/code\]

64ビット版FreeBSDのようです。[FreeBSDのJavaのサポートページ](http://www.freebsd.org/ja/java/ "FreeBSD Javaプロジェクト")を見てみると、通常のFreeBSDディストリビューションだと /usr/ports/java/openjdk16 に入ってmake installすればいいようです。が、さくらのレンタルサーバでは当該ディレクトリにアクセスできません。ユーザがFreeBSD portsが使えないようになっているんですね。[ユーザ領域にFreeBSD portsをインストールする](http://www.otsune.com/bsd/ports/install_as_user.html "otsune's FreeBSD memo - ユーザー領域にFreeBSD portsをインストールする方法")か、他をあたってビルド済みJDKを入手する必要がありそうです。

今回は、FreeBSDのWebサイトをもう少し調べて、[古いJDK](https://www.freebsdfoundation.org/java/java16)を見つけました。Apache Batikをローカルで使うだけなら、この古い版でも大丈夫そうです。古いだけあってFreeBSD 9.x用のバイナリがありませんが、FreeBSD 7.x/amd64用のDiablo Caffe JDK 1.6.0-7をダウンロードしてみたところ、今のところ問題なく動いてくれています。

このあたりのインストール方法については[Google検索](https://www.google.co.jp/search?q=さくら+レンタルサーバ+java)するとたくさん出てくるので詳しくは書きません。 ~/local/java というディレクトリを作って、 jdk から diablo-jdk1.6.0 へのシンボリックリンクを張りました。また、 lib というサブディレクトリにライブラリを放り込むことにしました。

## Apache BatikのインストールとMediaWikiの設定

インストールは、[Apache Batikのダウンロードページ](http://xmlgraphics.apache.org/batik/download.html "Apache Batik: Downloading A Distribution")からリンクをたどって適切なミラーを選び、それをダウンロードして解凍するだけです。

\[code lang="shell"\]% cd ~/local/java/lib % wget http://ftp.tsukuba.wide.ad.jp/software/apache/xmlgraphics/batik/batik-1.7.zip % unzip batik-1.7.zip % cd batik-1.7 % ls\[/code\]

あとはMediaWikiのLocalSettings.phpに以下のような設定を書き足して、SVGファイルをアップロードして確認してみるだけ。(usernameは環境に応じて変えてください。)

\[code lang="php"\]$wgFileExtensions\[\] = 'svg'; $wgSVGConverters\['batik'\] = '/home/username/local/java/jdk/bin/java -Djava.awt.headless=true -jar $path/batik-rasterizer.jar -w $width -d $output $input'; $wgSVGConverterPath = '/home/username/local/java/lib/batik-1.7'; $wgSVGConverter = 'batik';\[/code\]

わりとすんなりいきました。
