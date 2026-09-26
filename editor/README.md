# Blog writing room

An independent React/Vite editor and Cloudflare Worker for `arcatdmz/blog`.
The public blog still builds and publishes through its existing GitHub workflow.
Pages CMS remains available while this editor is being evaluated.

## Try it locally

Use Node.js 24 or later. From this directory:

```sh
npm ci
cp .dev.vars.example .dev.vars
npm run dev
```

Open <http://127.0.0.1:5173>. The read-only demo uses the longest Japanese post
and an English post with image layouts. Its thumbnails are placeholders. Editing,
preview, image preparation, and local recovery work; GitHub saves deliberately fail.
The demo does not need credentials and does not make GitHub requests. It is enabled
only by `LOCAL_DEMO=true` **in a development build on localhost**; production builds
cannot enable it. Keep the development server bound to loopback.

The editor has its own lockfile and dependencies. The parent blog excludes it from
TypeScript compilation. The editor and blog share typography and colors in
`../css/theme.css`. Article preview imports the blog's stylesheet and code
highlighting; no Markdown or image migration is needed.

## Deploy to Cloudflare

1. Run `npm run check` and `npm run build` in this directory.
2. Authenticate Wrangler with `npx wrangler login`. Deploy with `npm run deploy`
   to create the Worker and get its `workers.dev` address. With the default empty
   Access configuration, **every request fails closed**. No repository access is
   possible yet. A custom domain can be added later.
