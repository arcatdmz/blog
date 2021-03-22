---
title: Windows+QEMUでRaspberry Piをエミュレートする
date: '2014-12-31'
tags:
  - programming
coverImage: raspbian-on-qemu-windows.png
summary_generated: >-
  Raspberry Pi Type B 512MBを買ったのが 8 月のこと。Raspbian をインストールして無線 LAN 接続のための USB
  ドングル(BUFFALO 無線 LAN 子機 WLI-UC-GNM)を挿してカメラモジュールをつないで、ちょっと遊んではみた...
---

[Raspberry Pi Type B 512MB](http://www.amazon.co.jp/gp/product/B00CBWMXVE/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B00CBWMXVE&linkCode=as2&tag=digitalmuseum-22)![](http://ir-jp.amazon-adsystem.com/e/ir?t=digitalmuseum-22&l=as2&o=9&a=B00CBWMXVE)を買ったのが 8 月のこと。Raspbian をインストールして無線 LAN 接続のための USB ドングル([BUFFALO 無線 LAN 子機 WLI-UC-GNM](http://www.amazon.co.jp/gp/product/B003NSAMW2/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B003NSAMW2&linkCode=as2&tag=digitalmuseum-22)![](http://ir-jp.amazon-adsystem.com/e/ir?t=digitalmuseum-22&l=as2&o=9&a=B003NSAMW2))を挿してカメラモジュールをつないで、ちょっと遊んではみたもののそのまま放置していました。もったいない。

原因を考えてみたところ、

- `apt-get`などでインストールして遊びたいありもののソフトウェアはとくにない
- 自分で Raspberry Pi 用のプログラムを書きたい
- 統合開発環境フリークの自分にとってはパフォーマンスが低すぎて開発機にはならない(Eclipse などがまともに動かない)
- それどころか、ちょっと複雑なライブラリをビルドしようとするとそれだけで数時間以上かかってしまう
- しかも途中でエラーが起きたりして飽きる、だるい

ということのようです。

そこで、Windows 上で Raspbian をエミュレーションし、ビルドなど面倒なことはそこでやって、実機にはバイナリのみデプロイすることにしました。基本的には  [QEMU – Emulating Raspberry Pi the easy way (Linux or Windows!)](http://xecdesign.com/qemu-emulating-raspberry-pi-the-easy-way/) に書いてある方法の二番煎じです。この記事に従って作業すると、次のようなことができるようになります。

- Windows 版 QEMU の上で Raspbian OS が動き、実機の Raspberry Pi で動くバイナリをコンパイルできるようになる
- 200MB 程度しか空き容量がない Raspbian のディスクイメージを拡張し、2GB 以上の容量を確保、さまざまなパッケージをインストールできるようになる
- 256MB しかメモリを割り当てられない QEMU の制限に対し、スワップ領域を用意することで対処し、わりと多めのメモリを必要とする処理が可能になる
- ExpanDrive を使うことで、QEMU 上の Raspbian OS とホストマシンである Windows 間で簡単にファイルのやり取りができるようになる

<figure className="center">
  <a href="/images/raspbian-on-qemu-windows.png"><img src="/images/raspbian-on-qemu-windows.png" alt="raspbian-on-qemu-windows" /></a>
  <figcaption>WindowsでRaspbianが動いてる！</figcaption>
</figure>

**2015 年 1 月 4 日追記;** あけましておめでとうございます！

<blockquote class="twitter-tweet" lang="en">？？？？なんでクロスビルドしないんだ…？？？？：Windows+QEMUでRaspberry Piをエミュレートする | junkato.jp<div></div>— しゅううさん (@syuu1228) <a href="https://twitter.com/syuu1228/status/550374910468440066">December 31, 2014</a></blockquote>
<script src="//platform.twitter.com/widgets.js" async charset="utf-8"></script>

そういうのもあるのか！しかし、Windows で ARM Linux 用のクロスビルド環境を簡単に作れる方法ってあるんでしょうか？とりあえず Linux の方は[こちら](http://www.sadaji.net/Firmware/eclipse/index.htm)をどうぞ。Windows + Visual Studio でそれっぽいことをしてる人も[海外にはいる](http://www.hassang.com/visual-studio-2012-template-and-the-raspberry-pi-toolchain-c)ようですね。

## QEMU のインストール

> QEMU（キューエミュ）は、Fabrice Bellard が中心となって開発しているオープンソースのプロセッサエミュレータである。
>
> [QEMU - Wikipedia](http://ja.wikipedia.org/wiki/QEMU)

[QEMU for Windows](http://qemu.weilnetz.de/)からインストーラをダウンロードして実行します。記事執筆時点での 64bit 版 Windows 用の最新バイナリは[qemu-w64-setup-20141210.exe](http://qemu.weilnetz.de/w64/qemu-w64-setup-20141210.exe)でした。

このあと、QEMU バイナリがあるディレクトリ、例えば `C:\Program Files\qemu` などへパスを通します。

## Raspbian ディスクイメージなどのダウンロード

[Downloads | Raspberry Pi](http://www.raspberrypi.org/downloads/)  の Operating System Images から Raspbian の最新版をダウンロードして、ZIP を展開します。記事執筆時点での最新版は 2014/12/24 リリースの December 2014 で、ファイル名は `2014-12-24-wheezy-raspbian.img` でした。

あとは、Raspberry Pi のプロセッサと互換性があるカーネルイメージが必要です。作り方が  [Compiling an ARM1176 kernel for QEMU](http://xecdesign.com/compiling-a-kernel/)  に書いてありますが、幸い、ページ執筆者がダウンロード可能なバイナリを用意してくれています。リンク先の 2 行目にコンパイル済みカーネルへのリンク（[kernel-qemu](http://www.xecdesign.com/downloads/linux-qemu/kernel-qemu "ARM1176 QEMU kernel")）があります。

一つのフォルダの中に以下の二つのファイルが入っているようにしてください。

- `YYYY-MM-DD-wheezy-raspbian.img` (YYYY-MM-DD は 2014-12-24 など。以降、実際のファイル名に読みかえてください)
- `kernel-qemu`

## QEMU の起動

二つのファイルが揃ったフォルダの中で、コマンドプロンプトか PowerShell で以下のコマンドを実行します。うまくいけば、QEMU 上で bash が起動します。

```shell
qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw init=/bin/bash" -hda YYYY-MM-DD-wheezy-raspbian.img
```

ここで、 `nano` などを使って  `/etc/ld.so.preload` の内容をコメントアウトします。

```shell
nano /etc/ld.so.preload
# このあとカーソルが一文字目に合っているはずなので "#" を入力します。
# "#" が挿入されたのを確認したら Ctrl+x を押します。
# ファイルを保存するか聞かれるので y とENTERキーを順に押します。
```

同様の手順で `/etc/udev/rules.d/90-qemu.rules` を作成します。起動時に、Raspberry Pi が通常アクセスするマウントポイント(例えば `/dev/root`)からカーネルが見ているマウントポイント(例えば `/dev/sda2`)へシンボリックリンクを張る内容です。

```shell
KERNEL=="sda", SYMLINK+="mmcblk0"
KERNEL=="sda?", SYMLINK+="mmcblk0p%n"
KERNEL=="sda2", SYMLINK+="root"
```

最後にシステムをシャットダウンします。

```shell
halt
```

## ディスク容量の拡張と Raspbian の起動

Raspbian ディスクイメージは 200MB 程度しか空き容量がなく、いろいろなパッケージをインストールするには不足です。そこで、ディスクイメージの容量を拡張します。Linux などでは`dd`コマンドで容量を拡張する方法が一般的のようですが、Windows では`copy`コマンドを使って二つのディスクイメージを連結すれば同じ結果を得られます。 [Is it possible to resize a QEMU disk image?](http://superuser.com/questions/24838/is-it-possible-to-resize-a-qemu-disk-image)  を参考にしました。

```shell
# 2GB拡張する場合
qemu-img create -f raw temp.img 2G
copy /b YYYY-MM-DD-wheezy-raspbian.img+temp.img raspbian.img
```

以降、QEMU では生成された `raspbian.img` を使います。 `YYYY-MM-DD-wheezy-raspbian.img` はごみ箱に捨てて構いません。 `temp.img` はあとでスワップ領域用に再利用します。

先ほどの起動コマンドから `init=/bin/bash` を消し、 `-hda` オプションが `YYYY-MM-DD-wheezy-raspbian.img` でなく `raspbian.img` を指すようにします。

```shell
qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" -hda raspbian.img
```

Raspbian にユーザ名 `pi` パスワード `raspberry` でログインしたら、`fdisk`でパーティションテーブルを書き換え、Raspbian が使えるディスク容量を増やします。

```shell
sudo fdisk /dev/sda
```

ここまで書いて気づいたんですが、ほぼ同じことをしている日本の方がいますね。 [Raspberry Pi のイメージファイルを拡張する](https://blog.ymyzk.com/2013/12/raspbian-image-resize/)  という記事です。

> 現在のパーティションテーブルを確認します.

というところから読み進めてください。

なお、僕の環境では Raspbian 上で日本語がうまく表示できなかったのですが、 `jfbterm` をインストールし、その上で作業するようにしたら解決しました。

```shell
sudo apt-get install jfbterm
```

## スワップ領域の拡張

さて、ディスク容量も 2GB 増えて、いろいろインストールできるようになったのはいいのですが、実際にさまざまなコードをビルドしようと思うと、QEMU の 256MB のメモリ制限がきつくなってきます。僕の場合、OpenCV のビルド中にメモリが足りなくなって、 `make` がエラー終了してしまいました。

`qemu-system-armw` には RAM 容量を指定できる `-m` オプションがあるのですが、256 を超えた値では Raspbian が起動しないそうです。

そこで、[Raspberry Pi フォーラムの書き込み](http://www.raspberrypi.org/forums/viewtopic.php?f=53&t=8649)を参考に、先ほど作成した `temp.img` を QEMU に二つ目のディスクとして読み込ませ、全体をスワップ領域として使えるようにします。起動コマンドは次の通りです。

```shell
qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" -hda raspbian.img -hdb temp.img
```

Raspbian が起動したら、次のコマンドを実行するだけです。

```shell
mkswap /dev/sdb
swapon /dev/sdb
```

もし RAM ディスクを作成できるようなソフトウェアを持っていたら、 `temp.img` を RAM ディスク上に置いてやれば、アクセスが段違いに高速化すると思います。

## Raspbian と Windows 間のファイル交換

QEMU 上の Raspbian とホストとなっている Windows の間でファイル交換する方法については、Raspbian 上で Samba を動かすとかやり方はいろいろあると思うのですが、僕は、SFTP サーバをネットワークドライブとしてマウントできる[ExpanDrive](http://www.expandrive.com/expandrive)を使っています。

Raspbian はデフォルトで SSH サーバが起動するようになっているので、QEMU の起動コマンドに`-redir "tcp:10022::22"`と書き足して、次のようにすれば、Windows から SSH ログインできるようになります。

```shell
qemu-system-armw -kernel kernel-qemu -cpu arm1176 -m 256 -M versatilepb -no-reboot -serial stdio -append
"root=/dev/sda2 panic=1 rootfstype=ext4 rw" -redir "tcp:10022::22" -hda raspbian.img -hdb temp.img
```

あとは[ExpanDrive](https://www.expandrive.com/expandrive)で SFTP サーバ `127.0.0.1` のポート `10022` に接続すれば、Raspbian のホームディレクトリの中身が普通のフォルダのようにアクセスできるようになります。いつも使っている GUI ベースのテキストエディタで設定ファイルを編集することもできます。
