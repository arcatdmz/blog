---
title: Next.js + MDX + SSG で今風のブログ実装
date: "2021-03-22"
lastmod: "2021-03-27"
tags:
  - programming
  - server
summary: >-
  これまで WordPress を使っていたのですが、デザインが古いまま（Bootstrapテーマ）で、ポートフォリオサイトのSemantic
  UIにマッチしたテーマがなかなか見つからず、動作もそんなに軽くないということで移行先を探していました。仕事で普段から使っている Next.js
  が目的に使えそうということで、思い切って移行、改装しました。
summary_generated: >-
  これまで WordPress を使っていたのですが、デザインが古いまま（Bootstrap テーマ）で、ポートフォリオサイトの Semantic UI
  にマッチしたテーマがなかなか見つからず、動作もそんなに軽くないということで移行先を探していました。仕事で普段から使っている...
---

[これまで WordPress を使っていた](http://junkato.jp/ja/blog)のですが、デザインが古いまま（Bootstrap テーマ）で、ポートフォリオサイトの Semantic UI にマッチしたテーマがなかなか見つからず、動作もそんなに軽くないということで移行先を探していました。

仕事で普段から使っている Next.js が目的に使えそうということで、思い切って移行、改装しました。その記録を書いておこうと思います。

---

## 問題意識

これまでのブログは WordPress ベースで、 [2012 年に Bootstrap を使ったテーマを自作](https://blog.junkato.jp/ja/posts/2012-10-30-hello-world/)していました。これはポートフォリオサイトのデザインに合わせていたのですが、ポートフォリオサイトのほうは 2018 年の初頭に改装を行い、 Bootstrap でなく Semantic UI を使うようになっていました。これにキャッチアップするには、新しく Semantic UI ベースのテーマを作るか、まったく新しいブログを作ってそちらのデザインを Semantic UI ベースで調整するか、の 2 択になります。

もちろん、ブログとポートフォリオサイトは別物と捉えて、まったく別のデザインにしてもいいのですが、[その昔、はてなダイアリーを使っていた頃](https://web.archive.org/web/20140218233235/http://d.hatena.ne.jp/arc_at_dmz/)ですら、[当時の主サイト](https://digitalmuseum.jp/)のデザインに合わせて CSS をがんばってカスタマイズしたりしていたので、そこのこだわりは捨てきれませんでした。（と言いつつ 2 択のどちらにするか決心がつかないまま 3 年が経っていたわけですが…。）

### WordPress の新テーマを作る？

WordPress はシステムとしてはさすがによくメンテされていて、執筆体験も悪くありませんでした。ただ、素のままで使っていると動作が重かったり SSL 対応が微妙だったりでプラグインの利用が前提になっています。プラグインが WordPress 本体の更新に追従できていなかったり、更新のたびに互換性をチェックする必要があったりするのが地味に手間でした。

また、ちょっと見た目に凝ろうとするとけっきょく HTML を書かないといけなくて、その部分は WordPress のテーマに依存するので、テーマを切り替えるときに手動で HTML を更新する必要があります。

そもそも今後またポートフォリオサイトを改装するかもしれず、そのときは Semantic UI ではない CSS フレームワークを使うかもしれませんので、ブログも同様にテーマ開発をしてキャッチアップする必要が出てきます。

2012 年にブログを設置してから 9 年もテーマをいじる気になれなかったことも考えると、WordPress のままでいくのは辛い気持ちになりました。

### 新しいブログを作る

新しいブログを作る上での機能要件は以下のとおりでした。

1. WordPress から記事データを移行できる（そのうち古いブログは閉じたい）
2. データ構造がシンプルで、記事の執筆体験がよく、手軽に更新できる（Markdown かそれに準ずるものがよさそう）
3. 動作が軽い（できれば各記事が単なる HTML/CSS/JS の静的ページになっていてほしい）
4. 見た目などのカスタマイズが容易にでき、コントロールしやすい

<figure class="right">
  <a href="https://github.com/lonekorean/wordpress-export-to-markdown"><img src="https://user-images.githubusercontent.com/1245573/72686026-3aa04280-3abe-11ea-92c1-d756a24657dd.gif" alt="" /></a>
  <figcaption>wordpress-export-to-markdown</figcaption>
</figure>

ちょっと調べたところ、 WordPress の記事データを XML でエクスポートしたものを Markdown に変換できるツール「[wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown)」があり、精度も悪くなさそうだったので、 Markdown で書いた記事を <abbr title="Static Site Generation">SSG</abbr> で静的なページとして書き出す方針が決まりました。

このツールの説明には

> A script that converts a WordPress export XML file into Markdown files suitable for a static site generator (Gatsby, Hugo, Jekyll, etc.).

と書いてあり、紹介されている [Gatsby](https://www.gatsbyjs.org/) は[ほんの少し触ったことがあった](https://github.com/WISSOrg/web2019)のですが、必要以上に複雑に思えてあまりいい印象がありませんでした。

一方、 Next.js で Web サイトを開発して <abbr title="Static Site Generation">SSG</abbr> で書き出して単純な HTTP サーバでホストするというアプローチ自体は [TextAlive](https://junkato.jp/ja/textalive) の一部のサイトや [Arch Research の Web サイト](https://research.archinc.jp)ですでに使っていました。

また、 [Next.js を作った人](https://twitter.com/rauchg) が Markdown で React コンポーネントを書ける拡張書式 [MDX](https://mdxjs.com) を提案しており、 Next.js + MDX の相性がよさそうなのは知っていました。

そこで、 Next.js + MDX + SSG のアプローチでデザインを 1 から起こし、ブログを書けないかと思って探したところ、それらしいものを見つけました。いけそうですね。

https://twitter.com/arcatdmz/status/1372634105448255488

## 前例

最近だと同様のアプローチ（Next.js + MDX + SSG ブログ）を取る人はわりといるみたいです。 [@katryo](https://www.ryokato.com) さんも。

https://twitter.com/katryo/status/1372636218211459077

検索してもけっこういっぱい出てきます。

https://www.google.com/search?q=nextjs+mdx+%E3%83%96%E3%83%AD%E3%82%B0

- [Next.js + MDX でブログを作った](https://titanicrising.jp/blog/nextjs-mdx) - [titanicrising.jp](https://titanicrising.jp)
- [Next.js + MDX でブログを作る ～ Blanktar の場合 - Blanktar](https://blanktar.jp/blog/2020/05/how-to-make-blog-with-nextjs) - [blanktar.jp](https://blanktar.jp)
- [next.js で自分のブログを作る](https://mizchi.dev/slides/develop-mizchi-dev) - [mizchi.dev](https://mizchi.dev)
- [Next.js + MDX + TypeScript でブログを作った – kimizuy blog](https://blog.kimizuy.dev/posts/build-a-blog-with-next-mdx-ts) - [blog.kimizuy.dev](https://blog.kimizuy.dev)

## 実装

### 実装の概要

<figure class="right">
  <a href="https://github.com/timlrx/tailwind-nextjs-starter-blog"><img src="https://github.com/timlrx/tailwind-nextjs-starter-blog/raw/master/public/static/images/twitter-card.png" alt="" /></a>
  <figcaption>timlrx/tailwind-nextjs-starter-blog</figcaption>
</figure>

このブログのソースコードは https://github.com/arcatdmz/blog に置いてあります。 `main` ブランチに `push` されるたび [GitHub Actions](https://github.com/arcatdmz/blog/blob/main/.github/workflows/publish.yml) が走って、ブログ全体がビルドされ、 `rsync` でデータがサーバにアップロードされるようになっています。

基本的には [@katryo さんに教えてもらった](https://twitter.com/katryo/status/1372636218211459077?ref_src=twsrc%5Etfw) [Tailwind Nextjs Starter Blog
](https://github.com/timlrx/tailwind-nextjs-starter-blog) を眺めながらコードを書いていきました。大まかな違いは以下のとおりです。

- [Tailwind](https://tailwindcss.com) の代わりに Semantic UI ([semantic-ui-react](https://github.com/Semantic-Org/Semantic-UI-React)) を使う
- [TypeScript](https://www.typescriptlang.org) しか書きたくない
- [ESLint](https://eslint.org) 入れるほどじゃない
- [reading-time](https://github.com/ngryman/reading-time) とかは要らない
- 多言語対応が必須（日本語と英語のブログを同じドメインで運用したい）
- Twitter のツイート URL を書くだけで埋め込んでほしい
- モリサワ Web フォントや Google Analytics を使いたい

[website.json](https://github.com/arcatdmz/blog/blob/main/website.json) という JSON ファイルでサイト全体に関する情報を定義することにしました。

```json:website.json
{
  "rootPath": "/",
  "imageRoot": "https://blog.junkato.jp/images/",
  "maxPosts": 5,
  "languages": {
    "default": {
      "bannerUrl": null,
      "siteUrl": "https://blog.junkato.jp/",
      "sitePath": "/",
      "locale": "en-US",
      "title": "People are Programmers",
      "author": "Jun Kato",
      "authorUrl": "https://junkato.jp/",
      "email": "i@junkato.jp",
      "description": "Dr. Jun Kato's blog on creativity support and programming experience."
    },
    "ja": {
      "bannerUrl": null,
      "siteUrl": "https://blog.junkato.jp/ja/",
      "sitePath": "/ja/",
      "locale": "ja-JP",
      "title": "People are Programmers",
      "author": "加藤 淳",
      "authorUrl": "https://junkato.jp/ja/",
      "email": "i@junkato.jp",
      "description": "創作支援、プログラミング体験、そのほか研究開発のことをいろいろ書くブログです。"
    }
  }
}
```

### 多言語対応

もともと自分のポートフォリオサイトが `/{page}` に英語版、 `/ja/{page}` に日本語版を置くような構成にしていたので、ブログもこれに倣うことにしました。

`pages/[language]` というディレクトリを作り、 [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) で各 `language` のページが生成されるようにしています。（今は `ja` しかありませんがその気になればドイツ語版 `de` とかも作れます…！）

```tsx:index.tsx
const getStaticPaths: GetStaticPaths = async () => {
  const languages = Object.keys(websiteJson.languages).filter(
    language => language !== "default"
  );
  return {
    paths: languages.map(language => ({
      params: {
        language
      }
    })),
    fallback: false
  };
};
```

ブログ記事のデータは、デフォルト言語である英語を `src/default` 以下に、他の言語については `src/[language]` （例: `src/ja`）に置くことにしました。

こうして `NextPage` に渡した `language` パラメタをもとに React Context が作られ、子コンポーネントに継承されます。コンテキストの定義は [lib/BlogContext.ts](https://github.com/arcatdmz/blog/blob/main/lib/BlogContext.ts) にあります。

なお、最低限のコンテキスト情報は [pages/\_app.tsx](https://github.com/arcatdmz/blog/blob/main/pages/_app.tsx#L19-L27) で渡していて、英語のページはこれを参照しています。他の言語は `pages/[language]` 以下の各ページでコンテキストを上書きして渡しています。例えば次のようになっています。

```tsx:index.tsx
<BlogContext.Provider
  value={{
    ...currentContext,
    language,
    ...websiteJson.languages[language]
  }}
>
  <IndexPosts posts={filteredPosts} />
</BlogContext.Provider>
```

### remark-oembed によるコンテンツ埋め込み

ツイートや YouTube の動画プレイヤーなどの埋め込みには [oEmbed](https://oembed.com) という仕組みを利用しています。これは Twitter や YouTube などのサービス運営側が実装する API 仕様で、各サービスの oEmbed 用エンドポイントにコンテンツの URL（ツイートや YouTube 動画の URL）をリクエストすると HTML タグを返すというものです。便利ですね。

この oEmbed を使って Markdown で空行にはさまれた対応 URL を HTML タグに変換する [remark](https://remark.js.org/) 用プラグイン [remark-oembed](https://github.com/sergioramos/remark-oembed) を [lib/mdx.ts](https://github.com/arcatdmz/blog/blob/main/lib/mdx.ts#L41-L46) で読み込んでいます。

```typescript:mdx.ts
const mdxSource = await renderToString(content, {
  components: MDXComponents,
  mdxOptions: {
    remarkPlugins: [
      require("remark-slug"),
      require("remark-autolink-headings"),
      require("remark-code-titles"),
      [require("remark-oembed"), { syncWidget: true }]
    ],
    rehypePlugins: [require("@mapbox/rehype-prism")]
  }
});
```

### TypeSquare フォントを使う

さくらインターネットのレンタルサーバを使っていると[モリサワの Web フォント 33 書体](https://www.sakura.ne.jp/function/webfont)を無料で使えます。

[さくらインターネットのヘルプドキュメント](https://help.sakura.ad.jp/360000223501/)で指定されているスクリプトタグ `<script type="text/javascript" src="//webfonts.sakura.ne.jp/js/sakurav3.js"></script>` を挿入することで、ページロード時に読み込みが必要な Web フォントのサブセットが自動的に読み込まれる仕組みになっています。

ただ、Next.js ではサイト内ページ遷移が内部的な JSON データの Ajax 読み込みと React コンポーネントの書き換えによって行われ、実際にはページロードが発生しません。そのため、ユーザが初めにアクセスしたページに存在しない文字に関しては Web フォントが読み込まれず、見た目が崩れます。

これに対処するには Next.js の `next/router` のイベント `routeChangeComplete` をリッスンして、ページ遷移が発生するたびに強制的に Web フォントの読み込みプロセスを呼び出してやります。

上記のスクリプトはさくらインターネット専用のように見えますが、内部的にはモリサワが用意している [TypeSquare API](https://typesquare.com/service/api_reference) とほぼ同一のようです。そこで、 [lib/useTypeSquareJS.ts](https://github.com/arcatdmz/blog/blob/main/lib/useTypeSquareJS.ts) に次のような React hook を書いてあげて、 [pages/\_app.tsx](https://github.com/arcatdmz/blog/blob/main/pages/_app.tsx#L15) で読み込んでいます。

ちなみに、Google Analytics もまったく同じように（[lib/useGoogleAnalytics.ts](https://github.com/arcatdmz/blog/blob/main/lib/useGoogleAnalytics.ts)）設定しています。

```typescript:useTypeSquareJS.ts
import Router from "next/router";
import { useEffect } from "react";

export function useTypeSquareJS() {
  useEffect(() => {
    if (typeof window === "undefined" || !Router?.events) {
      return;
    }
    const onComplete = () => {
      // Re-validate web fonts
      if (
        typeof window["TypeSquareJS"] &&
        ["localhost", "127.0.0.1"].indexOf(location.hostname.toLowerCase()) < 0
      ) {
        const TypeSquareJS = window["TypeSquareJS"];
        TypeSquareJS.loadFont && TypeSquareJS.loadFont();
      }
    };
    Router.events.on("routeChangeComplete", onComplete);
    return () => {
      Router.events.off("routeChangeComplete", onComplete);
    };
  }, [Router.events]);
}
```

### 変換した記事データの調整

理想をいえば [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) で変換した Markdown がそのまままったく問題なく動けばよかったのですが、いくつか問題が発生しました。

#### 記事の概要がない

[記事の一覧ページ](https://blog.junkato.jp/ja)では、記事の全文ではなく概要を表示するようにしています。ところが、変換した Markdown には概要データがありませんでした。

そこで、Markdown の冒頭からある程度の長さをいい具合に切り出して概要扱いするようにしました。具体的には以下のような流れになっています。

1. [scripts/add-summary.mjs](https://github.com/arcatdmz/blog/blob/main/scripts/add-summary.mjs) で概要を切り出し、 Markdown の Front Matter に `summary_generated` フィールドを作成する
2. [記事一覧を表示するロジック](https://github.com/arcatdmz/blog/blob/main/components/ListItem.tsx#L21)で `summary` がなければ `summary_generated` を使うようにする

```typescript:ListItem.tsx
const body = summary || summary_generated;
```

#### 日付がずれる

変換元の WordPress で `{yyyy}/{mm}/{dd}/{slug}` というパスにあった記事が `{yyyy}-{mm}-{dd - 1}-{slug}.md` のように一日前の日付のファイル名で保存されてしまうケースが数十件ありました。中身の Front Matter の `date` フィールドも同様に一日前になっていました。

おそらく、タイムゾーンの計算を間違っているか、そもそもしていないことに起因するものと思われます。

真面目に issue 化したり <abbr title="Pull Request">PR</abbr> を書くほどの時間は取れなさそうだったので、古いブログに HTTP GET リクエストを送って見つからなかったら一日前後の日付で試すという乱暴なスクリプト（[scripts/check-old-articles.mjs](https://github.com/arcatdmz/blog/blob/main/scripts/check-old-articles.mjs)）と、その結果をもとにファイルをリネームするスクリプト（[scripts/rename-old-articles.mjs](https://github.com/arcatdmz/blog/blob/main/scripts/rename-old-articles.mjs)）、`date` フィールドをアップデートするスクリプト（[scripts/update-dates.mjs](https://github.com/arcatdmz/blog/blob/main/scripts/update-dates.mjs)）を書いて対処しました。

このあたりが移行作業でいちばん辛かった気がします。

## まとめ

まとめると

- Next.js + MDX + TypeScript を使い、先行事例を参考にブログを作った
- 多言語対応して日本語と英語のブログを同じドメインで運用できるようにした
- Twitter、YouTube、Instagram などのコンテンツ URL を空行ではさむだけで埋め込めるようにした
- モリサワ Web フォントや Google Analytics を使えるようにした

といったような内容でした。

2012 年にブログ開設してから 10 年近く経っていて、さすがに移行は一筋縄ではいきませんでした。ただ、なかなか歯ごたえがあって楽しめました。

これでもう少し頻繁に記事を書くようになればよいのですが。

とりあえず、予告していた記事に取りかかろうと思います。

https://twitter.com/arcatdmz/status/1373535380117450752
