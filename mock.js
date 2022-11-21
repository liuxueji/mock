const { glob } = require('glob');
const Koa = require('koa');
const router = require('koa-router')(); //注意：引入的方式
const app = new Koa();
const fs = require('fs');

router.get('/api', function (ctx, next) {
    ctx.body = "Hello";
})
router.get('/api/news', (ctx, next) => {
    ctx.body = "news"
});

glob("./api/**/*.json", (error, matches) => {
    if (!error) {
        matches.forEach((item, i) => {
            let apiJsonPath = item && item.split('/api')[1];
            let apiPath = apiJsonPath.replace('.json', '');
            console.log(fs.readFileSync(item).toString());
            router.get(apiPath, (ctx, next) => {
                let jsonStr = fs.readFileSync(item).toString();
                ctx.body = {
                    data: JSON.parse(jsonStr),
                    state: 200,
                    type: 'success'
                }
            });
        })
    }
});
app.use(router.routes()); //作用：启动路由
app.use(router.allowedMethods());
app.listen(8080, () => {
    console.log('starting at port 8080');
});
