---
title: 機械学習開発支援のためのインタラクション研究 論文紹介
date: "2018-12-19"
tags:
  - discussion
  - research
  - sigpx
coverImage: mlse1-kato-slides.png
summary_generated: >-
  この記事は「機械学習工学 / MLSE Advent Calendar 2018」12
  日目の記事です。先日開催された、機械学習工学関連の論文を紹介し合う「XX for ML
  論文読み会」初回で発表した資料の内容を抜粋で紹介します。論文読み会に参加できなかった方も、当ブログ...
---

この記事は[「機械学習工学 / MLSE Advent Calendar 2018」](https://qiita.com/advent-calendar/2018/mlse)12 日目の記事です。先日開催された、機械学習工学関連の論文を紹介し合う[「XX for ML 論文読み会」](https://mlxse.connpass.com/event/102563/)初回で発表した資料の内容を抜粋で紹介します。論文読み会に参加できなかった方も、当ブログ記事を PDF のお供にどうぞ。

[![](/images/mlse1-kato-slides-1024x576.png)](https://junkato.jp/publications/mlse1-kato-hci-slides.pdf)

**[発表資料 PDF](https://junkato.jp/publications/mlse1-kato-hci-slides.pdf)**

なお、書いている人は Human-Computer Interaction (HCI)と呼ばれるユーザインタフェースやインタラクションを研究するコンピュータ科学の応用分野の研究者です。とくに Programming Language の研究分野との隣接領域[「Programming Experience (PX)」](https://sigpx.org)で、ツールキットや API の設計、統合開発環境の研究開発を行ってきました。詳しい研究内容は[ポートフォリオサイト](https://junkato.jp/ja)をご覧ください。PX 全般については[情報処理学会学会誌で組まれた小特集](https://sigpx.org/ipsj2017/)が参考になると思います。

機械学習については興味はあるものの[研究で初歩的なものを使ったことがあるだけ](https://junkato.jp/ja/surfboard/)ですので、誤りなどあればぜひ教えてください。

---

### Grounding Interactive Machine Learning Tool Design in How Non-Experts Actually Build Models

Qian Yang, Jina Suh, Nan-Chen Chen, and Gonzalo Ramos. 2018. Grounding Interactive Machine Learning Tool Design in How Non-Experts Actually Build Models. In Proceedings of the 2018 Designing Interactive Systems Conference (DIS '18). ACM, New York, NY, USA, 573-584. DOI: [https://doi.org/10.1145/3196709.3196729](https://doi.org/10.1145/3196709.3196729)

論文読み会では最後に紹介したのですが、一番盛り上がっていたのでこの記事では最初に持ってきました。ACM DIS という、インタラクティブなシステムのデザイン手法を取り扱う（要は Human-Computer Interaction 全般に関する）学会で発表されたもので、インタラクティブな機械学習のためのツール設計において気にすべきポイントをまとめた調査研究です。

![](/images/mlse-sigpx-dis2018-table1-1024x395.png)

対面での調査対象は上記のとおり素人 14 名（Non-Experts; データサイエンスや統計などの学位を持たず必要に応じて機械学習を利用した問題解決を行っている人）と、雇われてその人たちを助けているプロ 10 名（Supporting Experts）です。さらに、オンラインで素人 98 名のデータを集めています。ここで気をつけたいのは、**素人といってもプログラミングができないわけではない**というところです。ふつうにコードは書けるけど、機械学習の専門的教育は受けていない人たちですね。

論文では、例えば次のように、素人とプロの考え方の違いをいろいろと比較検討しています。

![](/images/mlse-sigpx-dis2018-fig2.png)

面白かったのは「素人向けツールは GUI のものを用意すればいいとナイーブに思っているのは大間違いだ」というメッセージが明確に書かれていたところでした。**素人はコピペが大好き**なので、意外とテキストベースのコーディングをするそうです。確かに、今は Jupyter Notebook なんかもあるし、Visual Programming と違ってテキストコードのコピペは必ずできますよね。

いろいろ書いてあるのでぜひ[発表資料](https://junkato.jp/publications/mlse1-kato-hci-slides.pdf)を見ていただき、できれば論文原著を読んでいただきたいのですが、最後の結論としては、Test-Driven Machine Teaching というフローを支援するツールを作りましょう、ということでした。

![](/images/mlse-sigpx-dis2018-fig4.png)

個々のツール（例えばデバッガやコードエディタ）開発に専念するのでなく、ワークフローをよく観察してその全体を支援できるツールの組み合わせを整備することが重要なのだ、というのは近年のプログラミング支援研究のトレンドと言えると思います。

---

### Gestalt: Integrated Support for Implementation and Analysis in Machine Learning

Kayur Patel, Naomi Bancroft, Steven M. Drucker, James Fogarty, Andrew J. Ko, and James Landay. 2010. Gestalt: integrated support for implementation and analysis in machine learning. In Proceedings of the 23nd annual ACM symposium on User interface software and technology (UIST '10). ACM, New York, NY, USA, 37-46. DOI: [https://doi.org/10.1145/1866029.1866038](https://doi.org/10.1145/1866029.1866038)

論文読み会は 2018 年度刊行論文を紹介するのが基本だったのですが、どうしても紹介したくて入れました。機械学習のアルゴリズムを開発するための統合開発環境に関する提案で、先述したような、開発に関する**ワークフロー全体を支援する研究**の先駆けといえると思います。それまで、インタラクション系の研究分野で発表されるプログラミング支援研究はツールキット（API やライブラリ）の提案が主でした。

肝心の提案については、以下のデモ動画を見ていただくのが早いかもしれません。すごくしっかりと統合開発環境のインタフェースを作り込んであります。

https://www.youtube.com/watch?v=TKO9tLxytGA

基本的なアイデアは、機械学習アルゴリズムの開発では実装と分析を行ったり来たりするので、その各ステップに適したユーザインタフェースのセットを定義し、それが全部入った統合開発環境があればいいでしょう、というものです。

![](/images/mlse-sigpx-gestalt-fig-1024x268.png)

筆頭著者の Kayur Patel はこの論文を含む一連の研究で University of Washington の博士号を取得し、Google で Colaboratory プロジェクトを率いました。Colaboratory は、Google Drive 上に Jupyter Notebook を保存でき、かつ Google の計算資源や指定した Jupyter Kernel を使って実行もできるというもので、遊んでみた方も多いのではないでしょうか。

その後、確か昨年のことですが、Kayur は Colaboratory リリース直前のタイミングで Apple に移り、また機械学習用のツール開発などを行っているようです。研究インターンも募集しているらしいので、ご興味ある学生の方は募集を探してみてはいかがでしょうか。私と面識のある学生さんなら、私から Kayur に紹介することも可能かもしれません。

---

### その他の論文紹介

勉強会では、他にも以下の論文を紹介しました。

---

Yunjia Sun, Edward Lank, and Michael Terry. 2017. Label-and-Learn: Visualizing the Likelihood of Machine Learning Classifier's Success During Data Labeling. In Proceedings of the 22nd International Conference on Intelligent User Interfaces (IUI '17). ACM, New York, NY, USA, 523-534. DOI: [https://doi.org/10.1145/3025171.3025208](https://doi.org/10.1145/3025171.3025208)

インタラクティブな機械学習手法を使うためデータにラベリングしている段階で、いかに有用な情報を提示するか？という問題意識で、1) 現段階の結果のみ見せて、さらにラベリングできるようにする 2) ラベリング完了状態からモデルをいじれるようにするかモデル同士比較しやすくする という解決策を提案しています。

いろいろな機械学習手法・対象アプリケーションでこれらの解決策を実装してみた実例のスクリーンショットが入っているので、眺めるだけでも楽しめるタイプの論文だと思います。

---

David A. Mellis, Ben Zhang, Audrey Leung, and Björn Hartmann. 2017. Machine Learning for Makers: Interactive Sensor Data Classification Based on Augmented Code Examples. In Proceedings of the 2017 Conference on Designing Interactive Systems (DIS '17). ACM, New York, NY, USA, 1213-1225. DOI: [https://doi.org/10.1145/3064663.3064735](https://doi.org/10.1145/3064663.3064735)

筆頭著者の David Mellis はかの有名な Physical Computing プロトタイピング用ツールキット「Arduino」を作った一人です。

Arduino のようなエッジデバイスから収集したデータを母艦となる PC/Mac で機械学習し、エッジデバイスに戻すというハードウェア構成で必要になるインタラクション設計を、プロ向け(API)、素人向け(パラメタ調整と学習用 GUI)それぞれに作ったという研究です。

内容自体にはあまり驚きはありませんが、Physical Computing 関連での機械学習開発支援は珍しかったので取り上げました。

---

Xiong Zhang and Philip J. Guo. 2017. DS.js: Turn Any Webpage into an Example-Centric Live Programming Environment for Learning Data Science. In Proceedings of the 30th Annual ACM Symposium on User Interface Software and Technology (UIST '17). ACM, New York, NY, USA, 691-702. DOI: [https://doi.org/10.1145/3126594.3126663](https://doi.org/10.1145/3126594.3126663)

[Online PythonTutor](http://pythontutor.com/)で有名な Philip Guo の研究室の成果です。Philip は最近トップ国際会議 UIST で大量に論文を書いていて、この研究も UIST 2017 で Best Paper Honorable Mention Award でした。

HTML Table や CSV ファイルへのリンクなどを含む Web サイト上に、データサイエンス用ライブプログラミング環境を即席で作れるインタラクションデザインの提案です。実装としてはブックマークレットになっていて、データサイエンスの講義などで非常にお手軽に活用できるところが強みです。

---

Jun Kato, Takeo Igarashi and Masataka Goto. July 2016. Programming with Examples to Develop Data-Intensive User Interfaces.  Computer, vol. 49, no. 7, pp. 34-42. DOI: [https://doi.org/10.1109/MC.2016.217](https://doi.org/10.1109/MC.2016.217)

最後は我田引水で恐縮ですが、2016 年に刊行されたデータドリブンなアプリケーションの開発支援全般に関する論文で、私が書いたものです。文字ベースの統合開発環境でデータドリブンなアプリ開発を行うことの限界や、データをグラフィカルに例示しながら開発を続けられることの重要性（**Programming with Examples**）、そのためには具体的にどのようなユーザインタフェースが適しているのかといった内容を、豊富な実例と関連研究をもとに論じたものです。詳しくは[論文の解説用に作った専用の Web ページ](https://junkato.jp/ja/programming-with-examples/)をご覧ください。

私のこの論文は、機械学習の開発支援を直接取り扱ったものではないので論文読み会ではごく短時間の紹介に留めましたが、実のところ深く関連していると思っています。だからこそ、機械学習が専門でないにも関わらずこうした分野の論文を追い続けているともいえます。

---

[機械学習工学研究会](https://sites.google.com/view/sig-mlse/)には Human Computer Interaction (HCI)分野の研究者はあまり参加していないようですが、プログラマのためのインタラクションをうまく設計するうえで HCI は欠かせない観点を提供してくれる研究分野だと思います。

ぜひ開発者向けにツール開発する際には HCI（とその研究者）のことを少し思い出していただけると幸いです。（[SIGPX](https://sigpx.org/)もよろしくお願いいたします！）
