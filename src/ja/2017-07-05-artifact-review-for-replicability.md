---
title: 科学研究の再現性について
date: '2017-07-05'
tags:
  - discussion
summary_generated: >-
  2018年5月28日追記: ヒューマンインタフェース学会の会誌Vol.20
  No.1にヒューマンインタフェース研究における再現性向上に向けた取り組みと題した寄稿が掲載されました。本記事と合わせてどうぞ。昨年IPSJ-ONEに登壇した際の記事「情報処理が科学を更新する」では「...
---

**2018年5月28日追記:** ヒューマンインタフェース学会の会誌Vol.20 No.1に[ヒューマンインタフェース研究における再現性向上に向けた取り組み](https://junkato.jp/ja/science/)と題した寄稿が掲載されました。本記事と合わせてどうぞ。

昨年IPSJ-ONEに登壇した際の記事[「情報処理が科学を更新する」](http://junkato.jp/ja/blog/2016/03/16/ipsj-one-px-science-as-a-service/)では「Science as a Service」というコンセプトを解説し、プログラミング環境技術を伸ばしていった先に、効率的で再現性の担保された科学研究があるという旨を議論しました。

こうした流れについてはもはや止められるものでなく、実際にいろいろな事例を見聞きするようになってきました。ここでいったん、自分から見えている現状をまとめておこうと思います。他にも事例や研究コミュニティをご存知の方がいらっしゃいましたら、ぜひお知らせください。

## 再現できない！

以前の記事で引いたのは[2016年初頭の「生物医科学論文の大半に不備、信頼性に疑問符」と題するAFP通信の記事](http://www.afpbb.com/articles/-/3072132)で、元となった調査は[2016年1月4日のPLoS Biologyに掲載されたMeta-Research Article](https://dx.doi.org/10.1371/journal.pbio.1002333)でした。その後も、[2016年5月4日付のNature Newsで1500人の科学者を対象にした再現性に関する調査結果](http://www.nature.com/news/1-500-scientists-lift-the-lid-on-reproducibility-1.19970)が公開されました。**調査対象のうち70%以上が再現実験に失敗したことがあり、過半数が自分の実験ですら再現できなかったことがある**といった内容です。こうした危機感は研究者コミュニティのなかでは相当共有されていると思います。

再現実験の取り組みは以前からあって、例えば2012年には[LJAF Foundation](http://www.arnoldfoundation.org/initiative/research-integrity/)から著名な癌研究を検証するために130万ドルのファンディングが[Science Exchange](https://www.scienceexchange.com/applications/reproducibility)というスタートアップに提供され、[Validation by Scientific Exchange](http://validation.scienceexchange.com/#/press)というプロジェクトになっています。2015年8月には[心理学実験の論文100本を再現した研究](https://digest.bps.org.uk/2015/08/27/this-is-what-happened-when-psychologists-tried-to-replicate-100-previously-published-findings/)で、**元々の論文のうち97%で統計的な有意差が報告されていたのに対し、再現実験では36%でしか有意差が観察されなかった**ことが明らかになりました。2016年7月にはオランダの科学予算から[再現実験のためだけの300万ユーロのファンディング](https://www.nwo.nl/en/news-and-events/news/2016/nwo-makes-3-million-available-for-replication-studies-pilot.html)が立ち上がりました。日本で私と近い研究コミュニティだと、みんなで既存研究の再実装をして知見を共有しようという[CG技術の実装と数理](http://cg.eng.shizuoka.ac.jp/~micgt2017/)という勉強会があります。

**論文が大量に刊行され、査読者以外誰にも知られず忘れられていく**ことが問題の一端にあるとすれば、みんなで論文読み会をしてよく分からない論文を顕在化してしまうのも解決策の一つになるかもしれません。私の研究分野（Human-Computer Interaction）では、毎年600本近く刊行される論文を分担して紹介し合う[CHI勉強会](http://sigchi.jp/seminar/chi2017/)が何年も開催され続けています。Computer Vision分野にも[cvpaper.challenge](https://sites.google.com/site/cvpaperchallenge/home)という同様の試みがあります。

## なぜ再現性のない論文を書いてしまうのか

再現性が取れないような実験論文を書いてしまう原因の一つに、**実験をする段階で研究者側に思い込みがあって、それが反映された計画を立ててしまう、あるいは、結果を収集する段階で無意識に結果を選別してしまう**といったことが挙げられます。そこで、心理学のジャーナルの一部では、[実験計画を立てる段階で、実験を行う前に、ジャーナルに対して「Pre-registration」──すなわち実験内容を報告する](http://www.apa.org/science/about/psa/2015/08/pre-registration.aspx)ことになっています。これはユーザスタディを伴う論文をよく執筆する私の研究分野でもすぐ実現できそうで、極めて興味深い取り組みだと思います。

また、もう一つ、より根本的な原因として「CNS (Cell, Nature, Science)」などと呼ばれるトップジャーナルが権威を持ちすぎたことが挙げられます。**トップジャーナルに採録されたいがために、歪んだ研究プロセスを採ってしまう**ことがありうるのです。トップジャーナルが権威を得てきた過程については、[最近のGIGAZINEの記事「メディア王ロバート・マクスウェルが『科学』から巨万の富を搾り取る科学出版システムを作った方法とは？」](http://gigazine.net/news/20170630-robert-maxwell-change-science/)でも紹介されています。少し検索しただけでも、高額な契約料を強いるElsevierに対し大学図書館がボイコットした件についての[日本語の論考](http://user.keio.ac.jp/~ueda/papers/sc2014.pdf)が出てきました。

こうした批判の一方で、Elsevierは[多くの研究を効率化するスタートアップを買収](https://www.crunchbase.com/organization/elsevier)しており、巨人としての責任を果たそうとしているようにも見えます。スタートアップ界隈での科学技術研究を推進する取り組みについては[馬田さんの記事](https://medium.com/@tumada/%E7%A0%94%E7%A9%B6%E3%82%92%E5%8A%A0%E9%80%9F%E3%81%99%E3%82%8B%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E3%81%AE%E5%A2%97%E5%8A%A0-%E7%A0%94%E7%A9%B6%E8%80%85%E5%90%91%E3%81%91%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%E7%B4%84-50-%E5%80%8B-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88-9dc6ffe90360)が詳しいので、ぜひ読んでみてください。

現時点ですでに研究者の方なら、最近は予算獲得などの過程で研究不正を防ぐための講義が義務付けられていることが多いため、学びの機会が半強制的に得られていると思います。一方、これから研究者になる人が研究の方法を学ぶ機会も増えてきているようです。例えば東京大学では、[一年生から科学の技法を学ぶゼミがある](http://komex-fye.c.u-tokyo.ac.jp/programmes#rika)ようです。僕が在学中にはなかったので羨ましい！[これに関連した書籍「科学の技法」の書評](http://dain.cocolog-nifty.com/myblog/2017/07/post-119b.html)も参考になります。（ちょっとオフトピックですが、[同じ人の書評で「科学の経済学」](http://dain.cocolog-nifty.com/myblog/2016/05/post-cfa6.html)も気になりますね。）

## 再現性のある研究発表フォーマットとは

そもそも論文という静的な紙面を基本とするフォーマットは、**抽象的な考え方や得られた知見、つまり研究の結論をコンパクトに伝えるのには向いているけれども、結論に至った研究のプロセスのように具体的で雑多な情報を伝えるのが難しい**という問題もあります。

そこで、記事[「情報処理が科学を更新する」](http://junkato.jp/ja/blog/2016/03/16/ipsj-one-px-science-as-a-service/)中の[発表資料](https://www.slideshare.net/arcatdmz/a-line-of-code-is-worth-ten-thousand-words)では「結果の共有からプロセスの共有へ」という流れを紹介しました。例えば、数学的証明をプログラムで自動化することで複雑な証明を機械検証可能なソースコードとして書けるようにする証明支援システム[Coq](https://coq.inria.fr/)や、生物学実験のハードウェアとソフトウェアをオープンソース化する[DIYbio](https://diybio.org/)、複雑なデータの可視化を容易にする[Cytoscape](http://www.cytoscape.org/)などを事例として挙げています。

ここまで幅を広げなくても、**論文フォーマットを改善しようとか、論文に付随するデータやソースコードをもっと重視しようという試み**が近年コンピュータ科学を中心に広まっています。私の研究分野では論文にデモ動画をつけて投稿するのが当たり前になっていますし、Autodeskの研究者は[動画を論文PDF中に埋め込んで投稿してしまおう](https://www.autodeskresearch.com/publications/bringing-research-articles-life-animated-figures)と提唱しています。さらに、私から見て分野横断的に一番盛り上がっているのが、これから紹介する「Artifact Evaluation」です。

## Artifact Evaluation

コンピュータ科学分野の最大学会であるAssociation for Computing Machinery (ACM)は[「Artifact Review and Badging」](http://www.acm.org/publications/policies/artifact-review-badging)というタイトルで各分野の予稿集において**「論文だけでなく対象となるシステムや取り扱ったデータ(artifact)を公開することを推奨し、一定の基準をクリアした論文にバッジを付与して讃えよう」**というポリシーを表明しています。Artifact Evaluationと呼ばれるこうした試みはACMのなかでもソフトウェアに関する国際会議で始まったようです。例えば [Artifact Evaluations for Software Conferences](http://www.artifact-eval.org/) とか [Artifact Evaluation for Computer Systems' Research](http://ctuning.org/ae/) といったWebサイトに情報がまとまっています。この取り組みをサポートする会議では、プログラム委員会の他に、Artifact Evaluation Committeeという委員会が編成されます。似たような試みが最近コンピュータグラフィクスの国際会議であるSIGGRAPHでも始まっており、 [Graphics Replicability Stamp Initiative](http://www.replicabilitystamp.org/) で再現が容易な論文発表の一覧を見ることができます。

これらのArtifact Evaluationでは論文投稿者はGitHubなど誰でもアクセスできるソースコードリポジトリにすべてのソースコードとデータを置くことが一般的となっています。こういった取り組みは、近年のDeep Learning関連の研究でも頻繁に見られます。研究者の方で自身の研究成果をGitHubに置いてみたいと思ったら、日本語だと[「あなたの研究を可視化させるGitHubのすすめ」](https://lab-on.jp/article/1)という記事が参考になると思います。

コンピュータ科学に寄った話をしましたが、コンピュータは今やどんな研究分野でも使われています。とくに統計処理やデータの可視化などでコンピュータは大活躍しています。 scientific computing とか data-intensive science といったキーワードで調べると、関連する諸分野がいろいろ出てきます。とくに若い世代の研究者は、GUIのツールを使うだけでなく、統計処理やデータの可視化を自分でプログラムのソースコードを書いて行っています。前出のArtifact Evaluationはコンピュータ科学以外の分野でも行えるはずだし、実際にいろいろな研究コミュニティがそういう方向に進んでいます。

## Artifact Evaluationを可能にする技術

だんだん、私の専門であるプログラミング環境の話に近づけていきましょう。ソースコードやデータを配布する取り組みが現実的になってきた背景には、プログラミング言語や仮想化技術の発展があります。かつては、ソフトウェアのソースコードを書いても、それが実行できる環境は限られていました。ソースコードだけを配布しても意味がない研究が多かったのです。そこで私が注目している技術は二つ、DockerとJupyter Notebookです。

[Docker](https://www.docker.com/)は本質的には軽量な仮想化技術ですが、その周りを取り囲むツールや思想が非常に先進的です。すなわち、ソースコードをコンパイルして実行するための**「環境」を記述する専用のフォーマット**としてDockerfileがあり、これを他の人から受け継いでさらに編集したりできるのです。これによって、例えば論文で使われているシステムをすぐ実行できるだけでなく、査読者がソースコードを編集してコンパイルし直して他のパラメタを試したりできます。そういった可能性は例えば[2015年のブログ記事「Docker for data-intensive science」](http://ivory.idyll.org/blog/2015-docker-and-replicating-papers.html)で議論されていますし、生物学関連の便利なライブラリや開発環境をDocker化してみんなで共有できるようにした[「Bioshadock - Docker for Science」](http://bioshadock.genouest.org/)という取り組みがあります。Bioshadockは[論文](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4743153/)にもなっているようです。

[Jupyter](http://jupyter.org/)はある意味そのさらに上のレイヤーの取り組みで、コンピュータの深いところまで知らない科学者でも容易に使えるWeb上のプログラミング環境の一種です。こう書くとプログラミングできないと使えないように思われるかもしれませんが、**Google Docsにプログラミング機能を足したもの**といったほうがよいかもしれません。日本語だとほぼプログラマ向けの情報しか出てきませんが（私が科学者・研究者向けに情報をまとめたほうがいいのか…？）例えば[簡単な説明スライド](https://www.slideshare.net/enakai/life-with-jupyter)が見つかりました。生物学者向けにはPLoS Computational Biologyの2017年5月の論文で[「](http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005425)[Jupyter and Galaxy: Easing entry barriers into complex data analyses for biomedical researchers」](http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005425)という紹介記事があります。

こうした技術のおかげで、コンピュータ上のソフトウェアレベルでの再現性というのは飛躍的に向上したと言えると思います。**あとは、実際の実験室、すなわち物理世界で行われているウェットな実験プロセスをどうやってコンピュータで扱えるようにするか、という問題が残されています。**これについてはまだまだ研究が必要だと思っていて、私の研究でいえば[インターネットに繋がったデバイスを簡単に設計、出力できるf3.js](http://f3js.org)などが深く関連すると考えているのですが、その話はまたいずれ。

## Computer Scientists as Toolsmiths

この記事では、長らく問題視されてきた「研究の再現性」について、なぜ再現できないのか、なぜそうした研究をしてしまうのか、再現できる研究発表をするにはどうしたらいいのか、いろいろな事例を引きながら考えてきました。コンピュータ科学者である私としては、**科学研究の方法をコンピュータを使って革新していくのが建設的な解決策**だと信じています。

そうした考えをもっともよく表していて好きな言葉が「Computer Scientists as Toolsmiths」です。[同名の論文](http://www.cs.unc.edu/~brooks/Toolsmith-CACM.pdf)から引用します。

> If the computer scientist is a toolsmith, and if our delight is to fashion power tools and amplifiers for minds, we must partner with those who will use our tools, those whose intelligences we hope to amplify.

というわけで、こうした研究に興味のある方、情報をお持ちの方はぜひお知らせください。研究者の道具はもっとよくできるはずで、それは、研究の再現性を向上させる以上の価値を生むはずです。
