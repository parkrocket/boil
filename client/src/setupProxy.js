const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //target: "http://175.125.95.182:4000",
      target: "http://localhost:4000",
      changeOrigin: true,
    })
  );
};
