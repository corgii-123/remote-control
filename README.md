- 问题解决方案

  1. 安装npm install robotjs的时候的报错，报错的大致意思就是visual studio找不到2017和2015版本，其中一行错误如下，主要是由于node-gyp的报错所致
  ```
    gyp ERR! find VS **************************************************************
    gyp ERR! find VS You need to install the latest version of Visual Studio
    gyp ERR! find VS including the "Desktop development with C++" workload.
    gyp ERR! find VS For more information consult the documentation at:
    gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
    gyp ERR! find VS **************************************************************
  ```
  2. 于是针对node-gyp的错误查找了相关资料，比较简单的方式是对症下药，安装visual studio 2017，这里可以用到windows-build-tools工具，即运行如下指令，直接安装，简单快速解决问题。
  `npm i --global --production windows-build-tools`

  3. 大部分人到这里可能就解决了robotjs的安装报错，但是本人运行这行命令后，visual studio的安装一直处于still waiting for installer log file ...中。

  4. 查找相关资料，可能是npm的版本和windows-build-tools工具的问题，于是可以尝试运行下面这行代码。
  `npm i --global --production windows-build-tools@4.0.0`

  5. 到这里又有一部分人能解决robotjs的安装问题，但是本人依旧运行以上指令后，出现Could not install Visual Studio Build Tools，于是去https://dotnet.microsoft.com/download/visual-studio-sdks下载较新的.net framework开发包，不过重新运行代码依旧不能安装Visual Studio Build Tools。

  6. 后来经过了各种尝试和查阅，在windows-build-tools的github issue中找到了一种方法，即使用choco进行安装，终于成功。
  `choco install python visualcpp-build-tools -y`

  7. 最后一定要记得设置一下visual studio的版本，重启电脑后便大功告成。
  `npm config set msvs_version 2017`

- robot.js和electron的版本不匹配的解决方案
1. robotjs版本npm rebuild --runtime=electron --target=10.1.5 --			disturl=https://atom.io/download/atom-shell --abi=72
2. app.allowRendererProcessReuse = false

- react的webpack配置的篡改方式
	1. npm install customize-cra react-app-rewired
	2. 新建config-overrides.js文件，并编写篡改的代码
	3. 修改启动脚本react-scripts-rewired