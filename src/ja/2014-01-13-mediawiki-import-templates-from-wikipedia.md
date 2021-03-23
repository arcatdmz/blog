---
title: Wikipediaのテンプレートを自前のMediaWikiに追加した
date: "2014-01-13"
tags:
  - programming
  - server
coverImage: infobox.png
summary_generated: >-
  前日に引き続きMediaWikiに関する記事です。 素の MediaWiki は、記事を全て Wiki
  記法でべた書きしなくてはなりません。Wikipedia
  の記事では、右の図の情報ボックス(Infobox)のように、記事の種類ごとにテンプレートがあって、同じようなレイア...
altUrl: >-
  https://junkato.jp/ja/blog/2014/01/13/mediawiki-import-templates-from-wikipedia
---

<figure className="right">
  <a href="/images/infobox.png"><img src="/images/infobox-300x180.png" alt="" /></a>
  <figcaption>Wikipedia Infobox</figcaption>
</figure>

[前日](/ja/posts/2014-01-12-mediawiki/ "MediaWikiの多言語対応を調べた | junkato.jp")に引き続き[MediaWiki](http://www.mediawiki.org/wiki/MediaWiki "MediaWiki")に関する記事です。

素の MediaWiki は、記事を全て Wiki 記法でべた書きしなくてはなりません。Wikipedia の記事では、右の図の情報ボックス([Infobox](http://ja.wikipedia.org/wiki/Template:Infobox "Template:Infobox - Wikipedia"))のように、記事の種類ごとに[テンプレート](http://ja.wikipedia.org/wiki/Help:%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88 "Help:テンプレート - Wikipedia")があって、同じようなレイアウトの Wiki データを何度もコピー＆ペーストしないで済むようになっています。

Wikipedia の便利なテンプレートを自分で設置したローカルの MediaWiki でも使えるようにするには、まず Wikipedia で Infobox を定義しているデータを XML ファイルとしてエクスポートしてから、ローカルの MediaWiki にインポートする必要があります(**Wiki データのコピー**)。また、特定の拡張機能に依存しているテンプレートの場合は、当該の拡張機能もインストールする必要があります(**依存関係にある拡張機能のインストール**)。さらに、テンプレート内で独自の画像を埋め込んでいる場合は、画像ファイルも別途コピーしてくる必要があります(**画像データのコピー**)。Infobox はこれら三つ全てに当てはまるケースで、非常に面倒でした。

そこで、Wikipedia のテンプレート Infobox を、さくらインターネットのサーバに設置した MediaWiki でも使えるようにした手順を説明します。先に言っておきますと、長いです。

## テンプレートのエクスポートとインポート

まず、Wikipedia 閲覧中に、自分の MediaWiki でも使ってみたいよさそうなテンプレート(定型表現)を見かけたとします。Wiki のいいところは、その部分がどんな Wiki 記法で書かれているかすぐに調べられるところです。ページ右上の "Edit" をクリックして、該当箇所が **{{Infobox (中略)}}**  と書かれていることが分かりました。これは、該当箇所が Infobox テンプレートを用いて書かれていることを表しています。[Template:Infobox](http://en.wikipedia.org/wiki/Template:Infobox)にアクセスすると、Infobox テンプレートについての詳しい説明を読むことができます。

さて、テンプレートの名前が分かったところで、そのデータを XML ファイルとしてエクスポートしましょう。そのためには、[Special:Export](https://en.wikipedia.org/wiki/Special:Export)にアクセスします。この Export ページは、MediaWiki エンジンで動作しているどの Wiki にも備わっています。大きなテキストエリアに **Template:Infobox** と入力して、 Include only the current revision, not the full history, Include templates,  Save as file 全てにチェックをつけて Export ボタンをクリックすれば、XML ファイルがダウンロードできます。この中には、Infobox テンプレートの他にも依存関係のあるすべてのテンプレートが含まれます。

ここまできたら自分の MediaWiki の Special:Import ページにアクセスします。そこで、先ほどダウンロードした XML ファイルを選択してアップロードすると、テンプレートがインポートされます。これだけで済めば楽ですが、Infobox の場合は複数の拡張機能に依存しており、インポートした Template:Infobox を表示しようとするとエラーが表示されます。

## Scribunto と Lua のインストール

Infobox は、インストール時のオプションによっては有効化されていない[ParserFunctions](http://www.mediawiki.org/wiki/Extension:ParserFunctions "Extension:ParserFunctions - MediaWiki")と、素の MediaWiki には入っていない[Scribunto](http://www.mediawiki.org/wiki/Extension:Scribunto "Extension:Scribunto - MediaWiki")という拡張機能に依存しています。

ParserFunctions については、[Special:Version](http://www.mediawiki.org/wiki/Special:Version "Version - MediaWiki")(リンク先は MediaWiki のもの)の Installed extensions という項目に表示されていなければ LocalSettings.php の末尾に以下の行を足せば有効化されます。

```php
require_once "$IP/extensions/ParserFunctions/ParserFunctions.php";
```

Scribunto は、サーバ環境にインストールされたスクリプティング言語のインタプリタを呼び出すことで、PHP 以外の言語でスクリプトを記述できるようにする拡張機能です。Infobox の定義には同名の Lua モジュール([Module:Lua](http://en.wikipedia.org/wiki/Module:Infobox "Module:Infobox - Wikipedia"))が使われており、Scribunto に加えてサーバ環境に Lua のバイナリが必要です。

まず、Lua をサーバにインストールします。[Lua download area](http://www.lua.org/ftp/)に **lua-5.\*.tar.gz** というようなファイル名のソースコードがあるので、これをダウンロードして make します。さくらインターネットのレンタルサーバにインストールするため、自分のホームディレクトリ以下に local というディレクトリを作って、そこにソース、ライブラリ、実行ファイルを置くようにしています。このあたりは[Trac をインストールしたときの記録](http://digitalmuseum.jp/text/replus/article/trac-on-sakura)に詳しく書きました。

```bash
cd ~/local/src/
wget http://www.lua.org/ftp/lua-5.*.tar.gz
tar -zxvf lua-5.*
cd lua-5.*
make freebsd
make local
cd bin
ln -s lua lua-5.*
```

これで ~/local/src/lua-5.\*/bin の中に **lua-5.\*** というバイナリが生成されます。

次に、Scribunto をインストールします。基本的には[MediaWiki 上の日本語の説明](http://www.mediawiki.org/wiki/Extension:Scribunto/ja#.E3.82.A4.E3.83.B3.E3.82.B9.E3.83.88.E3.83.BC.E3.83.AB "Extension:Scribunto - MediaWiki")に従っていけば大丈夫です。[Download MediaWiki extension - MediaWiki](http://www.mediawiki.org/wiki/Special:ExtensionDistributor/Scribunto)から自分の MediaWiki 環境に合ったバージョンを選択し、Continue ボタンをクリックすると  **wikimedia-mediawiki-extensions-Scribunto-\*.tar.gz** のような名前の圧縮ファイルがダウンロードできます。これを MediaWiki のインストールディレクトリに移動し、

```bash
tar zxf wikimedia-mediawiki-extensions-Scribunto-*.tar.gz
mv wikimedia-mediawiki-extensions-Scribunto-* ~/www/wiki/extensions/Scribunto
```

LocalSettings.php の末尾で次のように呼び出してやればインストール完了です。(username, 5.\*は環境に合わせて変えてください。)

```php
require_once "$IP/extensions/Scribunto/Scribunto.php";
$wgScribuntoDefaultEngine = 'luastandalone';
$wgScribuntoEngineConf['luastandalone']['luaPath'] = '/home/username/local/src/lua-5.*/bin/lua5.*';
```

僕の環境ではシンタックスハイライトのための拡張機能 GeSHi とコードエディタの拡張機能 CodeEditor をインストールしていたため、次の行を追加して連携させました。

```php
$wgScribuntoUseGeSHi = true;
$wgScribuntoUseCodeEditor = true;
```

これで、Template:Infobox がサーバエラーなく表示されるようになるはずです。しかし、テンプレートが依存している画像データがないため、当該箇所の表示が崩れます。

## 画像データのコピー

最後に、テンプレートが依存している画像の一覧を取得し、Wikipedia および Wikimedia にアップロードされた同名画像をダウンロードして、自前の MediaWiki に登録します。これにより、Infobox が完璧な状態で表示されるようになります。本当は、Special:Export および Special:Import が文字ベースの XML ファイルだけでなく依存関係にある画像まで扱えるようになってくれれば楽なのですが、そのようなリクエストは[MediaWiki の Bugzilla に登録されたまま](https://bugzilla.wikimedia.org/show_bug.cgi?id=13827 "Bug 13827 - Add image data option to Special:Export")長らく放置されています。

MediaWiki において、画像など存在しないファイルへのリンクは[Special:WantedFiles](https://en.wikipedia.org/wiki/Special:WantedFiles "Wanted files - Wikipedia")(リンク先は Wikipedia のもの)で一覧できます。これをコマンドラインで取得して、足りないものと同名のファイルを Wikipedia からうまく取得、登録できたらよいのですが…方針が立たず困っていたところ、[Mediawiki: How to export a subset of pages including images](http://logbuffer.wordpress.com/2012/02/17/mediawiki-how-to-export-a-subset-of-pages-including-images/ "Mediawiki: How to export a subset of pages including images - Logbuffer Blog")という、とても参考になる記事を見つけました。

この記事によれば、MediaWiki では、画像ファイルは MD5 ハッシュの先頭 1 文字および 2 文字を名前に持つフォルダの中に格納されます。例えば、 **Lua-logo-nolabel.svg** なら

```bash
% echo -n Lua-logo-nolabel.svg | md5 6a3ed151b18e5e08776de4449bdf8bbe
```

なので、 $MEDIAWIKI**/images/6/6a/Lua-logo-nolabel.svg** に保存されます。MD5 ハッシュの値は Wikipedia でもさくらインターネットのレンタルサーバでも一緒なので、これを使って Wikipedia の URL を推測できます。 Lua-logo-nolabel.svg は Wikimedia Commons にアップロードされたものなら [**http://upload.wikimedia.org/wikipedia/commons/6/6a/Lua-logo-nolabel.svg**](http://upload.wikimedia.org/wikipedia/commons/6/6a/Lua-logo-nolabel.svg) にあるはずです。

そこで、まずローカルの MediaWiki に対してコマンドラインで SQL クエリを発行して足りないファイルの一覧を取得し、ローカルのファイルを探して、もしなければリモートの Wiki エンジンにおけるファイルの URL を推測してファイルをダウンロードするという方法が取れることになります。

上述の記事に掲載されているシェルスクリプトを、さくらインターネットのレンタルサーバ用に味付けしたものを以下に示します。(コードの整理と、さくらインターネットのレンタルサーバでは md5 ハッシュを求めるコマンドが md5sum ではなく md5 なので、そこを変えたりしています。)

```bash
#!/bin/sh

SQL_HOST="mysql*.db.sakura.ne.jp"
SQL_USER="digitalmuseum"
SQL_PWD="***"
SQL_TABLE="digitalmuseum"
MEDIAWIKI_DIR="$HOME/www/wiki"
IMAGE_DOWNLOAD_DIR="./images"
REMOTE_PATH="http://upload.wikimedia.org/wikipedia/en"

SQL_CMD="SET NAMES utf8; SELECT distinct il_to FROM imagelinks;"
IMAGE_DIR="$MEDIAWIKI_DIR/images"
MD5="md5"

mkdir -p $IMAGE_DOWNLOAD_DIR

images=`echo $SQL_CMD | mysql -h $SQL_HOST -u $SQL_USER -p"$SQL_PWD" $SQL_TABLE | grep -v '^il_to$'`
for image in $images
do
  md5=`echo -n $image | $MD5`
  first=`echo $md5 | cut -c1-1`
  second=`echo $md5 | cut -c1-2`
  target="$IMAGE_DIR"/"$first"/"$second"/"$image"
  if [ -f $target ]
  then
    echo found $target
  else
    url="$REMOTE_PATH"/"$first"/"$second"/"$image"
    echo downloading $url
    wget -a ./getMediaWikiImages.log --restrict-file-names=nocontrol -P $IMAGE_DOWNLOAD_DIR $url
  fi
done

php $MEDIAWIKI/maintenance/importImages.php $IMAGE_DOWNLOAD_DIR
```

これを実行すると、足りないファイルを Wikipedia からダウンロードして、自前の MediaWiki に登録してくれます。

こうして、晴れて Wikipedia のテンプレートを画像も含めコピーすることができました！いやー長かった…。

```

```
