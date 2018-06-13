# leek-view-nunjucks

`nunjucks`模板引擎的适配包


## 注意

经过测试，在 `nunjucks` 里，**不要** 在 `{% block xxx %}{% endblock%}` 内部使用 `{% set var = value %}`
来定义变量，这些变量，在外部根本访问不到！！

