---
title: "[2014年版] Amazonでいくら使った？"
date: "2014-11-12"
categories: 
  - "life"
  - "programming"
coverImage: "amazon-result.png"
---

**12/25更新;**  Amazonの実装が変わってChrome最新版との組み合わせで動かなくなっていたものを修正しました。技術解説は最後に。

そろそろ今年はいくら使ったか集計してみましょう^^

[![amazon](images/amazon-1024x437.png)](https://www.amazon.co.jp/gp/css/order-history/)

もともと[もろや](http://moroya.hatenablog.jp/entry/2013/06/03/225935)さんの書いたコードをちょっといじって使っていたんですが、GistがMIMEタイプを正しく返さなくなったりAmazonの注文履歴ページのレイアウトが変わったりで、うまく動かなくなっていたのを直しました。

あと、元々のコードは合計額を出すだけでしたが、このエントリで紹介するものは、新しいウィンドウが開いて個々の履歴がCSV形式でフォーマットされて表示されます。

## 使い方

オリジナルとほぼ一緒です。ただし、最後に新しいウィンドウが開くので、ポップアップブロッカーなどがインストールされている場合は amazon.co.jp を例外に指定するなどして対処する必要があります。

1. まず [https://www.amazon.co.jp/gp/css/order-history/](https://www.amazon.co.jp/gp/css/order-history/) にアクセスしてログインします。
2. アドレスバーに以下の文字列をコピー&ペーストします。（最近のブラウザだと先頭の `javascript:` が消えるので書き足さないとダメみたいです。）
    
    \[code lang="javascript"\]javascript:(function(){var d=document;var s=d.createElement('script');s.src='https://cdn.rawgit.com/arcatdmz/8500521/raw/555ad48b487e790c6079938e771dfa4a8384d10e/amazon-csv.js';d.body.appendChild(s)})();\[/code\]
    
3. Enterキーを押すと入力ダイアログが出ます。集計したい年を半角数字で入れるか、全部集計したい場合はallと入力して「OK」をクリックしましょう。
4. 結果が出るまでしばし待ちましょう。すごくぷるぷるにゃん…

\[caption id="attachment\_847" align="aligncenter" width="718"\][![うわぁ](images/amazon-result.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/11/amazon-result.png) うわぁ\[/caption\]

## ソースコードなど

この作業で 呼び出しているJavaScriptのソースコードは[Gist](https://gist.github.com/arcatdmz/8500521)に置いてあります。CSVのフォーマットを直したい場合など、適当にForkして使ってください。

なお、ある時からGistのRawリンクのHTTPヘッダが常にMIMEタイプ `text/plain` を返すようになりました。そのままだとセキュリティエラーが出て実行できないので、 [rawgit.com](https://rawgit.com/) というサービスを経由してHTTPヘッダを直してもらっています。このサービスが信頼できない場合は上記の作業は行わないでください。

何にせよ、ご利用は自己責任でお願いします！

## 技術解説

基本的には[Gistのソースコード](https://gist.github.com/arcatdmz/8500521)に書いてあるコメントを読んでいただければと思います。

**12/25の更新内容:** Amazonのサーバサイドの実装が微妙に変わったようで、 [https://www.amazon.co.jp/gp/css/order-history/](https://www.amazon.co.jp/gp/css/order-history/) に対するHTTPリクエストのヘッダにX-Requested-With: XMLHttpRequestがついているとHTMLでなくJSONらしきもの（レスポンスヘッダを見ると application/json-amazonui-streaming というContent-Typeが宣言されている）を返してくるようになりました。そこで、X-Requested-Withの値を書き換えるようにソースコードを修正しました。
