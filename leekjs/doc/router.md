# router

请求路由，分为两部分：*URL重写* 和 *解析module/controller/action*

先读取 `systemConfig.rewrite`配置，决定是否需要重写URL。然后，根据URL重写之后的URL，来查找对应的module、controller、action

## url重写

系统支持 `url rewrite`，读取  `systemConfig.rewrite` ，匹配当前请求是否需要重写

```javascript

systemConfig.rewrite = [
    {
        match: '/uplan/:id',
        rewrite: '/uplan/info/detail?id=:id'
        //匹配到的字段名，是否覆盖到query里
        overrideQuery: true
    },
    {
        match: /\/user\/(\w+)/,
        rewrite: '/user/home/detail?name=$1',
    }
];

```


`match` 可以是 `string` `RegExp` ：

* 如果是 `string` 格式，可以匹配命名的参数，会默认会写入 `ctx.params` 下面。如果 `overrideQuery !== false`, 会同时把字段覆盖到 `ctx.query` 对象上
* 针对 `RegExp` 格式，可以在 `rewrite` 中通过 `$1` `$2` 这样的格式来获取对应分组内容


## 路由解析

路由解析，负责从 `ctx.rewriteUrl` ，解析出对应的 `module/controller/action`，放在 `ctx.module` `ctx.controller` `ctx.action` 属性

如果 `ctx.rewriteUrl` 不包含 `action` ，则默认调用 `index action`

