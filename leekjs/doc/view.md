# 模板渲染

模板渲染，是放在 `leek_views` 这个 **插件** 里实现的基本功能，用户要使用各个不同的模板引擎，必须自己提供
渲染类，实现 `leek_views/core/ViewEngine` 里的方法，并通过配置文件，注册到 `leek_views/core/ViewManager`
上


## 模板配置

```javascript
// 在配置文件中，通过 view 来指定模板的配置项
config.view = {

    //模板文件的默认后缀，如果省略后缀，会使用这个来查找模板引擎
    defaultExtension: '.nj',

    //要注册的模板引擎列表
    engines: [
        {
            name: 'nunjucks',
            engine: require('leek-view-nunjucks'),
            options: {
                //模板文件的根目录，必须是绝对路径
                rootDir: '/some/absolute/path/to/view/dir',
            }
        },
        {
            name: 'swig',
            engine: require('leek-view-swig'),
            options: {
                //模板文件的根目录，必须是绝对路径
                rootDir: '/some/absolute/path/to/view/dir',
            }
        }
    ],

    //单独把每个模板引擎，对应的配置抽出来，避免放在 engines 数组中，每次都需要全部指定
    //上面 engines 数组中，也可以指定配置，会覆盖掉这里的配置
    engineOptions: {

        nunjucks: {
            //允许应用层传入一个函数，修改 env
            customFunction: null
        },

        swig: {

        }
    },

    //模板文件后缀，对应的引擎 name
    mapping: {
        '.nj': 'nunjucks',
        '.tpl': 'swig'
    }
};
```


