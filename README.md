[![](https://travis-ci.org/junfeisu/sj-cli.svg?branch=master)](https://travis-ci.org/junfeisu/sj-cli)

## sj-cli

> A comamnd cli program for personal.It now provides the function of download and similar to vue-cli.

### sj download

#### options

    -u --url specify the download path
    -n --file-name specify the download file name.
    -d --dest specify the download storage path

第一个option -u是必须的,后面两个可有可无.
第二个option -n如果不提供,那么下载文件的名字按照以下规则生成:

  . 下载地址带文件后缀名,那么文件名就从下载地址中截取, eg: 

      https://www.test.com/test.png 文件名就是test.png

  . 下载地址不带文件后缀名,那么文件名就会根据下载地址进行md5然后截取7位在前面加上sj-, eg:

      https://www.test.com/test 文件名就是类似于sj-dfasfjk.*

下载的文件如果是zip压缩包,下载完会自动询问是否进行解压。如果需要解压提供解压路径之后就会自动解压，暂不支持其他类型压缩包的自动解压

### sj init <project-name\>
使用方法和vue init相似，但是目前不支持在线的模板，计划下一版本支持，自己试一下就知道用法，提示也很清晰。
