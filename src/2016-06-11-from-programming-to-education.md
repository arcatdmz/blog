---
title: "プログラミング支援からプログラミング教育へ"
date: "2016-06-11"
tags: 
  - "discussion"
  - "research"
  - "sigpx"
coverImage: "IMG_9046.jpg"
---

最近プログラミング教育に関する世間一般の興味が高まってきています。オバマ大統領がイニシアチブを取り、コンピュータ科学に関する教育を全ての学生に課すため、関連する産業や研究開発に多額の政策投資を行おうというアメリカの[CS for All](https://www.whitehouse.gov/blog/2016/01/30/computer-science-all)や、日本の政府成長戦略のなかで挙げられている[小中学校でのプログラミング必修化](http://www.news24.jp/articles/2016/05/16/06330298.html)など、国レベルでの取り組みも目立つようになってきました。

これに呼応するように、プログラミング支援に関する研究を引っ張ってきたアメリカの大学教授たちが、研究トピックを教育方面にシフトしてきています。政策とアカデミアの研究開発とがタイムリーに連携していて大変興味深く、日本でも参考にできるところがあるように思います。

\[caption id="attachment\_1272" align="aligncenter" width="1024"\][![日本科学未来館でのPicode Workshopの様子](/images/IMG_9046-1024x683.jpg)](http://junkato.jp/ja/blog/wp-content/uploads/2016/06/IMG_9046.jpg) 日本科学未来館での[Picode Workshop](http://blog.miraikan.jst.go.jp/event/20130517post-347.html)の様子\[/caption\]

私自身は教育も[ちょっとだけ（日本科学未来館）](http://blog.miraikan.jst.go.jp/event/20130517post-347.html)、[手伝ったり（CANVAS）](http://canvas.ws/workshop/9548)してきましたが、基本的にはプログラミング環境の研究開発を主軸に据えています。[先日立ち上げた勉強会（SIGPX）](http://sigpx.org)も、教育に限らずプログラミング体験に関する研究開発の情報交換が主目的です。ただ、国際的な研究コミュニティがざわついて見えたので、知っている範囲で事例を共有しておこうと考え、本記事を書いています。ちなみに、きっかけになったのは[Viscuit開発者である原田さんのFacebookポスト](https://www.facebook.com/yasunori.harada.7/posts/10209444809020255)です。

さて、人とコンピュータの関係をよくしようというHuman-Computer Interactionの研究は、コンピュータ科学のなかでは最も応用研究に近い部類に入ります。かつてDemo or dieという標語が流行ったのですが、今ではDeploy or dieと言われます。これは、デモできないような研究はないものと等しい、のを超えて、社会のなかに実装できないような研究はないものと等しい、というかなり厳しい標語です。最近では、スタートアップを始めたり会社のプロダクト部門と密接に結びついて社会に直接インパクトを与えようという研究者が増えています。

プログラミング支援ツールを研究開発してきたUniversity of Washingtonの[Andy Ko](https://faculty.washington.edu/ajko/)氏は、AnswerDashというスタートアップを立ち上げています。その経験から、[支援ツールのようにプログラマの生産性を瞬間的に向上するよりも、よいコードを書けるプログラマを育てる教育のほうが長期的に見て大きなインパクトになるという気付きを得たそうで、研究テーマをプログラミング教育に切り替え](http://blogs.uw.edu/ajko/2016/05/13/my-sabbatical-research-pivot/)つつあります。研究デモは瞬間的にすごいと思わせれば勝ちですが、デプロイされたシステムは長期間にわたって実用的でないといけません。このDemo or dieからDeploy or dieへのシフトと、ツールによる瞬間的な支援から教育による過程の支援へのシフトは、非常に似ていると思います。

同様にプログラミング支援ツールや開発環境を研究開発してきたMIT CSAILの[Rob Miller](http://people.csail.mit.edu/rcm/)氏も、[ツール研究から教育系、とくにMOOCsなどのLearning at Scaleの研究に主眼をシフト](http://groups.csail.mit.edu/uid/research.shtml)しつつあるようです。これまで教育系の研究は手法を提案しても効果を実証するのに膨大な時間がかかっていたのですが、MOOCsの台頭により、大量の生徒に異なる教育手法を適用できるようになり、A/Bテストのようにどちらのほうがよかった/悪かったという評価を行うことが可能になってきました。教育のようにコンピュータ登場以前から存在していたトピックがコンピュータの強みを取り込むことによって、[研究方法が更新](http://junkato.jp/ja/blog/2016/03/16/ipsj-one-px-science-as-a-service/)されつつあるように思います。

プログラミング教育に関連する範囲に絞ると、最近では国際会議ACM CHI '16で[プログラミング言語のユーザビリティ](http://www.cs.cmu.edu/~NatProg/programminglanguageusability/)について考えようという会がありました。for文はrepeatという単語を使ったほうが意味を理解しやすいことが分かっている…というような低レイヤーの話から、そもそもどんな要素がユーザビリティに影響するのか、文字言語のユーザビリティだけでいいのか、などいろいろな議論を、部屋が溢れるほどの人数で活発にしていました。産業界からも、アカデミアからも、人がきていました。かつてACM CHI '09では[APIのユーザビリティ](https://sites.google.com/site/apiusability/)について考えようという試みもありました。それぞれ、リンク先ではいろいろな論文を読むことができます。

日本のプログラミング教育についても、このように、研究内容をもとに議論できる、科学的で建設的な場があるべきだと私は思っています。それで調べてみたら、いろいろあるんですね…[ACM SIGCSE](http://sigcse.org/sigcse/)みたいに代表的なものが一つあると分かりやすいんですが、どれがどういうものなのか、誰か解説していただけないでしょうか？

- [情報処理学会 コンピュータと教育研究会](http://ce.eplang.jp/)
- [電子情報通信学会 教育工学研究会](http://www.ieice.org/ken/program/index.php?tgid=ET)
- [日本情報科教育学会](http://jaeis.org/zenkoku/)
- [教育システム情報学会](http://www.jsise.org/society/)
- [大阪プログラミング・情報教育研究会(略称:大プ会)](http://qed.ouj.ac.jp/pukai/index.php?%C2%E7%A5%D7%B2%F1)
