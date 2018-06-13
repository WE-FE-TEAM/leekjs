# http request 请求

`node`目前在系统分层上，同样处于最前面，经常会在node这一层，调用各种不同的后端服务，对数据进行聚合，处理，然后
吐给前端。

因此，框架默认集成了发送http请求的接口，扩展在 `KoaApplication` 上。

目前使用的是这个库 [urllib](https://github.com/node-modules/urllib)，同样也是 `egg.js` 使用的。


为什么没有选择这个 [request](https://github.com/request/request) 呢？主要是在 `cookie` 处理上，不是很方便。

