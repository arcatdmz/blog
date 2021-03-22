---
title: OpenCVをJavaから使う
date: '2012-11-04'
tags:
  - programming
summary_generated: >-
  これまで、自前のライブラリで Web
  カメラから画像をとってきて、ARToolKitに渡してマーカー検出したりしていたのですが、画像処理関連の研究を始めたりして、そろそろ限界を感じるようになってきたので、Java
  からOpenCVの各機能が呼べるラッパーJavaCVを使って...
---

これまで、[自前のライブラリ](http://code.google.com/p/matereal/ "Materealの一部、captureプロジェクト")で Web カメラから画像をとってきて、[ARToolKit](http://nyatla.jp/nyartoolkit/ "Java版ARToolKit、NyARToolkit")に渡してマーカー検出したりしていたのですが、[画像処理関連の研究](http://junkato.jp/ja/dejavu/ "DejaVu")を始めたりして、そろそろ限界を感じるようになってきたので、Java から[OpenCV](http://opencv.willowgarage.com/wiki/)の各機能が呼べるラッパー[JavaCV](http://code.google.com/p/javacv/)を使ってみることにしました。

インストールおよび実行までの道のりが果てしなく遠い…かと思いきや、意外とすんなりできました。

**2014/1/26 追記;** JavaCV のバージョンがあがって、使い方がもっとシンプルになりました。詳しくは[新しい記事](http://junkato.jp/ja/blog/2014/01/26/use-opencv-from-java-rev2/ "OpenCVをJavaから使う (改訂版)")をご覧ください。

## 64-bit Windows で JavaCV

1. [OpenCV のバイナリ版](http://sourceforge.net/projects/opencvlibrary/files/opencv-win/)(OpenCV-\*.exe, 自己展開 ZIP)をダウンロードして適当なディレクトリ(C:¥opencv など)に解凍
2. [Visual C++ 2010 のランタイム](http://www.microsoft.com/ja-jp/download/details.aspx?id=14632 "Microsoft Visual C++ 2010 再頒布可能パッケージ (x64)")をインストール
3. 環境変数 PATH を編集してパスを.¥build¥common¥tbb¥intel64¥vc10 と.¥build.¥x64¥vc10¥bin に通す
4. [JavaCV](http://code.google.com/p/javacv/)(javacv-\*-bin.zip)をダウンロードして適当なディレクトリ(C:¥opencv¥javacv など)に解凍
5. コンパイル、実行するときの Java のクラスパスに javacpp.jar, javacv.jar, javacv-windows-x86_64.jar を追加

## 64-bit Mac OS X で JavaCV

1. [MacPorts](http://www.macports.org/)をインストール
2. コマンドラインで sudo port install opencv +python27 を実行
3. [JavaCV](http://code.google.com/p/javacv/)(javacv-\*-bin.zip)をダウンロードして適当なディレクトリ(/Users/\*/lib/javacv など)に解凍
4. コンパイル、実行するときの Java のクラスパスに javacpp.jar, javacv.jar, javacv-macosx-x86_64.jar を追加

以上です。

どちらの場合でも注意すべき内容としては、Java VM、OpenCV のビット数が合っていなくてはなりません。僕の環境では、古い研究プロジェクトを動かすため、Java VM が 32 ビットで起動するよう-d32 オプションをつけていました。ところが、OpenCV が 64 ビット版だったため、プログラムを走らせようとすると "java.lang.UnsatisfiedLinkError: Library jniopencv_core not found" というエラーが出てしばらく困りました。

JavaCV が正しくインストールできると、Web カメラから画像を読みとってウィンドウに表示するプログラムが、次のように簡単に書けます。

```java:CaptureImage.java
import javax.swing.JFrame;

import com.googlecode.javacv.CanvasFrame;
import com.googlecode.javacv.OpenCVFrameGrabber;
import com.googlecode.javacv.cpp.opencv_core.IplImage;

public class CaptureImage {
  public static void main(String[] args) {
    new CaptureImage().loop();
  }

  private void loop() {
    CanvasFrame canvas = new CanvasFrame("Webcam");
    canvas.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    // デフォルト(0)のWebカメラを使う
    OpenCVFrameGrabber grabber = new OpenCVFrameGrabber(0);
    try {
      grabber.start();

      // フレームレートを取得
      double frameRate = grabber.getFrameRate();
      long wait = (long) (1000 / (frameRate == 0 ? 10 : frameRate));

      // 画像を取りつづける
      while (true) {
        Thread.sleep(wait);
        IplImage image = grabber.grab();

        // 取ってきた画像を画面に表示
        if (image != null) { canvas.showImage(image); }
      }

    // 何かあったらエラーを吐いて終わる
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
```
