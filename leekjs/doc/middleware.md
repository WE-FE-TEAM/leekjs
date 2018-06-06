# 中间件

框架支持 `koa@v2` 格式的 `middleware`，也允许用户在 `lib/middleware/` 目录，提供自己的中间件。


## systemConfig.coreMiddleware

系统默认的核心middleware，包括

* koa-bodyparser  [https://github.com/koajs/bodyparser](https://github.com/koajs/bodyparser)
* koa-static  [https://github.com/koajs/static](https://github.com/koajs/static)


### 辅助

* koa-mount  [https://github.com/koajs/mount](https://github.com/koajs/mount)
*
