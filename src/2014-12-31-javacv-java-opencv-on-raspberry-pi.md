---
title: "Raspberry PiでJavaCV (Java + OpenCV)"
date: "2014-12-31"
tags: 
  - "programming"
coverImage: "javacv-raspberry-pi.png"
---

日本のみなさん、あけましておめでとうございます！PDT(太平洋標準時)ということにして、[先の記事でセットアップしたQEMU](http://junkato.jp/ja/blog/2014/12/31/raspberry-pi-raspbian-on-windows-qemu/ "Windows+QEMUでRaspberry Piをエミュレートする")上で [#大晦日ハッカソン](http://togetter.com/li/764484) を続けておりました。

けっきょくビルド時間などがネックになって実機での動作は間に合いませんでしたが、[JavaCV](https://github.com/bytedeco/javacv)をRaspbian (linux-arm)上で使えるようになったことだけご報告いたします。

これまではWindows, Mac OS X, Android, x86とx64のLinuxでしか動いていなかったOpenCVのJavaラッパーが、ARM Linuxでちゃんと動いたということです。

\[caption id="attachment\_897" align="aligncenter" width="656"\][![javacv-raspberry-pi](/images/javacv-raspberry-pi.png)](http://junkato.jp/ja/blog/wp-content/uploads/2015/01/javacv-raspberry-pi.png) RaspbianでJavaCVのサンプルが動いた！\[/caption\]

方法は後日改めて書きます。[GitHubのJavaCV原作者さんへのPull request](https://github.com/arcatdmz/javacpp-presets)もそのうち。

ではでは、よいお年を！
