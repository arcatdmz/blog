---
title: "Realmoteで家のリモコンを一つにまとめる"
date: "2012-12-24"
tags: 
  - "phybots"
  - "programming"
coverImage: "realmote.jpg"
---

[![](/images/realmote-138x300.jpg "Realmote")](http://junkato.jp/ja/blog/wp-content/uploads/2012/12/realmote.jpg)最近、[Pluto ステーション](http://www.amazon.co.jp/gp/product/B00A2H5HZY/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B00A2H5HZY)![](http://www.assoc-amazon.jp/e/ir?t=dmjp07-22&l=as2&o=9&a=B00A2H5HZY)とか[iRemocon(アイリモコン) IRM-01L](http://www.amazon.co.jp/gp/product/B0053BXBVG/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B0053BXBVG)![](http://www.assoc-amazon.jp/e/ir?t=dmjp07-22&l=as2&o=9&a=B0053BXBVG)といった、スマートフォンが赤外線リモコンの代わりになる製品をよく見るようになりました。確かにスマートフォンしか持ってない人には便利かもしれません。が、プログラマなら常時起動してるPC・Macが家に一台くらいはありますよね。それをリモコンにしたらいいと思いませんか。

というわけで、我が家で一年以上稼働している、Webインタフェースから家電製品やルンバが遠隔操作できちゃうリモコンアプリRealmoteを紹介します。

## Realmote

Realmoteは、右のスクリーンキャプチャのように、かなりシンプルなWebインタフェースを持っています。PC・Macで起動する際のオプションを変えることで、赤外線リモコン機能、ルンバのリモコン機能をON/OFFできます。（もう一つなめこカメラ機能というのもありますが、これは俺得機能なので普通は使わないと思います。）

### [![](/images/41D58M0CK9L._SL110_.jpg "RemoteStation")](http://www.amazon.co.jp/gp/product/B000I0RDJI/ref=as_li_ss_il?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B000I0RDJI)ハードウェア![](http://www.assoc-amazon.jp/e/ir?t=dmjp07-22&l=as2&o=9&a=B000I0RDJI)

Realmoteを使うのに必要なハードウェアは、次のとおりです。

- 常時起動しているPC・Mac
- 赤外線リモコン機能を使うなら: [Remote Station](http://www.amazon.co.jp/gp/product/B000I0RDJI/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B000I0RDJI)![](http://www.assoc-amazon.jp/e/ir?t=dmjp07-22&l=as2&o=9&a=B000I0RDJI)
- ルンバのリモコン機能を使うなら: ルンバ本体と[RooTooth](https://www.sparkfun.com/products/684)

Remote StationはBUFFALOの「[パソコン用学習リモコン](http://buffalo.jp/products/catalog/item/p/pc-op-rs1/)」で、その実態は赤外線LEDと赤外線センサーがUSB接続できるようになっている便利デバイスです。赤外線の出力がそれなりの長さのケーブルで4つに分岐しているのもポイントで、このおかげで複数の機器にしっかり信号を送れます。

4000円ちょっとなので、ケチりたい人はArduino互換機と赤外線LED、センサーを別々に買ってはんだ付けしてプログラムを書いたら少しは経費が浮くかもしれませんが、大差ないので買ったほうが楽でいいと思います。ただし、USB接続なので、所詮500mAであり、赤外線の出力は総量としては大したことありません。このあたりが気になるなら、自作するか、[iRemocon](http://www.amazon.co.jp/gp/product/B0053BXBVG/ref=as_li_ss_tl?ie=UTF8&tag=dmjp07-22&linkCode=as2&camp=247&creative=7399&creativeASIN=B0053BXBVG)あたりを買ったほうがいいと思います。

RooToothはルンバをBluetooth接続するためのアダプタです。ルンバの天面の保護カバーを外すと、このアダプタを挿せる穴が出てきます。

### ソフトウェア

Realmoteのソフトウェアは[GitHubで公開](https://github.com/arcatdmz/realmote/)されています。[ZIPでダウンロード](https://github.com/arcatdmz/realmote/archive/master.zip)してください。ハードウェアとソフトウェアが手元にそろったら、次の手順で起動します。

1. まず、赤外線リモコン機能が必要ならRemote StationをUSB接続し、ルンバと繋げたいならPC・MacのBluetoothをONにします。
2. 次に、Realmote起動用のバッチファイルを自分の環境に合わせて書き換えます。（Windows x86: [realmote\_example.cmd](https://github.com/arcatdmz/realmote/blob/master/realmote_example.cmd), Windows x64: [realmote\_example\_x64.cmd](https://github.com/arcatdmz/realmote/blob/master/realmote_example_x64.cmd), Mac: [realmote\_example.sh](https://github.com/arcatdmz/realmote/blob/master/realmote_example.sh)）
3. 書き換えたファイルをダブルクリックで実行します。（Macの場合は事前にchmod 755 realmote\_example.shが必要かも）

Realmote起動用のバッチファイルでは、 -remote に続けてRemote StationのCOMポートの名前を、 -roomba に続けてルンバのBluetoothアドレスを指定してください。

あとは、PC・Macのブラウザで http://127.0.0.1:8000/ にアクセスして動作を確認してください。うまくいったら、PC・MacのLAN側IPアドレスを調べて、スマートフォンから http://そのアドレス:8000/ にアクセスしてみてください。

<iframe src="http://www.youtube.com/embed/bhbW39zoxyg" frameborder="0" width="640" height="360"></iframe>

### 実装

RealmoteはJavaベースのWebサーバです。そして、特定のURLにアクセスがあると、Remote Stationやルンバにコマンドを送るようになっています。その部分の実装は恐ろしくシンプルで、例えばルンバに掃除させるコードや、掃除をキャンセルするコードは次のように書けます。（[RoombaHandler.java](https://github.com/arcatdmz/realmote/blob/master/src/jp/digitalmuseum/rm/handler/RoombaHandler.java)より抜粋）

\[java\]private boolean clean(HttpExchange exchange) throws IOException { Roomba.RooTooth.wakeUp(roomba);

RoombaCore core = roomba.requestResource(RoombaCore.class, this); core.clean(); roomba.freeResource(core, this);

exchange.sendResponseHeaders(200, 0); exchange.close(); return true; }

private boolean cancel(HttpExchange exchange) throws IOException { RoombaCore core = roomba.requestResource(RoombaCore.class, this); core.safe(); core.power(); roomba.freeResource(core, this);

exchange.sendResponseHeaders(200, 0); exchange.close(); return true; }\[/java\]

記事を通して何が言いたかったかというと、Phybots便利！ということでした。Remote Stationもルンバも、専用のクラス（[RemoteStation](https://github.com/arcatdmz/phybots/blob/master/phybots/src/com/phybots/entity/RemoteStation.java), [Roomba](https://github.com/arcatdmz/phybots/blob/master/phybots/src/com/phybots/entity/Roomba.java)）が最初から用意されていて、すぐに操作用のコードを書き始めることができます。プログラマのみなさまにおかれましては、冬休みの自由工作として家のオートメーションに取り組まれてはいかがでしょうか。
