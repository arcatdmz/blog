---
title: "OpenCVをJavaから使う (改訂版)"
date: "2014-01-26"
tags: 
  - "programming"
---

1年以上前に[OpenCVの非公式なJavaラッパーJavaCVを使う方法](http://junkato.jp/ja/blog/2012/11/04/use-opencv-from-java/ "OpenCVをJavaから使う")について記事を書いたのですが、その後、[OpenCVの公式なJavaラッパー](http://docs.opencv.org/doc/tutorials/introduction/desktop_java/java_dev_intro.html "Introduction to Java Development - OpenCV documentation")が公開されたり、[JavaCV](https://code.google.com/p/javacv/ "javacv - Java interface to OpenCV and more - Google Project Hosting")のバージョンが上がったりして、色々と状況が変わっています。

OpenCVの公式なJavaラッパーは最新のAPIが使えるという利点がありますが、OpenCVのバイナリを別途インストールする必要があります。

非公式なJavaラッパーJavaCVは、APIは少し古いものしか使えませんが、FFmpegなど関連する便利なライブラリのAPIもラップしてくれているほか、最近のアップデートで主要なOS向けのバイナリを含むjarファイルを一緒に配布してくれるようになり、OpenCVを別途インストールする必要がなくなりました。

OpenCVを利用したJavaアプリケーションを一般ユーザに配布したい場合は、JavaCVのほうが便利そうです。というわけで、最新のJavaCVを使う方法について簡単にメモしておきます。

1. [プロジェクトのダウンロードページ](https://code.google.com/p/javacv/downloads/list "Downloads - javacv")から次の二つをダウンロードして適当なディレクトリに解凍する
    - javacv-\*-bin.zip
    - javacv-\*-cppjars.zip
2. ソースコードをコンパイル、実行するときのJavaのクラスパスに以下のファイルを追加する
    - javacv.jar
    - javacpp.jar
    - javacv-{platform}.jar
    - opencv-\*-{platform}.jar

これだけです。[前の記事](http://junkato.jp/ja/blog/2012/11/04/use-opencv-from-java/ "OpenCVをJavaから使う")に比べて、OpenCVのインストール作業がなくなったので本当にシンプルになりました。

{platform}は、バージョン0.7現在でOpenCVとFFmpegどちらにも次の5通りが用意されていて、たいていの環境に対応できるはずです。

- 32bit版Windows (windows-x86)
- 64bit版Windows (windows-x86\_64)
- 64bit版Mac OS X (macosx-x86\_64)
- 32bit版Linux (linux-x86)
- 64bit版Linux (linux-x86\_64)
