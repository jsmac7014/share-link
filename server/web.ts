import { WebApp } from "meteor/webapp";

function isCrawler(userAgent) {
  return /facebookexternalhit|twitterbot|Slackbot-LinkExpanding|Discordbot|TelegramBot/i.test(
    userAgent || "",
  );
}

WebApp.connectHandlers.use("/dashboard", (req, res, next) => {
  console.log("[Crawler Check] UA:", req.headers["user-agent"]);
  if (isCrawler(req.headers["user-agent"])) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html>
      <head>
        <title>Dashboard</title>
        <meta property="og:title" content="Dashboard" />
        <meta property="og:description" content="Link preview for dashboard" />
      </head>
      <body>
        <h1>Dashboard - Bot View</h1>
      </body>
    </html>`);
  } else {
    next(); // 이걸 꼭 넣어야 일반 유저는 React SPA로 라우팅됩니다.
  }
});
