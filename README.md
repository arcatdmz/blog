# blog.junkato.jp

[![publish](https://github.com/arcatdmz/blog/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/arcatdmz/blog/actions/workflows/publish.yml)

## Directory structure

- `src/`: blog articles
  - `default/`: English articles
  - `ja/`: Japanese articles
- `public/`: resource files
  - `images/`: images used in blog articles

## Production build

```sh
$ npm ci --no-optional
$ npm run download
$ npm run build
$ npm run export
$ npx http-server out
```

## Debug build

```sh
$ npm i
$ npm run dev
```

## See also

- [arcatdmz/arcatdmz.github.io](https://github.com/arcatdmz/arcatdmz.github.io): junkato.jp source code

---

https://github.com/arcatdmz/blog
