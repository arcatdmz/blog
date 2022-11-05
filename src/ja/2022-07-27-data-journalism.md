---
title: データジャーナリズムの現在地
date: '2022-07-27'
tags:
  - research
  - science
  - discussion
summary: >-
  情報処理学会の学会誌「情報処理」5 月号の巻頭コラムは NHK 解説委員 三輪
  誠司氏の「報道の現場を変えたプログラミングスキル」でした。三輪さんの取り組みは、広義ではデータジャーナリズム（data
  journalism）として捉えることができます。その動向を記事にまとめました。
summary_generated: >-
  情報処理学会の学会誌「情報処理」5 月号の巻頭コラムは NHK 解説委員 三輪
  誠司氏の「報道の現場を変えたプログラミングスキル」でした。三輪さんのことはNHK
  取材ノートで知り、この巻頭コラムも興味深く読ませていただきました。三輪さんが「業務改善ツール」として取り組まれて...
---

情報処理学会の学会誌「情報処理」5 月号の巻頭コラムは NHK 解説委員 三輪 誠司氏の「[報道の現場を変えたプログラミングスキル](https://note.com/ipsj/n/n903ecb469daf)」でした。三輪さんのことは[NHK 取材ノート](https://note.com/nhk_syuzai/n/n9ccbd599da50)で知り、この巻頭コラムも興味深く読ませていただきました。

三輪さんが「業務改善ツール」として取り組まれているもののうち、データをプログラムで処理してニュースに活用する手法は、広くデータジャーナリズム（data journalism）と呼称されているものだと思います。私の専門である[プログラミング体験（programming experience）](https://sigpx.org/)の研究者のなかには、データジャーナリズムに使えそうな、データ処理に特化したライブラリや開発環境を作っている人たちがいます。かくいう自分も[画像処理パイプラインをインタラクティブに作れる開発環境](https://junkato.jp/ja/visionsketch/)を作りました。

[福地](https://fukuchi.org/index.html.ja)さん、[坂本](https://daisukesakamoto.jp)さんとの雑談のなかで、データジャーナリズムに関する最新情報が日本語であまりまとまって出てこないことに気づきましたので、素人目線ですが、ちょっと調べて分かったことをこの記事でまとめておこうと思います。（事実誤認や抜け漏れがありましたら[お知らせください！](https://junkato.jp/ja#contact)）

## 2010 年代

2010 年代は、オープンデータのうねりと共に、日本である程度データジャーナリズムという言葉が知られるようになった頃のようです。メディア企業がイベントを開いたり、英語資料の邦訳プロジェクトが走ったりしていました。

2014 年には朝日新聞が「[デジタルジャーナリズム](http://www.asahi.com/miraimedia/dj)」と題した特設ページを開設し、 MIT と[共同シンポジウム](https://www.huffingtonpost.jp/2014/05/13/joi-talks-on-data-journalism_n_5314724.html)を開いています。ただ、デジタルジャーナリズムのページの更新は同年で止まっていて、その後の組織的な取り組みには繋がっていないように見えます。

[![](/images/2022-07-27-www.asahi.com_miraimedia_dj.png)](http://www.asahi.com/miraimedia/dj)

データジャーナリズム黎明期から事例研究や普及活動を進めていた赤倉 優蔵さんという方がいらっしゃるのですが、おそらくこの方を中心に運営されていた「[ジャーナリズム・イノベーション・アワード](http://jcej.info/award)」が 2017 年で止まっています。

[![](/images/2022-07-27-jcej.info_award.jpg)](http://jcej.info/award)

また、Data Journalism Handbook という、おそらく界隈では有名な本の日本語訳プロジェクトがあるのですが、
2016 年に更新が止まっていて、原著の改訂版には追従できていないようです。

[![](/images/2022-07-27-datajournalismjp.github.io_handbook.png)](https://datajournalismjp.github.io/handbook)

## 2020 年代

2020 年代に入ってからは、2010 年代終盤にかけていったんは静まったデータジャーナリズムのうねりが、また別のところで、散発的ではありますが大きくなってきているように見えます。

例えば、2020 年の元旦には「[『データジャーナリズム元年』への期待と懸念](https://business.nikkei.com/atcl/seminar/19/00067/122300019/)」という記事が掲載されています。同年 2 月には東洋経済オンラインで新型コロナウィルスのインタラクティブなビジュアライゼーション記事が有名になり、グッドデザイン賞を獲得しました。制作の経緯は[取材記事](https://type.jp/et/feature/12712/)によくまとまっています。

[![](/images/2022-07-27-20G181177_01_880x660.jpg)](https://www.g-mark.org/award/describe/51074?locale=ja)

このビジュアライゼーションの作者である荻原 和樹さんは、今は[スマートニュースのメディア研究所に勤めてらっしゃる](https://smartnews-smri.com/member/kazuki-ogiwara/)ようです。

荻原さんが 2020 年末に書かれた「[なぜデータジャーナリズムは日本で普及しないのか](https://note.com/kazukio/n/nedb9fb057839)」という記事は、三輪さんの課題感を違う角度から捉えたものに見えて、大変興味深かったです。
例えば「開発者を書き手として扱おう」というあたりは、私の目指す世界観とも近いもので共感しました。

ちょうど 2021 年末には、朝日新聞で元エンジニアの山崎 啓介さんが記事を作成、執筆した事例の解説「[データジャーナリズムの種明かしするよ（衆院選の争点分析）](https://qiita.com/asakuramken/items/53f4f0d890e0a5549673)」が Qiita に掲載されました。これは、荻原さんの記事への回答にもなっていますね。

## アカデミアの取り組み

アカデミアでは、データジャーナリズムに関する研究が散発的に行われています。（専門にしている研究室は寡聞にして知りません…もしあれば、教えていただけると嬉しいです。）

自然言語処理（Natural Language Processing; NLP）を専門としている岡崎 直観さんが 2016 年に解説記事を書かれています。

[![](/images/2022-07-27-okazaki_ieice2016_datajournalism.png)](http://www.chokkan.org/publication/okazaki_ieice2016_datajournalism.pdf)

2019 年には、Ubiquitous Computing (UbiComp) を専門としている東大 越塚研が[オープンデータつながりで日経と共同研究を始めた](https://www.koshizuka-lab.org/?p=779)ようです。人文科学系での研究事例はさらに数が少ないようですが、[法政大 藤代研](https://www.fujisiro.net)は NTT 基礎研と共同研究したりしています。

## データジャーナリズムのためのツール

日本ではあまり見ないのですが、海外に目を向けると、ジャーナリスト向けの創造性支援やジャーナリストが実践的に使えるプログラミング環境・ソフトウェアツールを作るような研究もあります。Human-Computer Interaction、データ可視化、プログラミング言語などの研究分野で横断的に取り組まれています。

CHI 2018で発表された [Making the News: Digital Creativity Support for Journalists](https://dl.acm.org/doi/10.1145/3173574.3174049) はその典型例です。

データ可視化ライブラリで有名な [D3.js](https://idl.cs.washington.edu/papers/d3) は University of Washington の Jeff Heer のラボ [Interactive Data Lab](https://idl.cs.washington.edu) で生まれましたが、同ラボはその後も [Vega](https://vega.github.io/vega/about/research) やその応用研究 [Idyll](http://idl.cs.washington.edu/papers/idyll) など、論文も出しながら積極的にデータジャーナリズムを支援しています。

ジャーナリズムとは距離を置いているようですが、Microsoft Research の Bongshin Lee たちが積極的に
ツール開発をしている [Data-driven Storytelling](https://www.microsoft.com/en-us/research/project/data-driven-storytelling/publications) も関連が深い研究テーマですね。

変わり種では、プログラミング言語系の研究者 [Tomas Petricek](http://tomasp.net) が、
Alan Turing Institute でポスドクをしていた間に、 [Gamma](https://thegamma.net) というシンプルなデータジャーナリズム用言語を作っていました。

## 最後に

私はかねてから、メインストリームのプログラミング言語やプログラミング環境は汎用的すぎると考え、開発したいアプリケーションごとに適したユーザインタフェースを設計し、ドメイン特化の言語や環境を作ってきました。プログラミング教育については横目で見つつ自分で直接研究したことはないのですが、誰もがプログラミングを学ぶご時世だからこそ、学び方にもバリエーションがあったほうがよいのではないかと感じます。

データジャーナリズムに関しても

- そもそもデータジャーナリズム用のプログラミングツールが貧弱である（あるいは、いいものがあるが知られていない）
- 汎用のプログラミング教育はデータジャーナリズムへの最短パスになっていない

という二段階の課題があるような気がします。

今すぐに研究できる余力があるわけでは（たぶん）ないのですが、今後も業界ウォッチを続けたいと思います。

## 日本語 文献リスト

- 朝日新聞, [デジタルジャーナリズム](http://www.asahi.com/miraimedia/dj), 2014.
- 赤倉 優蔵, [データジャーナリズム概論　ニュースを変革する新たな報道手法](https://www.jstage.jst.go.jp/article/johokanri/58/3/58_166/_article/-char/ja), 情報管理 58(3), p.166-175, 2015.
- Data Journalism Handbook 日本語翻訳プロジェクト, [Data Journalism Handbook](https://datajournalismjp.github.io/), [GitHub](https://github.com/DataJournalismJP), 2016.
- 岡崎 直観, [データジャーナリズムとデータ科学](http://www.chokkan.org/publication/okazaki_ieice2016_datajournalism.pdf), 電子情報通信学会誌 99(4), p.339-346, 2016.
- 松本 健太郎, [2020年、「データジャーナリズム元年」への期待と懸念](https://business.nikkei.com/atcl/seminar/19/00067/122300019/), 日経ビジネス電子版, 2020.
- 荻原 和樹, [なぜデータジャーナリズムは日本で普及しないのか](https://note.com/kazukio/n/nedb9fb057839), note, 2020.
- 山崎 啓介, [データジャーナリズムの種明かしするよ（衆院選の争点分析）](https://qiita.com/asakuramken/items/53f4f0d890e0a5549673), Qiita, 2021.
