---
title: "技術書典 応援祭で「アニメ技術 2020春」頒布中 / Griffith Sketchリリース"
date: "2020-03-14"
tags: 
  - "anime"
  - "research"
coverImage: "techbook8_shoei_02.png"
---

[アーチで技術顧問の仕事を始めて](https://junkato.jp/ja/blog/2018/07/09/arch-inc-technical-advisor/)早1年半が過ぎました。表に出ている仕事としては、研究開発チーム [Arch Research](https://research.archinc.jp/) を作り、絵コンテ制作支援ツール「[Griffith](https://research.archinc.jp/griffith/)」を開発しています。2018年秋からは半年に一度の技術書の祭典「[技術書典](https://techbookfest.org/)」をスポンサーしつつ、2019年春からは毎回「[アニメ技術](https://research.archinc.jp/anitech/)」を刊行しています。

3月1日には[技術書典 8](https://techbookfest.org/event/tbf08/circle/5768522244292608)で新刊「アニメ技術 2020春」を頒布する予定だったのですが、COVID-19の影響で中止になってしまいました。新刊は、その代わり急遽3月7日から4月5日までオンライン開催となった技術書典 応援祭で頒布しています。ぜひ[技術書典 Webサイトから入手](https://techbookfest.org/product/5748798303240192)してください!!（品切れしていた既刊も[同サイトから頒布](https://techbookfest.org/market/search?q=%22%E3%82%A2%E3%83%BC%E3%83%81%E6%8A%80%E8%A1%93%E9%83%A8%22)しています）

この記事ではその内容と、同時リリースしたアイデアスケッチのための無償アプリ（Webサービス）「[Griffith Sketch](https://research.archinc.jp/griffith/sketch/)」について紹介します。

[![](/images/techbook8_shoei_02-1024x1024.png)](https://techbookfest.org/product/5748798303240192)

アニメ技術 2020春 脚本特集

## アニメ技術 2020春

「アニメ技術」は毎回、アニメの作り方がまとまった特集記事と、「Griffith」をはじめとする技術寄りの記事、クリエイターや研究者など多様なバックグラウンドの専門家による寄稿記事をバランスよく編成しようと頑張っています。

今号については巻頭言がよくまとまった紹介になっているので、以下に転載します。なお、目次やクレジットは[アニメ技術 2020春 特設ページ](https://research.archinc.jp/anitech/2020spring/)に掲載されています。

> この小冊子は、「アニメ技術」というタイトルどおり、アニメを支えるさまざまな技術を紹介するもので、半年に一冊のペースで刊行してきました。おかげさまで、アニメ制作、ソフトウェア開発などに関わるさまざまな方々に読んでいただいています。
> 
> 「アニメ技術」は、アニメ制作のための創作支援ツールを研究開発するチームで作り始めました。号を重ねるたびに多くの方々の協力を得て、アニメの作り方の現状と未来について、多角的に扱う冊子になってきたと感じています。
> 
> この号も例に漏れず、脚本やアイデアスケッチの制作技術についての記事や、それに留まらない多彩なゲスト寄稿を集めました。寄稿では、コンピュータアニメーションを「動くドローイング」と捉え、その作り方を1970年代までさかのぼる論考に始まり、フィギュアの作り方、楽曲制作環境、そしてアニソンの作詞技術について、各分野の識者が執筆してくださいました。ぜひお楽しみください。

毎号のことですが、社内のみならず、社外のいろいろな方に本当にお世話になっています。脚本特集では[脚本家の上江洲さま](https://twitter.com/uezux/status/1236942046109171713)、寄稿ではアニソンの作詞技術について[作詞家の高瀬さま](https://twitter.com/Takase_Aiko/status/1236565382988591104)、フィギュアの作り方やツールについて宮川 武さま、音楽制作における入力デバイスについてRAM RIDERさま、Human-Computer Interaction分野の創作支援研究におけるアニメーション制作支援ツールの最先端について[Adobe ResearchのRubaiatさま](https://rubaiathabib.me/)（訳: 加藤）にご協力いただきました。この場を借りて改めて御礼申し上げます。

社内からの記事としては、絵コンテ制作支援ツール「Griffith」の開発記録と、後述するWebアプリ「Griffith Sketch」の紹介などが入っています。

力作の記事揃いですので、ぜひ[技術書典 応援祭のWebサイト](https://techbookfest.org/product/5748798303240192)から入手してください。

[![](/images/techbook8_shoei_04-1024x1024.png)](https://techbookfest.org/product/5748798303240192)

アイデアスケッチのためのWebアプリ「Griffith Sketch」のご紹介

## Griffith Sketch

今回の技術書典は、自分たちArch Researchチームにとってはアニメ技術の頒布だけでなく、アイデアスケッチのためのWebアプリ「Griffith Sketch」リリースのタイミングでもありました。

先に技術書典の原稿が上がっていましたから、リリースしないわけにはいきません。完全自社開発のアプリなので、こういう〆切は本当に助かります。（自分の本職＝研究者にとっての学会論文投稿〆切と同じですね…。）

https://twitter.com/arcatdmz/status/1233697311345135617

どんな狙いがあってこのアプリをリリースしたかについては[アニメ技術 2020春](https://techbookfest.org/product/5748798303240192)の記事をご覧ください。また、機能の概要については[Arch Researchの紹介ページ](https://research.archinc.jp/griffith/sketch/)をご覧ください。

![](/images/griffith-sketch-fig1-1024x576.png)

Griffith Sketch v1.0.0 スクリーンショット

先々週 v1.0.0 を公開してから、すでに早速さまざまなフィードバックをいただいています。先週末は、ショートカットキーなどの機能を追加した v1.1.0 をリリースしました。

https://twitter.com/arcatdmz/status/1236464149099474945

今後も気軽にフィードバックをいただきたいので、Arch ResearchのTwitterアカウント（[@ArchResearchJp](https://twitter.com/ArchResearchJp)）を開設しました。

というわけで、繰り返しになりますが、技術書典 応援祭「[アニメ技術 2020春](https://research.archinc.jp/anitech/2020spring/)」と「[Griffith Sketch](https://research.archinc.jp/griffith/sketch/)」よろしくお願いします！