3. Create a Cloudflare Access self-hosted application covering the editor's entire
   hostname (all paths, including `/api/*` and assets). Add an Allow policy for
   **only your email**, using an identity provider or email one-time PIN. If using
   `workers.dev`, enable Access for that Worker hostname. See
   [Workers Access configuration](https://developers.cloudflare.com/workers/configuration/access/)
   and [Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).
4. Set the nonsecret values in `wrangler.jsonc`:
   - `ACCESS_TEAM_DOMAIN`: `https://YOUR-TEAM.cloudflareaccess.com` (no trailing slash).
   - `ACCESS_AUD`: the Access application's Audience (AUD) tag.
   - `ALLOWED_EMAIL`: the same single email allowed by the Access policy.
5. Create a GitHub **fine-grained personal access token** for **only `arcatdmz/blog`**,
   granting **Contents: read and write** (Metadata read is implicit). Store it
   directly in Cloudflare:

   ```sh
   npx wrangler secret put GITHUB_TOKEN
   ```

   Never put the token in the frontend, a `VITE_*` variable, or a tracked file.
   The token must be allowed to write `main`; the editor does not bypass branch
   protection or create pull requests. Rotate the secret when the token expires.

6. Run `npm run deploy` again, sign in at the protected URL, and verify the checks
   below. Version preview URLs are disabled. The Worker independently validates
   JWT signature, issuer, audience, expiry, and owner email even on alternate
   routes, and requires same-origin write requests.

### Automatic deployment with release tags

[Deploy blog editor](../.github/workflows/editor-deploy.yml) deploys the exact
revision tagged `editor-v*` (for example, `editor-v1.0.0`). It installs the locked
dependencies, runs type/unit checks, builds, and runs Chromium/WebKit browser tests
before deploying. Deployments do not run concurrently or cancel an active deploy.
Branch pushes and other tags do not trigger this workflow. The existing blog
publication workflow still runs on pushes to `main`, not on editor tags.

In the GitHub repository, open **Settings → Secrets and variables → Actions**
and add these repository secrets:

- `CLOUDFLARE_API_TOKEN`: a Cloudflare API token using the **Edit Cloudflare Workers**
  template, scoped to the account hosting this Worker.
- `CLOUDFLARE_ACCOUNT_ID`: that Cloudflare account's ID.

See [Cloudflare's GitHub Actions setup](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
Your local `wrangler login` does not authenticate GitHub Actions. The existing
Worker secret `GITHUB_TOKEN` remains stored in Cloudflare; do not replace it with
the Actions-provided GitHub token. Access settings come from the tagged
`editor/wrangler.jsonc`.

After committing and pushing the editor and workflow changes, tag the revision
you want to release from the repository root:

```sh
git tag -a editor-v1.0.0 -m "Editor v1.0.0"
git push origin editor-v1.0.0
```

Use a new tag for each release and follow **Actions → Deploy blog editor** for
the result. If you previously enabled Cloudflare Builds for this Worker, disable
its automatic branch builds so that deployments happen only through release tags.

## Daily use

- **English / 日本語** in the header switches the interface, including dialogs and
  preview controls. This preference stays in this browser; it does not change the
  post collection, article content, or undo history.
- Select English/Japanese, search by title or filename, then open a post. New
  posts require a title, date, and ASCII slug. Existing filenames cannot be renamed.
- Write uses a native textarea. Formatting actions insert source at the selection
  and use native undo where supported. Preview is rendered only when opened,
  with blog figure styles; executable embeds become placeholders and links are
  inactive. Switching tabs preserves the textarea and its editing history.
- **Zen mode** beside the article title hides navigation and post details, leaving
  the title, editing controls, and writing area. Save and preview remain available.
  Choose **Exit Zen mode** or press Escape to return; text and undo history are
  preserved. Escape closes an open dialog first and does not exit during IME input.
- Choose **Image layout** at the cursor, or **Edit image layout** in Preview.
  Supported figures include captions with Markdown links/emphasis, linked images,
  shared links, image ordering, floats, size presets, and 2/3/4 columns. Unsupported
  attributes/elements stay unchanged and open in source mode. Cancel/no-change
  Apply preserves the original figure verbatim.
- Post details expose the existing frontmatter fields. Unknown keys and generated
  summaries are preserved; frontmatter source is also editable. Body-only edits
  retain the entire original header byte for byte.
- **Images** supports original JPEG/PNG/WebP/GIF uploads, optional resize/compress,
  cover selection, and insertion. A browser-decodable HEIC or other format can be
  converted to JPEG. If decoding fails, export JPEG/PNG first. Optimizing animated
  GIF/WebP makes a still image; keep the original to preserve animation. Optimizing
  PNG keeps transparency. The limit is 10 MiB per image and 30 media changes per
  save. Post source is limited to 512 KiB.
- Image filenames are safe ASCII names and never overwrite an existing file.
  Deletions show blocking post references and are staged until Save changes.
  Reference checks include both language collections, Markdown links/images,
  HTML URL attributes, and cover images, including legacy bare cover filenames.
- **Save changes** (or Cmd/Ctrl+S) uploads pending blobs and commits the current
  post and all its pending media changes in one branch update. Blobs uploaded
  during an interrupted save are not added to the branch. Retry uses the same
  operation ID to recognize a successful commit whose response was lost.
- The commit link confirms a GitHub save. **Check publication** opens the existing
  build workflow; committed does not mean deployed. Drafts remain publicly readable
  in GitHub/history and at their article URLs, but are absent from article lists.

Recovery is stored in IndexedDB on this browser/device after a short idle period
and when the page is hidden. Text and original pending image bytes survive reloads
and failed requests. **On this device** restores these workspaces. This is local
recovery, not cloud draft synchronization: browser storage can be cleared or evicted,
so use **Export Markdown** for an additional copy. Keep original image files until
their GitHub save succeeds. A cold offline launch is not supported.

If another tool changes the same post, save is rejected and local work stays intact.
**Compare remote** shows both complete sources. Export/copy changes as needed,
then either acknowledge the remote revision while keeping local text, or explicitly
replace local text with GitHub's version. Unrelated changes already on `main` are
preserved. A branch update racing the final save is rejected without a partial
publication; retry reads the new head and rechecks file revisions/references.

## API and implementation

All endpoints require Access authentication. API responses are not publicly cached.
The repository, branch, and editable directories are fixed server-side.

| Operation | Endpoint                  | Purpose                                                                 |
| --------- | ------------------------- | ----------------------------------------------------------------------- |
| GET       | `/api/index`              | Current commit, post paths/revisions, media paths/revisions             |
| GET       | `/api/post?path=…&ref=…`  | Exact source and blob revision; optional commit ref                     |
| GET       | `/api/media?path=…&ref=…` | Image bytes at a commit, including assets not yet deployed              |
| POST      | `/api/references`         | Reference checks incorporating the pending post source                  |
| POST      | `/api/upload?path=…`      | Bounded raw image upload; returns blob SHA and signed receipt           |
| POST      | `/api/save`               | Post expected SHA, signed uploads, expected deletion SHAs, operation ID |
| GET       | `/api/save-status?id=…`   | Find a completed operation among the latest 100 commits                 |

The save operation creates a tree based on the current tree, then a commit whose
parent is the current head, and finally advances `main` with `force: false`.
Only that final operation changes the branch. Upload receipts bind validated
image bytes to their destination; the client cannot substitute arbitrary blob SHAs.
Deletion scans fail closed if any post cannot be inspected. GitHub throttling,
authorization failure, and conflicts return errors without clearing recovery.

Preview uses remark/rehype for GFM, code titles/highlighting, and raw HTML, then
DOMPurify and a shadow root for article styling. Only trusted application code
adds figure-edit buttons and local blob URLs after sanitization. Source HTML cannot
execute scripts, submit forms, or run third-party embeds in the editor.

## Verification

```sh
npm run check
npm run build
npx playwright install --with-deps chromium webkit
# .dev.vars must contain LOCAL_DEMO=true for the local Worker smoke test.
npm run test:browser
```

The browser suite includes desktop Chromium, a tablet-sized Chromium viewport,
and WebKit. Tests use a read-only Worker fixture or intercept repository APIs;
they never commit to the real repository. CI runs these checks separately from
the blog build. Use `BROWSER_EXECUTABLE=/path/to/chromium` when supplying a local
Chromium binary. Test source and image fixtures come from this repository.

Before adoption, check on the **actual iPad Pro**:

1. Open `2024-01-01-hci-research-in-the-wild.md`. Type continuously in Japanese
   and English using both the software and hardware keyboards. Check composition,
   candidate selection, touch selection handles, cursor movement, and scrolling.
2. Select text, apply formatting, undo, switch Preview/Write, and verify the
   keyboard does not obscure the cursor. Rotate between portrait and landscape.
3. Modify each existing figure layout, reorder images, cancel a dialog, and
   verify surrounding Markdown and unsupported HTML are unchanged.
4. Select a photo from Photos/Files, compare original and optimized output,
   insert it, reload, and recover the post and pending image. Temporarily lose
   connectivity or expire the Access session; retry without losing work.
5. In the deployed app, save a deliberately public test draft with a new image.
   Verify one GitHub commit contains both files, the existing workflow completes,
   and the image appears with the post. Exercise a competing GitHub edit and a
   referenced-image deletion. Remove the test assets afterward through the normal
   repository workflow.

Desktop/WebKit automation cannot establish actual iPad typing fluency. Live
Access, GitHub writes, and publication require your deployment and credentials.
