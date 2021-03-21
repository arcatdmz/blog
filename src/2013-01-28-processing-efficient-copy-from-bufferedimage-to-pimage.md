---
title: "Processingでメモリ消費を抑えてBufferedImageの内容をPImageにコピーする"
date: "2013-01-28"
tags: 
  - "java"
  - "processing"
  - "programming"
---

最近Processing用のライブラリをJavaで実装していて、Java界のBufferedImageを何度もPImageとして渡す必要がありました。最初は素直に次のようなコードを書いていたのですが…

\[java\]void draw() { BufferedImage bufImg = library.getImage(); PImage img = new PImage(bufImg); image(img, 0, 0); }\[/java\]

draw()のなかで何度もこれを呼んでいると、OutOfMemoryExceptionが出るようになってしまいました。PImageのコンストラクタは渡したbufImgをコピーするようになっているため、毎フレーム画素値用の配列が新しく確保されてしまい、Garbage Collectionが追いつかなくなってしまったようです。

そこで、予めPImageオブジェクトを用意しておいて、もらってきたbufImgの画素値をPImageにコピーするように書き換えてみました。

\[java\]PImage img; WritableRaster wr;

void draw() { BufferedImage bufImg = library.getImage(); if (img == null) { img = new PImage(bufImg); DataBufferInt dbi = new DataBufferInt(img.pixels, img.pixels.length); wr = Raster.createWritableRaster(bufImg.getSampleModel(), dbi, new Point(0, 0)); } else { bufImg.copyData(wr); img.updatePixels(); } image(img, 0, 0); }\[/java\]

ポイントは、int型配列への参照をPImageとWritableRasterで共有し、BufferedImageからWritableRasterにデータをコピーするようにしたことです。これは単なるコピー操作(System.arraycopy)であり、new PImageのときのように新しい配列用のメモリが確保されたりしません。最後にimg.updatePixelsでPImageの内部状態を同期させてから、ふつうのPImageのように画面に貼り付けることができます。

途中でBufferedImageの画像のサイズが変わったりする場合は、最初のif文にサイズのチェックも加える必要があるでしょう。また、Processingライブラリの実装としての完成度を上げるなら、BufferedImage型を返すlibrary.getImage()とは別にPImage型を返すlibrary.getPImage()のようなAPIを用意して、その中に処理を隠蔽すればよいと思います。
