---
title: Processingでメモリ消費を抑えてBufferedImageの内容をPImageにコピーする
date: "2013-01-28"
tags:
  - java
  - processing
  - programming
summary_generated: >-
  最近 Processing 用のライブラリを Java で実装していて、Java 界の BufferedImage を何度も PImage
  として渡す必要がありました。最初は素直に次のようなコードを書いていたのですが…void draw() {
    BufferedImag...
altUrl: >-
  https://junkato.jp/ja/blog/2013/01/28/processing-efficient-copy-from-bufferedimage-to-pimage
---

最近 Processing 用のライブラリを Java で実装していて、Java 界の BufferedImage を何度も PImage として渡す必要がありました。最初は素直に次のようなコードを書いていたのですが…

```java
void draw() {
  BufferedImage bufImg = library.getImage();
  PImage img = new PImage(bufImg);
  image(img, 0, 0);
}
```

draw()のなかで何度もこれを呼んでいると、OutOfMemoryException が出るようになってしまいました。PImage のコンストラクタは渡した bufImg をコピーするようになっているため、毎フレーム画素値用の配列が新しく確保されてしまい、Garbage Collection が追いつかなくなってしまったようです。

そこで、予め PImage オブジェクトを用意しておいて、もらってきた bufImg の画素値を PImage にコピーするように書き換えてみました。

```java
PImage img;
WritableRaster wr;

void draw() {
  BufferedImage bufImg = library.getImage();
  if (img == null) {
    img = new PImage(bufImg);
    DataBufferInt dbi = new DataBufferInt(img.pixels, img.pixels.length);
    wr = Raster.createWritableRaster(bufImg.getSampleModel(), dbi, new Point(0, 0));
  } else {
    bufImg.copyData(wr);
    img.updatePixels();
  }
  image(img, 0, 0);
}
```

ポイントは、int 型配列への参照を PImage と WritableRaster で共有し、BufferedImage から WritableRaster にデータをコピーするようにしたことです。これは単なるコピー操作(System.arraycopy)であり、new PImage のときのように新しい配列用のメモリが確保されたりしません。最後に img.updatePixels で PImage の内部状態を同期させてから、ふつうの PImage のように画面に貼り付けることができます。

途中で BufferedImage の画像のサイズが変わったりする場合は、最初の if 文にサイズのチェックも加える必要があるでしょう。また、Processing ライブラリの実装としての完成度を上げるなら、BufferedImage 型を返す library.getImage()とは別に PImage 型を返す library.getPImage()のような API を用意して、その中に処理を隠蔽すればよいと思います。

```

```
