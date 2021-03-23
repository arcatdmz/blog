---
title: Bootstrap 3ベースのWordPressテーマをLESSで編集する
date: "2014-02-26"
tags:
  - design
  - programming
  - server
summary_generated: >-
  自分のポートフォリオサイトで使っている Bootstrap のバージョンを 2 から 3
  にあげたので、このブログ(WordPress)のテーマも同時に更新しました。ポートフォリオサイトではBootstrap 3 の variables.less
  を編集したうえで grun...
---

自分のポートフォリオサイトで使っている Bootstrap のバージョンを 2 から 3 にあげたので、このブログ(WordPress)のテーマも同時に更新しました。ポートフォリオサイトでは[Bootstrap 3 の variables.less を編集](http://www.find-job.net/startup/twitter-bootstrap-3)したうえで grunt を使ってビルドして使っているため、見た目に統一感を持たせるためには、WordPress 用テーマのほうでもカスタムビルドした Bootstrap を素直に使える必要があります。

Bootstrap 2 のときは[WP-Bootstrap というテーマをダウンロードしてきて Bootstrap の CSS を全部置換するだけ](http://junkato.jp/ja/blog/2012/10/30/hello-world/ "Hello world!")で割とうまくいっていたのですが、Bootstrap 3 に対応した WP-Bootstrap の最新版はイマイチまだ作りかけ感があり、前と同じように簡単にはいかなさそうだったので、違う人が作ったテーマを探すことにしました。最終的には、探すだけでなくちょっと PHP のソースをいじることになりました。その記録を書いておきます。

さて、僕が求めている WordPress 用テーマの条件は、Bootstrap 3 を使っていて簡素なつくりである(したがって、カスタムビルドした Bootstrap を素直に導入して自分の Web サイトと統一感のある見た目にできる)こと。必然的に、あれこれ揃っている有償のテーマでなく無償配布されているオープンソースのテーマが候補になりました。[Shoestrap](http://shoestrap.org/ "shoestrap.org")はビルドに失敗し、[Roots](http://roots.io/ "Roots")は開発フローが複雑ですぐに使える感じではなく、最終的に行き着いたのは[BREW for Wordpress](http://danvswild.com/brew/)でした。

## LESS コンパイラのインストール

前提条件として、手元のテスト環境に LESS ファイルのコンパイラが必要です。Windows だと[WinLess](http://winless.org/ "WinLess")が、Mac だと[LESS.app](http://incident57.com/less/ "LESS.app")が使いやすいようですが、僕はコマンドラインの lessc を使うことにしました。

Bootstrap をビルドする関係で MacPorts を使って Node.js をインストールしていたので、次のコマンドで lessc コマンドが使えるようになりました。ちなみに、--force フラグは、何かのはずみで古い lessc（バージョン 1.3.0）が既に入っていたので、それを上書きするためです。

```bash
npm install less --global --force
```

本記事の内容は、こうしてインストールした lessc 1.6.3 (LESS Compiler) で動作確認しています。

## BREW のインストール

1. [ソースを ZIP でまとめてダウンロード](https://github.com/slightlyoffbeat/brew/archive/master.zip "slightlyoffbeat/brew - Download ZIP")する
2. WordPress の themes フォルダの中に突っ込む
3. 通常のテーマと同様に Web インタフェースで BREW を選ぶ

以上でインストール終了です。これだけで素の Bootstrap らしい外観になります。

## BREW の LESS ソース編集と style.css 更新

BREW のスタイルシートは[library/css/style.css](https://github.com/slightlyoffbeat/brew/blob/master/library/css/style.css#L8 "brew/library/css/style.css")にまとまっており、これは、[library/less/style.less](https://github.com/slightlyoffbeat/brew/blob/master/library/less/style.less "brew/library/less/style.less")をコンパイルした結果です。

style.less は中で様々な外部 less ファイルを読み込んでおり、その中にカスタマイズ可能な変数の一覧を含むファイル[library/less/custom-variables.less](https://github.com/slightlyoffbeat/brew/blob/master/library/less/custom-variables.less "brew/library/less/custom-variables.less")があります。内容は Bootstrap 3 の variables.less とほとんど同じです。

そこで、この custom-variables.less の内容を元サイトの Bootstrap 3 用の variables.less を参考にしながら書き換えていき、次のコマンドで style.css を更新します。(WinLESS や LESS.app を使っている場合は、手動で style.css を library/css/にコピーして古い style.css を上書きします。)

```bash
lessc --compress style.less > ../css/style.css
```

基本的には、これだけで BREW テーマを好きな見た目に調整できます。

## BREW にマルチバイト対応の処理を足す

見た目に関しては概ね満足できたのですが、記事を単独で表示する際のテンプレート single.php で前後の記事に飛ぶリンクがときどき文字化けするのが気になりました。

ソースコードをを追ってみると[brew_truncate_text 関数](https://github.com/slightlyoffbeat/brew/blob/f5ab904da2e95b9953e188a5c662cc00134b238e/library/brew.php#L217 "function brew_truncate_text")の中で 1 バイト文字前提の文字列編集操作が行われていました。具体的には、文字列が指定長より長かった場合に後ろを削って「…」を足す処理を substr 関数で行っていました。そこで、この関数の中身を全部 mb_substr などマルチバイト対応の文字列処理関数に書き直して、文字化けが起きる可能性を潰しました。

以上、Bootstrap 3 対応の WordPress テーマを自分流にカスタマイズして実用するまでの記録でした。
