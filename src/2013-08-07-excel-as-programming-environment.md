---
title: "プログラミング環境としてのExcel"
date: "2013-08-07"
categories: 
  - "research"
  - "sigpx"
---

萩谷先生の[「Excelでプログラムを書く」](http://lecture.ecc.u-tokyo.ac.jp/~shagiya/excel.pdf)という原稿が話題に挙がっていたので、僕の知る範囲で、研究の文脈をちょっとご紹介します。

プログラミング環境としてのExcelという考え方は、文字列ベースの開発環境に慣れた人にはちょっと頓狂に聞こえるかもしれませんが、Microsoft Research Cambridgeの[Simon P. Jones氏](http://research.microsoft.com/en-us/people/simonpj/) (2003-2004年あたりに関連研究)など、MSの中の人もかなり自覚的に極めようとしてきた節があります。最近の例だと、Excel 2013から導入された[FlashFill](http://research.microsoft.com/en-us/um/people/sumitg/flashfill.html)という機能もプログラミング言語の研究が背景にあります。

Excelに限らず、関数をサポートするスプレッドシートは関数型プログラミングを可能にするデータフロー言語の一種です。データフロー言語というと、ノード間の依存関係が有向辺で結ばれたVisual Programming Languageがすぐ思い浮かぶかもしれません。しかし、スプレッドシートは依存関係が隠れているだけで、中身は同じです。ちなみに、私の指導教官である五十嵐先生の初国際会議論文が、スプレッドシートにおけるセル間の依存関係を可視化する手法について述べた ["Fluid Visualization of Spreadsheet Structures"](http://www-ui.is.s.u-tokyo.ac.jp/~takeo/papers/vl98.pdf) (1998年)という論文です。ちょうど同時期に、Ed Chiという、今はGoogleでHCI研究をしている人が博士論文で[CGの可視化手法との組み合わせ](http://www-users.cs.umn.edu/~echi/phd/)を提案しています。

データフロー言語のいいところは、関数間の依存関係がはっきりしていて並列処理に向いている点などいろいろありますが、同時に、forループを表現しにくいなどの問題も抱えています。このあたり、詳しくはVisual Programming Languageの文献を当たってみるといろいろな解決法が提案されていて面白いと思います。(訳: よく調べていません。どなたか教えてくださいw) スプレッドシートによるプログラミングをエンドユーザプログラミングの観点で分析した議論はAndy Ko氏の ["The State of the Art in End-User Software Engineering"](http://dl.acm.org/citation.cfm?id=1922649.1922658) (2011年)の中でいろいろ書かれています。これは面白い論文なので、よく読もうと思っています。
