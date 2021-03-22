---
title: プログラミング環境としてのExcel
date: "2013-08-07"
tags:
  - research
  - sigpx
summary_generated: >-
  萩谷先生の「Excelでプログラムを書く」という原稿が話題に挙がっていたので、僕の知る範囲で、研究の文脈をちょっとご紹介します。プログラミング環境としてのExcelという考え方は、文字列ベースの開発環境に慣れた人にはちょっと頓狂に聞こえるかもしれませんが、Microsoft...
---

萩谷先生の[「Excel でプログラムを書く」](http://lecture.ecc.u-tokyo.ac.jp/~shagiya/excel.pdf)という原稿が話題に挙がっていたので、僕の知る範囲で、研究の文脈をちょっとご紹介します。

プログラミング環境としての Excel という考え方は、文字列ベースの開発環境に慣れた人にはちょっと頓狂に聞こえるかもしれませんが、Microsoft Research Cambridge の[Simon P. Jones 氏](http://research.microsoft.com/en-us/people/simonpj/) (2003-2004 年あたりに関連研究)など、MS の中の人もかなり自覚的に極めようとしてきた節があります。最近の例だと、Excel 2013 から導入された[FlashFill](http://research.microsoft.com/en-us/um/people/sumitg/flashfill.html)という機能もプログラミング言語の研究が背景にあります。

Excel に限らず、関数をサポートするスプレッドシートは関数型プログラミングを可能にするデータフロー言語の一種です。データフロー言語というと、ノード間の依存関係が有向辺で結ばれた Visual Programming Language がすぐ思い浮かぶかもしれません。しかし、スプレッドシートは依存関係が隠れているだけで、中身は同じです。ちなみに、私の指導教官である五十嵐先生の初国際会議論文が、スプレッドシートにおけるセル間の依存関係を可視化する手法について述べた ["Fluid Visualization of Spreadsheet Structures"](http://www-ui.is.s.u-tokyo.ac.jp/~takeo/papers/vl98.pdf) (1998 年)という論文です。ちょうど同時期に、Ed Chi という、今は Google で HCI 研究をしている人が博士論文で[CG の可視化手法との組み合わせ](http://www-users.cs.umn.edu/~echi/phd/)を提案しています。

データフロー言語のいいところは、関数間の依存関係がはっきりしていて並列処理に向いている点などいろいろありますが、同時に、for ループを表現しにくいなどの問題も抱えています。このあたり、詳しくは Visual Programming Language の文献を当たってみるといろいろな解決法が提案されていて面白いと思います。(訳: よく調べていません。どなたか教えてください w) スプレッドシートによるプログラミングをエンドユーザプログラミングの観点で分析した議論は Andy Ko 氏の ["The State of the Art in End-User Software Engineering"](http://dl.acm.org/citation.cfm?id=1922649.1922658) (2011 年)の中でいろいろ書かれています。これは面白い論文なので、よく読もうと思っています。
