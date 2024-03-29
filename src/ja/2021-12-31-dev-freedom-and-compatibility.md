---
title: 研究開発の自由度と互換性の両立
date: "2021-12-31"
tags:
  - research
  - programming
  - discussion
summary_generated: >-
  昨年から今年にかけては、リリックビデオの制作支援サービス「TextAlive」の開発において大きな節目でした。2020 年 9
  月にサービスの機能の一部を切り出した API「TextAlive App API」をリリースし、初音ミク「マジカルミライ 2020」および「マジカ...
summary: >-
  自分以外の方々にサービスや API を使ってもらう機会が増えるにつれ、研究開発の自由度（好きにコードを書きたい）と互換性（仕様変更で外部に迷惑をかけない）を両立するための工夫が重要になってきました。この記事では、とくに開発リソースがひっ迫している環境において、外部連携をスムーズに行うために、私が気をつけて実践してきたことを紹介します。
---

昨年から今年にかけては、リリックビデオの制作支援サービス「[TextAlive](https://junkato.jp/ja/textalive/)」の開発において大きな節目でした。2020 年 9 月にサービスの機能の一部を切り出した API「[TextAlive App API](https://developer.textalive.jp/)」をリリースし、初音ミク「マジカルミライ 2020」および「マジカルミライ 2021」のプログラミング・コンテストで多くの方々に使っていただくことができました（公式サイト: [2020](https://magicalmirai.com/2020/procon)・[2021](https://magicalmirai.com/2021/procon) / 特設サイト: [2020](https://developer.textalive.jp/events/magicalmirai2020)・[2021](https://developer.textalive.jp/events/magicalmirai2021)）。2020 年 10 月には街と音楽がシンクロする「[SYNCHRONICITY 2020](https://piapro.net/synchronicity2020)」で TextAlive が活用されました（[ドキュメンタリー](https://www.youtube.com/watch?v=uIWMS8lkgqw)）。今年に入ってからは 3 月に派生サービス「[TextAlive Flow](https://scrapbox.io/textalive/TextAlive_Flow)」が公開されたほか、「[初音ミク バースデーメッセージ企画 2021](https://piapro.net/mikusync2021)」と「[鏡音リン・レン Happy 14th Birthday メッセージ企画](https://piapro.net/rinlen14thbd/rinlensync14/)」の演出開発で使われました。

こうして自分以外の方々にサービスや API を使ってもらう機会が増えるにつれ、研究開発の自由度（**好きにコードを書きたい**）と互換性（**仕様変更で外部に迷惑をかけない**）を両立するための工夫が重要になってきました。

https://twitter.com/arcatdmz/status/1475033823364907011

この記事では、とくに開発リソースがひっ迫している環境において、外部連携をスムーズに行うために、私が気をつけて実践してきたことを紹介します。プログラミング言語やフレームワークなどになるべく依存しない書き方を心掛けましたが、似たような環境（TypeScript、Web API）で開発している人のために具体的な情報も記載しています。

---

## 背景

TextAlive は 2015 年に [ACM CHI 2015 での論文発表](http://doi.acm.org/10.1145/2702123.2702140)に続いて[プレスリリース](https://www.aist.go.jp/aist_j/press_release/pr2015/pr20150908/pr20150908.html)を行い、その後も継続的に開発を進めてきました。内部実装は能動的音楽鑑賞サービス [Songle](https://songle.jp) と密に連携する作りになっていますが、ユーザが触る部分に関しては基本的に個人開発に近く、これまでに三度の節目がありました。

一度目の節目は、Web サービスの実装を API サーバとクライアントアプリに分割し、クライアントのフレームワークを jQuery から React に切り替えた 2018 年でした（[改装時の告知記事](https://docs.textalive.jp/magicalmirai2018/#renewal)）。その後、クライアントのコードを少しずつ抽象化し、シェイプアップしてライブラリとしてまとめる作業を進めました。二度目の節目が、整理が一段落して外部向けにクライアント向け API「[TextAlive App API](https://developer.textalive.jp/)」をリリースした 2020 年 9 月でした。三度目の節目はサービス全体をオンプレミスから AWS に乗せ換える作業を完了した今年 2021 年 5 月ですが、主にサーバサイドの話なので今回は触れません。

## 開発者向けリソースの充実

<figure>
  <a href="/images/2021-12-31-api-doc-example-code-tutorial.jpg"><img src="/images/2021-12-31-api-doc-example-code-tutorial.jpg" /></a>
  <figcaption>API ドキュメント、サンプルコード、チュートリアル</figcaption>
</figure>

私は、**API ドキュメント**、**サンプルコード**、**チュートリアル**を、この順に充実させることに注力してきました。小規模開発だとどれも手を抜きがちですが、連携先が増えるにつれ、問い合わせに回答するコストが飛躍的に伸びます。ある程度プロジェクトの全体像が固まってきたら、開発者向けリソースを充実させるコストをかけないと手遅れになると思います。

API ドキュメントに関しては、仕様に追従できなくなると意義が半減するので、ある程度は自動生成させることが必須だと思います。私は [TypeScript](https://www.typescriptlang.org) でライブラリ開発を行い、[Microsoft API Extractor](https://api-extractor.com) でアノテーションを使って公開可能な API のフィルタリングを行い、[Typedoc](https://typedoc.org) を使ってドキュメントを生成しています。実例は [TextAlive App API のドキュメント](https://developer.textalive.jp/packages/textalive-app-api)をご覧ください。

サンプルコードは GitHub 上の [AIST TextAlive Project](https://github.com/TextAliveJp) に集約しているほか、チュートリアル内の[サンプルコード](https://developer.textalive.jp/app/examples)のページやプログラミング・コンテストのアフターレポート（[2020](https://developer.textalive.jp/events/magicalmirai2020)・[2021](https://developer.textalive.jp/events/magicalmirai2021)）冒頭から、サムネイルつきでアクセスしやすいようにしています。チュートリアルは [TextAlive for Developers](https://developer.textalive.jp) という Web サイトを開設しています。ちなみに、私はチュートリアルから実際のアプリ開発に移るときのギャップを小さくする研究にも取り組んでいたのですが（ [DeployGround](https://junkato.jp/ja/deployground/); [Songle Sync チュートリアル](https://tutorial.songle.jp) に実装済み）、TextAlive に関してはそこまで手が回っていません。

<figure className="right">
  <a href="/images/2021-12-31-mm2020procon-slides-14.png"><img src="/images/2021-12-31-mm2020procon-slides-14.png" /></a>
  <figcaption><a href="https://www.youtube.com/watch?v=FbeZ3s0M63I">リリックアプリ開発ことはじめ</a>使用スライド「リリックアプリとは？」</figcaption>
</figure>

## データ構造の堅持

実は TextAlive の核となるリリックビデオのデータ構造は 2014 年の開発開始当初から一度も変わっていません。 **動画とは時刻を与えると画像をレンダリングする副作用のない関数である** という設計思想のもとで、表示するテキストやグラフィックを格納するデータ構造を設計し、それがほぼそのまま使われ続けています。開発のかなり初期、2014 年に開発言語を Java から TypeScript に切り替えたのですが、そこでもほとんど書き写しただけです。現在の公開 API で [IVideo](https://developer.textalive.jp/packages/textalive-app-api/interfaces/IVideo.html) というインタフェースで表されるものです。

この部分は 2020 年に TextAlive App API をリリースするにあたり、リリックビデオを拡張してリリックアプリという概念を提唱した際（右図参照）にも維持されています。

こうした、研究上の貢献とも深く関わるような技術基盤に関しては、一切手をつけずに堅持することにしてきました。

## 互換性を守る複数の壁

TextAlive の外部連携にはいくつかのパターンが考えられ、それぞれで必要となる互換性の程度や種類が異なります。ただし、TextAlive の開発リソースは極めて限定的なので、コードベースは基本的に単一のものにする必要があります。そこで、外部連携のパターンに応じて渡す機能の **粒度** を変えることにしました。

最も大きいのが **Web アプリケーションの粒度** で、外部には、URL のクエリパラメタを変えることで望みの振る舞いを実現してもらいます。内部実装がどれだけ変わっても、クエリパラメタの仕様さえ同じならまったく問題なく動作します。Web アプリケーションの URL の仕様は、これまで完全な後方互換性を保ってきています。

次が **ラッパーライブラリの粒度** で、外部には、TextAlive の核となる機能のうち安定的なものだけを集めて再エキスポートしたライブラリを使ってもらいます。内部実装に追加や削除があっても、安定的な API の仕様さえ同じなら問題なく動作します。ラッパーライブラリは数か月に一度手を加える程度で、型が更新されることはありますが、リビルドできなくなるような破壊的変更はほとんどありません。

最後が **コアライブラリの粒度** で、外部には、TextAlive の核となる機能をそのまま使ってもらいますが、開発を支援するためのツールを同時に提供し、内部実装に大幅な変更があっても追従しやすくします。

それぞれ公開されている情報をもとに実例を紹介します。

### Web アプリケーションを渡す

街と音楽がシンクロする「[SYNCHRONICITY 2020](https://piapro.net/synchronicity2020)」では、 [Songle Sync](https://tutorial.songle.jp/sync) によって音楽再生と同期してリリックビデオが再生されています。これは TextAlive サービスサイトの Web アプリケーションとクエリパラメタの仕様だけで実現可能です。

https://www.youtube.com/watch?v=uIWMS8lkgqw

### ラッパーライブラリを渡す

画面をタップ／ドラッグするだけで歌詞アニメーションを手軽に制作・編集して楽しめる Web アプリケーション「[TextAlive Flow](https://flow.textalive.jp/)」は [TextAlive App API](https://developer.textalive.jp) を使って開発されています。

https://twitter.com/daniwell_aidn/status/1375066730456776704

初音ミク「マジカルミライ 2020」および「マジカルミライ 2021」のプログラミング・コンテストでは、 [TextAlive App API](https://developer.textalive.jp) を使って開発されたアプリケーションが公募されました。（公式サイト: [2020](https://magicalmirai.com/2020/procon)・[2021](https://magicalmirai.com/2021/procon)）

次の動画は 2021 年の最優秀賞受賞作品のデモですが、他にも力作が特設サイト（[2020](https://developer.textalive.jp/events/magicalmirai2020)・[2021](https://developer.textalive.jp/events/magicalmirai2021)）からアクセスできるのでぜひ見てみてください。

https://www.youtube.com/watch?v=NqszHM1g9xE

プログラミング・コンテストの開催期間中はフェアネスの観点から API に手を加えることはできませんが、サービスサイトなどの開発は継続する必要があります。このようなケースに対応するため、サービスサイトなどで使っているコア機能をそのまま一般公開するのではなく、コア機能を再パッケージして App API として公開しています。

私は、こうした再パッケージ化には [rollup.js](https://rollupjs.org/guide/en/) を使っています。また、型定義を元パッケージから持ってくるためには [Microsoft API Extractor](https://api-extractor.com) が使えます。

### コアライブラリを渡す

かなり踏み込んだ連携が必要な場合に限り、コアライブラリをそのまま渡す必要が出てきます。渡し方にもいろいろありそうですが、私はプライベート npm レジストリを立ち上げ、アカウントを連携先に渡す方法を採っています。こうすることで GitHub Actions などの CI でブランチごとに publish 先のレジストリを切り替えられるため、リリース前のパッケージを一部の人に試してもらうような運用もやりやすくなります。

最近 TextAlive として技術提供したイベントのうち、Web アプリケーションを渡したり、ラッパーライブラリを渡したりするだけでは実現できなかったものには「[初音ミク バースデーメッセージ企画 2021](https://piapro.net/mikusync2021)」と「[鏡音リン・レン Happy 14th Birthday メッセージ企画](https://piapro.net/rinlen14thbd/rinlensync14/)」が挙げられます。

https://twitter.com/cfm_miku/status/1434759780581580803

https://twitter.com/cfm_miku/status/1475428776146522114

コアライブラリをそのまま渡すようなケースでは、破壊的な変更に追従してもらう必要が生じる可能性が高いため、外部連携先とかなり密に連絡を取り合える環境が必須となります。

さらに、典型的な開発者向けリソース（API ドキュメント、サンプルコード、チュートリアル）では不足する部分に関しては、専用ツールを開発して提供することもあります。

### おわりに

この記事では、研究開発に従事する立場から、API やライブラリを提供することで外部とうまく連携しながら、研究開発の自由度をキープするためのノウハウを紹介してきました。具体的には、開発者向けリソースの充実に注力してきたこと、データ構造を初めからずっと変えていないこと、そして互換性を守るため複数の壁を設けている工夫について詳しく触れました。

記事で書かなかったことが二つあります。まず、これらすべてに共通して必要になるのが、**実装をモジュラーに整理しておくこと**だと思うのですが、そのためのノウハウは述べていません。私の場合、そうしたノウハウはデザインパターンの勉強などを軽く通過しつつ経験則で身につけてきたものであり言語化が難しいうえ、実装はプロトタイピングを繰り返しながら徐々に洗練されるものであり、そもそもパターン化されたノウハウでどうにかできるものではないと考えているためです。

次に、この記事は研究開発の**自由度**と互換性の両立について述べたものであり、**スピード**については議論の対象外です。これまでかなり自由気ままにコードを書いてきたつもりですが、これが最短ルートだったかは分かりません。また、私はあくまでソフトウェアエンジニアでなく研究者として成果を評価される立場なので、開発以外の業務に相当の時間を割いていて、専業エンジニアとしてのトップスピードはそもそも出せません。

この記事が誰の役に立つのかちょっと心配になってきましたが、あまり読んだことがないトピックだったので（参考文献があれば、ぜひ教えてください）、きっと引っかかる人がいると信じて筆を置くことにします。

今年一年お世話になりました。よいお年を！
