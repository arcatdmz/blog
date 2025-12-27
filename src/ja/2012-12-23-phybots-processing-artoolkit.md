---
title: ProcessingとPhybotsでARToolKitマーカーを検出する
date: '2012-12-23'
tags:
  - phybots
  - programming
  - research
summary_generated: |2-

    Java/Processing で小型ロボットを簡単に動かせるツールキット Phybots は、オープンソースで公開されてしばらく経ちますが、正直なところ忙しくてあまり管理に手が回っておらず、すぐ使える配布ファイルもありませんでした。#五十嵐 ERATOのポスターセッ...
coverImage: phybots-marker-detection.jpg
altUrl: 'https://junkato.jp/ja/blog/2012/12/23/phybots-processing-artoolkit/'
---

<figure class="right">
  <a href="/images/phybots-overview.jpg"><img src="/images/phybots-overview-300x211.jpg" alt="Phybotsのハードウェアセットアップ" /></a>
</figure>

Java/Processing で小型ロボットを簡単に動かせるツールキット Phybots は、オープンソースで公開されてしばらく経ちますが、正直なところ忙しくてあまり管理に手が回っておらず、すぐ使える配布ファイルもありませんでした。

[#五十嵐 ERATO](http://togetter.com/li/425443)のポスターセッションでさまざまな方に興味を示していただけたので、ようやく意を決して[Processing ですぐ使えるライブラリ](https://github.com/arcatdmz/phybots/blob/master/dist/PhybotsP5.zip "Phybots 1.0.0 for Processing")の配布を始めました。

## Phybots はいろいろ便利だという話

Phybots は、右上の写真のようなセットアップで使われることを想定したツールキットです。床や机の上を見下ろすカメラと、ARToolKit マーカーをつけた小型ロボットを、PC や Mac に接続して、ロボットを好きな場所に移動させたり、物を押させたりできます。作例は YouTube のプレイリスト[Phybots Applications](https://www.youtube.com/playlist?list=PL5EC9CECDDBEA183A)に載っています。

ただし、僕は[マーカーをつけていない単なる LEGO ベースのロボットに特定の動きをさせるプログラムを書く](https://junkato.jp/ja/picode/ "Picode: ソースコードに写真を貼り込める統合開発環境 ")のに使っていますし、3DCG の重畳表示をしないのであれば、マーカーの位置を検出するのもかなり簡単です。Phybots は 2008 年の年末に開発が始まり、けっこうな年月をかけて API が作りこまれたライブラリなので、用意された機能のサブセットだけでもいろいろ便利なのです。

この記事では、Processing+Phybots の組み合わせで、カメラ画像からマーカーを検出して、その位置にテキストを表示するコードを紹介します。

![](/images/phybots-marker-detection.jpg "マーカー検出時の様子")

## Phybots のインストール

他の Processing 用ライブラリと同じように、[PhybotsP5.zip](https://github.com/arcatdmz/phybots/blob/master/dist/PhybotsP5.zip "Phybots 1.0.0 for Processing")を解凍してできる PhybotsP5 フォルダを libraries フォルダの中に移動すれば、ライブラリ本体のインストール完了です。

Processing を起動して、メニューの Sketch > Import Library...の中に PhybotsP5 があれば成功です。（Processing 2.0 の場合は、表記が Phybots for Processing に変わります。）

次に、Windows の場合だけ、Web カメラから綺麗な画質で画像を取ってくるために[DirectShow Java Wrapper](http://www.humatic.de/htools/dsj/download.htm)をインストールする必要があります。リンク先からダウンロードした ZIP ファイルを解凍して、dsj.jar と dsj.dll を PhybotsP5/library/に移動します。

このとき、64bit 版の Windows で 64bit 版の Java（Processing）を使っている人は、x64 フォルダの中に入っている dsj.dll を使ってください。（分からない場合はとりあえずどちらでもいいので PhybotsP5/library/に移動してください。スケッチを実行したときに UnsatisfiedLinkError が出るので分かります。）

## スケッチ

PhybotsP5/examples/MarkerDetection/MarkerDetection.pde を開いてみてください。以下のような内容のスケッチがあるはずです。

```java
import com.phybots.*;
import com.phybots.service.*;
import com.phybots.utils.*;
import com.phybots.p5.*;
import jp.digitalmuseum.napkit.*;

Camera camera;
PhybotsImage img;
MarkerDetector md;
NapMarker marker;

void setup()
{
  // カメラを起動する
  camera = new Camera();
  camera.start();

  // カメラの画像をProcessingで見られるようにする
  img = new PhybotsImage(camera);

  // マーカー検出を始める
  marker = new NapMarker(dataPath("4x4_45.patt"), 55);
  md = new MarkerDetector();
  md.setImageProvider(camera); // このカメラの画像から検出
  md.addMarker(marker); // このマーカーを検出
  md.start();

  size(640, 480);

  // ランタイムデバッグツールを表示する
  Phybots.getInstance().showDebugFrame();
}

void draw()
{
  image(img, 0, 0);

  // 検出結果を取得する
  NapDetectionResult result = md.getResult(marker);
  if (result != null) {
    ScreenPosition p = result.getPosition();
    ScreenRectangle r = result.getSquare();

    // 検出エリアを赤線で囲む
    stroke(255, 0, 0);
    for (int i = 0; i < 4; i ++) {
      ScreenPosition a = r.get(i);
      ScreenPosition b = r.get((i + 1) % 4);
      line(a.getX(), a.getY(), b.getX(), b.getY());
    }

    // 検出結果をテキストで表示する
    fill(255);
    text("confidence: " + result.getConfidence(), p.getX(), p.getY());
  }
}
```

コメントがあるので、あまり説明するところはないかもしれません。setup()では、カメラ（Camera）が画像を取ってきてマーカー検出器（MarkerDetector）に渡し、マーカー（NapMarker）を検出するようにセットアップしています。draw()では、マーカー検出器に検出結果を尋ね、もし検出されていたら、その位置にいろいろ描くようにしています。

おまじないチックなのは img = new PhybotsImage(camera) あたりでしょうか。これは、もともと Java 用のライブラリだった Phybots を Processing に接続するための部分で、camera を PImage として画面に直接貼り付けられるようにしています。ランタイムデバッグツールについては次で説明します。

## プログラムの起動

まず MarkerDetection/data/4x4_45.pdf を印刷してください。自分のマーカーパターンを持っている場合は、スケッチの中の 4x4_45.patt をそのマーカーファイルの名前に書き換えてやればそれが検出されます。

「Run」ボタンをクリックすればスケッチがコンパイルされ、プログラムが起動するはずです。32bit 版、64bit 版、それぞれの Windows と Mac で動作確認が取れています。Windows で UnsatisfiedLinkError が出た場合は、DirectShow Java Wrapper の DLL の bit を確かめてください。その他、起動しない場合は[@arcatdmz](http://twitter.com/arcatdmz)に聞いてください。

プログラムが起動したら、上の画面のように、ふつうの Processing のウィンドウのほかにもう一つウィンドウが開くはずです。これがランタイムデバッグツールで、Phybots の API の利用状況が分かるようになっています。「サービス」タブで Phybots > Marker Detector を選ぶと、マーカー検出のためのパラメタを調整できます。照明条件によってうまくマーカーが検出されない場合は、ここで二値化の閾値を調整してみてください。

以上、マーカー検出のやり方説明でした！お疲れさまでした。今後も折を見てさまざまなコード例を紹介していきたいと思います。
