[![](https://travis-ci.org/junfeisu/slj-cli.svg?branch=master)](https://travis-ci.org/junfeisu/slj-cli)

## slj-cli

> A comamnd cli program for personal.It now provides the function of download and similar to vue-cli.

### slj download

#### options

    -u --url specify the download path.
    -n --file-name specify the download file name.
    -d --dest specify the download storage path.
    -e --extract-path specify the zip file extract path.

第一个option -u是必须的,后面两个可有可无.

第二个option -n如果不提供,那么下载文件的名字按照以下规则生成:

第三个option -d如果不提供，那么下载文件的存放路径就是process.env.PWD([详细了解](https://github.com/junfeisu/Blog/issues/1))

第四个option -e如果提供了并且下载的文件是一个zip包，下载完就会自动解压到指定的路径

  . 下载地址带文件后缀名,那么文件名就从下载地址中截取, eg: 

      https://www.test.com/test.png 文件名就是test.png

  . 下载地址不带文件后缀名,那么文件名就会根据下载地址进行md5然后截取7位在前面加上slj-, eg:

      https://www.test.com/test 文件名就是类似于slj-dfasfjk.*

下载的文件如果是zip压缩包,下载完会自动询问是否进行解压。如果需要解压提供解压路径之后就会自动解压，暂不支持其他类型压缩包的自动解压

### slj scan <dir\>

#### options

    -r --relative specify the scan relative path.
    -i --ignore specify the scan ignore directories.
    -n --json-name specify the generate json file name. Default is staticResource.json.
    -d --dest specify the store path of the to be generated json file. Default is <dir>.

dir 就是指定需要扫描的项目的根目录.

第一个option -r 这个参数是相对dir指定的，只扫描这个指定的目录下面的静态文件.

第二个option -i 这个参数如果-r指定了，那么ignore的参数就是相对relatice的，如果没有指定就相对于dir.

补充：因为commander.js单个option不支持常见命令行多值，所以这边采用 ~ 进行分隔，想指定多个ignore directorires，就像如下指定：

    -i node_moduels~.git~build // ignore node_modules .git build directory

### slj init <project-name\>
使用方法和vue init相似，支持在线和本地的模板，目前本地的模板只有server这一个模板，后续会丰富。在线模板的话把模板的仓库地址填进去即可（**目前仅支持github和gitlab的仓库**）
