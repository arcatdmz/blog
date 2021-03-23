import fs from "fs";
import https from "https";

import config from "./config.mjs";

const checkUrl = async url => {
  return new Promise(r => {
    setTimeout(() => {
      https
        .request(url, { method: "HEAD" }, res => {
          r(res.statusCode);
        })
        .on("error", _err => {
          r(-1);
        })
        .end();
    }, 300);
  });
};

const readFiles = async ({ dir }) => {
  const files = fs.readdirSync(dir);
  const results = [];
  for (const file of files) {
    const fetched = [];

    // first trial
    const url = file.replace(
      /([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)\.md/,
      "https://junkato.jp/ja/blog/$1/$2/$3/$4/"
    );
    const code1 = await checkUrl(url);
    fetched.push([url, code1]);
    if (code1 === 200 || code1 === 301) {
      results.push({
        file,
        url,
        result: code1
      });
    } else {
      const parsed = /^https:\/\/junkato\.jp\/ja\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/(.+)\/$/.exec(
        url
      );
      const d = new Date(`${parsed[1]}-${parsed[2]}-${parsed[3]}`);

      // second trial
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const url2 = `https://junkato.jp/ja/blog/${String(
        next.getFullYear()
      )}/${String(next.getMonth() + 1).padStart(2, "0")}/${String(
        next.getDate()
      ).padStart(2, "0")}/${parsed[4]}/`;
      const code2 = await checkUrl(url2);
      fetched.push([url2, code2]);

      if (code2 === 200 || code2 === 301) {
        results.push({
          file,
          url: url2,
          result: code2,
          rename: `${String(next.getFullYear())}-${String(
            next.getMonth()
          ).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}-${
            parsed[4]
          }.md`
        });
      } else {
        // third trial
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 1);
        const url3 = `https://junkato.jp/ja/blog/${String(
          prev.getFullYear()
        )}/${String(prev.getMonth() + 1).padStart(2, "0")}/${String(
          prev.getDate()
        ).padStart(2, "0")}/${parsed[4]}/`;
        const code3 = await checkUrl(url3);
        fetched.push([url3, code3]);

        if (code3 === 200 || code3 === 301) {
          results.push({
            file,
            url: url3,
            result: code3,
            rename: `${String(prev.getFullYear())}-${String(
              prev.getMonth()
            ).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}-${
              parsed[4]
            }.md`
          });
        } else {
          // failure
          results.push({
            file,
            url,
            result: code3,
            rename: null
          });
        }
      }
    }

    results[results.length - 1].fetched = fetched;
  }
  fs.writeFileSync("old-articles.json", JSON.stringify(results, null, "  "));
  console.log("Done");
};

Promise.all(config.filter(c => c.language === "ja").map(readFiles));
