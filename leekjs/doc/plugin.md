# 插件

插件是实现某个功能的集合，可能包含了 `config` `extend` `middleware` `service` `policy`

## 启用插件

在具体的`app`里，可以明确配置要启用的插件列表，以及某个插件的位置，是来自 `npm` 包，还是来自某个 目录，插件的配置如下：

```
//比如在 应用 的 `lib/config/plugin.js` 里，内容如下：

module.exports = [
    {
        //表示插件是一个 npm 包
        package: 'leek-view'
    },
    {
        //插件是在某个指定目录内
        path: '/some/absolute/path/to/a/plugin/dir'
    }
];
```




