---
title: HCI 研究の捉えどころのなさと3つの波、次の波
date: "2021-12-18"
tags:
  - research
  - discussion
  - advent-calendar
summary_generated: |-
  この記事は Human-Computer Interaction (HCI) Advent Calendar 2021
   の 18 日目です。プログラム委員長として長らく準備をしてきた SIGGRAPH 2021 Real-Time Live! が終わってほっと一息ついた...
summary: |-
  HCIは捉えどころがない分野だと思います。この捉えどころのなさを「課題解決としてのHCI研究」という考え方、「HCIの三つの波」という歴史の見方を通して紐解き、最後にちょっとした宣伝をします。
---

この記事は [Human-Computer Interaction (HCI) Advent Calendar 2021
](https://adventar.org/calendars/6523) の 18 日目です。プログラム委員長として長らく準備をしてきた [SIGGRAPH 2021 Real-Time Live!](https://sa2021.siggraph.org/jp/attend/real-time-live/6/sessions) が終わってほっと一息ついたところで、この記事を書いています。

https://twitter.com/arcatdmz/status/1471691289205022725

[SIGGRAPH Asia 2021](https://sa2021.siggraph.org/jp) では他にも「[R&D for Anime Production: State-of-the-Art and Future Prospects（アニメづくりの R&D: 今後と現状）](https://research.archinc.jp/events/siggraph-asia-2021/)」というセッションに登壇しました。このあたりは別の機会に触れたいと思います。

さて、 <abbr title="Human-Computer Interaction">HCI</abbr> Advent Calendar です。

## HCI って何だ？

私が初めて HCI という研究分野に足を踏み入れたのは 2008 年、学部 4 年で[五十嵐先生の ERATO](https://www.jst.go.jp/erato/igarashi) の研究補助員を始めたタイミングでした。それから干支がたっぷり一周してしまいましたが、相変わらず HCI は捉えどころがない分野だなと思います。

この「捉えどころのなさ」は私自身の整理では二つに分けられ、一つは分野が本質的に抱えているもの、もう一つはその派生で、 <abbr title="User Experience">UX</abbr> デザイナーなどインタラクションデザインの実践の現場にいる人と HCI 研究者の間の隔絶（産学間の隔絶）によるものです。

まずは前者について考えてみます。例えば、[HCI における研究上の貢献は 7 種類に分けられる](https://interactions.acm.org/archive/view/may-june-2016/research-contribution-in-human-computer-interaction)と言われます。[今年開催された ACM CHI 2021 には Subcommittee が 15 個もあり](https://chi2021.acm.org/for-authors/presenting/papers/selecting-a-subcommittee)、投稿者はどの委員会に査読してもらいたいか選ぶ必要があります。それだけ別々の研究手法を持った人々が集まる分野ということです。同じ分野なのにまったく違う手法の研究が併存する場合、分野内の共通言語は一体何なのでしょうか？

これらの質問に対する一つの回答が、 **HCI 研究は人とコンピュータの関係についての課題解決のプロセス** として理解できるというものです。 Antti Oulasvirta らは CHI 2016 の論文 [HCI Research as Problem-Solving](https://dl.acm.org/doi/10.1145/2858036.2858283) で、 HCI 研究の貢献の大きさは以下の 3 軸で定義される **課題解決キャパシティ** で測れる、という考え方を提案しています。

1. どれだけ幅広い課題に適用可能で
2. どれだけ効率的な解決策を提案していて
3. その課題はどれだけ重要なものか

人類の課題解決キャパシティをどれだけ増やしたかが研究の価値を決めるというわけです。<!-- 課題解決キャパシティというコンセプト自体は[Larry Laudan](https://en.wikipedia.org/wiki/Larry_Laudan)が初めに提案したもので… -->ここでいう課題とは、**人とコンピュータの関わりで生じる現象に関する理解の欠如**や、**現象をより望ましい状況へ改善するためのインタラクション技術の設計手法が未知であること**を指します。

この考え方に従えば、例えば Tangible Bits と Fitts' Law という一見まったく別の種類の研究同士を比較検討することが可能になります。このエッセイ論文の口頭発表は、非常に堂々としていて、質疑応答も含めて最高なのでぜひ見てみてください。

https://www.youtube.com/watch?v=E0EVhYd4_Ws

捉えどころがないがゆえに分野内でこうした自省的議論が続けられている面もあり、それこそ健全な学問的態度であろうとも思います。

HCI 分野を、人とコンピュータの関係をよりよくしていこうという人たちが専門性（ディシプリン）を問わず集まり、課題解決に集中しているコミュニティとして見ると、捉えどころのなさはすなわち多様性の現れということになります。分野としてのグランドチャレンジの不在もよく批判されますが、 **HCI は研究手法の専門性を問わない懐の深さを持ち、新たな課題を発見した人が新規参入して新たな波を起こしやすい分野** である、と好意的に捉えることもできそうです。

## HCI 研究の 3 つの波

そろそろ「UX デザイナーなどインタラクションデザインの実践の現場にいる人と HCI 研究者の間の隔絶」についても考えてみたいと思います。

近年 UX デザイナーという職種はかなり一般的になってきています。HCI 系の研究室を出てこうした職業に就かれる方も多いはずです。ただ、インタラクションデザインの実践の場で必要となる知識と、 HCI 系の研究遂行で培われる知識との間にはかなり隔絶があります。

これを説明するために、 **HCI 研究にはこれまで 3 つの波があった** という見方を紹介したいと思います。その見方に立つと、今は 3 つ目の波が始まってしばらく経った頃です。参考文献は [Third-wave HCI, 10 years later—participation and sharing (Susanne Bødker, 2015)](https://interactions.acm.org/archive/view/september-october-2015/third-wave-hci-10-years-later-participation-and-sharing) と [The Three Paradigms of HCI (Steven Harrison et al.) ](https://people.cs.vt.edu/~srh/Downloads/TheThreeParadigmsofHCI.pdf) です。

それぞれの波は以下のとおりです。こうした時代的整理を行う研究はどれもヨーロッパ発が多い印象があります。日本はもちろん、アメリカなどでもあまり見ない気がします。

---

### first wave: human factors / user interface design

> “**Interaction as man-machine coupling**” -- Steven Harrison, 2007

- 人間にフィットするコンピュータ
- 認知科学、工学
- 1980 年代まで

### second wave: human-centered systems / user experience design

> “**From human factors to human actors**” -- Steven Harrison, 2007

- 人間が職場などコントロールされた環境下でコンピュータをうまく使う
- 人間中心デザイン、Natural User Interface、CSCW、(Tangible User Interfaces)
- 1990 年代

### third wave

> “**Support for situated action in the world**” -- Steven Harrison, 2007
>
> “**Technology spread from the workplace to our homes and everyday lives and culture**” -- Bødker, 2015

- 人間が仕事、生活、あらゆる場面でコンピュータと一緒に生きる
- Socio-technical Systems、UbiComp、(Tangible User Interfaces)、Swarm User Interfaces、Radical Atoms, …
- 2000 年代以降

---

インタラクションデザインの実践の現場で必要となるのは、主に first wave から second wave までの内容ではないでしょうか。一方、HCI 研究の文脈ではどちらもすでに通り過ぎた波です。メインストリームはすでに third wave に移っており、その断絶がそのまま産学の溝になっていそうです。

とくに 2000 年代から 2010 年代にかけて流行った Physical Computing や Personal Fabrication といったテーマの研究ではコンピュータが物質性を得るところに新規性の核があり、伝統的なソフトウェアのインタラクション設計に関する基礎知識にほとんど触れず HCI 系の学部や専攻を修了した方々もいたかもしれません。

first から second wave 初頭にかけての研究について、私の書いたものの中では「[ユーザインタフェース設計](https://junkato.jp/ja/user-interface-design/)」という記事がそれなりにカバーしているので、よろしければご一読ください。

あとは、こうしたトピックを網羅した厚めの教科書が日本語で出ると、便利でいいですね。

## 次の波を作るために

HCI 分野が third wave に入ってだいぶ経ちます。

CHI で Subcommittee の統廃合があったり、HCI のグランドチャレンジと言われることもある創造性支援研究についての[振り返り論文](https://dl.acm.org/doi/10.1145/3196709.3196732)が出たり、深層学習のアプリケーション研究が少しずつ増えてくるなどソフトウェア系の研究が盛り返してきていたり、CHI 2021 の会議テーマが [Making Waves, Combining Strengths](https://chi2021.acm.org/) だったり、新しいさざ波はたくさん起こっています。

次の波を作るには、まず今の波を知ることが必要です。私も継続的に運営に関わってきた[CHI 勉強会](https://sigchi.jp/seminar/chi2021/)は、言語バリアを超えてそうした潮流に触れるよい機会になっていると思います。ただ、勉強会は一年に一度なんですよね。

一方、HCI 分野の海外有力ラボ（Microsoft, Adobe, CMU, MIT, UC Berkeley, ...）では、月に一度などもっと高頻度に研究者のトークイベント（セミナーシリーズ）が開催されており、分野のオーバービューが掴みやすくなっています。

そこで、この場を借りて最後に一つちょっとした告知です。

来年、私の主所属である産業技術総合研究所の主催で一般公開の「**AIST Creative HCI seminar series**」を開講したいと考えています。世界トップクラスの若手 HCI 研究者に月一くらいでオンライン講演してもらい、そのあととくに研究の興味がかぶっている研究室などのバーチャルツアーを組む流れをイメージしています。協力者も募集中なのでご興味あればお知らせください。
