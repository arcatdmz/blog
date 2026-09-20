# blog.junkato.jp

[![publish](https://github.com/arcatdmz/blog/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/arcatdmz/blog/actions/workflows/publish.yml)

## Directory structure

- `src/`: blog articles
  - `default/`: English articles
  - `ja/`: Japanese articles
- `public/`: resource files
  - `images/`: images used in blog articles

## Production build

Use Node.js 24 or later (CI uses Node.js 24).

```sh
$ npm ci
$ npm run download
$ npm run build
$ npm run export
$ npx http-server out
```

React and its types stay on version 18 because Semantic UI React does not yet
support React 19. Node types track the Node.js 24 runtime used in CI.

## Debug build

```sh
$ npm i
$ npm run dev
```

## See also

- [arcatdmz/arcatdmz.github.io](https://github.com/arcatdmz/arcatdmz.github.io): junkato.jp source code

---

https://github.com/arcatdmz/blog
