# 配置

`leekjs`的应用中，`config` 分为 `systemConfig` 和 `moduleConfig`


## systemConfig 系统配置

系统配置会影响到系统的启动和执行流程，决定启用那些plugin、plugin的加载顺序、middleware的加载顺序等等


## moduleConfig  业务模块配置

业务模块配置，只是在运行时，处理http请求过程中，配置各个模块下controller的policy，或者提供一些配置数据，方便在controller中
使用

