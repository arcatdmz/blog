---
title: "ThriftでJavaからC#サーバのKinectを使う"
date: "2013-02-21"
tags: 
  - "java"
  - "programming"
coverImage: "kinect-thrift-server.jpg"
---

[![kinect-thrift-server](/images/kinect-thrift-server-300x225.jpg "C#サーバとJavaクライアントがThriftで通信")](http://junkato.jp/ja/blog/wp-content/uploads/2013/02/kinect-thrift-server.jpg)

最近、Kinectを使う開発環境[Picode](http://junkato.jp/ja/picode/)の実装を手直ししています。この開発環境はJavaで書かれているのですが、Kinect for Windows SDKのAPIを使う必要があります。

Kinect for Windows SDKはC++とC#向けのAPIしか提供していないため、Javaから使うためにはC++またはC#のプロセスと通信することになります。そこで今回は、[Thrift](http://thrift.apache.org "Apache Thrift")というFacebookが開発したフレームワークを使ってプロセス間通信(Inter-process communication)してみました。

ソースコードとバイナリは[GitHub](https://github.com/arcatdmz/kinect-thrift-server)にあります。

### Inter-process communication (IPC)

Java VMと外界がInter-process communicationするための方便はJNI、Named pipe、Memory-mapped file……といろいろあるのですが、今回はKinectサーバをWindowsマシンで動かしてPicodeを別のMacマシンで動かすようなこともしてみたかったので、ソケット通信を利用することにしました。

実装の初期段階では自前のTCP/IPサーバとクライアントを書いていたのですが、クライアント側で呼び出したい機能が増えていくに従って俺々プロトコルが複雑になってしまいました。

そこで、TCP/IP越しの[RPC](http://ja.wikipedia.org/wiki/RPC "Remote procedure call")用のフレームワークの中で使いやすそうなものがないか調べました。

### Thrift

今回はC#がサーバ、Javaがクライアントになるので、ライブラリの実装状況から見て候補が[Thrift](http://thrift.apache.org "Apache Thrift")と[MessagePack](http://msgpack.org/ "MessagePack")に絞られました。さらにMessagePackのほうは[C#のRPCの実装](https://github.com/yfakariya/msgpack-rpc-cli "MessagePack for CLI (.NET/Mono) RPC")がドキュメント不足で使いづらそうだったのでThriftを使うことにしました。

Thriftは最初に拡張子.thriftのテキストファイルでRPCの仕様を書いて、これをthriftバイナリに食わせることで各言語のテンプレートを生成することができます。Kinectサーバの場合は、.thriftを[こんな具合](https://github.com/arcatdmz/kinect-thrift-server/blob/master/thrift/KinectService.thrift)に書いてやると、ちゃんと[C#のテンプレート](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectService.cs)と[Javaのテンプレート](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectService.java)が生成されました。

サーバ側は、自動生成されるインタフェース([KinectService.Iface](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectService.cs#L21))を実装するクラス([KinectServiceHandler](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectServiceHandler.cs))を作り、次のようなコードを書いてやればサーバが起動します。

\[code language="csharp"\] KinectServiceHandler handler = new KinectServiceHandler(); KinectService.Processor processor = new KinectService.Processor(handler); TServerTransport serverTransport = new TServerSocket(10000); TServer server = new TSimpleServer(processor, serverTransport); handler.Shutdown = server.Stop; Console.WriteLine("Starting the server..."); server.Serve();\[/code\]

クライアント側はさらに簡単で、自動生成されるClientクラス([KinectService.Client](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectService.java#L91))をインスタンス化すればサーバに接続でき、リモートの関数を呼び出せます。

\[code language="java"\] TTransport transport = new TSocket("localhost", 10000); TProtocol protocol = new TBinaryProtocol(transport); KinectService.Client client = new KinectService.Client(protocol);\[/code\]

GitHubにC#の[サーバ](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/Program.cs)と、Javaの[簡単なクライアントのサンプル](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/app/RawClientTest.java)、[GUIがついてちょっと複雑なクライアントのサンプル](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/app/KinectClientFrame.java)を置いてあります。どちらもGit cloneするとバイナリが置いてあってすぐ実行できるようになっています。実行の仕方について詳しくは[README.md](https://github.com/arcatdmz/kinect-thrift-server#readme)をどうぞ。

### はまったところ

#### Thriftの型システムとエンディアン

上にさらっと書いた内容だけだとすごく簡単そうです（実際、通信部分のコードは全く気にせず済んだので、そこはよかったのです）が、Thriftの型システムにいただけないところがあって苦労しました。まず、intやlongなどの配列を作れません。list<i32>と書くと、配列ではなくListができます。しかも、Javaの場合はプリミティブ型のListが作れないのでList<Integer>になります。[滅びればいいのに](https://twitter.com/arcatdmz/status/303885308754288640)。

で、binaryと書くと単なるbyte型配列ができるので、[short\[\]をクライアントに返すためにいったんbyte\[\]に変換するコード(C#)](https://github.com/arcatdmz/kinect-thrift-server/blob/master/csharp/ConsoleKinectServer/KinectServiceHandler.cs#L496)を書いたのですが、[受け取ったbyte\[\]をshort\[\]に戻すコード(Java)](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L199)を素直に書いたらデータが壊れました。原因はEndian-nessの不整合でした。

以下のC#側のコードはWindows上で動くので、Little endianでshort\[\]をbyte\[\]に書き込みます。

\[code language="csharp"\] // Depth image processing. if (depthImageFrame != null && depthEnabled) { depthImageFrame.CopyPixelDataTo(depthImageData); Buffer.BlockCopy(depthImageData, 0, depthImageRawData, 0, depthImageRawData.Length); frame.DepthImage = depthImageRawData; }\[/code\]

一方、以下のJava側のコードはデフォルトでBig endianを使うため、データが壊れたというわけです。

\[code language="java"\] if (frame.isSetDepthImage()) { depthByteBuffer.put(frame.getDepthImage()); depthByteBuffer.rewind(); depthShortBuffer.put(depthByteBuffer.asShortBuffer()); depthShortBuffer.rewind(); depthImageData = depthShortBuffer.array(); }\[/code\]

けっきょく、[Java側でLittle endianを明示的に指定](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L174)して復号することで対応しました。

\[code language="java"\] // C# server running on Windows converts short\[\] to byte\[\] with little-endian. // Therefore, we need to specify the endian-ness here to reconstruct it correctly. depthByteBuffer.order(ByteOrder.LITTLE\_ENDIAN);\[/code\]

#### Kinectのカラー画像のRGBオーダー

Thriftは全く関係ないのですが、Kinectのカラー画像はなぜかBGR(null)の順でbyte\[\]として取得できるようになっています……ふつうARGBか(null)BGR、(null)RGBだと思うんですけど。この**Java側でBGR(null)順になっていた理由は上記と同じEndian-nessの問題でした。ともかく、こうして受信した**byte\[\]をJavaのBufferedImageとしてレンダリングしようと思うと、素直な実装ではbyte\[\]の要素数ループを回してRGBのオーダーを入れ替えなければなりません。それって何だかエレガントじゃない。

この問題を解決するため、ByteBufferを使い、先頭に1バイト(null)を足してお尻を1バイト短くしたうえでIntBufferとして読み出してやることにより、TYPE\_INT\_BGRなBufferedImage用のint\[\]を練成しました。要は「BGR0BGR0BG……BGR**0**」となってるものを「**0**BGR0BGR0BG……BGR」にしてint\[\]でラップしたわけです。実際のコードは[このあたり](https://github.com/arcatdmz/kinect-thrift-server/blob/master/java/src/jp/digitalmuseum/kinect/KinectServiceWrapper.java#L191)。

\[code language="java"\] colorImageBuffer = (DataBufferInt) image.getRaster().getDataBuffer(); colorIntBuffer = IntBuffer.wrap(colorImageBuffer.getData()); // 中略 if (frame.isSetImage()) { byte\[\] imageData = frame.getImage(); colorByteBuffer.put((byte) 0); colorByteBuffer.put(imageData, 0, imageData.length - 1); colorByteBuffer.rewind(); colorIntBuffer.put(colorByteBuffer.asIntBuffer()); colorIntBuffer.rewind(); }\[/code\]

そんな努力の賜物のKinectサーバ/クライアント、よかったら使ってみてください。それなりのパフォーマンスで動きます。ThriftのファイルもGitHubにあげてあるので、他の言語のクライアントも比較的簡単に書けると思います。
