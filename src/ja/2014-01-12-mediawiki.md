---
title: MediaWikiの多言語対応を調べた
date: "2014-01-12"
tags:
  - programming
  - server
summary_generated: >-
  多言語対応できてそれなりにしっかりした Wiki
  エンジンを探していたらMediaWikiにたどり着いたのだけど、どうもやり方がよく分からない。ドキュメントも日本語ではあまり見つからなかった。というわけで、基礎知識と、多言語対応の方法について調べたことを書いておきます。Me...
altUrl: "https://junkato.jp/ja/blog/2014/01/12/mediawiki"
---

多言語対応できてそれなりにしっかりした Wiki エンジンを探していたら[MediaWiki](http://www.mediawiki.org/wiki/MediaWiki)にたどり着いたのだけど、どうもやり方がよく分からない。ドキュメントも日本語ではあまり見つからなかった。

というわけで、基礎知識と、多言語対応の方法について調べたことを書いておきます。

## MediaWiki の基礎知識

- [Wikipedia](http://ja.wikipedia.org/)など大型 Wiki サイトのエンジンとして有名
- [インストールガイド](http://www.mediawiki.org/wiki/Manual:Installation_guide/ja#.E3.82.AF.E3.82.A4.E3.83.83.E3.82.AF.E3.82.A4.E3.83.B3.E3.82.B9.E3.83.88.E3.83.BC.E3.83.AB.E3.82.AC.E3.82.A4.E3.83.89)によると PHP (5.3.2-) + MySQL (5.0.2-, InnoDB 推奨)あるいは SQLite, PostgreSQL (8.1-)で動作する
- デフォルトの URL は index.php?…と長ったらしい
  - Apache mod_rewrite を使っている場合は[所定の方法](http://www.mediawiki.org/wiki/Manual:Short_URL/ja)で短くできる

### Extension による機能拡張

[Extension](http://www.mediawiki.org/wiki/Manual:Extensions/ja)で機能を拡張できますが、わりと方法は原始的です。

- tarball をダウンロード、解凍して extensions に突っ込み、LocalSettings.php という特別な設定ファイルの末尾に require_once 文を足すことで機能が拡張される
- データベースを利用する拡張機能の場合、別途データベースの更新作業が必要になることがある
- [更新作業](http://www.mediawiki.org/wiki/Manual:Upgrading/ja#.E6.9B.B4.E6.96.B0.E3.82.B9.E3.82.AF.E3.83.AA.E3.83.97.E3.83.88.E3.82.92.E5.AE.9F.E8.A1.8C)では maintenance/update.php をコマンドラインで実行するか、Web アップデータを利用する

### Skin による見た目の変更

[Skin](http://www.mediawiki.org/wiki/Manual:Skin_configuration/ja)でデフォルトの見た目を変えられますが、あまり作っている人がいない感じです。

- tarball あるいは zip をダウンロードして skins に突っ込むことで選べるスキンが増える
- スキン一つにつき "スキン名.php" (先頭大文字)というファイルと "スキン名" というディレクトリがある
- ログインしている人は当該 Wiki にインストールされているものの中から自分好みのスキンを選べる
- [公式サイトのスキン一覧](http://www.mediawiki.org/wiki/Category:All_skins)はなんだか寂しい感じ
- [外部サイトが独自に収集したスキン一覧](https://wikiapiary.com/wiki/Skin:Main_Page)もバリエーションに欠ける…要は作ってる人が少ないものと思われる
- デフォルトでついてくる Vector か、かつて Mozilla Wiki で使われていたという[Cavendish](http://www.mediawiki.org/wiki/Skin:Cavendish)の改良版[Cavendish-mw](http://sourceforge.net/projects/cavendishmw/ "Cavendish-MW | Free software downloads at SourceForge.net")あたりが完成度高そう

## 多言語対応の方法

で、さまざまな言語で記事を作りたいときは、2 つの方法があります。

1. 拡張機能 Translate を使う
2. Wiki family を作る

これらは根本的に異なる方法で、結果としてできることも全く違います。

### 拡張機能[Translate](http://www.mediawiki.org/wiki/Extension:Translate/ja)を使う

一つ目は、一つの Wiki を拡張して多言語で記事を書くサポートを足す方法です。

段落ごとに翻訳したり、他の人に校正を頼むなど、翻訳に関する機能が細かく追加されます。これにより、記事翻訳のプロセス全体が便利になりますが、Wiki のベース言語をほかの言語に翻訳することしかできません。

例えば、英語 Wiki を作ったら、各記事を日本語やフランス語などに翻訳する機能がつきますが、逆に日本語で記事を作っておいたものを英語に翻訳する機能はありません。

### [Wiki family](http://www.mediawiki.org/wiki/Manual:Wiki_family/ja)を作る

二つ目は、言語ごとに個別の Wiki を設置しつつ、基本的なファイルを共有することで無駄を省く方法です。Wiki 間は Interwiki の相互リンクによってゆるく接続されます。

言語ごとの記事データは全く別のデータベースで管理されます。Wikipedia はこの方法を取っています。とても柔軟な運用ができますが、Translate を使う場合のような緻密な翻訳支援機能は期待できません。

今回は英語の Wiki を作って日本語などに翻訳していきたかったので、一つ目の方法を取りました。

## MediaWiki Language Extension Bundle

[Translate](http://www.mediawiki.org/wiki/Extension:Translate)という拡張機能は、前述のように翻訳プロセス全体を支援してくれます。これを単体でインストールしてもよいのですが、公式サイトは[MediaWiki Language Extension Bundle](http://www.mediawiki.org/wiki/MediaWiki_Language_Extension_Bundle)(MLEB)という他の拡張機能もセットになったバンドルを入れることをお勧めしています。

インストール手順は MLEB の[公式インストールガイド](http://www.mediawiki.org/wiki/MLEB#Installation)をまとめると以下の通りです。

1. tarball を MediaWiki のインストールディレクトリにダウンロードする
2. tar xjf MediaWikiLanguageExtensionBundle-\*.tar.bz2 コマンドを実行して MediaWiki のインストールディレクトリ下に展開する
3. LocalSettings.php に $EXT = "$IP/extensions"; という行を足す
4. LocalSettings.php にその他の設定を書き足す
5. データベースの更新作業を行う

ここまでしても、Wiki ページの見た目にはあまり変化がありません。かろうじて、MediaWiki エンジンの表示インタフェース言語を切り替える Universal Language Selector のリンクが画面上に追加される程度です。

翻訳のための主たるインタフェースは特別な Wiki ネーム、Special:Translate でアクセスできるようになっていますが、この URL へのリンクはどこにも追加されません。分かりづらいです…。例えば、[MediaWiki 公式サイトの Special:Translate](http://www.mediawiki.org/wiki/Special:Translate?language=ja)を見てみるとよいでしょう。ここには翻訳待ちの Wiki ページ一覧が表示されます。

一般的な Wiki ページを翻訳待ち一覧に登録するには、ページの当該箇所を <translate>～</translate> で囲む必要があります。そうすると、当該ページに翻訳用のリンクが表示されたり、Special:Translate の一覧に登録されたりします。

その後、翻訳が部分的にでも済むと、例えば Fréttinga という記事なら  Fréttinga/ja のように言語の識別子がポストフィックスについた Wiki ページが生成されます。また、ページ内に <languages /> と書き込んでおくと、他言語版の記事へのリンクのテンプレートが挿入されます。
