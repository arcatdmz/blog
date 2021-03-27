---
title: ThriftでJavaからC#サーバのKinectを使う
date: "2013-02-22"
tags:
  - java
  - programming
coverImage: kinect-thrift-server.jpg
summary: >-
  最近、Kinect を使う開発環境Picodeの実装を手直ししています。この開発環境は Java で書かれているのですが、Kinect for
  Windows SDK の API を使う必要があります。Kinect for Windows SDK は C++と C#向けの ...
summary_generated: >-
  C#サーバとJavaクライアントがThriftで通信最近、Kinect を使う開発環境Picodeの実装を手直ししています。この開発環境は Java
  で書かれているのですが、Kinect for Windows SDK の API を使う必要があります。Kinect for...
altUrl: "https://junkato.jp/ja/blog/2013/02/22/kinect-for-java-via-thrift"
---

<figure className="right">
  <a href="/images/kinect-thrift-server.jpg"><img src="/images/kinect-thrift-server-300x225.jpg" alt="" /></a>
  <figcaption>C#サーバとJavaクライアントがThriftで通信</figcaption>
</figure>

最近、Kinect を使う開発環境[Picode](https://junkato.jp/ja/picode/)の実装を手直ししています。この開発環境は Java で書かれているのですが、Kinect for Windows SDK の API を使う必要があります。

Kinect for Windows SDK は C++と C#向けの API しか提供していないため、Java から使うためには C++または C#のプロセスと通信することになります。そこで今回は、[Thrift](http://thrift.apache.org "Apache Thrift")という Facebook が開発したフレームワークを使ってプロセス間通信(Inter-process communication)してみました。

ソースコードとバイナリは[GitHub](https://github.com/arcatdmz/kinect-thrift-server)にあります。

## Inter-process communication (IPC)

Java VM と外界が Inter-process communication するための方便は JNI、Named pipe、Memory-mapped file……といろいろあるのですが、今回は Kinect サーバを Windows マシンで動かして Picode を別の Mac マシンで動かすようなこともしてみたかったので、ソケット通信を利用することにしました。

実装の初期段階では自前の TCP/IP サーバとクライアントを書いていたのですが、クライアント側で呼び出したい機能が増えていくに従って俺々プロトコルが複雑になってしまいました。

そこで、TCP/IP 越しの[RPC](http://ja.wikipedia.org/wiki/RPC "Remote procedure call")用のフレームワークの中で使いやすそうなものがないか調べました。

## Thrift

今回は C#がサーバ、Java がクライアントになるので、ライブラリの実装状況から見て候補が[Thrift](http://thrift.apache.org "Apache Thrift")と[MessagePack](http://msgpack.org/ "MessagePack")に絞られました。さらに MessagePack のほうは[C#の RPC の実装](https://github.com/yfakariya/msgpack-rpc-cli "MessagePack for CLI (.NET/Mono) RPC")がドキュメント不足で使いづらそうだったので Thrift を使うことにしました。

Thrift は最初に拡張子.thrift のテキストファイルで RPC の仕様を書いて、これを thrift バイナリに食わせることで各言語のテンプレートを生成することができます。Kinect サーバの場合は、.thrift を[こんな具合](https://github.com/arcatdmz/kinect-thrift-server/blob/master/thrift/KinectService.thrift)に書いてやると、ちゃんと[C#のテンプレート](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectService.cs)と[Java のテンプレート](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectService.java)が生成されました。

サーバ側は、自動生成されるインタフェース([KinectService.Iface](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectService.cs#L21))を実装するクラス([KinectServiceHandler](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectServiceHandler.cs))を作り、次のようなコードを書いてやればサーバが起動します。

```csharp
KinectServiceHandler handler = new KinectServiceHandler();
KinectService.Processor processor = new KinectService.Processor(handler);
TServerTransport serverTransport = new TServerSocket(10000);
TServer server = new TSimpleServer(processor, serverTransport);
handler.Shutdown = server.Stop;
Console.WriteLine("Starting the server...");
server.Serve();
```

クライアント側はさらに簡単で、自動生成される Client クラス([KinectService.Client](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectService.java#L91))をインスタンス化すればサーバに接続でき、リモートの関数を呼び出せます。

```java
TTransport transport = new TSocket("localhost", 10000);
TProtocol protocol = new TBinaryProtocol(transport);
KinectService.Client client = new KinectService.Client(protocol);
```

GitHub に C#の[サーバ](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/Program.cs)と、Java の[簡単なクライアントのサンプル](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/app/RawClientTest.java)、[GUI がついてちょっと複雑なクライアントのサンプル](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/app/KinectClientFrame.java)を置いてあります。どちらも Git clone するとバイナリが置いてあってすぐ実行できるようになっています。実行の仕方について詳しくは[README.md](https://github.com/arcatdmz/kinect-thrift-server#readme)をどうぞ。

## はまったところ

### Thrift の型システムとエンディアン

上にさらっと書いた内容だけだとすごく簡単そうです（実際、通信部分のコードは全く気にせず済んだので、そこはよかったのです）が、Thrift の型システムにいただけないところがあって苦労しました。まず、int や long などの配列を作れません。 list<i32\> と書くと、配列ではなく List ができます。しかも、Java の場合はプリミティブ型の List が作れないので List<Integer\> になります。[滅びればいいのに](https://twitter.com/arcatdmz/status/303885308754288640)。

で、binary と書くと単なる byte 型配列ができるので、[short\[\]をクライアントに返すためにいったん byte\[\]に変換するコード(C#)](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectServiceHandler.cs#L496)を書いたのですが、[受け取った byte\[\]を short\[\]に戻すコード(Java)](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L199)を素直に書いたらデータが壊れました。原因は Endian-ness の不整合でした。

以下の C#側のコードは Windows 上で動くので、Little endian で short\[\]を byte\[\]に書き込みます。

```csharp
// Depth image processing.
if (depthImageFrame != null && depthEnabled)
{
    depthImageFrame.CopyPixelDataTo(depthImageData);
    Buffer.BlockCopy(depthImageData, 0, depthImageRawData, 0, depthImageRawData.Length);
    frame.DepthImage = depthImageRawData;
}
```

一方、以下の Java 側のコードはデフォルトで Big endian を使うため、データが壊れたというわけです。

```java
if (frame.isSetDepthImage()) {
    depthByteBuffer.put(frame.getDepthImage());
    depthByteBuffer.rewind();
    depthShortBuffer.put(depthByteBuffer.asShortBuffer());
    depthShortBuffer.rewind();
    depthImageData = depthShortBuffer.array();
}
```

けっきょく、[Java 側で Little endian を明示的に指定](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L174)して復号することで対応しました。

```java
// C# server running on Windows converts short[] to byte[] with little-endian.
// Therefore, we need to specify the endian-ness here to reconstruct it correctly.
    depthByteBuffer.order(ByteOrder.LITTLE_ENDIAN);
```

### Kinect のカラー画像の RGB オーダー

~~Thrift は全く関係ないのですが、Kinect のカラー画像はなぜか BGR(null)の順で byte\[\]として取得できるようになっています……ふつう ARGB か(null)BGR、(null)RGB だと思うんですけど。この~~**Java 側で BGR(null)順になっていた理由は上記と同じ Endian-ness の問題でした。ともかく、こうして受信した**byte\[\]を Java の BufferedImage としてレンダリングしようと思うと、素直な実装では byte\[\]の要素数ループを回して RGB のオーダーを入れ替えなければなりません。それって何だかエレガントじゃない。

この問題を解決するため、ByteBuffer を使い、先頭に 1 バイト(null)を足してお尻を 1 バイト短くしたうえで IntBuffer として読み出してやることにより、TYPE_INT_BGR な BufferedImage 用の int\[\]を練成しました。要は「BGR0BGR0BG……BGR**0**」となってるものを「**0**BGR0BGR0BG……BGR」にして int\[\]でラップしたわけです。実際のコードは[このあたり](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L191)。

```java
colorImageBuffer = (DataBufferInt) image.getRaster().getDataBuffer();
colorIntBuffer = IntBuffer.wrap(colorImageBuffer.getData());
// 中略
if (frame.isSetImage()) {
    byte[] imageData = frame.getImage();
    colorByteBuffer.put((byte) 0);
    colorByteBuffer.put(imageData, 0, imageData.length - 1);
    colorByteBuffer.rewind();
    colorIntBuffer.put(colorByteBuffer.asIntBuffer());
    colorIntBuffer.rewind();
}
```

そんな努力の賜物の Kinect サーバ/クライアント、よかったら使ってみてください。それなりのパフォーマンスで動きます。Thrift のファイルも GitHub にあげてあるので、他の言語のクライアントも比較的簡単に書けると思います。
