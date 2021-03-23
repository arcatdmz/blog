---
title: OpenCVをJavaから使う (改訂版)
date: "2014-01-26"
tags:
  - programming
summary_generated: >-
  1 年以上前にOpenCV の非公式な Java ラッパー JavaCV を使う方法について記事を書いたのですが、その後、OpenCV の公式な Java
  ラッパーが公開されたり、JavaCVのバージョンが上がったりして、色々と状況が変わっています。OpenCV の公式な ...
altUrl: "https://junkato.jp/ja/blog/2014/01/26/use-opencv-from-java-rev2"
---

1 年以上前に[OpenCV の非公式な Java ラッパー JavaCV を使う方法](/ja/posts/2012-11-04-use-opencv-from-java/ "OpenCVをJavaから使う")について記事を書いたのですが、その後、[OpenCV の公式な Java ラッパー](http://docs.opencv.org/doc/tutorials/introduction/desktop_java/java_dev_intro.html "Introduction to Java Development - OpenCV documentation")が公開されたり、[JavaCV](https://code.google.com/p/javacv/ "javacv - Java interface to OpenCV and more - Google Project Hosting")のバージョンが上がったりして、色々と状況が変わっています。

OpenCV の公式な Java ラッパーは最新の API が使えるという利点がありますが、OpenCV のバイナリを別途インストールする必要があります。

非公式な Java ラッパー JavaCV は、API は少し古いものしか使えませんが、FFmpeg など関連する便利なライブラリの API もラップしてくれているほか、最近のアップデートで主要な OS 向けのバイナリを含む jar ファイルを一緒に配布してくれるようになり、OpenCV を別途インストールする必要がなくなりました。

OpenCV を利用した Java アプリケーションを一般ユーザに配布したい場合は、JavaCV のほうが便利そうです。というわけで、最新の JavaCV を使う方法について簡単にメモしておきます。

1. [プロジェクトのダウンロードページ](https://code.google.com/p/javacv/downloads/list "Downloads - javacv")から次の二つをダウンロードして適当なディレクトリに解凍する
   - javacv-\*-bin.zip
   - javacv-\*-cppjars.zip
2. ソースコードをコンパイル、実行するときの Java のクラスパスに以下のファイルを追加する
   - javacv.jar
   - javacpp.jar
   - javacv-{platform}.jar
   - opencv-\*-{platform}.jar

これだけです。[前の記事](/ja/posts/2012-11-04-use-opencv-from-java/ "OpenCVをJavaから使う")に比べて、OpenCV のインストール作業がなくなったので本当にシンプルになりました。

{platform}は、バージョン 0.7 現在で OpenCV と FFmpeg どちらにも次の 5 通りが用意されていて、たいていの環境に対応できるはずです。

- 32bit 版 Windows (windows-x86)
- 64bit 版 Windows (windows-x86_64)
- 64bit 版 Mac OS X (macosx-x86_64)
- 32bit 版 Linux (linux-x86)
- 64bit 版 Linux (linux-x86_64)
