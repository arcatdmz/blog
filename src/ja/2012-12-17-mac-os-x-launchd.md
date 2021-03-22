---
title: "Mac OS Xでスクリプトを定期実行する"
date: "2012-12-17"
tags:
  - "programming"
  - "server"
coverImage: "fungus-camera.jpg"
---

![](/images/fungus-camera.jpg "なめこカメラ")

最近、照明を ON/OFF する機能を備えた Arduino ベースのネットワークカメラを開発したのですが、そこから定期的に画像を取ってきて保存したくなりました。自宅サーバとして Mac mini Mid 2010 (Mac OS X Snow Leopard)を使っているので、Mac mini で定期的に wget を走らせることができればよいはずです。言ってしまえば簡単なことですが、意外と設定に手間取ったので手順を書いておきます。

## カメラの画像を日付連番で保存するスクリプト

まず、カメラから画像を取ってきて日付連番で保存するスクリプトを書きます。date コマンドで現在の日付を適当なフォーマットに整形し、それを wget の出力ファイル名として渡します。最新の画像は ln -s で newest.jpg からシンボリックリンクを張って常にアクセスできるようにしておきます。カメラから画像を取ってくる wget の前後にアクセスしている URL は照明を ON/OFF するためのものです。

```bash
#!/bin/bash

DIR=/Users/arc/Pictures/Visionsketch/Fungus/
DATE=`date +"%Y-%m-%d-%H%M"`
/opt/local/bin/wget http://192.168.10.7/sendirsignl1 -O -
sleep 5
/opt/local/bin/wget http://192.168.10.7/takepicture -O "${DIR}${DATE}.jpg"
rm "${DIR}newest.jpg"
ln -s "${DIR}${DATE}.jpg" "${DIR}newest.jpg"
/opt/local/bin/wget http://192.168.10.7/sendirsignl0 -O -
```

## スクリプトを定期的に実行するための設定ファイル

スクリプトを自分で実行してみて問題なければ、これを定期的に実行するための設定ファイルを書きます。Mac OS X では、定期的に実行したいジョブは特別な XML 形式(plist)で設定ファイルを書いて launchctl に読み込ませ、launchd に実行させます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
 <key>Label</key>
   <string>jp.digitalmuseum.FungusCamera</string>
 <key>ProgramArguments</key>
   <array>
     <string>/Volumes/MyBook/Documents/Scripts/photo-fungus.sh</string>
   </array>
 <!--
 <key>StartCalendarInterval</key>
   <dict>
     <key>Minute</key>
       <integer>0</integer>
   </dict>
 -->
 <key>StartInterval</key>
   <integer>3600</integer>
 <key>RunAtLoad</key>
   <true/>
 <key>ExitTimeout</key>
   <integer>300</integer>
</dict>
</plist>
```

Label には他と被らない適当な文字列を指定し、ProgramArguments に先ほど作成したシェルスクリプトのフルパスを指定します。このスクリプトが実行される際は、/opt/local/bin にパスが通っていないため、前出のスクリプト内では wget をフルパスで指定していました。StartInterval には実行間隔を秒単位で書きます。StartCalendarInterval は、指定した時間(Hour)や分(Minute)に実行させたいとき、StartInterval の代わりに指定します。ExitTimeout で指定した時間内にジョブが終了しなければ、ジョブは強制的に kill されます。

## 設定の確認

ここまでの準備ができたら設定を読み込ませて正しく動作するか確認します。

```bash
launchctl load jp.digitalmuseum.FungusCamera.plist
ps aux | grep fungusCamera.sh
launchctl list -x jp.digitalmuseum.FungusCamera
ls /Users/arc/Pictures/Visionsketch/Fungus/
```

launchctl load で plist を読み込ませ、定期的に実行するようにします。

なお、plist で RunAtLoad を true にしておくと load 時にタスクが実行されます。これにより、本当にカメラから画像が読み込まれるかすぐに確認できます。launchtl load してから即座に ps aux でプロセス一覧を表示すると、その中に fungusCamera.sh を実行しているプロセスがあることが分かるはずです。

launchctl が読み込んだ内容は launchctl list で確認できます。-x オプションをつけると XML 形式で見ることができます。

最後に、ls で画像ファイルがちゃんと生成されているかも見ておきましょう。
