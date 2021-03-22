---
title: J-1ビザで渡米した研究インターンの所得税還付手続き
date: "2014-02-26"
tags:
  - life
  - research
summary_generated: "2月27日追記;\_本記事の内容に沿ってアメリカの非居住者としての所得税還付を受けた場合は、日本の居住者として同額の所得を確定申告する必要があるようです。この話題について、詳しくはコメント欄を参照してください。2月、そろそろ確定申告の時期ですね。これはアメリカでも同じで、とく..."
---

**2 月 27 日追記;**  本記事の内容に沿ってアメリカの非居住者としての所得税還付を受けた場合は、日本の居住者として同額の所得を確定申告する必要があるようです。この話題について、詳しくは[コメント欄](http://junkato.jp/ja/blog/2014/02/27/j1-trainee-tax-refund-docs-for-irs/#comment-3619)を参照してください。

2 月、そろそろ確定申告の時期ですね。これはアメリカでも同じで、とくに年度中に渡米して企業で研究インターンした日本人の大学院生は、払いすぎた所得税を取り戻す申請手続きを行うことができます。これは、J-1 ビザで渡米している人なら基本的に**全額**戻ってきます。人それぞれですが、けっこうな額になるはずです。

研究インターンは博士課程の学生がほとんどであり、この手続きは該当する人でも高々 1、2 回程度しかしないため、なかなかノウハウが蓄積しません。そこで、関連する条約や手続きの流れを簡単にまとめておきます。

還付手続きは最終的には本人が書類を郵送する必要があるのですが、インターン先によっては支援サービスを提供してくれるところもあるようです。僕の経験では、Microsoft Research は後述する W-2 フォームを郵送してくるだけだった一方、Adobe Research は J-1 ビザ取得を外部団体に委託しており、その団体が還付手続きの時期になったら支援サービスのアカウントを一個くれました。

還付手続き支援サービスでは、質問に答えていくだけで必要な書類が全て揃います。ただ、日米租税条約上の僕の立場に関する解釈が僕の考えと違っているようで、僕としては全額還付されるつもりでいたのが、サービスから出力された書類ではそうなっていませんでした。どちらが正しかったかについては後日報告します。

**5 月 21 日追記;** 全額還付されました。とりあえず、このブログ記事に書いた解釈が認められたものと考えてよさそうです。

## J-1 ビザ（Students and Trainees）

まず、この記事の対象になるのは J-1 ビザ取得者のなかでも、学生または職業訓練を受けている人たち（Students and Trainees）です。

J-1 ビザは、他に、教師や研究者（Teachers and Researchers）に対しても発行されます。博士号取得後のインターンはもしかしたら研究者（Researcher）扱いになるのかもしれませんが、博士課程の学生に関しては Trainee としての渡米が普通のようです。

## 日米租税条約

ふだん日本に住んでいて、一時的に渡米して所得を得た人は、所得税の還付を受けられる可能性があります。この取り決めが書いてあるのが日米租税条約で、1967 年に締結されたあと、2003 年に大きく改訂され、同内容が 2004 年に批准されました。最近だと昨年 2013 年に修正が入るなど、ときどき更新されるので、原典にあたるのが確実です。2003 年に改訂されたときの内容は[U.S. Tax Treaty](http://www.treasury.gov/resource-center/tax-policy/treaties/Documents/japantreaty.pdf "Convention between the government of the United States of America and the government of Japan for the avoidance of double taxation and the prevention of fiscal evasion with respect to taxes on income")にあります。

このような条約に関しては、海外からの読者を想定しているためか、わりと読みやすい解説書類などが用意されています。例えば、租税条約の内容を様々な国を横断してまとめた書類が[U.S. Tax Treaties](http://www.irs.gov/pub/irs-prior/p901--2013.pdf)で、どのような身分で渡米しているかの大分類が章立てになっていて、どの国から渡米しているか各節で説明しています。日本から Students and Trainees として渡米している人たちの処遇に関しては以下のように書いてあります。

> A student or business apprentice who is a resident of Japan immediately before visiting the United States and is in the United States for the purpose of education or training is exempt from U.S. income tax on amounts received from abroad for the individual's maintenance, education, or training.
>
> Business apprentices are entitled to the benefit of this exemption for a maximum period of 1 year.

生活や教育、トレーニングのために受け取った所得に関しては所得税（全額）免除とのこと。

ただし、ビジネス目的のトレーニングだと一年限定とも書いてあります。私企業の研究インターンが「あくまで研究に必要な素養を身に付けるためにやるもので、ビジネス目的ではない」と判断されるか、あるいは「私企業のビジネスに資することをやっているのだからビジネス目的と言える、よって一年限定」なのかについては、現時点ではちょっと分かりません。ちょうど僕が現在このケースの二年目なので、還付手続きをしてみて、結果を報告したいと思います。

それで、先の文書には根拠となる条項へのリンクがないのですが、日米租税条約を読んでみると 19 項にちょうど対応する箇所があります。

> Payments which a student or business apprentice who is, or was immediately before visiting a Contracting State, a resident of the other Contracting State and who is present in the first-mentioned Contracting State for the primary purpose of his education or training receives for the purpose of his maintenance, education or training shall be exempt from tax in the first-mentioned Contracting State, provided that such payments are made to him from outside that first-mentioned Contracting State. The exemption from tax provided by this Article shall apply to a business apprentice only for a period not exceeding one year from the date he first begins his training in the first-mentioned Contracting State.

基本的に同内容で、これをかみ砕いたのが先ほどの文章だったわけですね。ここまでで、所得税の還付が受けられることが確認できたと思います。

## Form 1040NR-EZ, W-2, 8843

実際に還付を受けるためには、日本の国税庁に相当する IRS（Internal Revenue Service, 歳入庁 ‎）に直接書類を送付します。このような手続きをする人が必ず送付するのが Form 1040 で、IRS の Web サイトには[1040 Central](http://www.irs.gov/Individuals/1040-Central)というページがあります。

1040 にはいくつか種類があって、普段日本に住んでいる人は[1040NR (Non-Resident)](http://www.irs.gov/uac/Form-1040NR,-U.S.-Nonresident-Alien-Income-Tax-Return)\[[PDF](http://www.irs.gov/pub/irs-pdf/f1040nr.pdf)\]を書くことになります。さらに、1040NR には簡易版[1040NR-EZ (Easy)](http://www.irs.gov/uac/Form-1040NR-EZ,-U.S.-Income-Tax-Return-for-Certain-Nonresident-Aliens-With-No-Dependents)\[[PDF](http://www.irs.gov/pub/irs-pdf/f1040nre.pdf)\]があって、単身赴任者のようなシンプルなケースではこれを使えるようです。多くの研究インターン生が 1040NR-EZ になるはずです。記入例は[米国公認会計士の若菜氏の解説ページ](http://www.wakanacpa.com/TaxWebSite/MainContents/1040NREZ.htm)が参考になります。

この記事の対象になる人は所得税全額還付してほしいわけですから、このフォームの欄番号 22 と 23a（還付してほしい金額）が支払った所得税全額となるように書けば OK です。同じところに還付の方法を指示する欄があります。インターンで給与をもらっている人はほとんどがアメリカの銀行口座を持っているはずで、それなら Direct deposit（銀行振り込み）が簡単だと思います。さらに、還付の根拠を 2 枚目の欄番号 J-1 に書く必要があります。具体的には、(a) Country - Japan, (b) Tax treaty article - Article 19, (d) Amount of exempt income in current tax year - 12 となると思います。（(c)は、初年度の場合 0、2 年以上連続でインターンしている場合は 12。）

また、1040 には別途、会社が発行する書類で、どれだけの所得を得たのかの証明になる Form W-2 (Wage and Tax Statement)を貼り付ける必要があります。W-2 は 3 枚綴りになっていて、そのうち 1 枚を 1040 の表面に貼ります。

さらに、米国滞在期間について申告するための[Form 8843](http://www.irs.gov/uac/Form-8843,-Statement-for-Exempt-Individuals-and-Individuals-With-a-Medical-Condition-1)\[[PDF](http://www.irs.gov/pub/irs-pdf/f8843.pdf)\]にも記入する必要があります。記入例は例によって[若菜氏の解説ページ](http://www.wakanacpa.com/TaxWebSite/MainContents/form8843.htm)が参考になります。

これらのフォームに記入したら、ひとまとめにして IRS に送付します。送付先住所は、[フォームごとの送付先住所が一覧できるページ](http://www.irs.gov/uac/Where-to-File----Forms-Beginning-With-The-Number-1)に書いてあります。この記事を書いている時点では以下の住所のようです。シンプルですね。

> Department of the Treasury Internal Revenue Service Austin, Texas 73301-0215

ここまでやりきったら、あとは還付を待つのみです。Form 1040 の欄 23a で Direct deposit の指示を書いた人なら、数か月で銀行口座に指定額が振り込まれるはずです。
