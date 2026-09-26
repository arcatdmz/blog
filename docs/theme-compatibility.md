# テーマの共通仕様と後続サイトへの導入

調査日: 2026-09-26。今回有効にするのは編集室。ブログ本体は既存のライト表示を維持する。

## 共通仕様

- `localStorage["theme"]`: `light` / `dark`。キーがない、または未知の値なら OS に追従。
- UI は「OSに合わせる / ライト / ダーク」。OS に戻すとキーを削除する。
- `<html data-theme="light|dark">` は解決済みの色。`color-scheme` も同じ値。
- 初回描画前に適用し、OS 追従中は `matchMedia` の change を監視する。
  同一 origin の別タブ変更は storage イベントで反映する。
- ストレージ禁止時もページ内の選択は機能する。次回は OS を使う。
- `shared/theme.ts` は React 非依存。UI/イベントの接続例は
  `editor/src/ThemeSelect.tsx`、初期化例は `editor/index.html`。
- 配色は `css/theme.css` の `--blog-*`。暗色パレットは
  `:root[data-theme="dark"]` でのみ有効。編集室固有の状態色は
  `editor/src/tokens.css`。Shadow DOM のプレビューは変数を継承する。

`../anime-aist.vercel.app/app/components/ThemeProvider.tsx` と
`app/layout.tsx` にある保存キー・値・DOM属性と互換。
元サイトの2択に、OSへ戻す選択・OS変更追従・別タブ同期を追加した。

## ブログ本体

Next.js App Router / React 18。`app/layout.tsx` が CSS と
`/stylesheets/main.css` を読み込み、`app/RootLayoutClient.tsx` がクライアント処理を担う。
`public/stylesheets/main.css` はポートフォリオのリリース由来
（ルート `package.json` の `download`）。Semantic UI の固定色も含まれる。

後続実装:

1. `app/layout.tsx` に描画前の初期化を追加する。SSR は OS/ブラウザ保存値を
   読めないので、html属性の hydration 差分を扱い、セレクトの初期表示を合わせる。
2. ヘッダーのクライアントコンポーネントから共通テーマ処理を使う。
3. `css/style.css` の pusher/main、記事キャプション・埋め込み背景・罫線、
   Semantic UI のメニュー・カード・フォーム・見出しを変数化／上書きする。
   暗いフッターやコード強調は既に独立した暗色なので個別に検証する。
4. ポートフォリオの CSS リリースを更新する場合も公開ブログとの組み合わせを確認する。
   写真や埋め込みを一括反転しない。

## ポートフォリオ junkato.jp

[公開ソース](https://github.com/arcatdmz/arcatdmz.github.io) の
`4a406534b5e68c78ad23b5f4671b1e8f8078a844` を読み取り調査した。
Reactではなく Gulp + Pug + TypeScript/Webpack + LESS / Semantic UI。
調査時点の通常ページ共通処理にはテーマ保存・OS配色追従はない。

導入点:

- `src/_layout.pug`: 共通HTMLとhead。初回描画前のテーマ初期化をここに置く。
- `src/_layout-components.pug`: `head` と `header` / `right-header-menu`。
  英日両方の切り替えUIを追加する。
- `src/javascripts/views/library.ts`: jQuery/Semantic UIの共通初期化。
  共通 `theme.ts` を取り込み、セレクトと change/storage リスナーを接続する。
  `views/default.ts` はこの library を遅延ロードするため、初期描画の処理は
  library にだけ置かず head で実行する。
- `src/stylesheets/main.less`: Semantic UI を読み込む。LESS の固定色だけでは
  実行時切り替えができないため、CSS変数と `data-theme` の上書きを追加する。
- `gulpfile.js` の `css` は PurgeCSS を実行する。動的な属性セレクタや
  テーマ用クラスを safelist などで保持し、production CSSでも検証する。
- `src/homehack/_layout.pug` など個別レイアウトは共通テンプレートの対象範囲と
  別に確認する。通常ページだけの変更を全ページ対応とみなさない。

同じ処理を移植できるが、配色ルールの対応は各サイトのUIごとに必要。

## サイト間の保存範囲

共通の選択仕様と、サイト間で選択が自動同期することは別。
localStorage は origin 単位なので `junkato.jp`、`blog.junkato.jp`、編集室の
hostname は保存領域を共有しない。今回も各サイト／ブラウザごとの保存とする。
後日、同じ選択を自動共有したい場合は、編集室の公開hostnameを確定させて
`junkato.jp` 配下の共通Cookie等を設計する必要がある。
`workers.dev` や `vercel.app` との間は親ドメインCookieでも共有できない。
