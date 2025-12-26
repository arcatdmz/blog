---
title: PX に関する研究で IPSJ/ACM から共同表彰されました
date: "2021-03-28"
tags:
  - sigpx
  - research
  - creativity
coverImage: ipsj_acm_joint_award_2021.jpg
summary: >-
  先日、情報処理学会 第 83 回全国大会の表彰式で「IPSJ/ACM Award for Early Career Contributions to
  Global Research」を受賞しました。これは年に一度、情報学全分野から一人を情報処理学会とACMから表彰するという...
summary_generated: >-

  10 月 6 日追記; 情報処理学会の学会誌「情報処理 Vol.62 No.10」に受賞記念記事が掲載されました。先日、情報処理学会 第 83
  回全国大会の表彰式で「IPSJ/ACM Award for Early Career Contributions to Glob...
---

> **10 月 6 日追記;** 情報処理学会の学会誌「[情報処理 Vol.62 No.10](https://amzn.to/3oC9Fjm)」に[受賞記念記事](http://doi.org/10.20729/00212783)が掲載されました。

<figure class="right">
  <img src="/images/ipsj_acm_joint_award_2021.jpg" alt="" />
</figure>

先日、[情報処理学会 第 83 回全国大会](https://www.ipsj.or.jp/event/taikai/83/)の表彰式で「IPSJ/ACM Award for Early Career Contributions to Global Research」を受賞しました。これは年に一度、情報学全分野から一人を情報処理学会と<abbr title="Association for Computing Machinery">ACM</abbr>から表彰するというものです。

> 情報学の分野において，国際的な研究による成果をあげ，今後の発展および国際的な活躍が期待される若手研究者に情報処理学会と ACM（Association for Computing Machinery）から共同表彰を行う．2018 年より設置．
>
> [IPSJ/ACM Award for Early Career Contributions to Global Research - 情報処理学会](https://www.ipsj.or.jp/award/ACM-Joint-award.html)

ちょっと長くなりますが、受賞の経緯と、受賞に繋がった研究内容について今一度自分の言葉でまとめておこうと思います。

- [賞について](#award)
- [PX について](#px)
- [PX の未来 創作文化の未来](#creativity-support)

---

<a class="internal-link" id="award"></a>

## 賞について

表彰の対象となった研究成果は「Pioneering Work in Programming Experience Research for Creativity Support of Both Programmers and Non-Programmers」ということで、 **Programming Experience** (PX; プログラミング体験) についての研究が認められてのことだそうです。

これまで ACM CHI, UIST, Multimedia, PLDI, IEEE VL/HCC など情報学のいろいろな分野の国際会議で PX に関連する論文を発表してきました。また、国内では 2016 年から <a href="https://sigpx.org"><abbr title="Special Interest Group on Programming Experience">SIGPX</abbr></a> という勉強会を開いており、国際的には <a href="https://liveprog.org/">Workshop on Live Programming</a> の Steering Committee や <a href="http://programming-experience.org">Programming Experience Workshop</a> のプログラム委員を務めてきました。 ACM CHI や UIST などでもプログラム委員（Associate Chair）を務め、最近だと CHI 2020 で [Programming Experience](https://pgl.jp/conferences/chi2020/sessions/5ec42956dcced0002938d8f1) という名前のセッションができたりしています。基礎的な研究を進めるだけでなく、成果を応用した一般公開サービスである [TextAlive](https://junkato.jp/ja/textalive) や [f3.js](https://junkato.jp/ja/f3js) などの開発と運営を行ってきました。また、一見こうしたガチガチのプログラミング研究とは遠いところにありそうな、兼業先のアニメ制作会社[アーチ](https://archinc.jp/ja)における [Arch Research](https://research.archinc.jp) での活動も、私にとっては研究成果の社会展開の一環です。

こうしてがんばってきた一連の成果をまとめて表彰していただけるのは大変ありがたいことで、推薦してくださった方、選考してくださった方々にこの場を借りて御礼申し上げたいと思います。また、これは上記のとおり PX 研究の国内外での盛り上がりをふまえての賞だと思っているので、分野を一緒に盛り上げてきてくださっている方々にも感謝しています。これからもよろしくお願いします。

---

<a class="internal-link" id="px"></a>

## PX について

ブログでも ["sigpx" タグがついた記事](/ja/tags/sigpx/) で、自分の成果に限らず関連する研究をいろいろ紹介してきましたが、とくに[2016 年に第 1 回 SIGPX を開催したときの記事](/ja/posts/2016-03-05-sigpx1)が、自分の PX にかける気持ちをいちばん詳しく説明しています。

ただ、じつは PX とは何なのかをはっきりと定義することはあえて避けていました。当時は研究の黎明期でしたし、 SIGPX を多様な取り組みを知るための場所にしていきたかったので、自分にとっての定義を前面に押し出すのは違うと感じていました。この判断は今でも間違っていなかったと思いますし、 SIGPX は今でも間口を広げたままにしています。そのほうが面白いので。

とはいえ、どこかのタイミングで PX についての個人的な課題感を言葉にしておいたほうがよい気もしていました。成果がまとめて評価され、SIGPX をはじめてから 5 年が経った今は、ちょうどよい頃合いなのかもしれません。そこで、先日の[第 8 回 SIGPX 勉強会](https://sigpx.org/8)のイントロダクションに 1 枚だけ私論のスライドを入れました。以降はこの内容を簡単に説明します。最後は、 PX と創作文化の関係についても少しだけ触れたいと思います。

<figure>
  <img src="/images/sigpx8-kato-intro.png" alt="What is PX?" />
  <figcaption><a href="https://sigpx.org/8">第 8 回 SIGPX 勉強会</a>冒頭のスライドより</figcaption>
</figure>

### Programmer's Experience （だけ）ではない

プログラミングに関する研究は、ほとんどの場合、プログラマを支援する研究です。また、エンドユーザプログラミング（End-user programming; End-user development とも）という研究分野があり、これはプログラミングを本職にしていない人を支援する研究です。両者に共通するのは、特定の人々を支援することに研究の重点が置かれている点です。最近だと Developer's Experience (DX) という言葉も耳にするようになりましたが、これも同様ですね。

私は、このように既存の取り組みが「人」に重点を置いてきたのは本質的でないと感じていました。 **プログラミングという行為に重点を置いた研究** つまりコンピュータを変幻自在の道具にする方法論としてのプログラミングはどんな行為なのか、どんな行為になるべきなのかについての研究が必要だと考えていました。その行為の主体がプロの開発者かどうかといったようなことは、本来は結果論ではないでしょうか。そこで、国内勉強会の SIGPX を設立するときには PX を Programming Experience の略としました。国際ワークショップの PX も、同様に Programming Experience の略です。

PX について説明するとき「UX (User Experience) のプログラミング版」と言えば何となく伝わったりするので、単純に User の代わりに Programmer なんですよ、と言えば楽なのですが、そうするとこの「プログラマは誰なのか」問題が出てくるので、じつは譲れないポイントです。

### Programming Language （だけ）ではない

プログラムを記述することをプログラミングと呼ぶのであれば、そこで使われる表現はすべて（文字ベースの言語でなくとも）広義「プログラミング言語」であり、じっさい、プログラミング言語の研究コミュニティはプログラミングという行為の大部分を発明し、規定してきました。

<figure class="right">
  <img src="/images/sigpx8-kato-intro-environment.png" alt="Programming Environment" />
  <figcaption><a href="https://sigpx.org/8">第 8 回 SIGPX 勉強会</a>冒頭のスライドより</figcaption>
</figure>

ただし、プログラムを記述するために必要となるのは言語仕様への理解だけではありません。適切なライブラリの選定や学習、コーディング規約の遵守、メンテナンスしやすいデザインパターンの選択など、さまざまな要素がからんできます。また、プログラムの開発プロセスはプログラムを記述するだけでは終わりません。不具合がないかデバッグしたり、十分な性能が出ているかプロファイリングしたり、手元の環境で動作しているプログラムを一般公開するためサーバ上に展開（デプロイ）したり、じつに多様なステップがありえます。

洗練された仕様の言語（道具）がなぜ産業界で受け入れられないのか、技術移転が遅いのはなぜかという議論がしばしばありますが、これは産業界の進展が遅いのではなく、研究の文脈における「洗練」があくまで研究室環境における in vitro な実験で検証されたものであり、 in vivo に見てみるとあまり効果的ではなかったということだろうと思います。つまり、プログラミング言語よりもスコープを広げた**プログラミング体験全体についての研究**が必要なのではないでしょうか。

かつて、Human-Computer Interaction 分野はコンピュータを道具として捉える考え方が主流で、タスクを効率的にこなせるユーザインタフェース設計が主要な研究トピックでした。それが、次第に人とコンピュータの関係性を幅広く扱うようになっていきました。プログラミング言語も同様の文脈で捉えなおすことが可能だと思います。そこでは、HCI 分野を中心に培われてきた創作支援（Creativity Support）に関する研究の知見が活きるはずです。

### 体験設計は環境設計でもある

私がプログラミング体験と言うとき、それはプログラミングという行為を可能にする環境（プログラミング環境）とセットです。

HCI 分野のプログラミング支援研究は、かつてはプログラミングに係る行為の**一部**を支援するものがほとんどでした。ところが、[2012 年 11 月の記事で紹介したように](/ja/posts/2012-11-21-devenv-research-hci)特定のアプリケーション開発のワークフローを**丸ごと**支援する機能を備えた開発環境の研究が増えてきました。

さらに私は、プログラムを開発する環境と利用する環境を繋げ、プログラミングを通じて、従来の区分けで「プログラマ」「ユーザ」だった人たちの間のコミュニケーションを促進する研究をしてきました。 [TextAlive](https://junkato.jp/ja/textalive) では動画演出を開発する人と動画を制作する人を、 [f3.js](https://junkato.jp/ja/f3js) ではマイコンのファームウェアや筐体設計をプログラミングする人と日曜大工的に手軽な電子工作をしたい人を繋げました。そうすることで、多様な技術的背景を持つ人々の、総体としてのクリエイティビティを支援できると考えてきました。

今回の受賞タイトルは「Pioneering Work in Programming Experience Research for Creativity Support of Both Programmers and Non-Programmers」であり、まさにこの観点が第一義的に評価されたものと考えています。詳しくは [Programming as Communication](https://junkato.jp/ja/programming-as-communication) という研究トピックのページをご覧ください。 [Rethinking Programming "Environment"](https://junkato.jp/publications/ccs2020-kato-rethink-prog-env.pdf) という論文で詳しく議論しており、論文はそのうち和訳する予定なので、そのとき改めてブログでも紹介します。

---

<a class="internal-link" id="creativity-support"></a>

## PX の未来 創作文化の未来

ソフトウェアが世界を飲み込んでいる昨今、プログラミングと無関係な創造的活動はもはや存在しません。アルゴリズミックアートのような創作が目新しいものとしてもてはやされた黎明期はもはや過ぎ去りつつあり、プログラミング的メリットをいかに既存の創作支援ツールに織り込んでいくかがメインストリームの研究課題になってきています。私はアニメ制作会社で兼業をしており、ここまで触れてきたようなガチガチのプログラミング研究者としての私を知る人からは不思議に思われることも多いのですが、それはアニメ作りと PX の間にも並々ならぬ関係があるからに他なりません。

Unity や Unreal Engine といったゲームエンジンを映像コンテンツ制作に活かす試みは [Machinima](https://en.wikipedia.org/wiki/Machinima) と呼ばれ、数十年の歴史を持っていますが、こうした統合環境が国内のアニメ制作現場でも使われるようになりました。そこで、数百人が関与する複雑なアニメ制作ワークフローと PX 的な世界観をうまく接続する環境設計が必要とされています。このあたりは[技術顧問就任時のブログ記事](/ja/posts/2018-07-09-arch-inc-technical-advisor/)で触れた他、 <a href="https://news.mynavi.jp/article/20190216-770325/"><abbr title="アニメーション・クリエイティブ・テクノロジー・フォーラム">ACTF</abbr> というイベントで登壇したとき</a>に少しお話ししました。 [Arch Research で刊行している冊子「アニメ技術」](https://research.archinc.jp/anitech/)シリーズの [2019 春](https://research.archinc.jp/anitech/2019spring) 「Griffith 鼎談」（アニメ監督 + 加藤 + 社長）でも語りました。

プログラミングという行為がさまざまな文脈のもとに置かれるようになり、新しい技術やユーザインタフェースを発明する研究だけでは全体像をつかむことは不可能です。プログラミング体験やプログラミング環境に関する研究は、その不足を補うものになりえます。私にとってこれは創作文化に関する研究であり、社会の未来像を描く研究です。

これからも、いろいろな研究分野の人たち、産業界の人たち、クリエイターやエンジニアのみなさま、そして一般公開サービスを使ってくださっているユーザの方々の協力を得ながら、研究を進めていきたいと思っています。
