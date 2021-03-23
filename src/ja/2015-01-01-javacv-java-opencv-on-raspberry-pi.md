---
title: Raspberry PiでJavaCV (Java + OpenCV)
date: "2015-01-01"
tags:
  - programming
coverImage: javacv-raspberry-pi.png
summary_generated: "日本のみなさん、あけましておめでとうございます！PDT(太平洋標準時)ということにして、先の記事でセットアップした QEMU上で \_#大晦日ハッカソン を続けておりました。けっきょくビルド時間などがネックになって実機での動作は間に合いませんでしたが、JavaCVを Rasp..."
---

日本のみなさん、あけましておめでとうございます！PDT(太平洋標準時)ということにして、[先の記事でセットアップした QEMU](https://junkato.jp/ja/blog/2014/12/31/raspberry-pi-raspbian-on-windows-qemu/ "Windows+QEMUでRaspberry Piをエミュレートする")上で  [#大晦日ハッカソン](http://togetter.com/li/764484) を続けておりました。

けっきょくビルド時間などがネックになって実機での動作は間に合いませんでしたが、[JavaCV](https://github.com/bytedeco/javacv)を Raspbian (linux-arm)上で使えるようになったことだけご報告いたします。

これまでは Windows, Mac OS X, Android, x86 と x64 の Linux でしか動いていなかった OpenCV の Java ラッパーが、ARM Linux でちゃんと動いたということです。

<figure className="center">
  <a href="/images/javacv-raspberry-pi.png"><img src="/images/javacv-raspberry-pi.png" alt="javacv-raspberry-pi" /></a>
  <figcaption>RaspbianでJavaCVのサンプルが動いた！</figcaption>
</figure>

方法は後日改めて書きます。[GitHub の JavaCV 原作者さんへの Pull request](https://github.com/arcatdmz/javacpp-presets)もそのうち。

ではでは、よいお年を！
