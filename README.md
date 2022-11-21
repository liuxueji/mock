## 0.初始化项目
`npm init -y`
## 1.启动koa服务器
```
// 引入koa
const koa = require('koa')
// 启动koa
const app = koa()
// 监听8080
app.listen(8080)
```

## 2.配置koa路由
> 路由就是根据不同的URL 地址，加载不同的页面实现不同的功能。
- 安装koa-router
  `npm i koa-router`
- 配置koa-router
  ```
    /*app.js*/
    const Koa = require('koa');
    const router = require('koa-router')(); //注意：引入的方式
    const app = new Koa();
    router.get('/api', function (ctx, next) {
        ctx.body = "Hello koa";
    })
    router.get('/api/news', (ctx, next) => {
        ctx.body = "news"
    });
    app.use(router.routes()); //作用：启动路由
    // router.allowedMethods()中间件，主要用于 405 Method Not Allowed 这个状态码相关；如果不使用，前端发起get请求，而接口时post请求，会返回404，不利于前端调试
    app.use(router.allowedMethods());
    /* 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配
    router.routes()之后,目的在于：根据ctx.status 设置response 响应头
    */
    app.listen(8080, () => {
        console.log('starting at port 8080');
    });
  ```
  > 浏览器输入：http://localhost:8080/api 输出：Hello
  > 浏览器输入：http://localhost:8080/api/news 输出：news

  ## 3.glob工具包
  > ​glob​​​ 是一种文件匹配模式，比如我们常见 ​​*.js​​​ 匹配所有 ​​js​​​ 文件就是使用了 ​​glob​​ 模式
  使用方法：
  > glob(pattern, [options], callback) ， glob 方法接收三个参数：
  > - pattern: 匹配规则字符串
  > - options: 配置项（可选）
  > - callback: 回调函数 (error, files) => {}
  > - error: 错误信息，如果不存在则为成功
  > - matches: 匹配文件数组
  ```
  const glob = require( "glob")
  // ./api/**/*.json 表示找到api文件下的所有以 .json 结尾的文件
  glob("**/*.json", (error, matches) => {
    if(!error) {  
      console.log(matches); // 输出.json 结尾的文件 例：[ './api/news/news1.json', './api/user/uuid1.json' ]
    }
  });
  ```

  ## 4.实现
  ```
  glob("./api/**/*.json", (error, matches) => {
      if (!error) {
          matches.forEach((item, i) => {
              // 将./api/news/news1.json 转为 /news/news1.json
              let apiJsonPath = item && item.split('/api')[1];
              // 将/news/news1.json 转为 /news/news1
              let apiPath = apiJsonPath.replace('.json', '');
              // 通过fs读取文件内容
              console.log(fs.readFileSync(item).toString());
              // 通过文件夹的名称调用对应接口数据，例如：http://localhost:8080/news/news1
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
  ```