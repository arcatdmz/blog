---
title: "Windows+QEMUでRaspberry Piをエミュレートする"
date: "2014-12-31"
tags: 
  - "programming"
coverImage: "raspbian-on-qemu-windows.png"
---

[Raspberry Pi Type B 512MB](http://www.amazon.co.jp/gp/product/B00CBWMXVE/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B00CBWMXVE&linkCode=as2&tag=digitalmuseum-22)![](http://ir-jp.amazon-adsystem.com/e/ir?t=digitalmuseum-22&l=as2&o=9&a=B00CBWMXVE)を買ったのが8月のこと。Raspbianをインストールして無線LAN接続のためのUSBドングル([BUFFALO 無線LAN子機 WLI-UC-GNM](http://www.amazon.co.jp/gp/product/B003NSAMW2/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B003NSAMW2&linkCode=as2&tag=digitalmuseum-22)![](http://ir-jp.amazon-adsystem.com/e/ir?t=digitalmuseum-22&l=as2&o=9&a=B003NSAMW2))を挿してカメラモジュールをつないで、ちょっと遊んではみたもののそのまま放置していました。もったいない。

原因を考えてみたところ、

- `apt-get`などでインストールして遊びたいありもののソフトウェアはとくにない
- 自分でRaspberry Pi用のプログラムを書きたい
- 統合開発環境フリークの自分にとってはパフォーマンスが低すぎて開発機にはならない(Eclipseなどがまともに動かない)
- それどころか、ちょっと複雑なライブラリをビルドしようとするとそれだけで数時間以上かかってしまう
- しかも途中でエラーが起きたりして飽きる、だるい

ということのようです。

そこで、Windows上でRaspbianをエミュレーションし、ビルドなど面倒なことはそこでやって、実機にはバイナリのみデプロイすることにしました。基本的には [QEMU – Emulating Raspberry Pi the easy way (Linux or Windows!)](http://xecdesign.com/qemu-emulating-raspberry-pi-the-easy-way/) に書いてある方法の二番煎じです。この記事に従って作業すると、次のようなことができるようになります。

- Windows版QEMUの上でRaspbian OSが動き、実機のRaspberry Piで動くバイナリをコンパイルできるようになる
- 200MB程度しか空き容量がないRaspbianのディスクイメージを拡張し、2GB以上の容量を確保、さまざまなパッケージをインストールできるようになる
- 256MBしかメモリを割り当てられないQEMUの制限に対し、スワップ領域を用意することで対処し、わりと多めのメモリを必要とする処理が可能になる
- ExpanDriveを使うことで、QEMU上のRaspbian OSとホストマシンであるWindows間で簡単にファイルのやり取りができるようになる

\[caption id="attachment\_884" align="aligncenter" width="656"\][![raspbian-on-qemu-windows](/images/raspbian-on-qemu-windows.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/12/raspbian-on-qemu-windows.png) WindowsでRaspbianが動いてる！\[/caption\]

**2015年1月4日追記;** あけましておめでとうございます！

<blockquote class="twitter-tweet" lang="en">？？？？なんでクロスビルドしないんだ…？？？？：Windows+QEMUでRaspberry Piをエミュレートする | junkato.jp<div></div>— しゅううさん (@syuu1228) <a href="https://twitter.com/syuu1228/status/550374910468440066">December 31, 2014</a></blockquote>
<script src="//platform.twitter.com/widgets.js" async charset="utf-8"></script>

そういうのもあるのか！しかし、WindowsでARM Linux用のクロスビルド環境を簡単に作れる方法ってあるんでしょうか？とりあえずLinuxの方は[こちら](http://www.sadaji.net/Firmware/eclipse/index.htm)をどうぞ。Windows + Visual Studioでそれっぽいことをしてる人も[海外にはいる](http://www.hassang.com/visual-studio-2012-template-and-the-raspberry-pi-toolchain-c)ようですね。

## QEMUのインストール

> QEMU（キューエミュ）は、Fabrice Bellardが中心となって開発しているオープンソースのプロセッサエミュレータである。
> 
> [QEMU - Wikipedia](http://ja.wikipedia.org/wiki/QEMU)

[QEMU for Windows](http://qemu.weilnetz.de/)からインストーラをダウンロードして実行します。記事執筆時点での64bit版Windows用の最新バイナリは[qemu-w64-setup-20141210.exe](http://qemu.weilnetz.de/w64/qemu-w64-setup-20141210.exe)でした。

このあと、QEMUバイナリがあるディレクトリ、例えば `C:\Program Files\qemu` などへパスを通します。

## Raspbian ディスクイメージなどのダウンロード

[Downloads | Raspberry Pi](http://www.raspberrypi.org/downloads/) のOperating System ImagesからRaspbianの最新版をダウンロードして、ZIPを展開します。記事執筆時点での最新版は2014/12/24リリースのDecember 2014で、ファイル名は `2014-12-24-wheezy-raspbian.img` でした。

あとは、Raspberry Piのプロセッサと互換性があるカーネルイメージが必要です。作り方が [Compiling an ARM1176 kernel for QEMU](http://xecdesign.com/compiling-a-kernel/) に書いてありますが、幸い、ページ執筆者がダウンロード可能なバイナリを用意してくれています。リンク先の2行目にコンパイル済みカーネルへのリンク（[kernel-qemu](http://www.xecdesign.com/downloads/linux-qemu/kernel-qemu "ARM1176 QEMU kernel")）があります。

一つのフォルダの中に以下の二つのファイルが入っているようにしてください。

- `YYYY-MM-DD-wheezy-raspbian.img` (YYYY-MM-DDは2014-12-24など。以降、実際のファイル名に読みかえてください)
- `kernel-qemu`

## QEMUの起動

二つのファイルが揃ったフォルダの中で、コマンドプロンプトかPowerShellで以下のコマンドを実行します。うまくいけば、QEMU上でbashが起動します。

\[code language="shell"\]qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw init=/bin/bash" -hda YYYY-MM-DD-wheezy-raspbian.img\[/code\]

ここで、 `nano` などを使って `/etc/ld.so.preload` の内容をコメントアウトします。

\[code language="shell"\]nano /etc/ld.so.preload # このあとカーソルが一文字目に合っているはずなので "#" を入力します。 # "#" が挿入されたのを確認したら Ctrl+x を押します。 # ファイルを保存するか聞かれるので y とENTERキーを順に押します。\[/code\]

同様の手順で `/etc/udev/rules.d/90-qemu.rules` を作成します。起動時に、Raspberry Piが通常アクセスするマウントポイント(例えば `/dev/root`)からカーネルが見ているマウントポイント(例えば `/dev/sda2`)へシンボリックリンクを張る内容です。

\[code language="shell"\]KERNEL=="sda", SYMLINK+="mmcblk0" KERNEL=="sda?", SYMLINK+="mmcblk0p%n" KERNEL=="sda2", SYMLINK+="root"\[/code\]

最後にシステムをシャットダウンします。

\[code language="shell"\]halt\[/code\]

## ディスク容量の拡張とRaspbianの起動

Raspbian ディスクイメージは200MB程度しか空き容量がなく、いろいろなパッケージをインストールするには不足です。そこで、ディスクイメージの容量を拡張します。Linuxなどでは`dd`コマンドで容量を拡張する方法が一般的のようですが、Windowsでは`copy`コマンドを使って二つのディスクイメージを連結すれば同じ結果を得られます。 [Is it possible to resize a QEMU disk image?](http://superuser.com/questions/24838/is-it-possible-to-resize-a-qemu-disk-image) を参考にしました。

\[code language="shell"\]# 2GB拡張する場合 qemu-img create -f raw temp.img 2G copy /b YYYY-MM-DD-wheezy-raspbian.img+temp.img raspbian.img\[/code\]

以降、QEMUでは生成された `raspbian.img` を使います。 `YYYY-MM-DD-wheezy-raspbian.img` はごみ箱に捨てて構いません。 `temp.img` はあとでスワップ領域用に再利用します。

先ほどの起動コマンドから `init=/bin/bash` を消し、 `-hda` オプションが `YYYY-MM-DD-wheezy-raspbian.img` でなく `raspbian.img` を指すようにします。

\[code language="shell"\]qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" -hda raspbian.img\[/code\]

Raspbianにユーザ名 `pi` パスワード `raspberry` でログインしたら、`fdisk`でパーティションテーブルを書き換え、Raspbianが使えるディスク容量を増やします。

\[code language="shell"\]sudo fdisk /dev/sda\[/code\]

ここまで書いて気づいたんですが、ほぼ同じことをしている日本の方がいますね。 [Raspberry Pi のイメージファイルを拡張する](https://blog.ymyzk.com/2013/12/raspbian-image-resize/) という記事です。

> 現在のパーティションテーブルを確認します.

というところから読み進めてください。

なお、僕の環境ではRaspbian上で日本語がうまく表示できなかったのですが、 `jfbterm` をインストールし、その上で作業するようにしたら解決しました。

\[code language="shell"\]sudo apt-get install jfbterm\[/code\]

## スワップ領域の拡張

さて、ディスク容量も2GB増えて、いろいろインストールできるようになったのはいいのですが、実際にさまざまなコードをビルドしようと思うと、QEMUの256MBのメモリ制限がきつくなってきます。僕の場合、OpenCVのビルド中にメモリが足りなくなって、 `make` がエラー終了してしまいました。

`qemu-system-armw` にはRAM容量を指定できる `-m` オプションがあるのですが、256を超えた値ではRaspbianが起動しないそうです。

そこで、[Raspberry Piフォーラムの書き込み](http://www.raspberrypi.org/forums/viewtopic.php?f=53&t=8649)を参考に、先ほど作成した `temp.img` をQEMUに二つ目のディスクとして読み込ませ、全体をスワップ領域として使えるようにします。起動コマンドは次の通りです。

\[code language="shell"\]qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" -hda raspbian.img -hdb temp.img\[/code\]

Raspbianが起動したら、次のコマンドを実行するだけです。

\[code language="shell"\]mkswap /dev/sdb swapon /dev/sdb\[/code\]

もしRAMディスクを作成できるようなソフトウェアを持っていたら、 `temp.img` をRAMディスク上に置いてやれば、アクセスが段違いに高速化すると思います。

## RaspbianとWindows間のファイル交換

QEMU上のRaspbianとホストとなっているWindowsの間でファイル交換する方法については、Raspbian上でSambaを動かすとかやり方はいろいろあると思うのですが、僕は、SFTPサーバをネットワークドライブとしてマウントできる[ExpanDrive](http://www.expandrive.com/expandrive)を使っています。

RaspbianはデフォルトでSSHサーバが起動するようになっているので、QEMUの起動コマンドに`-redir "tcp:10022::22"`と書き足して、次のようにすれば、WindowsからSSHログインできるようになります。

\[code language="shell"\]qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" -redir "tcp:10022::22" -hda raspbian.img -hdb temp.img\[/code\]

あとは[ExpanDrive](http://www.expandrive.com/expandrive)でSFTPサーバ `127.0.0.1` のポート `10022` に接続すれば、Raspbianのホームディレクトリの中身が普通のフォルダのようにアクセスできるようになります。いつも使っているGUIベースのテキストエディタで設定ファイルを編集することもできます。
