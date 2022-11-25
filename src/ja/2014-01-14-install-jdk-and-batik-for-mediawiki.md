---
title: レンタルサーバのMediaWikiにJava製SVGレンダラを設定した
date: "2014-01-14"
tags:
  - programming
  - server
summary_generated: >-
  MediaWiki に画像をアップロードすると、その縮小版を ImageMagick で作ってくれます。デフォルトでは$wgFileExtensionsに
  jpg/jpeg/png/gif の拡張子が登録されており、JPEG/PNG/GIF 画像しかアップロードできないよう...
altUrl: "https://junkato.jp/ja/blog/2014/01/14/install-jdk-and-batik-for-mediawiki/"
---

MediaWiki に画像をアップロードすると、その縮小版を ImageMagick で作ってくれます。デフォルトでは[$wgFileExtensions](http://www.mediawiki.org/wiki/Manual:$wgFileExtensions "Manual:$wgFileExtensions - MediaWiki")に jpg/jpeg/png/gif の拡張子が登録されており、JPEG/PNG/GIF 画像しかアップロードできないようになっていますが、Wikipedia ではグラフなども含め最近ベクター形式の SVG フォーマットの画像がたくさん見られるようになっています。[SVG を可読性のある XML として記述しておけば翻訳が簡単だから](http://en.wikipedia.org/wiki/Wikipedia:Collaboration_to_convert_graphs_to_SVG "Wikipedia:Collaboration to convert graphs to SVG - Wikipedia")、という理由もあるようです。

ただし、僕が MediaWiki を設置しているさくらのレンタルサーバで SVG をアップロードできるようにするには、$wgFileExtensions に svg を足すだけでは不十分でした。レンタルサーバにインストールされている ImageMagick が、SVG の他フォーマットへの変換をサポートしていなかったのです。

そこで、この記事では、SVG 画像のレンダリングに使うエンジンを ImageMagick から Apache Batik という Java で動作するものに差し替えた手順を紹介します。(これで、[前日](/ja/posts/2014-01-13-mediawiki-import-templates-from-wikipedia/ "Wikipediaのテンプレートを自前のMediaWikiに追加した")、[前々日](/ja/posts/2014-01-12-mediawiki/ "MediaWikiの多言語対応を調べた")から続いた MediaWiki のセットアップ記録は終わりです。)

## ImageMagick と librsvg の関係

さくらのレンタルサーバにインストールされている ImageMagick は、SVG のレンダリングに必要な librsvg に依存する設定になっていました。ただ、その librsvg が存在していなかったのです。単なる設定ミスか、サーバ負荷が重くなるからわざと外したんでしょうか。それとも何かほかの理由が…(**フラグ**)

試しに SVG フォーマットの画像を PNG に変換しようとすると以下のエラーが出ます。この状態で MediaWiki に SVG 画像をアップロードしても、Web インタフェース上で同じエラーメッセージが出ます。

```shell
% convert -o test.png test.svg
6a: delegate failed `"rsvg-convert" -o "%o" "%i"' @ error/delegate.c/InvokeDelegate/1065.
6a: unable to open image `/tmp/magick-33161aUu_YCemoI0c': No such file or directory @ error/blob.c/OpenBlob/2638.
6a: unable to open file `/tmp/magick-33161aUu_YCemoI0c': No such file or directory @ error/constitute.c/ReadImage/589.
6a: unrecognized option `-o' @ error/convert.c/ConvertImageCommand/2139.
```

ImageMagick が SVG 画像のレンダリングに関して rsvg-convert を内部呼び出ししていることは、次のコマンドでも確認できます。

```shell
% convert -list delegate | grep "svg ="
svg => "rsvg-convert" -o "%o" "%i"
```

そこで、レンタルサーバのユーザとして取れる対処法は以下の二つです。

- ImageMagick を正しく動作させるために librsvg をインストールする
- MediaWiki が SVG 画像の変換に ImageMagick 以外のエンジンを使うようにする

結論から言って、一つ目の方法は挫折しました。librsvg → Cairo → gdk-pixbuf, pixman → glib2.0, libffi, …という具合にビルドとインストールの作業を進めようとするたびに必要なモジュールが出てきて、しかも各モジュールのバージョン間の相性がわりとシビアだったためです。いろいろ苦労したあとで見つけたのですが、MediaWiki のマニュアルにも librsvg には**とち狂った膨大な依存関係**([a ridiculously large chain of dependencies](http://www.mediawiki.org/wiki/Manual:Image_Administration#SVG "Manual:Image administration - MediaWiki"))があってお勧めできないと書かれています。ああ、だからさくらのレンタルサーバには librsvg が入ってないんですね。(**フラグ回収**)

ここからは二つ目の方法について書いていきます。

## SVG 変換エンジンの選定

MediaWiki のマニュアルによれば、SVG 変換エンジンは[$wgSVGConverter](http://www.mediawiki.org/wiki/Manual:$wgSVGConverter "Manual:$wgSVGConverter - MediaWiki")に ImageMagick、sodipodi、inkscape、batik、rsvg、imgserv のいずれかを設定すれば切り替えられるようです。また、[$wgSVGConverters](http://www.mediawiki.org/wiki/Manual:$wgSVGConverters "Manual:$wgSVGConverters - MediaWiki")に適切なコマンド名を記述すればその他の変換エンジンも使えるようになるそうです。とくに SVG レンダラに詳しいわけでもないので、この中から選ぶことにしました。

ImageMagick 以外はどれも使ったことがない…[Inkscape](http://www.inkscape.org/ja/ "Inkscape")はデスクトップアプリの印象が強いんですが、Windows で PHP 動かしている場合には使いやすいのかもしれません。その他もざっと調べてみたところ、batik は[Apache Batik](http://xmlgraphics.apache.org/batik/ "Apache Batik SVG Toolkit")という名前で開発されている Java 製 SVG レンダラとのこと。Java VM の立ち上げコストを考えると動作が重そうですが、Java 厨としては心くすぐられるところがあります。とりあえず、Batik を使ってみることにしました。

## JDK 1.6 のインストール

さくらのレンタルサーバには Java は入っていません。まず JDK をインストールするためにアーキテクチャを調べます。

```shell
% uname -rsm
FreeBSD 9.1-RELEASE-p7 amd64
```

64 ビット版 FreeBSD のようです。[FreeBSD の Java のサポートページ](http://www.freebsd.org/ja/java/ "FreeBSD Javaプロジェクト")を見てみると、通常の FreeBSD ディストリビューションだと /usr/ports/java/openjdk16 に入って make install すればいいようです。が、さくらのレンタルサーバでは当該ディレクトリにアクセスできません。ユーザが FreeBSD ports が使えないようになっているんですね。[ユーザ領域に FreeBSD ports をインストールする](http://www.otsune.com/bsd/ports/install_as_user.html "otsune's FreeBSD memo - ユーザー領域にFreeBSD portsをインストールする方法")か、他をあたってビルド済み JDK を入手する必要がありそうです。

今回は、FreeBSD の Web サイトをもう少し調べて、[古い JDK](https://www.freebsdfoundation.org/java/java16)を見つけました。Apache Batik をローカルで使うだけなら、この古い版でも大丈夫そうです。古いだけあって FreeBSD 9.x 用のバイナリがありませんが、FreeBSD 7.x/amd64 用の Diablo Caffe JDK 1.6.0-7 をダウンロードしてみたところ、今のところ問題なく動いてくれています。

このあたりのインストール方法については[Google 検索](https://www.google.co.jp/search?q=さくら+レンタルサーバ+java)するとたくさん出てくるので詳しくは書きません。 ~/local/java というディレクトリを作って、 jdk から diablo-jdk1.6.0 へのシンボリックリンクを張りました。また、 lib というサブディレクトリにライブラリを放り込むことにしました。

## Apache Batik のインストールと MediaWiki の設定

インストールは、[Apache Batik のダウンロードページ](http://xmlgraphics.apache.org/batik/download.html "Apache Batik: Downloading A Distribution")からリンクをたどって適切なミラーを選び、それをダウンロードして解凍するだけです。

```shell
% cd ~/local/java/lib
% wget http://ftp.tsukuba.wide.ad.jp/software/apache/xmlgraphics/batik/batik-1.7.zip
% unzip batik-1.7.zip
% cd batik-1.7
% ls
```

あとは MediaWiki の LocalSettings.php に以下のような設定を書き足して、SVG ファイルをアップロードして確認してみるだけ。(username は環境に応じて変えてください。)

```php
$wgFileExtensions[] = 'svg';
$wgSVGConverters['batik'] = '/home/username/local/java/jdk/bin/java -Djava.awt.headless=true -jar $path/batik-rasterizer.jar -w $width -d $output $input';
$wgSVGConverterPath = '/home/username/local/java/lib/batik-1.7';
$wgSVGConverter = 'batik';
```

わりとすんなりいきました。
