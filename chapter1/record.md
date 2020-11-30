# NPM常用命令
  - 查看安装版本 
    - npm -v,npm version
  - npm 安装和更新到最新版本
	- npm install npm 或 npm install -g npm
	- npm install npm@6.2.0 或 npm install -g npm@6.2.0
	- npm config set registry http://npm安装源地址 （切换服务器地址）
  - npm init 生成一个package.json文件。或 npm init -y 系统填写默认值
  - npm install X 安装库 npm uninstall X 卸载库

# 模块加载原理与加载方式
  #### Node.js中模块分为原生和文件模块，在nodejs中可以通过require导入，通过exports导出模块
  - require 导入模块
   - const http = require('http'); http.createServer();
  - exports 导出模块
   - const util = {....}; module.exports = util;
 
# Node.js核心模块
  - http模块---创建http服务器和客户端
    - node.js 服务器端 例子 4-1 ~ 4-3
		- http.Server 的事件主要有：
			- request：最常用的事件，当客户端请求到来时，该事件被触发，提供req和res两个参数，表示请求和响应信息。
            - connection：当TCP连接建立时，该事件被触发，提供一个socket参数，是net.Socket的实例。
            - close：当服务器关闭时，触发事件（注意不是在用户断开连接时）。 
		- http.IncomingMessage是HTTP请求的信息，提供了以下3个事件：
			- data：当请求体数据到来时该事件被触发。该事件提供一个chunk参数，表示接收的数据。
            - end：当请求体数据传输完毕时该事件被触发，此后不会再有数据。
            - close：用户当前请求结束时，该事件被触发。
		- http.ServerResponse是返回给客户端的信息，其常用的方法为：
			- res.writeHead(statusCode,[headers])：向请求的客户端发送响应头。
            - res.write(data,[encoding])：向请求发送内容。
            - res.end([data],[encoding])：结束请求。
	- 客户端向http服务器发起请求 例子 4-4 ~ 4-6
	    - 向http服务器发起请求的方法有：
		    - http.request(option[,callback])：option为json对象，主要字段有host、port（默认为80）、method（默认为GET）、path（请求的相对于根的路径，默认是“/”）、headers等。该方法返回一个httpClientRequest实例。
			- http.get(option[,callback])：http.request()使用HTTP请求方式GET的简便方法。
		- http.request()和http.get()方法返回的是一个http.ClientRequest()实例。http.ClientRequest()类主要的事件和方法有
		    - response：当接收到响应时触发。
			- request.write(chunk[,encoding][,callback])：发送请求数据。
			- res.end([data][,encoding][,callback])：发送请求完毕，应该始终指定这个方法。
	- http2模块——创建HTTP/2服务器和客户端
	    - Node.js HTTP/2服务器端 http2app
		    - http2server.js 代码说明：http.createSecureServer()方法返回的是http2模块封装的一个基于事件的http2服务器，并通过listen()方法监听客户端请求
			- 这里与http模块显著不同的地方是，http2模块需要依赖于ssl安全证书来实现，因此就需要配合使用fs文件模块来引用证书文件
		    - HTTP/2服务器端定义的server使用了以下2个事件和1个方法：
				- stream：当请求体数据到来时该事件被触发。该事件提供2个参数（stream和headers），表示数据流和文件响应头信息。通过数据流stream实现了向客户端发送信息
					- 通过respond()方法向客户端定义了文件响应头信息
					- 通过end()方法向客户端发送了文本内容，并结束请求
				- error：错误信息
				- 通过listen()方法监听客户端请求（端口为8443）
		- Node.js HTTP/2客户端向服务器端发起请求
		    - http2.connect(url, options)：url为请求的服务器地址和端口，option为json对象，该方法返回一个http2session实例
			- http2session.request(headers[, options])：请求headers相对于根的path路径（默认是“/”），该方法返回一个http2stream实例
			- client.request方法返回的是一个http2stream实例（req），其主要的事件和方法有：
				- setEncoding()方法：设定文件编码类型.
				- data事件：发送请求数据
				- end事件：发送请求完毕，并关闭客户端
				- end()方法：发送请求完毕，应该始终指定这个方法