---
title: データジャーナリズムの現在地
date: '2022-07-27'
tags:
  - research
  - science
  - discussion
draft: true
summary_generated: >-
  情報処理学会の学会誌「情報処理」5 月号の巻頭コラムは NHK 解説委員 三輪
  誠司氏の「報道の現場を変えたプログラミングスキル」でした。三輪さんのことはNHK
  取材ノートで知り、この巻頭コラムも興味深く読ませていただきました。三輪さんが「業務改善ツール」として取り組まれて...
---

情報処理学会の学会誌「情報処理」5 月号の巻頭コラムは NHK 解説委員 三輪 誠司氏の「[報道の現場を変えたプログラミングスキル](https://note.com/ipsj/n/n903ecb469daf)」でした。三輪さんのことは[NHK 取材ノート](https://note.com/nhk_syuzai/n/n9ccbd599da50)で知り、この巻頭コラムも興味深く読ませていただきました。

三輪さんが「業務改善ツール」として取り組まれているもののうち、データをプログラムで処理してニュースに活用する手法は、広くデータジャーナリズム（data journalism）と呼称されているものだと思います。私の専門である[プログラミング体験（programming experience）](https://sigpx.org/)の研究者のなかには、データジャーナリズムに使えそうな、データ処理に特化したライブラリや開発環境を作っている人たちがいます。かくいう自分も[画像処理パイプラインをインタラクティブに作れる開発環境](https://junkato.jp/ja/visionsketch/)を作りました。

[福地](https://fukuchi.org/index.html.ja)さん、[坂本](https://daisukesakamoto.jp)さんとの雑談のなかで、データジャーナリズムに関する最新情報が日本語であまりまとまって出てこないことに気づきましたので、自分に分かる範囲をこの記事でまとめておこうと思います。

2014 年には朝日新聞と MIT が共同シンポジウムを開いていますが、
その後の組織的な取り組みには繋がっていないように見えます。

http://www.asahi.com/miraimedia/dj/

https://www.huffingtonpost.jp/2014/05/13/joi-talks-on-data-journalism_n_5314724.html

また、data journalism 黎明期から事例研究や普及活動を進めていたという赤倉 優蔵さんを知ったのですが、
おそらくこの方を中心に運営されていた「ジャーナリズム・イノベーション・アワード」が 2017 年で
止まってしまっています。

https://www.jstage.jst.go.jp/article/johokanri/58/3/58_166/_article/-char/ja

http://jcej.info/award/

Data Journalism Handbook という（界隈では有名そうな本？）の日本語訳プロジェクトがあるのですが、
2016 年に更新が止まっていて、原著の改訂版には追従できていないようです。

https://datajournalismjp.github.io/

https://www.facebook.com/groups/datajournalism.jp/

三輪さんの記事がバズったのは去年ですが、一昨年は、
東洋経済オンラインの新型コロナウィルスの記事も有名になりましたよね。

https://www.g-mark.org/award/describe/51074?locale=ja

この作者の荻原和樹さんは、今はスマートニュースのメディア研究所に勤めてらっしゃるようです。

https://type.jp/et/feature/12712/

https://smartnews-smri.com/member/kazuki-ogiwara/

荻原さんが 2020 年末に書かれた「なぜデータジャーナリズムは日本で普及しないのか」という記事は
「開発者を書き手として扱おう」のあたりなど、
三輪さんの課題感を違う角度から捉えたものに見えて、大変興味深かったです。

https://note.com/kazukio/n/nedb9fb057839

ちょうど 2021 年末、朝日新聞で元エンジニアの山崎 啓介さんが記事を作成、執筆した事例の解説が挙がっていて、
ある種、荻原さんの記事への回答になっています。

https://qiita.com/asakuramken/items/53f4f0d890e0a5549673

2010 年代中盤にいったんは止まった data journalism のうねりが、
また別のところで、まだ散発的ではありますが大きくなってきていたり、するんでしょうか。

https://business.nikkei.com/atcl/seminar/19/00067/122300019/

アカデミアの人間としては、こうしたテーマを専門に扱う研究室がどこかにあるのか気になります。
NLP 系の岡崎先生が 2016 年に解説記事を書かれています。

http://www.chokkan.org/publication/okazaki_ieice2016_datajournalism.pdf

2019 年には、UbiComp 系の東大越塚研がオープンデータつながりで（？）日経と共同研究を始めたようです。

https://www.koshizuka-lab.org/?p=779

ただ、どれも散発的な印象があります。また、メディア論などの人文系研究室の事例が見当たらないのも気になります。
法政大の藤代研は NTT 基礎研と共同研究したりしているので、数少ない例の一つかもしれません。

https://www.fujisiro.net/

道具鍛冶職人研究者としては、ジャーナリストが実践的に使えるプログラミング環境やソフトウェアツールを作るような研究が見当たらないのがちょっと残念です。

D3.js は University of Washington の Jeff Heer のラボで生まれましたが、
同ラボはその後も Vega やその応用研究 Idyll [UIST 2018]など論文も出しながら積極的に data journalism を支援しています。

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

- そもそも data journalism 用のプログラミングツールが貧弱である（あるいはいいものがあるが知られていない？）
- 汎用のプログラミング教育は data journalism への最短パスになっていない

という二段階の課題があり、どちらも同じくらい重要だと思います。
