---
title: "Adobe Illustratorのaiファイルに埋め込まれた画像を抽出する"
date: "2014-08-19"
tags: 
  - "design"
coverImage: "adobe-illustrator-link-panel.png"
---

\[caption id="attachment\_780" align="aligncenter" width="900"\][![](/images/adobe-illustrator-embedded.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/08/adobe-illustrator-embedded.png) Adobe Illustratorに埋め込まれた画像\[/caption\]

aiファイルに貼り付けた画像がいつの間にか移動していて、aiファイルがちゃんと開けなくなっている…そんな悲劇を避けるために、画像を「埋め込む」ことがあります。さらに、一度埋め込んだファイルをPowerPointスライドで使いまわしたい等の理由でなるべく綺麗に取り出したいことがあります。

Illustratorのヘルプにはそのものずばり「[Illustrator ヘルプ / 画像の埋め込み解除](http://helpx.adobe.com/jp/illustrator/using/unembed-images.html)」という項目があるんですが、対象とされているAdobe Illustrator CS6では「埋め込みを解除」というボタンが現れません。（代わりに、主要なボタンがグレーアウトした上図のような画面になります。）

試しに[Google検索](https://www.google.co.jp/webhp#q=extract+embed+images+illustrator)してみると、大量に困っている人がいるようです。そこで、aiファイルに埋め込まれた画像を簡単に取り出す方法を調べました。

\[caption id="attachment\_781" align="alignright" width="300"\][![](/images/adobe-illustrator-link-panel-300x193.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/08/adobe-illustrator-link-panel.png) Adobe Illustratorの「リンク」パネル（右側に印がついている項目は埋め込まれている。ついていない項目は外部ファイルへのリンク。）\[/caption\]

## プラグインを使う

[NAVERまとめ](http://matome.naver.jp/odai/2134041603599834901)によると、Illustrator 8-CS4用のプラグイン「[Replace Raster](http://www.chiri.com/freeplugin_replaceraster.htm)」を利用すると、埋め込まれた画像が指定した解像度で書き出され、埋め込みが解除されてリンクに戻るようです。最近のバージョンは動作対象外のようですが、CS5.5でも動作したとのこと。

ただし、画像を一度ラスタライズし直しているようで、元と同じ画質は期待できません。

## SVGファイルとして「別名で保存」する

日本語で探してもあまり情報がなかったので英語に範囲を広げたところ、[Extract/Export embedded images out of Illustrator](http://www.andrewbrettwatson.com/index.php/86-design/166-extract-export-embedded-images-out-of-illustrator)というブログ記事がとても簡単な方法を紹介していました。（リンク先の1: the SVG method）ほとんどの場合はこの方法で問題ないと思います。

\[caption id="attachment\_782" align="alignright" width="300"\][![](/images/adobe-illustrator-svg-options-300x242.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/08/adobe-illustrator-svg-options.png) SVGファイルの保存オプション\[/caption\]

日本語版だと次のような流れです。

1. 画像を吸い出したいaiファイルを「開く」
2. メニューの「ファイル」→「別名で保存」→ファイルの種類: SVG (\*.SVG)を選んで「保存」
3. 「SVG オプション」ウィンドウで参考方法:「リンク」を選択
4. 「OK」

これで、SVGファイルの保存先と同じフォルダに画像ファイルが書き出されます。（なお、参考方法を「埋め込み」のままにすると、画像データがSVGファイル内に埋め込まれてしまいます。）

ファイル名は埋め込んだときのものから勝手に変えられてしまっていますが、ともかくこれですべての画像を収集できるので便利です。

\[caption id="attachment\_785" align="aligncenter" width="640"\][![](/images/adobe-illustrator-exported-images.png)](http://junkato.jp/ja/blog/wp-content/uploads/2014/08/adobe-illustrator-exported-images.png) Adobe Illustratorから書き出されたSVG+画像ファイル\[/caption\]
