const koa = require('koa');
const app = new koa();
const static = require('koa-static');
const favicon = require('koa-favicon');
const path = require('path');
const port = 3001;

// set static directiory
app.use(static(path.join(__dirname, 'dist')));
app.use(favicon(path.join(__dirname, 'favicon.jpg')));

//if historyApiFallback mode
// app.use(tpl({
//     path: path.join(__dirname, 'dist')
// }));

// app.use(async (ctx, next) => {
//     if(ctx.href.search('.js')< 0){
//         ctx.render('index.html');
//     }
// });

// deal 404
app.use(async (ctx, next) => {
  ctx.status = 404;
  ctx.body = '404! page not found !';
});

// koa already had middleware to deal with the error, just rigister the error event
app.on('error', (err, ctx) => {
  ctx.status = 500;
  ctx.statusText = 'Internal Server Error';
  if (ctx.app.env === 'development') {
    //throw the error to frontEnd when in the develop mode
    ctx.res.end(err.stack); //finish the response
  } else {
    ctx.body = { code: -1, message: "Server Error" };
  }
});

app.listen(port);
console.log('app server running at: http://localhost:%d', port);
