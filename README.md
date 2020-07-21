使用方式

1.设置安装yarn
```markdown
npm i yarn -g
```
2.设置yarn的node-sass代理，防止下载不了
```markdown
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
# 注： 如果是使用的npm，是可以把yarn替换为npm的
```
3.下载依赖
```markdown
yarn install 或者 npm i 
# 注： 不要使用cnpm，因为cnpm不支持包重命名的写法，如npm@:@abc/npm: "0.0.1" 这种操作
```
4.运行小程序
```markdown
npm run dev:weapp
```
5.打包
```markdown
npm run build:weapp
```
6.注意
```markdown
如果运行或者打包的执行过程中，出现“busyness”等错误，请关闭微信开发者工具后在尝试，因为刚开启后添加文件之后，可能存在权限问题，
所以先关闭开发者工具，然后运行或者打包，然后在开启开发者工具，之后在运行或者打包就不会出现错误
```
7.书写规范，很多提示类文件，需要在typings中写上对应的接口，这样代码中才会有语法提示
