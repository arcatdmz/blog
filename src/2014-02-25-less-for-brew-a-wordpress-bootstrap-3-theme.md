---
title: "Bootstrap 3ベースのWordPressテーマをLESSで編集する"
date: "2014-02-25"
tags: 
  - "design"
  - "programming"
  - "server"
---

自分のポートフォリオサイトで使っているBootstrapのバージョンを2から3にあげたので、このブログ(WordPress)のテーマも同時に更新しました。ポートフォリオサイトでは[Bootstrap 3のvariables.lessを編集](http://www.find-job.net/startup/twitter-bootstrap-3)したうえでgruntを使ってビルドして使っているため、見た目に統一感を持たせるためには、WordPress用テーマのほうでもカスタムビルドしたBootstrapを素直に使える必要があります。

Bootstrap 2のときは[WP-BootstrapというテーマをダウンロードしてきてBootstrapのCSSを全部置換するだけ](http://junkato.jp/ja/blog/2012/10/30/hello-world/ "Hello world!")で割とうまくいっていたのですが、Bootstrap 3に対応したWP-Bootstrapの最新版はイマイチまだ作りかけ感があり、前と同じように簡単にはいかなさそうだったので、違う人が作ったテーマを探すことにしました。最終的には、探すだけでなくちょっとPHPのソースをいじることになりました。その記録を書いておきます。

さて、僕が求めているWordPress用テーマの条件は、Bootstrap 3を使っていて簡素なつくりである(したがって、カスタムビルドしたBootstrapを素直に導入して自分のWebサイトと統一感のある見た目にできる)こと。必然的に、あれこれ揃っている有償のテーマでなく無償配布されているオープンソースのテーマが候補になりました。[Shoestrap](http://shoestrap.org/ "shoestrap.org")はビルドに失敗し、[Roots](http://roots.io/ "Roots")は開発フローが複雑ですぐに使える感じではなく、最終的に行き着いたのは[BREW for Wordpress](http://danvswild.com/brew/)でした。

## LESSコンパイラのインストール

前提条件として、手元のテスト環境にLESSファイルのコンパイラが必要です。Windowsだと[WinLess](http://winless.org/ "WinLess")が、Macだと[LESS.app](http://incident57.com/less/ "LESS.app")が使いやすいようですが、僕はコマンドラインのlesscを使うことにしました。

Bootstrapをビルドする関係でMacPortsを使ってNode.jsをインストールしていたので、次のコマンドでlesscコマンドが使えるようになりました。ちなみに、--forceフラグは、何かのはずみで古いlessc（バージョン1.3.0）が既に入っていたので、それを上書きするためです。

\[code lang="bash"\]npm install less --global --force \[/code\]

本記事の内容は、こうしてインストールした lessc 1.6.3 (LESS Compiler) \[JavaScript\] で動作確認しています。

## BREWのインストール

1. [ソースをZIPでまとめてダウンロード](https://github.com/slightlyoffbeat/brew/archive/master.zip "slightlyoffbeat/brew - Download ZIP")する
2. WordPressのthemesフォルダの中に突っ込む
3. 通常のテーマと同様にWebインタフェースでBREWを選ぶ

以上でインストール終了です。これだけで素のBootstrapらしい外観になります。

## BREWのLESSソース編集とstyle.css更新

BREWのスタイルシートは[library/css/style.css](https://github.com/slightlyoffbeat/brew/blob/master/library/css/style.css#L8 "brew/library/css/style.css")にまとまっており、これは、[library/less/style.less](https://github.com/slightlyoffbeat/brew/blob/master/library/less/style.less "brew/library/less/style.less")をコンパイルした結果です。

style.lessは中で様々な外部lessファイルを読み込んでおり、その中にカスタマイズ可能な変数の一覧を含むファイル[library/less/custom-variables.less](https://github.com/slightlyoffbeat/brew/blob/master/library/less/custom-variables.less "brew/library/less/custom-variables.less")があります。内容はBootstrap 3のvariables.lessとほとんど同じです。

そこで、このcustom-variables.lessの内容を元サイトのBootstrap 3用のvariables.lessを参考にしながら書き換えていき、次のコマンドでstyle.cssを更新します。(WinLESSやLESS.appを使っている場合は、手動でstyle.cssをlibrary/css/にコピーして古いstyle.cssを上書きします。)

\[code lang="bash"\]lessc --compress style.less &gt; ../css/style.css \[/code\]

基本的には、これだけでBREWテーマを好きな見た目に調整できます。

## BREWにマルチバイト対応の処理を足す

見た目に関しては概ね満足できたのですが、記事を単独で表示する際のテンプレートsingle.phpで前後の記事に飛ぶリンクがときどき文字化けするのが気になりました。

ソースコードをを追ってみると[brew\_truncate\_text関数](https://github.com/slightlyoffbeat/brew/blob/f5ab904da2e95b9953e188a5c662cc00134b238e/library/brew.php#L217 "function brew_truncate_text")の中で1バイト文字前提の文字列編集操作が行われていました。具体的には、文字列が指定長より長かった場合に後ろを削って「…」を足す処理をsubstr関数で行っていました。そこで、この関数の中身を全部mb\_substrなどマルチバイト対応の文字列処理関数に書き直して、文字化けが起きる可能性を潰しました。

以上、Bootstrap 3対応のWordPressテーマを自分流にカスタマイズして実用するまでの記録でした。
