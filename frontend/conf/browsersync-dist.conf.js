const conf = require('./gulp.conf');
const proxyMiddleware = require('http-proxy-middleware');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.dist
      ]
    },
    // middleware: proxyMiddleware(['/todos'], {
    //   target: 'https://GATEWAYID.execute-api.eu-central-1.amazonaws.com',
    //   pathRewrite: {'^/': '/Prod/'},
    //   changeOrigin: true
    // }),
    open: false
  };
};
