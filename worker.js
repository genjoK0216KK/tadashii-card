// ただしいカード：静的ファイルに無いURLだけ、ここに来る（ふつうのページは素通り）。
// 「/」→ index.html を出す。「/article1」のような .html なしは「/article1.html」へ301で転送する。
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    }
    if (!url.pathname.endsWith("/") && !url.pathname.includes(".")) {
      const target = new URL(url);
      target.pathname = url.pathname + ".html";
      const head = await env.ASSETS.fetch(new Request(target, { method: "HEAD" }));
      if (head.ok) return Response.redirect(target.toString(), 301);
    }
    return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  },
};
