---
title: "WebmoをNode.jsから使う"
date: "2017-07-19"
tags:
  - "programming"
coverImage: "webmo.jpg"
---

[昨日の記事](https://junkato.jp/ja/blog/2017/07/19/webmo/)でも紹介した[Webmo](http://webmo.io/)は JavaScript で簡単に操作できることがウリですが、現状用意されているライブラリはブラウザ上で動作することを前提に設計されており、Node.js で実行するとエラーが起きます。

エラーを直して本家に pull request を送ろうと思っていたのですが、そう簡単ではなかったので、Node.js 用に移植した新しい npm パッケージ [webmo-client-nodejs](https://www.npmjs.com/package/webmo-client-nodejs) を作って公開しました。

<figure className="center"><a href="https://junkato.jp/ja/blog/wp-content/uploads/2017/07/webmo-client-error.png"><img src="/images/webmo-client-error.png" alt="" /></a><figcaption>依存ライブラリがブラウザ前提に設計されているため、<a href="https://github.com/arcatdmz/webmo-example-nodejs/blob/master/index.orig.js">サンプルコード</a>を実行すると  
ReferenceError: self is not defined というようなエラーが出ます。</figcaption></figure>

## 変更点

- 本家 [webmo-client](https://github.com/cidreixd/webmo-library-javascript) が依存していた qwest や Q といったブラウザ用ライブラリを一掃して、websocket のような Node.js で足りていないライブラリを読み込むようにしました。
- 開発言語を JavaScript から TypeScript にしました。
- ビルド時、ブラウザ用に webpack で固めていたのを tsc でコンパイルするだけにしました。

詳しくは[GitHub の Commits](https://github.com/arcatdmz/webmo-library-nodejs/commits/master)を見てみてください。

## require('webmo-client-nodejs')

変更点は上の通り表層的な部分だけなので、実際の使い方は本家とほぼ同じです。ブラウザ用に `require('webmo-client')` と書いていた部分を `require('webmo-client-nodejs')` とすれば同じ JavaScript コードが動きます。サンプルコードを [webmo-example-nodejs](https://github.com/arcatdmz/webmo-example-nodejs) に置きましたが、めちゃくちゃ短いのでこちらにも貼っておきます。Webmo 便利ですね！

```javascript
var WebmoWs = require("webmo-client-nodejs").ws;
var motor = new WebmoWs("webmo.local");

motor.onopen = () => {
  motor.rotate(90);
  setTimeout(() => {
    motor.stop();
    motor.close();
  }, 2000);
};
```

上の例は WebSocket を使っていますが、HTTP もテスト済みです。

```javascript
var WebmoHttp = require("webmo-client-nodejs").http;
var motor = new WebmoHttp("webmo.local");
process.stdout.write("testing http client ...");

motor.rotate(-90).then(() => {
  setTimeout(() => {
    motor.stop().then(() => {
      process.stdout.write(" ok\n");
    });
  }, 2000);
});
```

というわけで、Happy hacking with Webmo!
