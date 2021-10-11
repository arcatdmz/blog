---
title: 立花隆公式サイトを作りました
date: "2021-10-11"
tags:
  - programming
  - research
  - server
  - science
coverImage: tachibana-rip.png
summary: >-
  今年 4 月 30 日、立花隆氏が亡くなりました。立花氏ははやくからインターネットの可能性に注目していました。氏の公式サイトは、かつて私がメンテナンスをお手伝いしていたのですが、ドメインの失効とともに閉鎖になっていたのです。訃報を受け、サイトを一から作り直して 6 月に https://tachibana.rip で公開しました。さらに、このたび、そのソースコードを公開しました。
summary_generated: >-
  今年 4 月 30 日、立花隆氏が亡くなりました。80 歳でした。私は大学の学部一年から二年にかけて、 2005 年に始まった東京大学
  第二期立花隆ゼミで幹事を務め、氏には大変お世話になりました。当時、科学技術のいろいろな分野の最先端に触れ、また、その社会とのかかわりを考え...
---

今年 4 月 30 日、立花隆氏が亡くなりました。80 歳でした。私は大学の学部一年から二年にかけて、 2005 年に始まった東京大学 第二期立花隆ゼミで幹事を務め、氏には大変お世話になりました。

立花氏ははやくからインターネットの可能性に注目し、誰もが発信できる時代、良質な情報をキュレーションすることの重要性などにいち早く気づいていました。第一期 立花隆ゼミでも [Cyber University](https://cyu.digitalmuseum.jp/about.html) という Web サイトを作り講義録を残していますが、私のいた第二期はさらに Web が活動の中心となっていました。第二期 立花隆ゼミでは、氏の掛け声のもと、ゼミ生みんなで大きな科学技術総合メディア・サイトを作ろう、と奮闘しました。

そのとき制作したサイト「SCI（サイ）」は今も https://sci.digitalmuseum.jp で見られるように残してあります。私が主体的に関わった企画のなかでは、例えば押井守氏との対談記事など今読んでも発見があり、色褪せない価値があると思います。

https://twitter.com/arcatdmz/status/1224859951568285696

立花氏と情報技術の関わりについて、詳細なエピソードは
[ユリイカ 2021 年 9 月号　特集＝立花隆](http://www.seidosha.co.jp/book/index.php?id=3602)に寄稿したので、興味のある方はぜひご覧ください。（[刊行当時の Facebook ポスト](https://www.facebook.com/jun.kato/posts/10165330006385391)）

## 立花隆公式サイト

前置きが長くなりましたが、かつて私は、そんな氏の公式サイトのメンテナンスをしていました。ただ、公式サイトはドメインの失効とともに閉鎖になっていたのです。訃報を受けて、立花ゼミの友人とともに一から作り直して 6 月に https://tachibana.rip で公開しました。

[![](/images/tachibana-rip.png)](https://tachibana.rip)

さらに、このたび、そのソースコードを公開しました。

[GitHub: ChezTachibana/website](https://github.com/ChezTachibana/website)

立花氏の著作やテレビの出演情報など、Web サイト上で確認できる情報の元データとなる CSV ファイルなどが GitHub リポジトリから簡単に取得できます。ご遺族の目を通してあり、氏の情報としては一番まとまっていると思いますので、何かのお役に立つこともあるかもしれません。

[GitHub: ChezTachibana/website/tree/main/data](https://github.com/ChezTachibana/website/tree/main/data)

## GitHub で開発 Cloudflare でホスト

技術的には今どきのモダンな構成になっています。

- React フレームワーク: [Next.js](https://nextjs.org/)
- CSS フレームワーク: [Bulma](https://bulma.io/)

これらのフレームワークを使い、Web サイト全体を静的に書き出して、Web サーバでホストしています。

CI/CD には当初 GitHub Actions だけを使っていましたが、途中から Web サイトをホストする目的で [Cloudflare Pages](https://pages.cloudflare.com/) を利用し始めたため、そのビルドパイプラインを併用しています。

具体的には、 Git の `main` ブランチに `push` されるたび、 [Cloudflare Pages API](https://developers.cloudflare.com/pages/platform/api) の REST エンドポイントにリクエストが POST され、ビルドパイプラインが走ります。

[GitHub: ChezTachibana/website/blob/main/.github/workflows/deploy-cloudflare.yml](https://github.com/ChezTachibana/website/blob/main/.github/workflows/deploy-cloudflare.yml)

`main` ブランチに `push` されるたびビルドパイプラインを走らせるだけなら、 Cloudflare Pages のデフォルト機能で済むのですが、GitHub を離れずにパイプラインをトリガできたほうが便利だったため、また、次で述べるような外部サービスとの連携をしたかったため、わざわざ GitHub Actions を書いています。

## バックエンドデータベースとしての Google Sheets

少し特殊な部分として Google Sheets との連携が挙げられます。公式サイトでは Google Forms で氏へのお別れのメッセージを募集しており、その内容をほぼそのままサイトへ反映させるための仕組みを作りました。ようするに掲示板のようなものですが、すべてのメッセージを掲載するわけではなくゼミ生やご遺族による目視チェックを入れるようにしてあります。

Google Sheets 上でデータを整理したうえでボタンをクリックすると、 Apps Script から GitHub の `repository_dispatch` 用エンドポイントに POST リクエストが飛び、上記の GitHub Actions が走ります。

まとめると、全体像は **Google Forms ➡ Google Sheets ➡ （手作業） ➡ GitHub Actions ➡ Cloudflare Pages** となっています。

## プログラマとコンテンツ制作者の連携

プログラマ以外の人が Web サイトの一部コンテンツの編集業務を行う際に Google Sheets や Docs をバックエンドとして使う手法は、かなり使い回しが効くと思います。もちろん、GitHub にアカウントを作ってもらって Markdown を Web UI から編集してもらうことだってできるわけですが、エンドユーザ向けのサービスを離れずに Web サイトのコンテンツを更新できることには相当なメリットがあると感じます。

かつて第二期 立花隆ゼミで「[SCI（サイ）](https://sci.digitalmuseum.jp)」を作っていた頃は、独自のコンテンツ管理システム「[Chippie](https://digitalmuseum.jp/software/chippie)」を組んで、PHP の編集マニュアルや FFFTP の操作マニュアルを用意して…と、そうとう苦労してプログラマと記事執筆者の間を繋いでいたのですが、隔世の感があります。

技術的な習熟度に幅のあるチームで Web 記事を作っていく試みは、2011 年 3 月 11 日の東北地方太平洋沖地震のあと取り組んだ「[MIT 原子力理工学部による原子力発電の解説（翻訳）](https://digitalmuseum.jp/sci/mitnse-ja/)」以来でした。自動化できる部分が少なく、掲載先がブログの場合には、当時の枠組みは今でも有効だと思います。いずれにせよ「誰でも発信ができる」便利な時代になりました。

最後になりましたが、立花先生のご冥福をお祈りいたします。といっても、[葬式にも墓にもまったく関心がない](https://tachibana.rip/announcement.pdf)人だったので笑われてしまいそうですが。あの屈託のない笑顔がまた見たいです。

ゼミ生だった学部一年から二年にかけて、科学技術のいろいろな分野の最先端に触れ、また、その社会とのかかわりを考える機会を得たことが、私の研究者としての姿勢の根幹を形成しました。立花隆ゼミといえば第一期の「[二十歳のころ](https://amzn.to/3lriHO8)」という書籍が有名ですが、まさに自分自身が二十歳のころを立花隆ゼミで過ごし、大きな影響を受けたわけです。（[訃報に関し NHK 取材に答えた際の Facebook ポスト](https://www.facebook.com/jun.kato/posts/10165127237275391)）

立花氏に受けた影響については、いずれまた筆を改めたいと思います。

なお、本 Web サイトの開設に際しては、ドメインの取得など諸々の事務処理で兼業先の[アーチ](https://archinc.jp/ja)にお世話になっています。アニメ制作会社ですが、作品 PR などで Web サイト開設は当たり前に業務の範疇なんですよね。ありがとうございます。
