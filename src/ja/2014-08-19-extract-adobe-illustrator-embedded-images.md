---
title: Adobe Illustratorのaiファイルに埋め込まれた画像を抽出する
date: "2014-08-19"
tags:
  - design
coverImage: adobe-illustrator-link-panel.png
summary_generated: >-
  Adobe Illustratorに埋め込まれた画像ai ファイルに貼り付けた画像がいつの間にか移動していて、ai
  ファイルがちゃんと開けなくなっている…そんな悲劇を避けるために、画像を「埋め込む」ことがあります。さらに、一度埋め込んだファイルを PowerPoint
  スラ...
altUrl: >-
  https://junkato.jp/ja/blog/2014/08/19/extract-adobe-illustrator-embedded-images
---

<figure className="center">
  <a href="/images/adobe-illustrator-embedded.png"><img src="/images/adobe-illustrator-embedded.png" alt="" /></a>
  <figcaption>Adobe Illustratorに埋め込まれた画像</figcaption>
</figure>

ai ファイルに貼り付けた画像がいつの間にか移動していて、ai ファイルがちゃんと開けなくなっている…そんな悲劇を避けるために、画像を「埋め込む」ことがあります。さらに、一度埋め込んだファイルを PowerPoint スライドで使いまわしたい等の理由でなるべく綺麗に取り出したいことがあります。

Illustrator のヘルプにはそのものずばり「[Illustrator ヘルプ / 画像の埋め込み解除](http://helpx.adobe.com/jp/illustrator/using/unembed-images.html)」という項目があるんですが、対象とされている Adobe Illustrator CS6 では「埋め込みを解除」というボタンが現れません。（代わりに、主要なボタンがグレーアウトした上図のような画面になります。）

試しに[Google 検索](https://www.google.co.jp/webhp#q=extract+embed+images+illustrator)してみると、大量に困っている人がいるようです。そこで、ai ファイルに埋め込まれた画像を簡単に取り出す方法を調べました。

<figure className="right">
  <a href="/images/adobe-illustrator-link-panel.png"><img src="/images/adobe-illustrator-link-panel-300x193.png" alt="" /></a>
  <figcaption>Adobe Illustratorの「リンク」パネル（右側に印がついている項目は埋め込まれている。ついていない項目は外部ファイルへのリンク。）</figcaption>
</figure>

## プラグインを使う

[NAVER まとめ](http://matome.naver.jp/odai/2134041603599834901)によると、Illustrator 8-CS4 用のプラグイン「[Replace Raster](http://www.chiri.com/freeplugin_replaceraster.htm)」を利用すると、埋め込まれた画像が指定した解像度で書き出され、埋め込みが解除されてリンクに戻るようです。最近のバージョンは動作対象外のようですが、CS5.5 でも動作したとのこと。

ただし、画像を一度ラスタライズし直しているようで、元と同じ画質は期待できません。

## SVG ファイルとして「別名で保存」する

日本語で探してもあまり情報がなかったので英語に範囲を広げたところ、[Extract/Export embedded images out of Illustrator](http://www.andrewbrettwatson.com/index.php/86-design/166-extract-export-embedded-images-out-of-illustrator)というブログ記事がとても簡単な方法を紹介していました。（リンク先の 1: the SVG method）ほとんどの場合はこの方法で問題ないと思います。

<figure className="right">
  <a href="/images/adobe-illustrator-svg-options.png"><img src="/images/adobe-illustrator-svg-options-300x242.png" alt="" /></a>
  <figcaption>SVGファイルの保存オプション</figcaption>
</figure>

日本語版だと次のような流れです。

1. 画像を吸い出したい ai ファイルを「開く」
2. メニューの「ファイル」→「別名で保存」→ ファイルの種類: SVG (\*.SVG)を選んで「保存」
3. 「SVG オプション」ウィンドウで参考方法:「リンク」を選択
4. 「OK」

これで、SVG ファイルの保存先と同じフォルダに画像ファイルが書き出されます。（なお、参考方法を「埋め込み」のままにすると、画像データが SVG ファイル内に埋め込まれてしまいます。）

ファイル名は埋め込んだときのものから勝手に変えられてしまっていますが、ともかくこれですべての画像を収集できるので便利です。

<figure className="center" style={{ clear: "both" }}>
  <a href="/images/adobe-illustrator-exported-images.png"><img src="/images/adobe-illustrator-exported-images.png" alt="" /></a>
  <figcaption>Adobe Illustratorから書き出されたSVG+画像ファイル</figcaption>
</figure>
