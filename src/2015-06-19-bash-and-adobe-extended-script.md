---
title: "久しぶりにシェルスクリプト・Adobe ExtendedScript"
date: "2015-06-19"
tags: 
  - "life"
  - "programming"
coverImage: "DSC00698.jpg"
---

最近書いたものをメモがてら。

- bashで行ごとに処理
- Gitのログを整形して出力
- フォルダ内のデジタル一眼RAWを全部現像

[![日々](/images/DSC00698-1024x682.jpg)](http://junkato.jp/ja/blog/wp-content/uploads/2015/06/DSC00698.jpg) 

## bashで行ごとに処理

さくらインターネットのレンタルサーバで、メーリングリストにメンバーをたくさん追加したかった。

\[code language="bash"\]#!/usr/local/bin/bash while read p; do echo $p ~/fml/makefml add2actives chi2015j-ml $p done <users.txt\[/code\]

## Gitのログを整形して出力

開発の進捗をMarkdownの書式でまとめるために、指定した日付以降のGitのコミットログを適当なフォーマットで並べたかった。

\[code language="bash"\]git log --pretty=format:" \* %ad: %s (%h)" --after "2015-04-01" > gitlog.txt\[/code\]

## フォルダ内のデジタル一眼RAWを全部現像

2015-05-で始まる名前のフォルダに入っていて、Photoshopで現像したことのある（現像設定が \*.xmp として保存されている）RAWファイル全てを今一度、指定した解像度でJPEGとして出力したかった。（[出力結果](http://goo.gl/photos/RBzDVXF7g6YT2YNY8)）

\[code language="javascript"\] app.preferences.rulerUnits = Units.PIXELS; app.preferences.typeUnits = TypeUnits.PIXELS; app.displayDialogs = DialogModes.NO;

var rootFolder = new Folder("D:\\\\Users\\\\arc\\\\Pictures"); var inputFolders = rootFolder.getFiles("2015-05-??"); for (var f = 0; f < inputFolders.length; f ++) { $.writeln(inputFolders\[f\].fullName); developFolder(inputFolders\[f\]); }

function developFolder(folder) { var inputFiles = folder.getFiles("\*.xmp"); var jpegOptions = new JPEGSaveOptions(); jpegOptions.embedColorProfile = true; jpegOptions.formatOptions = FormatOptions.STANDARDBASELINE; jpegOptions.matte = MatteType.NONE; jpegOptions.quality = 12;

for (var i = 0; i < inputFiles.length; i ++) { var inputXmpFile = inputFiles\[i\]; $.writeln(inputXmpFile.fullName);

var inputXmpName = inputXmpFile.fullName; var inputFileName = inputXmpName.substr(0, inputXmpName.length - 4) + ".ARW"; var inputFile = new File(inputFileName); var outputFileName = inputFileName.substr(0, inputFileName.length - 4) + "\_developed.jpg"; var outputFile = new File(outputFileName); // Skip if the output file already exists if (outputFile.exists) { continue; }

// Resize if needed var inputDocument = app.open(inputFile); if (inputDocument.width.value > inputDocument.height.value) { if (inputDocument.width.value > 2048) { inputDocument.resizeImage(2048, 2048 \* inputDocument.height.value / inputDocument.width.value); } } else { if (inputDocument.height.value > 2048) { inputDocument.resizeImage(2048 \* inputDocument.width.value / inputDocument.height.value, 2048); } } // Save inputDocument.saveAs(outputFile, jpegOptions, true); inputDocument.close(SaveOptions.DONOTSAVECHANGES); } }\[/code\]
