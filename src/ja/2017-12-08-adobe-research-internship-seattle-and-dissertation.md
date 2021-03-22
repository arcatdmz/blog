---
title: Adobe Research Internship─または博論執筆の記録
date: '2017-12-08'
tags:
  - life
  - research
  - student
  - university
summary_generated: >-
  これまでにも情報科学系 海外研究インターンのすすめ〔前編〕・〔後編〕や北京に 4 ヶ月住んだ話（Microsoft Research
  Asia）などを書いてきましたが、シアトルに 3 ヶ月住んだ話（Adobe Research）は書けていませんでした。なぜなら、端的に言うと...
---

これまでにも[情報科学系 海外研究インターンのすすめ〔前編〕](https://junkato.jp/ja/blog/2015/06/29/cs-research-internship-abroad/)・[〔後編〕](https://junkato.jp/ja/blog/2015/06/30/cs-research-internship-abroad-2/)や[北京に 4 ヶ月住んだ話（Microsoft Research Asia）](https://junkato.jp/ja/blog/2014/12/12/4-months-in-beijing-microsoft-research-asia/)などを書いてきましたが、シアトルに 3 ヶ月住んだ話（Adobe Research）は書けていませんでした。なぜなら、端的に言うと、この研究インターンは失敗だったためです。もう今更のことだし楽しかったし後悔はしてないのですが、客観的に見て明らかに失敗でした。

というわけで、[研究留学 Advent Calendar 2017](https://adventar.org/calendars/2562)にかこつけて、よかったこと…だけでなく、こういうのはやめたほうがいいよ！という失敗談を提供したいと思います。下の写真は Adobe Research Seattle の中庭です。橋のたもとで水と緑、日差しに恵まれたすばらしい景色ですね。うらやましいですか？…最後まで読んでみてから、ご判断ください。

<figure className="center">
  <a href="/images/DSC_0024.jpg"><img src="/images/DSC_0024-1024x576.jpg" alt="" /></a>
  <figcaption>Adobe Research Seattle</figcaption>
</figure>

## 私「ファンです」

どんな失敗も始まりの時点ではどうなるか分からないものです。この研究インターンも例に漏れず、むしろきっかけ作りのところは最もうまくいったと思っています。[海外研究インターンのすすめ](https://junkato.jp/ja/blog/2015/06/29/cs-research-internship-abroad/)でも触れていますが、インターンのきっかけは人づてにお願いして作ってもらうのが最も多い…気がします。一方、この Adobe Research に行くきっかけは自分で作ることができました。それは、[DejaVu](https://junkato.jp/ja/dejavu/)という統合開発環境（IDE）の研究を発表した Human-Computer Interaction 分野のトップ国際会議[ACM UIST 2012](https://uist.acm.org/uist2012/)でのことでした。2012 年 10 月ですね。

[Joel Brandt](http://joelbrandt.com/cv/)という、Stanford 大の[Scott Klemmer](https://d.ucsd.edu/srk/)（現 UCSD）の下で博士号を取って Adobe Research に就職し、Adobe の[Brackets](http://brackets.io/)という IDE に実装された[Blueprint](http://www.joelbrandt.org/publications/brandt_chi2010_example_centric_programming.pdf) [CHI '10]や[Theseus](http://www.joelbrandt.org/publications/lieber_chi2014_always-on_programming_visualizations.pdf) [CHI '14]などの機能を研究開発した研究者がいます。Joel のことは DejaVu の研究をするときに色々調べて知っていたので、UIST で会えたらいいなと思っていました。

その Joel が、DejaVu と同じセッションで ConstraintJS という共著発表があった関係で、セッション終了後に登壇発表者がたむろしているあたりに来てくれました。そこで声をかけ、私の発表を見てくれていたことを確認し、興味が近いこと、今こんなテーマを考えているということ、そして何より私が Joel の研究のファンであることを伝えました。

しばらく雑談したあと、Adobe が定期的に研究インターンを雇っていることを事前情報で知っていたので、インターンに興味がある旨を伝えたところ、いいね！CV を送ってくれ！と言ってくれました。（こうした反応がどれくらいポジティブなニュアンスかは、文字面では判断しづらいのですが、少なくとも対面で話していた感触ではけっこう可能性ありそうな雰囲気でした。）

## Researcher「サンノゼじゃなくシアトルで」

2012 年 10 月の UIST で Joel に会って会期直後にメールを送ってから、しばらくは音沙汰がありませんでした。気になったので 12 月末に ping したところ、年明けに「今ちょうどインターン用のバジェットを確保してるところだからもうちょっと待ってね」と連絡がありました。また、ラボ全体に連絡が行くインターン応募用メールアドレスがあるので、そちらにも CV を送るようお願いされました。その後、2013 年 2 月に Jovan Popovic という別の研究者から連絡があって Skype ミーティングをしました。

結論からいうと、Jovan と Joel のダブルメンター体制でインターンをしようということになりました。Joel はサンノゼ本社、Jovan はシアトル支社のラボに勤めているので、サンノゼかな？と思っていたのですがシアトル勤務になりました。シアトルは前年の Microsoft Research Redmond インターンで行っていたレドモンドの隣にあって、土地勘はわりとあったので暮らしやすいのは知っていたのですが、新しい場所好きの自分にはちょっと残念…ただ、これは混迷を極める留学の序章に過ぎませんでした。

## Prof.「博士論文と両立」

7 月、インターン直前にインターン期間についての議論がありました。実は私は、2013 年度が博士の最終年度（見込み）でした。当時、2013 年の夏は博士論文執筆のハイシーズンだったのです。この記事を書いている私は、2014 年 3 月に博士号を無事取得できたことが確定している世界線にいるので、文章も落ち着いてタイピングできています。それでも冷や汗がにじむような緊張感があります。

米企業のよくある研究インターンは、アメリカの大学院の夏季休暇に合わせて 7-9 月ですが、これが論文執筆期間ともろにかぶっていたわけです。さらに、10 月の UIST 2013 で[Doctoral Symposium](https://junkato.jp/ja/blog/2014/07/27/acm-doctoral-symposium-consortium/)に参加することが決まっていました。そこで、Adobe 研究者と指導教官と相談して以下のオプションを検討しました。

**Option (a)** 博論執筆終了させて UIST 2013 後にインターン

UIST は 10 月頭から一週間なので、そこから 3 か月だと、博士論文締め切りの 12 月はシアトルにいることになります。不可。

**Option (b)** 博論ディフェンス後、博士号確定してからインターン

一般的には 2 月頭にディフェンスなので、そこから 3 か月だと今度は入社とかぶります。不可。

**Option (c)** なるべく博論を形にしてから 8-11 月インターン

期間中も博論執筆する前提でインターンに行きます。インターン途中で UIST 2013 にも参加。

けっきょく(a)と(b)は不可能だったので(c)になりました。昼は Adobe の研究、夜は博論執筆という大変な 3 ヶ月間の幕開けです。

## インターン期間の進捗

<figure className="center">
  <a href="/images/DSC08969.jpg"><img src="/images/DSC08969-1024x681.jpg" alt="" /></a>
  <figcaption>シアトルの夏</figcaption>
</figure>

正直言ってあまり覚えてないのですが、8 月、シアトルに行きたての頃はまだ多少余裕があったような気がします。気候もよく、さわやかな日々が続いていました。[気が向いたら撮っていた写真](https://photos.google.com/album/AF1QipMapd-iQVFW6-Af6_VWNQJ80H3_i3hJD3-dlbkF)も明るいです。

9 月になってくると Adobe インターンのほうは方針が固まってきました。興味があり、なおかつ勉強したいと思っていた分野のテーマになり、とてもいい滑り出しでした。一方で、博論ページ数の伸び悩みに苦しむようになります。博論の章立てなど骨組みは決まっていたので、進捗を可視化するために以下のようなグラフを半自動で生成できるようにしていました。

<figure className="right">
  <a href="/images/chart.png"><img src="/images/chart.png" alt="" /></a>
  <figcaption>博士論文ページ数の推移</figcaption>
</figure>

10 月、インターンでは、進捗はありつつも今一つブレークスルーがないといった感じでした。また、一週間弱エジンバラへ出張して UIST 2013 [Doctoral Symposium](https://junkato.jp/ja/blog/2014/07/27/acm-doctoral-symposium-consortium/)で博論の概要を話し、概ね方針としては大丈夫そうだというお墨付きを得ますが、やはり進捗が芳しくない…この頃からもう完全にインターンより博論のほうが重大事になってきました。

ただ、そんな中でもちょっと無理をして Human-Computer Interaction 分野の名門 University of Washington (UW)の DUB (Design, Use, Build) Seminar で発表をさせてもらったのは非常によい経験でした。ちょっと記憶があいまいですが、UW の[Andy Ko](http://faculty.washington.edu/ajko/)という非常に尊敬している教授に連絡を取ったら機会をくれたような覚えがあります。このときの動画は[多少編集が荒いですが Vimeo に上がっていて、今でも見ることができます](https://vimeo.com/77669396)。（ちなみに、私の研究に興味のある方はぜひ[今秋 CMU で講演した際の最新の動画のほうをご覧ください](https://scs.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=fd1c36b4-c0ad-49ef-b50c-aab0e5fa36b7)。）

11 月になるとシアトルは濃霧の日が多く、ほとんど晴れない陰鬱で肌寒い気候になってきます。私はというと、インターンの始末をつけないといけない上に、帰国日が見えてきて、このままでは帰国後に教授に合わせる顔がない、という危機感が募って、これまた陰鬱な気持ちになっていました。[気が向いたら撮っていた写真](https://photos.google.com/album/AF1QipMHwjVsDuPzn8cAmnhNbFvEQ3cryiBGGp2lvneu)も、彩度ゼロの霧に埋もれた紅葉がかろうじて自己主張するような景色をよく映していると思います。

このときの反省として、生活の基盤となる部屋は多少値が張っても便利がよくゆとりのあるところを借りたほうがよいと感じました。私は Studio という日本でいうところのワンルーム、しかも半地下のところを借りたのですが、もっと気分の晴れる、最低でも 1BR（1LDK）でそこそこ窓の外の景色がよいところを借りるべきでした。[アパート選びのポイントについての記事](http://kengg.blog75.fc2.com/blog-entry-44.html)が参考になります。

ちなみに、ビザの手配をどれくらいサポートしてくれるか、住む場所まで手配してくれるかどうか、などの対応は企業によってまちまちです。前年に行った Microsoft Research Redmond はどちらもとても手厚く、ほぼ何も考えなくてもアメリカでの生活を始めることができました。一方 Adobe は、ビザの手配を外部の団体に委託しており、多少手間が多かったです。また、住む場所は自身で見繕う必要がありました。そのために、日本からの出国前、博論執筆のための貴重な時間を、事務的なことでけっこう削られてしまいました。

<figure className="center">
  <a href="/images/DSC09213.jpg"><img src="/images/DSC09213-1024x681.jpg" alt="" /></a>
  <figcaption>シアトルの秋</figcaption>
</figure>

## まとめ

けっきょく 3 か月のインターン期間に得たものは以下の 3 つでした。

- 諦めない心
- 30→80 ページに増えた博論原稿
- Adobe で勉強した新分野の知見

Adobe での経験はとても得難く、よい友人にも巡り合えましたが、一方で研究成果を論文にまとめることはできませんでした。博士論文は最終的にはそれなりに満足のいく出来で、[情報処理学会の推薦論文](http://www.ipsj.or.jp/magazine/hakase/HCI02.html)にも選出していただきましたが、明らかにインターン前に完成させてから行くべきでした。推薦論文に寄せたコメントでこの記事を〆たいと思います。

> 五十嵐先生、坂本先生、多分野にわたる主査副査の先生方と研究室の皆様のお世話になりました。Microsoft や Adobe での海外研究インターンではメンターに恵まれ大変よい経験を積めました。この場を借りて御礼申し上げます。**なお、博論執筆の最中に遠隔地のインターンへ行くことはお薦めしません。寿命が縮みます。**
