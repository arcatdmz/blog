---
title: Live Programmingについて (LIVE 2017で基調講演します)
date: '2017-10-08'
tags:
  - research
  - sigpx
coverImage: inventing-on-principle.png
summary: >-
  Live Programming に関する国際ワークショップ LIVE 2017 で基調講演を任されることになり、いろいろ考えた末「User
  Interfaces for Live Programming」という題で話すことにしました。講演内容は講演後に掲載することにして、Live
  Programming とは、LIVE とは何か、どんな人がやっているのか紹介してみます。フォローアップ記事とスライドへのリンクもあります。
summary_generated: >-

  無事、基調講演を終えて帰国しました。フォローアップ記事とスライドをどうぞ。Live Programming に関する国際ワークショップ LIVE 2017
  で基調講演を任されることになり、いろいろ考えた末「User Interfaces for Live Programm...
altUrl: 'https://junkato.jp/ja/blog/2017/10/08/live-programming/'
---

> 無事、基調講演を終えて帰国しました。[フォローアップ記事](https://junkato.jp/ja/live-programming/)と[スライド](https://junkato.jp/publications/live2017-kato-keynote-slides.pdf)をどうぞ。

Live Programming に関する国際ワークショップ LIVE 2017 で基調講演を任されることになり、いろいろ考えた末[「User Interfaces for Live Programming」](https://2017.splashcon.org/event/live-2017-keynote-a)という題で話すことにしました。講演内容は講演後に掲載することにして、Live Programming とは、LIVE とは何か、どんな人がやっているのか紹介してみます。

## Live Programming

Live Programming とは、簡単に言うと**プログラム実行時の情報を参照しながらプログラムを編集できるようにする「プログラマ向けのインタラクションデザイン」**で、近年プログラミング言語・ソフトウェア工学・Human-Computer Interaction (HCI)の研究者の間で盛んに研究されています。実行中の様子を想像しながらソースコードを編集 → コンパイル → 実行しながらどうソースコードを直せばいいか考える、という開発サイクルを過去のものにしようという目論見です。

<figure>
  <a href="https://vimeo.com/36579366"><img src="/images/inventing-on-principle.png" alt="" /></a>
  <figcaption>Bret Victor - Inventing on Principle</figcaption>
</figure>

https://twitter.com/arcatdmz/status/262493485624619008

Live Programming というインタラクションデザインは、この Bret Victor の Inventing on Principle という講演で一躍有名になりました。ここで注意したいのは、Live Programming が可能な開発環境自体はかなり昔からたくさんあったということです。

### 古くて新しい Live Programming

[Max/MSP](https://cycling74.com/products/max/)や[vvvv](https://vvvv.org/)などビジュアルプログラミング言語の多くはデータフロープログラミングが可能で、スライダーなどを操作して下流のノードの実行結果をインタラクティブに変えることができます。Morphic Framework を採用した[Squeak/Smalltalk](http://squeak.org/)や[LivelyKernel](https://www.lively-kernel.org/)のように、プログラムを実行中に編集できる機能はオブジェクト指向プログラミングのための環境に備わっています。REPL (read-eval-print loop)をサポートするシンプルなインタプリタも、Live Programming を可能にする技術の一種と言えます。

このように「新しくない」Live Programming がそれでも近年注目を集めているのは、一つには**Live Programming がメインストリームを占める文字ベースの開発環境においても実現できるようになってきた**ためだと思います。例えば Live Programming が実装されたプロダクションレベルの開発環境に[Xcode](https://www.macstories.net/mac/xcode-6-live-rendering-visual-view-debugging-and-swift/), [LightTable](https://www.youtube.com/watch?v=H58-n7uldoU), 最近の例だと[Flutter](https://flutter.io/)などが挙げられます。

また、もう一つ ── このほうが本質的だと思うのですが ──**Live Programming が、技術ではなくインタラクションデザインであり、ひいてはプログラマの体験を軸に考えた設計思想である**、という面があります。

<figure>
  <a href="https://junkato.jp/ja/dejavu/"><img src="/images/fig6-timeline-1024x332.png" alt="" /></a>
  <figcaption>DejaVu Timeline</figcaption>
</figure>

### Live ⇔ Dead Programming

実は、Live Programming の技術的な定義は曖昧です。というか、技術だけでは定義されないといったほうが正確かもしれません。例えば私が作った[DejaVu](https://junkato.jp/ja/dejavu/)という統合開発環境には、プログラムの実行結果が動画プレイヤーのように実時間軸に沿って表示されるタイムラインがあって、過去の実行結果を自由に探索できます。さらに、それを参照しながらプログラムを書き換えて、タイムラインをリフレッシュできます。

DejaVu では、コードの編集結果が実行時状態に反映されるのに少し時間がかかるため、単に実行中のプログラムをインタラクティブに編集する技術だけを Live Programming と呼ぶことにすると、DejaVu は定義からは外れます。しかし、Live Programming の第一人者である Sean McDirmid は[最近書いた原稿](https://2017.splashcon.org/track/live-2017#A-Brief-Intro-to-Live-Programming)のなかで DejaVu を代表例の一つとして挙げてくれています。（まぁ、Sean 自身が DejaVu 論文の共著者なので身内びいきという面はあるでしょうが……）

これについては、Live Programming の反対の概念（Dead Programming？）を考えるとスッキリすると思っています。Dead なプログラミングでは、ソースコードというプログラムの死んでいる表現とにらめっこしながら実行時の生きた状態を想像する必要があります。このとき、プログラマは頭の中で死んだプログラムの実行状況をエミュレーションしているはずです。

Dead Programming のように頭の中で想像しなくても、**開発環境が生きたプログラムの状態を分かりやすく提示してくれて、しかもそれに関するソースコードを直感的に編集できるようなインタラクションデザイン**こそが Live Programming なのです。（余談になりますが、Inventing on Principle で有名になった Bret はその後[Stop Drawing Dead Fish](https://vimeo.com/64895205)という講演をしています。）

### Programming Experience (PX)

最近、Live Programming に限らず、プログラミングのインタラクションデザインを再考する試みがたくさん出てきています。例えば[Jupyter Notebook](http://jupyter.org)や[Eve](http://witheve.com/)などは文芸的プログラミング(Literate Programming)が Live Programming と結びついて現代的な再興を果たした例です。プログラミング言語のような単一のユーザインタフェース(UI)だけを改善するのではなく、プログラマを取り巻く環境、それが提供する体験を改善しようという流れができてきています。

UI からユーザ体験(UX)へのシフトのプログラミング版、つまりプログラミング言語(PL)からプログラミング体験(PX)へのシフトと見ることもできるかもしれません。[SIGPX (Special Interest Group on Programming Experience)](https://sigpx.org/)は、そうした背景のなか私が東工大の[増原先生](http://prg.is.titech.ac.jp/ja/)と一緒に日本で昨年立ち上げたグループです。

## LIVE Workshop

Live Programming について学術的な背景を持つ人が中心となって集まる場は、ソフトウェア工学に関するトップ国際会議 ICSE 2013 に併設するかたちで初めて開かれました。これが[Workshop on Live Programming (LIVE 2013)](http://liveprogramming.github.io/2013/about.html)です。Plenary Session では、ビジュアルプログラミングにおける Liveness を初めて提唱した Steven Tanimoto 氏が[「A Perspective on the Evolution of Live Programming」](http://liveprogramming.github.io/2013/papers/liveness.pdf)、Morphic Framework を実現した David Ungar, Randall Smith 両氏が[「The thing on the screen is supposed to be the actual thing」](http://davidungar.net/Live2013/Live_2013.html)、そして即興プログラミングで音を生み出す Live Coding に古くから関わってきた Thor Magnusson 氏が[「The Threnoscope」](http://liveprogramming.github.io/2013/papers/thor.pdf)というタイトルで発表しています。その他、デモ発表や講演、[BoF](https://en.wikipedia.org/wiki/Birds_of_a_feather_%28computing%29)セッションがあったようです。

LIVE 2013 主催者の一人、[Brian Burg](http://brrian.org/)は当時 HCI とソフトウェア工学で有名な[Code & Cognition Lab (Prof. Andy Ko)](http://faculty.washington.edu/ajko/)の博士課程学生で、今は Apple で Safari のデバッガを作っています。Safari のデバッガに DejaVu のタイムライン的なものを実用的な形で盛り込んだ凄腕プログラマです。（PX っぽいことができる学生、わりと産業界に行くケースが多い気がします。Adobe で JavaScript デバッガ Theseus を作っていた[Tom Lieber](http://alltom.com/)とか。）

LIVE 2013 の次は少し間が空いて、プログラミング言語に関する難関国際会議の一つ[ECOOP 2016](https://2016.ecoop.org/)に併設するかたちで開かれました。[Workshop on Live Programming Systems (LIVE 2016)](https://2016.ecoop.org/track/LIVE-2016)です。プログラム委員には Java/Dart の設計に関わった[Gilad Bracha](http://bracha.org/Site/Home.html)や Live Coding の第一人者[Alex McLean](http://slab.org/)などが名を連ねています。私もプログラム委員として参加した他、[Live Tuning](https://junkato.jp/live-tuning)という登壇発表を行いました。驚いたのが会議参加者の Live Programming への関心の高さで、会場を急遽大きめのところに移してもらうほどの人気でした。

そして、今年はプログラミング言語関連で最も大きな国際会議[SPLASH](https://2017.splashcon.org/home)の 1 トラックとして、オブジェクト指向プログラミングに関する国際会議[OOPSLA](https://2017.splashcon.org/track/splash-2017-OOPSLA)と同時開催で[LIVE 2017](https://2017.splashcon.org/track/live-2017#program)が開かれます。プログラム委員には、先に紹介した Eve 設計者の[Chris Granger](http://www.chris-granger.com/)や、エンドユーザプログラミング研究で著名な MIT の[Henry Lieberman](http://web.media.mit.edu/~lieber/)、Microsoft Research で Visual Studio の[Debugger Canvas](https://marketplace.visualstudio.com/items?itemName=DebuggerCanvasTeam.DebuggerCanvas)やビッグデータ可視化などに関わってきた[Rob DeLine](https://www.microsoft.com/en-us/research/people/rdeline/)、図形を直接操作してその図形を描画できるプログラムを編集できる（もちろんその逆もできる）Sketch-n-Sketch でプログラミング系・HCI 系両方のトップ会議に論文を通した[Ravi Chugh](http://people.cs.uchicago.edu/~rchugh/)、[Python Tutor](http://pythontutor.com)をはじめとするインタラクティブなプログラム可視化や、最近だとテーブルのあるどんな Web ページもデータサイエンス用開発環境にしてしまう[DS.js](http://pgbovine.net/dsjs-paper.htm)などに取り組んできた[Philip Guo](http://pgbovine.net)などが名を連ねています。

LIVE に深くかかわる人たちのなかで、明らかに HCI 寄りの研究者が増えてきています。そのうち、HCI 系のトップ国際会議でワークショップが併設される日も遠くなさそうです。

## おわりに

ここまで紹介してきたように、Live Programming とそれを取り巻くトピックは研究者の間で年々盛り上がってきていますが、それだけでなく産業界にもインパクトを与えてきています。一研究者としては、今後の盛り上がりにぜひ注目していただければ幸いです。

この他にもより幅広く PX 関係の研究をしているラボなどが知りたい場合は[過去の記事](/ja/posts/2013-09-27-devenv-research-labs)や[Google Docs](https://docs.google.com/document/d/176yfANBFr0txgYJSROFPEdGkPwXhicrP9YZu_bJlgyg/edit)を見てみてください。（私と研究してみたい場合は[こちら](https://junkato.jp/ja/collaborations/)をご参照ください。）
