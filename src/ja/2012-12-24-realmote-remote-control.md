---
title: Realmoteで家のリモコンを一つにまとめる
date: "2012-12-24"
tags:
  - phybots
  - programming
coverImage: realmote.jpg
summary: >-
  最近、スマートフォンが赤外線リモコンの代わりになる製品をよく見るようになりました。この記事ではその私家版、 Web
  インタフェースから家電製品やルンバが遠隔操作できちゃうリモコンアプリ Realmote を紹介します。
altUrl: "https://junkato.jp/ja/blog/2012/12/24/realmote-remote-control/"
summary_generated: >-
  Realmote最近、Pluto ステーションとかiRemocon(アイリモコン)
  IRM-01Lといった、スマートフォンが赤外線リモコンの代わりになる製品をよく見るようになりました。確かにスマートフォンしか持ってない人には便利かもしれません。が、プログラマなら常時起動して...
---

<figure className="right">
  <a href="/images/realmote.jpg"><img src="/images/realmote-138x300.jpg" alt="" /></a>
  <figcaption>Realmote</figcaption>
</figure>

最近、[Pluto ステーション](http://www.amazon.co.jp/gp/product/B00A2H5HZY/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B00A2H5HZY)とか[iRemocon(アイリモコン) IRM-01L](http://www.amazon.co.jp/gp/product/B0053BXBVG/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B0053BXBVG)といった、スマートフォンが赤外線リモコンの代わりになる製品をよく見るようになりました。確かにスマートフォンしか持ってない人には便利かもしれません。が、プログラマなら常時起動してる PC・Mac が家に一台くらいはありますよね。それをリモコンにしたらいいと思いませんか。

というわけで、我が家で一年以上稼働している、Web インタフェースから家電製品やルンバが遠隔操作できちゃうリモコンアプリ Realmote を紹介します。

## Realmote

Realmote は、右のスクリーンキャプチャのように、かなりシンプルな Web インタフェースを持っています。PC・Mac で起動する際のオプションを変えることで、赤外線リモコン機能、ルンバのリモコン機能を ON/OFF できます。（もう一つなめこカメラ機能というのもありますが、これは俺得機能なので普通は使わないと思います。）

### ハードウェア

Realmote を使うのに必要なハードウェアは、次のとおりです。

- 常時起動している PC・Mac
- 赤外線リモコン機能を使うなら: [Remote Station](http://www.amazon.co.jp/gp/product/B000I0RDJI/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B000I0RDJI)
- ルンバのリモコン機能を使うなら: ルンバ本体と[RooTooth](https://www.sparkfun.com/products/684)

<figure className="right">
  <a href="http://www.amazon.co.jp/gp/product/B000I0RDJI/ref=as_li_ss_il?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B000I0RDJI"><img src="/images/41D58M0CK9L._SL110_.jpg" alt="" /></a>
  <figcaption>RemoteStation</figcaption>
</figure>

Remote Station は BUFFALO の「[パソコン用学習リモコン](http://buffalo.jp/products/catalog/item/p/pc-op-rs1/)」で、その実態は赤外線 LED と赤外線センサーが USB 接続できるようになっている便利デバイスです。赤外線の出力がそれなりの長さのケーブルで 4 つに分岐しているのもポイントで、このおかげで複数の機器にしっかり信号を送れます。

4000 円ちょっとなので、ケチりたい人は Arduino 互換機と赤外線 LED、センサーを別々に買ってはんだ付けしてプログラムを書いたら少しは経費が浮くかもしれませんが、大差ないので買ったほうが楽でいいと思います。ただし、USB 接続なので、所詮 500mA であり、赤外線の出力は総量としては大したことありません。このあたりが気になるなら、自作するか、[iRemocon](http://www.amazon.co.jp/gp/product/B0053BXBVG/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B0053BXBVG)あたりを買ったほうがいいと思います。

RooTooth はルンバを Bluetooth 接続するためのアダプタです。ルンバの天面の保護カバーを外すと、このアダプタを挿せる穴が出てきます。

### ソフトウェア

Realmote のソフトウェアは[GitHub で公開](https://github.com/arcatdmz/realmote/)されています。[ZIP でダウンロード](https://github.com/arcatdmz/realmote/archive/master.zip)してください。ハードウェアとソフトウェアが手元にそろったら、次の手順で起動します。

1. まず、赤外線リモコン機能が必要なら Remote Station を USB 接続し、ルンバと繋げたいなら PC・Mac の Bluetooth を ON にします。
2. 次に、Realmote 起動用のバッチファイルを自分の環境に合わせて書き換えます。（Windows x86: [realmote_example.cmd](https://github.com/arcatdmz/realmote/blob/master/realmote_example.cmd), Windows x64: [realmote_example_x64.cmd](https://github.com/arcatdmz/realmote/blob/master/realmote_example_x64.cmd), Mac: [realmote_example.sh](https://github.com/arcatdmz/realmote/blob/master/realmote_example.sh)）
3. 書き換えたファイルをダブルクリックで実行します。（Mac の場合は事前に chmod 755 realmote_example.sh が必要かも）

Realmote 起動用のバッチファイルでは、 -remote に続けて Remote Station の COM ポートの名前を、 -roomba に続けてルンバの Bluetooth アドレスを指定してください。

あとは、PC・Mac のブラウザで http://127.0.0.1:8000/ にアクセスして動作を確認してください。うまくいったら、PC・Mac の LAN 側 IP アドレスを調べて、スマートフォンから http://そのアドレス:8000/ にアクセスしてみてください。

https://www.youtube.com/watch?v=bhbW39zoxyg

### 実装

Realmote は Java ベースの Web サーバです。そして、特定の URL にアクセスがあると、Remote Station やルンバにコマンドを送るようになっています。その部分の実装は恐ろしくシンプルで、例えばルンバに掃除させるコードや、掃除をキャンセルするコードは次のように書けます。（[RoombaHandler.java](https://github.com/arcatdmz/realmote/blob/master/src/jp/digitalmuseum/rm/handler/RoombaHandler.java)より抜粋）

```java
private boolean clean(HttpExchange exchange) throws IOException {
  Roomba.RooTooth.wakeUp(roomba);

  RoombaCore core = roomba.requestResource(RoombaCore.class, this);
  core.clean();
  roomba.freeResource(core, this);

  exchange.sendResponseHeaders(200, 0);
  exchange.close();
  return true;
}

private boolean cancel(HttpExchange exchange) throws IOException {
  RoombaCore core = roomba.requestResource(RoombaCore.class, this);
  core.safe();
  core.power();
  roomba.freeResource(core, this);

  exchange.sendResponseHeaders(200, 0);
  exchange.close();
  return true;
}
```

記事を通して何が言いたかったかというと、Phybots 便利！ということでした。Remote Station もルンバも、専用のクラス（[RemoteStation](https://github.com/arcatdmz/phybots/blob/master/phybots/src/com/phybots/entity/RemoteStation.java), [Roomba](https://github.com/arcatdmz/phybots/blob/master/phybots/src/com/phybots/entity/Roomba.java)）が最初から用意されていて、すぐに操作用のコードを書き始めることができます。プログラマのみなさまにおかれましては、冬休みの自由工作として家のオートメーションに取り組まれてはいかがでしょうか。
