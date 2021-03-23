---
title: CloudflareとLet's EncryptでWebサイトをHTTPS化した
date: "2017-07-17"
tags:
  - server
summary_generated: "これまで HTTP でホストしていた研究会サイト sigpx.org\_ と個人サイト junkato.jp を HTTPS 化しました。前者は Cloudflare、後者は Let&#x27;s Encrypt を使いました。どちらも無料でした。できれば Cloudflar..."
altUrl: >-
  https://junkato.jp/ja/blog/2017/07/17/http-to-https-by-lets-encrypt-and-cloudflare
---

これまで HTTP でホストしていた研究会サイト [sigpx.org](https://sigpx.org)  と個人サイト [junkato.jp](https://junkato.jp/ja) を HTTPS 化しました。前者は Cloudflare、後者は Let's Encrypt を使いました。どちらも無料でした。

できれば Cloudflare で統一したかったのですが、事情があって別々の方法を取りました。また、手順自体はシンプルだったのですが、単純に移行するとはてなブックマークや Facebook の Like などが引き継がれないので、その対応が少々面倒くさかったです。

## Cloudflare で GitHub Pages を SSL 化

[SIGPX の Web サイト](https://sigpx.org/)は GitHub Pages でホストしています。GitHub Pages は github.io のサブドメインであれば SSL でアクセスできます（例: [https://sigpx.github.io](https://sigpx.github.io)）が、独自ドメインを使うと直接は SSL 化できません。

Cloudflare を使った具体的な SSL 化の方法については[すでに日本語の記事が Qiita などにあがっている](http://qiita.com/noraworld/items/89dd85a434a7b759e00c)のでそれを参照すると簡単だと思いますが、[英語なら Cloudflare 自身の ブログ記事もあります](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)。

仕組みとしては、独自ドメインの名前解決をするときに Cloudflare のネームサーバを見に行くようにすることで、HTTP であれ HTTPS であれ、アクセス時に GitHub Pages のサーバではなく Cloudflare のサーバへアクセスが飛ぶようにしています。

そして、以下のように、Cloudflare がリバースプロキシとなってブラウザと GitHub Pages サーバ間の接続を仲介することで、もともとの GitHub Pages と同じコンテンツへのアクセスが可能となっています。

<figure className="center">
  <a href="/images/cfssl_full.png"><img src="/images/cfssl_full.png" alt="" /></a>
  <figcaption>[What do the SSL options mean? - Cloudflare Support](https://support.cloudflare.com/hc/en-us/articles/200170416)</figcaption>
</figure>

設定の途中で、独自ドメイン契約先でネームサーバの設定を変更する作業が必要です。[お名前.com](https://www.onamae.com/)の場合は、「ドメイン設定」「ネームサーバーの設定」「ネームサーバーの変更」からネームサーバーを CloudFlare に指定されたものに変更します。

最終的に Cloudflare 上の DNS に関する設定は次のようになります。

[![](/images/cloudflare-configurations.png)](/images/cloudflare-configurations.png)

あとはサイト上で参照しているすべてのリソースが HTTPS で統一されていることを確認します。（そうしないとブラウザのアドレスバーに[「安全でない通信路」の情報](http://www.atmarkit.co.jp/ait/articles/1609/23/news023.html)が出続けます。）

GitHub Pages も Cloudflare も無料の範疇で転送データ量の制限などがあるようですが、ふつうに使うぶんには全く問題なさそうです。

## Let's Encrypt でさくらインターネットの共有サーバ上のサイトを SSL 化

さくらインターネットのスタンダードプランでホストしている個人サイト [junkato.jp](https://junkato.jp/ja) も Cloudflare で SSL 化できれば簡単だったのですが、そうはいきませんでした。設定後、Cloudflare の「Error 1000」が出るようになったのです。[まったく同じ問題で困った人のブログ記事](https://my.iesaba.com/posts/sakura-shared-server-very-bad)があって助かりました。記事から引用すると、起きている現象は以下のとおりです。

> 1. クライアントがさくらのレンタルサーバ(https)に対して要求を送信する
> 2. さくらのレンタルサーバ(https)の 443 番ポートは 80 番ポートへのプロキシなので名前解決を行う
> 3. 名前解決した結果、当然 CloudFlare の IP アドレスが返ってくるので、そのアドレスを使用し http で接続を試みる
> 4. CloudFlare(http)はさくらのレンタルサーバ(http)へ接続を試みてコンテンツを取得する

後で知ったのですが、[サイト全体を WordPress で運用している場合はさくらインターネットの公式プラグインがある](https://ja.wordpress.org/plugins/sakura-rs-wp-ssl/)ようです。自分の場合はそうではなかったので、Cloudflare を諦めて Let's Encrypt で証明書を取ることにしました。

SSL 化自体は、Qiita で[「さくらレンタルサーバーに独自 SSL「Let's Encrypt」導入(Windows10 編)」という記事](http://qiita.com/bass-inu/items/43637b3ceb9fa7cf05c7)を書いている方がいたので手順に従うだけでとても簡単でした。

## はてなブックマークと Facebook Likes

Web ページの URL が変わる（http が https になる）ので、これまでのブックマーク数や Likes は引き継げません。ただ、見た目上引き継ぐことはできます。

はてなブックマークの場合はウィジェット表示部の a タグに data-hatena-bookmark-url 要素を設定するとブックマーク対象の URL を変更できます。（[ボタン設置用フォーム](http://b.hatena.ne.jp/guide/bbutton)の「保存する URL」欄に対応）

Facebook の場合は同様に data-href 要素を設定します。（[Share Button Configurator](https://developers.facebook.com/docs/plugins/share-button)の URL to share に対応）

静的なページの場合は個別にこの対応をしていけばよいのですが、問題は WordPress で運用しているブログ（このページ）でした。HTTPS 化する前のページは HTTP の URL で、HTTPS 化したあとのページは HTTPS の URL でシェアボタンの類を設置したいので、利用している[WP Social Bookmarking Light](https://wordpress.org/plugins/wp-social-bookmarking-light/)のソースコードを編集して対応しました。

変更点は以下のとおり:

[https://github.com/arcatdmz/WP-Social-Bookmarking-Light/commit/d48293c05cde3fbe41a4ab8622cac488f6a71549](https://github.com/arcatdmz/WP-Social-Bookmarking-Light/commit/d48293c05cde3fbe41a4ab8622cac488f6a71549)

日付の判定は[Service.php の 50 行目](https://github.com/arcatdmz/WP-Social-Bookmarking-Light/blob/d48293c05cde3fbe41a4ab8622cac488f6a71549/src/WpSocialBookmarkingLight/Service.php#L50)で行っています。

そんなわけで、意外と考えることは多かったですがちゃんと HTTPS 化できました。Let's Encrypt の証明書更新も自動化したいのですが、さくらインターネット側が API のようなかたちで対応してくれないと難しいかもしれません。（ヘッドレスブラウザでログインから自動化する？）
