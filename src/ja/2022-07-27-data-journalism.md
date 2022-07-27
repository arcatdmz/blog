---
title: データジャーナリズムの現在地
date: '2022-07-27'
tags:
  - research
  - science
  - discussion
draft: true
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

[福地](https://fukuchi.org/index.html.ja)さん、[坂本](https://daisukesakamoto.jp)さんとの雑談のなかで、データジャーナリズムに関する最新情報が日本語であまりまとまって出てこないことに気づきましたので、自分に分かる範囲をこの記事でまとめておこうと思います。

## 2010 年台

2010 年台は、オープンデータのうねりと共に、日本である程度データジャーナリズムという言葉が知られるようになった頃のようです。メディア企業がイベントを開いたり、英語資料の邦訳プロジェクトが走ったりしていました。

2014 年には朝日新聞が「[デジタルジャーナリズム](http://www.asahi.com/miraimedia/dj)」と題した特設ページを開設し、 MIT と[共同シンポジウム](https://www.huffingtonpost.jp/2014/05/13/joi-talks-on-data-journalism_n_5314724.html)を開いています。ただ、デジタルジャーナリズムのページの更新は同年で止まっていて、その後の組織的な取り組みには繋がっていないように見えます。

[![](/images/2022-07-27-www.asahi.com_miraimedia_dj.png)](http://www.asahi.com/miraimedia/dj)

データジャーナリズム黎明期から事例研究や普及活動を進めていた赤倉 優蔵さんという方がいらっしゃるのですが、おそらくこの方を中心に運営されていた「[ジャーナリズム・イノベーション・アワード](http://jcej.info/award)」が 2017 年で
止まってしまっています。

[![](/images/2022-07-27-jcej.info_award.jpg)](http://jcej.info/award)

また、Data Journalism Handbook という、おそらく界隈では有名な本の日本語訳プロジェクトがあるのですが、
2016 年に更新が止まっていて、原著の改訂版には追従できていないようです。

[![](/images/2022-07-27-datajournalismjp.github.io_handbook.png)](https://datajournalismjp.github.io/handbook)

- [データジャーナリズム概論　ニュースを変革する新たな報道手法](https://www.jstage.jst.go.jp/article/johokanri/58/3/58_166/_article/-char/ja), 情報管理 58(3), p.166-175
- [Data Journalism Handbook](https://datajournalismjp.github.io/), [Data Journalism Handbook 日本語翻訳プロジェクト](https://github.com/DataJournalismJP)

## 2020 年台

2020 年台に入ってからは、2010 年代終盤にかけていったんは静まったデータジャーナリズムのうねりが、また別のところで、散発的ではありますが大きくなってきているように見えます。

例えば、2020 年の元旦には「[『データジャーナリズム元年』への期待と懸念](https://business.nikkei.com/atcl/seminar/19/00067/122300019/)」という記事が掲載されています。同年 2 月には東洋経済オンラインで新型コロナウィルスのインタラクティブなビジュアライゼーション記事が有名になり、グッドデザイン賞を獲得しました。制作の経緯は[取材記事](https://type.jp/et/feature/12712/)によくまとまっています。

[![](/images/2022-07-27-20G181177_01_880x660.jpg)](https://www.g-mark.org/award/describe/51074?locale=ja)

このビジュアライゼーションの作者である荻原 和樹さんは、今は[スマートニュースのメディア研究所に勤めてらっしゃる](https://smartnews-smri.com/member/kazuki-ogiwara/)ようです。

荻原さんが 2020 年末に書かれた「[なぜデータジャーナリズムは日本で普及しないのか](https://note.com/kazukio/n/nedb9fb057839)」という記事は、三輪さんの課題感を違う角度から捉えたものに見えて、大変興味深かったです。
例えば「開発者を書き手として扱おう」というあたりは、私の目指す世界観とも近いもので共感しました。

ちょうど 2021 年末には、朝日新聞で元エンジニアの山崎 啓介さんが記事を作成、執筆した事例の解説「[データジャーナリズムの種明かしするよ（衆院選の争点分析）](https://qiita.com/asakuramken/items/53f4f0d890e0a5549673)」が Qiita に掲載されました。これは、荻原さんの記事への回答にもなっています。

## アカデミアの取り組み

アカデミアでは、データジャーナリズムに関する研究が散発的に行われています。

自然言語処理（Natural Language Processing; NLP）を専門としている岡崎先生が 2016 年に解説記事を書かれています。

http://www.chokkan.org/publication/okazaki_ieice2016_datajournalism.pdf

2019 年には、Ubiquitous Computing (UbiComp) を専門としている東大 越塚研がオープンデータつながりで日経と共同研究を始めたようです。

https://www.koshizuka-lab.org/?p=779

人文科学系での研究事例はさらに数が少ないようですが、法政大 藤代研は NTT 基礎研と共同研究したりしています。

https://www.fujisiro.net/

## データジャーナリズムのためのツール

道具鍛冶職人としては、ジャーナリストが実践的に使えるプログラミング環境やソフトウェアツールを作るような研究が見当たらないのがちょっと残念です。

D3.js は University of Washington の Jeff Heer のラボで生まれましたが、
同ラボはその後も Vega やその応用研究 Idyll [UIST 2018]など論文も出しながら積極的にデータジャーナリズムを支援しています。

https://vega.github.io/vega/about/research/

http://idl.cs.washington.edu/papers/idyll/

ジャーナリズムとは距離を置いているようですが、Microsoft Research の Bongshin Lee たちが積極的に
ツール開発をしている data-driven storytelling も関連が深い研究テーマですね。

https://www.microsoft.com/en-us/research/project/data-driven-storytelling/publications/

変わり種では、知り合いのプログラミング言語系の研究者 Tomas Petricek が、
Alan Turing Institute でポスドクをしていた間に、Gamma というシンプルなデータジャーナリズム用言語を作っていました。

http://tomasp.net/

私はかねてからプログラミング言語やプログラミング環境は汎用的すぎる（開発したいアプリケーションごとに適したユーザインタフェースを備えているべき）と考えて、ある程度用途を特化しながら、インタラクションデザインを工夫した道具（言語や環境）を作ってきました。

データジャーナリズムに関しても

- そもそもデータジャーナリズム用のプログラミングツールが貧弱である（あるいはいいものがあるが知られていない？）
- 汎用のプログラミング教育はデータジャーナリズムへの最短パスになっていない

という二段階の課題があり、どちらも同じくらい重要だと思います。
