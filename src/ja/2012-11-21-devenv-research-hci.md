---
title: “開発環境の研究”とは？ / HCI編
date: "2012-11-21"
tags:
  - research
  - sigpx
coverImage: uist2012-kato-dejavu.png
summary_generated: >-
  IT が生活のいろんな部分に入り込んでくるにつれ、プログラミングの重要性がどんどん増しています。しかし、Visual
  StudioやEclipseに代表されるような開発環境の使い勝手を向上させる研究は、意外といっていいほど見当たりません。その中でも著名な研究は、Last
  a...
altUrl: "https://junkato.jp/ja/blog/2012/11/21/devenv-research-hci/"
---

IT が生活のいろんな部分に入り込んでくるにつれ、プログラミングの重要性がどんどん増しています。しかし、[Visual Studio](http://www.microsoft.com/visualstudio/)や[Eclipse](http://eclipse.org)に代表されるような開発環境の使い勝手を向上させる研究は、意外といっていいほど見当たりません。その中でも著名な研究は、Last author をたどるとたいてい 2 人の研究者に行き着きます。ユーザインタフェース（UI）・Human-Computer Interaction（HCI）という研究分野はありとあらゆる人が使う情報機器を対象とします。プログラマ向け UI である開発環境だってもちろん研究対象となるはずなんですが、関連研究の少なさ、関わってきた人の少なさから、これまでは世界的にもマイナーな研究分野だったと言えると思います。

ただ、僕はこの研究分野はすごく重要だし、今後どんどん成長すると思っています。現に、ここ一年で Web ベースの開発環境[Cloud9](https://c9.io/)や教育目的の[KhanAcademy](http://www.khanacademy.org/cs)に組み込まれたインタプリタ、ライブコーディングが可能な開発環境[LightTable](http://www.chris-granger.com/2012/04/12/light-table---a-new-ide-concept/)など、プログラミング体験を全く別のものにする試みがたくさん走り始めています。これらはプロダクトの例ですが、研究としては 2 つの分野の学際領域にあるので、まずは隣接分野との比較を通して輪郭をなぞってみます。さらに、これからの開発環境のあるべき姿（研究が進む方向）について考えてみます。

<figure class="right">
  <img src="/images/hci-pl-devenv-300x206.png" alt="Human-Computer Interaction / 開発環境の研究 / Programming Language" />
</figure>

ちょっと長くなりそうなので、このページでは最初の 3 分の 1 だけ書くことにしますね。プロダクトでも研究でも、もし紹介から漏れている興味深いプロジェクトがあったらぜひ教えてください。

- このページ: **UI ツールキットと開発環境**（研究分野: HCI, 主な学会: [CHI](http://chi2013.acm.org/), [UIST](http://www.acm.org/uist/)）
  - 分野のオーバービュー
  - これまで HCI で開発環境の研究が少なかった理由
    - 開発環境の開発が大変だったから
  - これから HCI で開発環境の研究が増える理由
    - 開発環境の開発が簡単になったから
    - 既存の開発環境が多種多様なアプリケーション開発に対応しきれなくなったから
    - インターネットの常時接続が普通になったから
- 次回: プログラミング言語と開発環境（研究分野: SE, PL, 主な学会: [ICSE](http://www.icse-conferences.org/), [PLDI](http://www.sigplan.org/Conferences/PLDI/Main), [SPLASH/Onward!](http://onward-conference.org/)）
- 次々回: これからの開発環境研究

## UI ツールキットと開発環境

まず、UI・HCI 分野での開発環境研究について書いてみます。UI と HCI はとても似た言葉ですが、微妙にニュアンスの違いがあります。UI は情報機器の道具としての使い勝手に焦点を当てる言葉ですが、HCI はより広く、情報機器と人の間の関係性を指しており、UI という言葉で括れない研究がたくさん生まれてからできた言葉です。

この分野で有名な[UIST](http://www.acm.org/uist/uist2012/ "ACM Symposium on User Interface Software and Technology")という国際会議では、UI を構築するためのツールキット、つまり UI プログラマが使う道具が数多く提案されてきました。もっとも網羅的な最近のサーベイ論文は 2000 年のジャーナルに載った[Past, Present, and Future of User Interface Software Tools](http://dx.doi.org/10.1145/344949.344959)でしょうか。同じ著者が 1995 年に同じジャーナルに[User Interface Software Tools](http://dx.doi.org/10.1145/200968.200971)というサーベイ論文を書いているので、そろそろ次の世代のサーベイ論文が出てもいい頃だと思うのですが…何かよさそうなものがあったら教えてください。

これらのサーベイで触れられている UI ツールキットは開発環境の外部ツールやソフトウェアのライブラリとして提供され、アプリケーション開発工程の一部だけを支援するものがほとんどです。一方で開発環境の研究は、ふつう、コーディングとデバッグなど、プログラミングのワークフロー全体を支援してくれます。

ツールキットと開発環境比較の具体例として、インタラクティブな画像処理のプログラムをプロトタイピングするためのツール[Eyepatch](http://hci.stanford.edu/research/eyepatch/ "Eyepatch: Prototyping Camera-based Interaction through Examples") [[Monzy](http://www.monzy.org/) et al., 2007]と、同様のプログラミング全般を支援する開発環境[DejaVu](https://junkato.jp/ja/dejavu/ "DejaVu: Integrated Support for Developing Interactive Camera-Based Programs") [Kato et al., 2012]を簡単に紹介します。

![](/images/uist2007-monzy-eyepatch.png "Eyepatch")

こちらが Eyepatch です。GUI の画面上で画像処理のサンプルをたくさん記録して、機械学習などのアルゴリズムを使って物体認識などをさせることができます。認識結果はネットワーク経由で送出されるので、他のプログラムから自由に利用できます。要は、画像認識を使ったインタラクティブなアプリケーションを作りたいときに、その部分のコードを書く手間を省いてくれるのです。ただし、アプリケーションを書くには別に立ち上げた開発環境と Eyepatch の間を往復しなくてはなりません。

![](https://junkato.jp/ja/blog/wp-content/uploads/2012/11/uist2012-kato-dejavu.png "DejaVu")

一方、こちらが拙作の DejaVu です。通常のコーディングに使われる統合開発環境をベースに、Canvas と Timeline というインタフェースを追加しています。（これらのインタフェースの使い勝手については[公式サイト](https://junkato.jp/ja/dejavu/)に詳しく書いてあります。）DejaVu は開発環境そのものであり、一般的な画像処理のプログラミング体験全体を支援することを目指して作られているため、単体でアプリケーションを作ることができます。

つまり、ツールキット研究はプログラマが使える道具を提案しますが、開発環境の研究はプログラマのプログラミング体験（PX）を向上させることを目指します。ここで、UI と HCI という言葉の違いを思い出してみてください。開発環境の研究は、単なる UI の改善に留まらない、ユーザ体験（User experience, UX）を重視する HCI の研究なのです。僕を含む何人かの研究者は、UX にあやかって Programmer's experience, PX という言葉を作り、積極的に使っています。開発環境を作りこんで PX を改善すれば、プログラマの生産性は必ず向上します。PX という考え方をより多くの人に知ってもらうことは、このブログを立ち上げた大きな理由の一つです。

### これまで HCI で開発環境の研究が少なかった理由

#### 開発環境の開発が大変だったから

HCI 分野において本気の開発環境研究がなかなか生まれにくかった背景には、どうしても研究上の新規性に比して実装にかかるコストが大きめになることがあったように思われます。

5-10 年前の段階では、オープンソースの統合開発環境のコードベースがとても大きく、あまり整理されていませんでした。そのため、何かを新しく作るには書くコード量が多く、既存の環境の上に乗せるプラグインを作るにしても読むコード量が多く…と、かなり苦労しないと開発環境を作り上げることができなかったのです。例えば 2006 年の段階では、テキストベースのコードエディタの中に絵などのマルチメディアコンテンツを貼りこめる構造化エディタを作れるフレームワーク[Barista](http://faculty.washington.edu/ajko/barista.shtml) [Ko et al., 2006]を提案しただけでも、ちゃんと研究論文になっています。

### これから HCI で開発環境の研究が増える理由

#### 開発環境の開発が簡単になったから

直近の 5-10 年の間に、開発環境の実装に必要なコンポーネントが急速に整備されてきています。そして、オープンソースの開発環境のコードが整理されてきており、それなりに読みやすくなってきています。

例えば、画像を貼りこめるエディタを提供する開発環境[Sikuli](http://www.sikuli.org/) [Yeh et al., 2009]の実装では Java Development Kit の標準コンポーネント JTextPane が使われており、Barista のような手法は最早不要となっています。Visual Studio チームは compilers as services と銘打って、コードネーム[Roslyn](http://msdn.microsoft.com/en-gb/roslyn)でインキュベーションプロジェクトを進めています。Roslyn は、統合開発環境が提供するすべての機能を開発者向けに API として提供することを目指しています。また、上述の DejaVu は C#ベースのオープンソースな統合開発環境[SharpDevelop](http://www.icsharpcode.net/opensource/sd/)を拡張して実装してあるのですが、大して本体のコードをいじらずに不要な機能を削ったり必要な機能を他コンポーネントから呼び出したりできました。

#### 既存の開発環境が多種多様なアプリケーション開発に対応しきれなくなったから

最近、[Processing](http://processing.org/)のようにシンプルなワークフローが魅力の開発環境が人気を博すなど、プログラミング体験を重視することの価値が認められ始めています。全てのアプリケーションに対して一つの統合開発環境やいくつかのワークスペースといったアドホックな対応で済ますのではなく、特定の種類のアプリケーションに対して、そのワークフローに特化した開発環境を提供する研究が増えてきているのです。

背景には、既存の開発環境が提供するテキストベースのプログラミングとデバッグだけでは開発が難しい種類のアプリケーションが増えていることが挙げられます。画像処理や機械学習、実世界のセンサやアクチュエータを用いる開発においては、テキストでは到底表現しえない、特別な可視化を必要とするさまざまなデータ構造を扱うことになります。また、単純なイベントドリブンのプログラムと、画像処理やゲームの実装でよく使われるフレームベースのプログラムでは、必要な開発支援手法はかなり異なります。これらの問題に対する解答例として、上述の DejaVu や、それに先立つ研究として、Physical Computing のための[d.tools](http://hci.stanford.edu/research/dtools/) [Hartmann et al., 2006]や機械学習のための[Gestalt](http://research.microsoft.com/apps/pubs/default.aspx?id=141330) [Patel et al., 2010]などが提案されてきたのです。

#### インターネットの常時接続が普通になったから

インターネットに接続された環境が一般的になったことも、新しい開発環境づくりに貢献しています。

例えば、プログラマならソースコードを書きながら Web を閲覧することは頻繁にあると思います。そこで、Web 上のサンプルコードをエディタのコード補完機能で検索し、直接入力できるようにする[Blueprint](http://labs.adobe.com/technologies/blueprint/) [[Brandt et al., 2010](http://dx.doi.org/10.1145/1753326.1753402 "Example-centric programming: integrating web search into the development environment ")]や、Web 検索と閲覧の動作をキャプチャして、URL へのリンクを自動的に行番号と紐づけてあとで閲覧できるようにしてくれる[HyperSource](http://www.cs.berkeley.edu/~bjoern/projects/hypersource/) [Hartmann et al., 2011]という開発環境の拡張機能などが提案されています。

さらに、インターネットを介して、他の人の助けを借りてプログラミングできる開発環境も提案されています。既存研究としては、他の人とリアルタイムに協力してプログラミングできるよう特別にデザインされた Web ベースの開発環境[Collabode](http://groups.csail.mit.edu/uid/collabode/) [Goldman et al., 2011]や、同じ開発環境を使っている人たちがエラーでつまづいた場合の解決法をクラウドで共有して、何かエラーが起きたときに適切な修正候補を提案してくれる[HelpMeOut](http://bjoern.org/projects/helpmeout/) [[Hartmann et al., 2010](http://dx.doi.org/10.1145/1753326.1753478 "What would other programmers do: suggesting solutions to error messages")]などがあります。

このように、今後もさまざまなタイプのアプリケーション開発に最適化された開発環境がどんどん提案されるはずです。僕も研究を続けますし、もっと多くの人に関心を持ってもらって、日本発の研究やプロダクト開発も盛り上がってほしいな、と思っています。
