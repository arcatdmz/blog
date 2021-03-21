---
title: "Intel Edisonで新しいセンサ・アクチュエータを使うためのドライバ開発"
date: "2015-10-24"
tags:
  - "programming"
coverImage: "DSC09957.jpg"
---

最近 Intel Edison のお世話になっています。JavaScript で（ホスト PC なしに）センサ・アクチュエータが動くのって本当に素敵ですね！

Intel Edison や Galileo では、GPIO などを操作するために[mraa](https://github.com/intel-iot-devkit/mraa)という低レイヤーな通信用ライブラリを使います。簡単に入手できる有名なセンサ・アクチュエータごとに mraa を使ったコードをライブラリ化し、API を整備したのが[upm](https://github.com/intel-iot-devkit/upm)です。`opkg update && opkg install upm`コマンドで最新版をインストールでき、オフィシャルに対応しているすべてのドライバが使えるようになります。

しかしながら、使いたいセンサ・アクチュエータがあるのに upm が対応していないケースがよくあります。そういった場合には、自分で upm を拡張するドライバを開発して GitHub で pull request を送ることができます。しばらくすると upm にマージされ、そのうち Intel Edison の初期設定で入るファームウェアでも当該センサ・アクチュエータが使えるようになります。みんな幸せになれますね。

mraa を使って upm を拡張するための手順は一応すべて GitHub にあがっていますが、もう少し詳しく、日本語で解説してみます。なお、ホスト PC で Intel Edison 用にドライバをクロスコンパイルすることもできるかもしれませんが、とりあえず手軽に実機での開発方法を紹介します。今のところ、実機でも現実的な時間でコンパイルが終わってすぐ動作確認できるので、とくに問題を感じていません。

[![Intel Edisonを使ったマイコンアプリケーション開発](/images/DSC09957-1024x512.jpg)](https://junkato.jp/ja/blog/wp-content/uploads/2015/10/DSC09957.jpg)

## opkg で Git をインストール

まずは Git をインストールするために、パッケージマネージャ opkg の参照先 URL を増やします。(情報元: [Edison opkg package repo created](https://communities.intel.com/thread/55692))

```bash
echo "src/gz all http://repo.opkg.net/edison/repo/all" >> /etc/opkg/base-feeds.conf
echo "src/gz edison http://repo.opkg.net/edison/repo/edison" >> /etc/opkg/base-feeds.conf
echo "src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32" >> /etc/opkg/base-feeds.conf
```

そのうえで、Git をインストールします。お手軽。

```bash
opkg update
opkg install git
```

## mraa を git clone, cmake, make install

情報元: [Building libmraa](https://github.com/intel-iot-devkit/mraa/blob/master/docs/building.md)

GitHub からソースコード一式を落としてきます。

```bash
cd ~/
mkdir github
cd github
git clone https://github.com/intel-iot-devkit/mraa.git
```

cmake します。

```bash
cd ~/github/mraa/
mkdir build
cd build
cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr ..
```

make install します。

```bash
cd ~/github/mraa/build/
make install
```

これで開発版の mraa がインストールされます。

## 環境変数を設定

upm のビルド時に参照される環境変数を設定します。

```bash
echo "PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/home/root/github/mraa/build/lib/pkgconfig" >> ~/.profile
echo "CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:/home/root/github/mraa/build/include" >> ~/.profile
echo "LIBRARY_PATH=$LIBRARY_PATH:/home/root/github/mraa/build/lib" >> ~/.profile
```

このあとログインし直さない場合は`source ~/.profile`で読み込んでから作業を続けましょう。

## upm を git clone, cmake, make install

情報元: [Building UPM](http://iotdk.intel.com/docs/master/upm/building.html)

**GitHub 上で本家 upm リポジトリを自分のアカウントに fork してから**ソースコード一式を落としてきます。fork しておかないと後々`git push`できないので要注意です。

```bash
cd ~/github/
git clone https://github.com/arcatdmz/upm.git
```

`cmake`します。僕は Python を使わないので`-DBUILDSWIGPYTHON=OFF`オプションをつけています。

```bash
cd ~/github/upm/
mkdir build
cd build
cmake -DBUILDSWIGPYTHON=OFF -DCMAKE_INSTALL_PREFIX:PATH=/usr ..
```

ここまでは mraa と一緒ですが、このあとそのまま`make install`するとけっこう時間がかかります。全ドライバをビルドするためです。

```bash
cd ~/github/upm/build/
make install
```

必要なドライバだけビルドするためには、そのサブフォルダに入って`make install`します。

```bash
cd ~/github/upm/build/src/grovecircularled/
make install
```

ビルド方法が分かったので、あとはドライバを書くだけですね！

## upm を拡張する

情報元: [Making a UPM module for MAX31855](http://iotdk.intel.com/docs/master/upm/max31855.html)

`upm/src/`の中に新しいディレクトリを作って C++のソースコードを書けば upm を拡張できます。例えば [groveultrasonic: Initial implementation](https://github.com/arcatdmz/upm/commit/add313ad6bbcd2ac4e7d4177b2beb9fd408b57d3) を見てみてください。これは、Grove の超音波測距センサを使えるようにしたドライバの pull request です。

具体的には次のようにしてソースコードを書いていきます。

```bash
cd ~/github/upm/build/src
mkdir groveultrasonic
cd groveultrasonic
vi groveultrasonic.cxx
```

使える API は[mraa のドキュメント](http://iotdk.intel.com/docs/master/mraa/)を見てみてください。

また、Python や Node.js 用のモジュールを作るため、C++のソースコード以外にもいくつかファイルが必要になります。初めは似た処理をしているドライバのディレクトリをコピーして、それを改変していくのがいいと思います。なお、ディレクトリ名はそのままドライバ名になります。(cf. [命名規則](http://iotdk.intel.com/docs/master/upm/naming.html))

examples/c++/CMakeList.txt

C++用のサンプルコードをビルドするための情報が書いてある。

examples/c++/{modname}.cxx

C++用のサンプルコードを書く。MIT ライセンスの文面を忘れないように。`//! [Interesting]`で囲んだ範囲はサンプルコードとして API リファレンスに転載される。

examples/{langname}/{modname}.py

{JavaScript,Python,Java}用のサンプルコードを書く。MIT ライセンスの文面を忘れないように。

src/{modname}/CmakeLists.txt

cmake 用の設定を書く。ほぼコピペでよい。

src/{modname}/{modname}.{cxx,h}

C++でドライバを書く。本体。MIT ライセンスの文面を忘れないように。

src/{modname}/{js,py}upm\_{modname}.i

JavaScript, Python バインディングのための設定ファイル。ほぼコピペでよい。

## 本家 upm に pull request を送る

ファイルが揃ったら`git commit --signoff`します。`--signoff`オプションをつけることで[upm への貢献に関する規約](http://iotdk.intel.com/docs/master/upm/contributions.html)に同意したとみなされます。

あとは fork した自分のリポジトリへ`git push`して、[GitHub 上で pull request を送れば](https://github.com/intel-iot-devkit/upm/pull/298)そのうち本家に取り込まれるかもしれません。
