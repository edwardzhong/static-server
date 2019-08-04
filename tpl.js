const { readFileSync, existsSync, statSync } = require('fs')

/**
 * simple template engine
 */
module.exports = opt => {
    const config = Object.assign({ path: '/' }, opt);
    return async (ctx, next) => {
        ctx.render = fileName => {
            ctx.type = 'text/html; charset=utf-8';
            try {
                const path = config.path + '/' + fileName;
                if (existsSync(path) && statSync(path).isFile()) {
                    ctx.body = readFileSync(path);
                } else {
                    const msg = 'template file not exist : ' + fileName;
                    ctx.status = 404;
                    ctx.throw(404, msg);
                }
            } catch (err) {
                ctx.status = 404;
                if (ctx.app.env === 'development') {
                    ctx.body = err.message;
                } else {
                    ctx.throw(404, err.message);
                }
            }
        };
        await next();//注意要加上 await
    };
};