---
title: "MediaWikiの多言語対応を調べた"
date: "2014-01-11"
tags: 
  - "programming"
  - "server"
---

多言語対応できてそれなりにしっかりしたWikiエンジンを探していたら[MediaWiki](http://www.mediawiki.org/wiki/MediaWiki)にたどり着いたのだけど、どうもやり方がよく分からない。ドキュメントも日本語ではあまり見つからなかった。

というわけで、基礎知識と、多言語対応の方法について調べたことを書いておきます。

## MediaWikiの基礎知識

- [Wikipedia](http://ja.wikipedia.org/)など大型Wikiサイトのエンジンとして有名
- [インストールガイド](http://www.mediawiki.org/wiki/Manual:Installation_guide/ja#.E3.82.AF.E3.82.A4.E3.83.83.E3.82.AF.E3.82.A4.E3.83.B3.E3.82.B9.E3.83.88.E3.83.BC.E3.83.AB.E3.82.AC.E3.82.A4.E3.83.89)によるとPHP (5.3.2-) + MySQL (5.0.2-, InnoDB推奨)あるいはSQLite, PostgreSQL (8.1-)で動作する
- デフォルトのURLはindex.php?…と長ったらしい
    - Apache mod\_rewriteを使っている場合は[所定の方法](http://www.mediawiki.org/wiki/Manual:Short_URL/ja)で短くできる

### Extensionによる機能拡張

[Extension](http://www.mediawiki.org/wiki/Manual:Extensions/ja)で機能を拡張できますが、わりと方法は原始的です。

- tarballをダウンロード、解凍してextensionsに突っ込み、LocalSettings.phpという特別な設定ファイルの末尾にrequire\_once文を足すことで機能が拡張される
- データベースを利用する拡張機能の場合、別途データベースの更新作業が必要になることがある
- [更新作業](http://www.mediawiki.org/wiki/Manual:Upgrading/ja#.E6.9B.B4.E6.96.B0.E3.82.B9.E3.82.AF.E3.83.AA.E3.83.97.E3.83.88.E3.82.92.E5.AE.9F.E8.A1.8C)ではmaintenance/update.phpをコマンドラインで実行するか、Webアップデータを利用する

### Skinによる見た目の変更

[Skin](http://www.mediawiki.org/wiki/Manual:Skin_configuration/ja)でデフォルトの見た目を変えられますが、あまり作っている人がいない感じです。

- tarballあるいはzipをダウンロードしてskinsに突っ込むことで選べるスキンが増える
- スキン一つにつき "スキン名.php" (先頭大文字)というファイルと "スキン名" というディレクトリがある
- ログインしている人は当該Wikiにインストールされているものの中から自分好みのスキンを選べる
- [公式サイトのスキン一覧](http://www.mediawiki.org/wiki/Category:All_skins)はなんだか寂しい感じ
- [外部サイトが独自に収集したスキン一覧](https://wikiapiary.com/wiki/Skin:Main_Page)もバリエーションに欠ける…要は作ってる人が少ないものと思われる
- デフォルトでついてくるVectorか、かつてMozilla Wikiで使われていたという[Cavendish](http://www.mediawiki.org/wiki/Skin:Cavendish)の改良版[Cavendish-mw](http://sourceforge.net/projects/cavendishmw/ "Cavendish-MW | Free software downloads at SourceForge.net")あたりが完成度高そう

## 多言語対応の方法

で、さまざまな言語で記事を作りたいときは、2つの方法があります。

1. 拡張機能 Translate を使う
2. Wiki familyを作る

これらは根本的に異なる方法で、結果としてできることも全く違います。

### 拡張機能[Translate](http://www.mediawiki.org/wiki/Extension:Translate/ja)を使う

一つ目は、一つのWikiを拡張して多言語で記事を書くサポートを足す方法です。

段落ごとに翻訳したり、他の人に校正を頼むなど、翻訳に関する機能が細かく追加されます。これにより、記事翻訳のプロセス全体が便利になりますが、Wikiのベース言語をほかの言語に翻訳することしかできません。

例えば、英語Wikiを作ったら、各記事を日本語やフランス語などに翻訳する機能がつきますが、逆に日本語で記事を作っておいたものを英語に翻訳する機能はありません。

### [Wiki family](http://www.mediawiki.org/wiki/Manual:Wiki_family/ja)を作る

二つ目は、言語ごとに個別のWikiを設置しつつ、基本的なファイルを共有することで無駄を省く方法です。Wiki間はInterwikiの相互リンクによってゆるく接続されます。

言語ごとの記事データは全く別のデータベースで管理されます。Wikipediaはこの方法を取っています。とても柔軟な運用ができますが、Translateを使う場合のような緻密な翻訳支援機能は期待できません。

今回は英語のWikiを作って日本語などに翻訳していきたかったので、一つ目の方法を取りました。

## MediaWiki Language Extension Bundle

[Translate](http://www.mediawiki.org/wiki/Extension:Translate)という拡張機能は、前述のように翻訳プロセス全体を支援してくれます。これを単体でインストールしてもよいのですが、公式サイトは[MediaWiki Language Extension Bundle](http://www.mediawiki.org/wiki/MediaWiki_Language_Extension_Bundle)(MLEB)という他の拡張機能もセットになったバンドルを入れることをお勧めしています。

インストール手順はMLEBの[公式インストールガイド](http://www.mediawiki.org/wiki/MLEB#Installation)をまとめると以下の通りです。

1. tarballをMediaWikiのインストールディレクトリにダウンロードする
2. tar xjf MediaWikiLanguageExtensionBundle-\*.tar.bz2 コマンドを実行してMediaWikiのインストールディレクトリ下に展開する
3. LocalSettings.phpに $EXT = "$IP/extensions"; という行を足す
4. LocalSettings.phpにその他の設定を書き足す
5. データベースの更新作業を行う

ここまでしても、Wikiページの見た目にはあまり変化がありません。かろうじて、MediaWikiエンジンの表示インタフェース言語を切り替えるUniversal Language Selectorのリンクが画面上に追加される程度です。

翻訳のための主たるインタフェースは特別なWikiネーム、Special:Translateでアクセスできるようになっていますが、このURLへのリンクはどこにも追加されません。分かりづらいです…。例えば、[MediaWiki公式サイトのSpecial:Translate](http://www.mediawiki.org/wiki/Special:Translate?language=ja)を見てみるとよいでしょう。ここには翻訳待ちのWikiページ一覧が表示されます。

一般的なWikiページを翻訳待ち一覧に登録するには、ページの当該箇所を <translate>～</translate> で囲む必要があります。そうすると、当該ページに翻訳用のリンクが表示されたり、Special:Translateの一覧に登録されたりします。

その後、翻訳が部分的にでも済むと、例えば Fréttinga という記事なら Fréttinga/ja のように言語の識別子がポストフィックスについたWikiページが生成されます。また、ページ内に <languages /> と書き込んでおくと、他言語版の記事へのリンクのテンプレートが挿入されます。
