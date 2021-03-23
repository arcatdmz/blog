---
title: Hello world!
date: "2012-10-30"
tags:
  - design
  - research
  - server
summary_generated: ブログを始める準備をしています。考えたこと、やったことを一覧にしておきます。
altUrl: "https://junkato.jp/ja/blog/2012/10/30/hello-world"
---

ブログを始める準備をしています。考えたこと、やったことを一覧にしておきます。

## タイトル決めとロゴデザイン

はてなダイアリーでいろいろ書いていたやっていた頃よりも研究・開発にフォーカスしたブログにしようと思っています。狙いが明確だったので、タイトル決めやデザインも楽でした。

まず、僕の研究上の大目標は、国民皆プログラマ化です。それは別に、プログラミングを啓蒙したいということではありません。みんな普段からけっこうプログラミングのキモになる概念を使って暮らしている(People are programmers.)という考え方がベースにあって、その暮らしと、本気のプログラミングを使ってもっと便利に楽しくなった暮らしの間のギャップを埋める、実世界指向のエンドユーザプログラミングを可能にしたいと思っているのです。

この大目標に取り組む以前の問題として、僕は今あるプログラミング言語・ライブラリ・開発環境に著しい不足を感じています。User experience (UX)という言葉が流行っている昨今、プログラマのプログラミング体験(Programmer's experience, PX)は何年も前から大して向上しているように思えません。言語・ライブラリ・開発環境、それぞれの面で少しずつ改善はしているのですが、ある目的のプログラムを作ろうとしたときのワークフロー全体を支援してくれる、流れるようなプログラミング体験を実現してくれる環境はあまりないのです。PX の視点の欠如は、[Programmers are people, too.](http://queue.acm.org/detail.cfm?id=1071731 "Programmers Are People, too - ACM Queue")とか[Software engineers are people, too.](http://www.cs.cmu.edu/~natprog/papers/Myers2012ICSE_Talk.pdf "Software Engineers are People Too: Applying Human Centered Approaches to Improve Software Development. - Brad Myer's talk slides")といった言葉が端的に表しています。プログラマは、人のために便利な道具を作るくせに、自分たちのことを人だと思っていないのではないでしょうか。

そこで、Programmer's experience (PX)をロゴの中心に据えて、下に補足する文を足しました。タイポグラフィだけのロゴにしたのは、自分が言葉（文字言語）が好きだから、あと非常にミーハーですが Windows 8 UI に影響されたからです:)

![P(x)](/images/px-junkato.jp.400.png "People are programmers. ロゴ画像")

## WordPress のインストール

タイトルとかロゴといった一番楽しいところを考え終えたら、あとはブログシステムのインストールです。昔は[ミドルウェアの一部として自作](http://digitalmuseum.jp/software/chippie/ "Chippie : digitalmuseum")していたのですが、最近は出来合いのシステムを作ったほうがいろいろ便利です…。

- [WordPress 3.4.2 日本語版](http://ja.wordpress.org/)のサーバへのダウンロードと展開
- ./config.sample.php を編集して config.php にコピー
- ブログの URL にアクセスしてデータベース初期化
- パーマリンク設定をカスタマイズして個々のブログ記事の URL を/月/日/slug/形式に変更

## 外観テーマとプラグインのインストール

### WP-Bootstrap

[主サイト](https://junkato.jp/)のデザインを Bootstrap ベースで書いているので、これに合わせるため、WordPress 用の Bootstrap ベースのデザインのテーマをインストールしました。

- [WP-Bootstrap](http://320press.com/wpbs/)のサーバへのダウンロードと./wp-contents/themes/への展開
- [wordpress-bootstrap/library/css/bootstrap.css](https://junkato.jp/ja/blog/wp-content/themes/wordpress-bootstrap/library/css/bootstrap.css)などの URL で参照されている Bootstrap を主サイトのものに差し換え
- functions.php, header.php, style.css, footer.php を編集してデザインのバグを修正
- [wordpress-bootstrap/library/images/icons/h/apple-touch-icon.png](https://junkato.jp/ja/blog/wp-content/themes/wordpress-bootstrap/library/images/icons/h/apple-touch-icon.png)などの URL で参照されているブログサイトのアイコンを自作のものに差し換え

### WP Social Bookmarking Light

イマドキのサイトらしく記事ごとに Twitter や Facebook のボタンをつけておきたくて、それができるプラグインをインストールしました。

- [WP Social Bookmarking Light](http://www.ninxit.com/blog/2010/06/13/wp-social-bookmarking-light/)のサーバへのダウンロードと./wp-contents/plugins/への展開
- プラグインの有効化
- はてなブックマーク、Facebook、Twitter のボタンを、この順番で並べるように設定

### WP-OGP Customized

Facebook のボタンをつけたところで、そういえば Facebook は Open Graph protocol とかいう書式を使って Web サイトのメタ情報を見てるんだった、と思いだしたので、それを WordPress のヘッダに書き加えるプラグインをインストールしました。

- [WP-OGP Customized](http://inspire-tech.jp/2011/07/wp_ogp_customized_plugin/)のサーバへのダウンロードと./wp-contents/plugins/への展開
- og:img のデフォルト画像を更新
- プラグインの有効化
