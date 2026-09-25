# blog.junkato.jp

[![publish](https://github.com/arcatdmz/blog/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/arcatdmz/blog/actions/workflows/publish.yml)

## Directory structure

- `src/`: blog articles
  - `default/`: English articles
  - `ja/`: Japanese articles
- `public/`: resource files
  - `images/`: images used in blog articles

## Write in a browser

[Pages CMS](https://app.pagescms.org/) edits Markdown and images in this GitHub
repository. A repository owner must sign in with GitHub and install the Pages CMS
GitHub App for **only** `arcatdmz/blog`. The editor reads the configuration in
[`.pages.yml`](.pages.yml). No editor runs on the rental server.

1. Open `arcatdmz/blog` in Pages CMS and choose **English posts** or **Japanese
   posts**. Create a post or open an ordinary Markdown post. The body editor has
   Editor and Source modes for Markdown preview and editing.
2. Set the title and date, then check the filename when creating a post. Keep
   the `YYYY-MM-DD-ascii-slug.md` pattern; the filename determines the public
   URL. The `date` field should match its date prefix. Add tags and an optional
   summary or cover image as needed.
3. Upload images in the body editor or Media library. They are committed under
   `public/images` and inserted in Markdown as `/images/filename`. The cover
   image picker also accepts these images. Existing cover-image filenames are
   still supported.
4. New posts start with **Draft** enabled. Saving commits them to GitHub and
   triggers the existing build. Drafts are absent from article lists but their
   URLs work, and the [public repository](https://github.com/arcatdmz/blog)
   exposes their source and history. Turn **Draft** off and save to publish the
   post in the lists. Check the [publish workflow](https://github.com/arcatdmz/blog/actions/workflows/publish.yml)
   if a change does not appear on the site.

For posts containing hand-written HTML, figures, or embeds, use **English posts
(source)** or **Japanese posts (source)**. These edit the whole Markdown file
without rich-text conversion; preserve the YAML frontmatter when editing. The
source collections are for edits to existing files, while the regular
collections create new posts. Changes made in the CMS and in a local checkout
share the same Git history.

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
