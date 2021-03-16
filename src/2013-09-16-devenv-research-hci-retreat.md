---
title: "“開発環境の研究”とは？ / HCI編 補遺"
date: "2013-09-16"
categories: 
  - "research"
  - "sigpx"
---

早いもので、[“開発環境の研究”とは？ / HCI編](http://junkato.jp/ja/blog/2012/11/21/devenv-research-hci/)を書いてからもう一年近く経ってしまいました。すぐにPL編を書こうと思っていたのですが、何となくHCI編も分野を嘗めきれていない気がして筆が進みませんでした。論文を読んでいろいろと歴史を紐解いていくうちに、この違和感の正体が分かってきたので頭の中の整理を兼ねてざっと補遺を書いておきます。そのうち補遺の補遺が出るやもしれません。

前回はHCI系開発環境研究が投稿される主な学会をACMの[CHI](http://chi2013.acm.org/), [UIST](http://www.acm.org/uist/)としていたのですが、IEEEの[VL/HCC](http://conferences.computer.org/VLHCC/)が抜けていました。これはちょうどPL系とHCI系の間に位置する学会だと言っていいと思います。

VL/HCCは、名前の通りVisual Languageを扱う学会として、初めは単にVLという名前で立ち上がりました。初回は1984年の広島です。当時はIBMのPersonal Computerが広がり始めた頃で、エンドユーザという人種が初めて現れた頃でもありました。そこで、プログラミングの概念を理解しない初学者やエンドユーザに対して、どうやってプログラミングを学んでもらうかというのが大きな研究課題でした。そこで颯爽と現れたVisual Programming Languageは、視覚表現を使うから人に分かりやすいはずだ、一次元の文字表現より二次元のほうがリッチなはずだ、と持て囃されます。最初の頃のVLはわりと牧歌的に、視覚的であることはいいことだ！として、プログラミングに用いる全ての概念をVPLに詰め込んだりしていました。

ところが、MATLABのような少数の成功例を除いてなかなかVPLは普及しません。そこで、視覚的＝いいもの、というのは[ちょっと短絡的過ぎたんではないか](http://books.google.com/books?id=KT_bpSSJBgcC&lpg=PA121&ots=xOqA9RqCmE&dq=comprehensibility%20of%20visual%20and%20textual%20programs&lr&pg=PA121#v=onepage&q=comprehensibility%20of%20visual%20and%20textual%20programs&f=false "Comprehensibility of visual and textual programs: A test of superlativism against the’match-mismatch’conjecture")\[Green et al., 1991\][いったい我々は何を考えて研究してたんだろう](http://dx.doi.org/10.1109/VL.1996.545293 "Metacognitive theories of visual programming: what do we think we are doing?")\[Blackwell, 1996\]という揺り戻しがあります。そして、こういうのは[心理学の手法にしたがってちゃんと使える知見として溜めていくべきだろう](http://books.google.co.jp/books?id=gGyEOjkdpbYC&lpg=PA103&ots=6xumBtoOkX&dq=the%20cognitive%20dimensions%20of%20notations%20framework&lr&pg=PA103#v=onepage&q=the%20cognitive%20dimensions%20of%20notations%20framework&f=false "Notational systems–the cognitive dimensions of notations framework")\[Blackwell & Green, 2003\]という反省がなされます。

HCI編で紹介したほとんどの論文著者を直接、間接的に指導しているBrad Myersの[Natural Programming](http://www.cs.cmu.edu/~NatProg/index.html "Natural Programming Project, Carnegie Mellon University 1996-2013")プロジェクトは、1996年、ちょうどこのあたりの時期に始まっています。前回は実装の話ばかり紹介しましたが、実はNatural Programmingのほとんどの研究が、まず初めにユーザを観察して開発環境の問題点を洗い出すところを出発点にしています。初学者がつまづきやすいポイントを[プログラミング言語](http://www.cs.cmu.edu/~pane/cmu-cs-96-132.html "Usability Issues in the Design of Novice Programming Systems")\[Pane & Myers, 1996\]や[開発環境](http://dx.doi.org/10.1109/VLHCC.2004.47 "Six Learning Barriers in End-User Programming Systems")\[Ko et al., 2004\]についてまとめた論文が前提としてあって、これを解決するかたちでシステムを実装しているのです。
