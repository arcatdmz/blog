import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve("dist/client");
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html"
};
// Match the Worker's production policy, including the ban on inline scripts.
const csp =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self'; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname
      );
      const file = resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname)
      );
      if (!file.startsWith(root + sep)) {
        response.writeHead(404).end();
        return;
      }
      const body = await readFile(file);
      const extension = file.slice(file.lastIndexOf("."));
      response
        .writeHead(200, {
          "Content-Type": types[extension] || "application/octet-stream",
          "Content-Security-Policy": csp,
          "Cache-Control": "no-store"
        })
        .end(body);
    } catch {
      response.writeHead(404).end();
    }
  })
  .listen(5174, "127.0.0.1");
