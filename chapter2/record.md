# 5.1 Node.js文件系统介绍
## 5.1.1 同步和异步
  
  ```
  const fs = require('fs');
  //异步操作读取文件
  fs.unlink('./tmp/hello', (err) => {
      if(err) throw err;
      console.log('successfully deleted ./tmp/hello');
  });
  //同步操作读取文件
  fs.unlinkSync('./tmp/hello');
  console.log('successfully deleted ./tmp/hello');
  ```
  * 异步操作的方法不能保证一定执行成功，所以文件操作的顺序在代码执行过程中是非常重要的，例如下面的代码将会引发一个错误
  ```
  const fs = require('fs');
  fs.rename('./tmp/hello', './tmp/world', (err) => {
      if(err) throw err;
	  console.log('rename complete')
  });
  fs.stat('./tmp/world', (err, stats) => {
      if(err) throw err;
      console.log(`stats: ${JSON.stringify(stats)}`);
  });
  ```
  * fs.stat将在fs.rename之前执行，正确的方法是使用回调函数来执行
  ```
  const fs = require('fs');
  fs.rename('./tmp/hello', './tmp/world', (err) => {
      if(err) throw err;
      fs.stat('./tmp/world', (err, stats) => {
          if(err) throw err;
          console.log(`stats: ${JSON.stringify(stats)}`);
      });
  });
  ```
  ###### 提示
  ```
  在一个大型的系统中，建议使用异步方法，同步方法将会导致进程被锁死。
  和同步方法相比，异步方法性能更高、速度更快，而且阻塞更少。
  本书以介绍异步方法为主，同步方法为辅。
  ```
 ## 5.1.2 fs模块中的类和文件的基本信息
  * Node.js在文件模块中只有4个类，分别为fs.FSWatcher、fs.ReadStream、fs.Stats和fs.WriteStream。
	* 其中，fs.ReadStream和fs.WriteStream分别是读取流和写入流，fs.FSWatcher和fs.Stats可以获取文件的相关信息。
	* stats类中的方法有：
	  * stats.isFile()：如果是标准文件就返回true，如果是目录、套接字、符号连接或设备等就返回false。
	  * stats.isDirectory()：如果是目录就返回true
	  * stats.isBlockDevice()：如果是块设备就返回true。大多数情况下，类UNIX系统的块设备都位于/dev目录下
	  * stats.isCharacterDevice()：如果是字符设备就返回true
	  * stats.isSymbolicLink()：如果是符号连接就返回true。fs.lstat()方法返回的stats对象才有此方法
	  * stats.isFIFO()：如果是FIFO就返回true，FIFO是UNIX中一种特殊类型的命令管道
	  * stats.isSocket()：如果是UNIX套接字就返回true
	  * 使用fs.stat()、fs.lstat()和fs.fstat()方法都将返回文件的一些特征信息，如文件的大小、创建时间或者权限
	  ```
	  var fs = require('fs');
	  fs.stat('5-3.js', function (err, stats) {
	      console.log(stats);
	  });
	  ```

## 5.1.3 文件路径
 * path模块主要有以下几个主要功能：
   * 规范化路径。
   * 连接路径。路径解析。
   * 查找路径之间的关系。
   * 提取路径中的部分内容。
	 ```
	 var path = require('path');
	 //合法的字符串连接
	 path.join('/chapter05', 'tmp/asdf', 'quux', '..');
	 // 连接后
	 // '/foo/bar/baz/asdf'
	 //不合法的字符串将抛出异常
	 path.join('/chapter05', {}, 'tmp');
	 // 抛出的异常
	 // TypeError: Arguments to path.join must be strings'
	 ```
	 #### 在使用相对路径的时候，路径的相对性应该与process.cwd()一致。

# 5.2 基本文件操作
 ## 5.2.1 打开文件
  * fs.open(path,flags[,model],callback)
	* path：文件的路径。
	* flags：文件打开的方式
	* mode：设置文件模式（权限），文件创建默认权限为可读写
	* callback：回调函数，同时带有两个参数
	```
	var fs = require('fs');
	// 打开文件
	console.log("准备打开文件!");
	fs.open('text.txt', 'r+', function(err, fd) {
	   if (err) {
	       return console.error(err);
	   }
	  console.log("成功打开文件!");
	});
	```

 ## 5.2.2 关闭文件
  * fs.close(fd,callback)
    * fd：通过fs.open()方法返回的文件描述符
	* callback：回调函数，没有参数
	```
	var fs = require('fs');
	console.log("准备打开文件!");
	fs.open('input.txt', 'r+', function (err, fd) {
	    if (err) {
	        return console.error(err);
	    }
	    console.log("文件打开成功!");
	    // 关闭文件
	    fs.close(fd, function (err) {
	        if (err) {
	            console.log(err);
	        }
	        console.log("文件关闭成功!");
	    });
	});
	```
	#### 事实上，并不需要经常使用fs.close来关闭文件。除了几种特例之外，Node.js在进程退出之后将自动把所有文件关闭。原因在于，在使用fs.readFile、fs.writeFile或fs.append之后，它们并不返回任何fd，Node.js将在文件操作之后进行判断并自动关闭文件

 ## 5.2.3 读取文件
   #### Node.js目前支持UTF-8、UCS2、ASCII、Binary、Base64、Hex编码的文件，并不支持中文GBK或GB2312之类的编码，所以无法操作GBK或GB2312格式文件的中文内容。如果想读取GBK或GB2312格式的文件，需要第三方的模块支持，建议使用iconv模块或iconv-lite模块。其中，iconv模块仅支持Linux，不支持Windows

  - fs.read(fd,buffer,offset,length,position,callback)
	* fd：通过fs.open()方法返回的文件描述符。
	* buffer：数据写入的缓冲区
	* offset：缓冲区写入的写入偏移量
	* length：要从文件中读取的字节数
	* position：文件读取的起始位置，如果position的值为null，就会从当前文件指针的位置读取
	* callback：回调函数，有err、bytesRead、buffer三个参数。其中err为错误信息，bytesRead表示读取的字节数，buffer为缓冲区对象
	```
	var fs = require('fs');
	fs.open('5-7.js', 'r', function (err, fd) {
	    var readBuffer = new Buffer(1024),
	        offset = 0,
	        len = readBuffer.length,
	        filePostion = 100;
	    fs.read(fd, readBuffer, offset, len, filePostion, function (err, readByte) {
	        console.log('读取数据总数: ' + readByte + ' bytes');
	        // ==>读取数据总数
	        console.log(readBuffer.slice(0, readByte)); //数据已被填充到readBuffer中
	    })
	});
	```
  - fs.readFile(filename[,options],callback)
    ###### fs.readFile方法是在fs.read上的进一步封装，两者的主要区别是fs.readFile方法只能读取文件的全部内容
    * filename：要读取的文件
	* options：一个包含可选值的对象。
	  * encoding {String | Null} 默认为null
	  * flag {String} 默认为'r'
	* callback：回调函数


 ## 5.2.4 写入文件
   - fs.writeFile(filename,data[,options],callback)
     * filename：文件名或文件描述符
	 * data：写入文件的数据，可以是字符串（String）或流（Buffer）对象
	 * options：该参数是一个对象，包含{encoding, mode, flag}，默认编码为UTF8，模式为0666，flag为 'w'
	 * callback：回调函数，只包含错误信息参数（err）

   - fs.appendFile(file,data[,options],callback)
     * file：文件名或者文件描述符
	 * data：可以是字符串或流对象
	 * options：该参数是一个对象，包含{encoding, mode, flag}，默认编码为UTF8，模式为0666，flag为'w'
	 * callback：回调函数，只包含错误信息参数（err）
   ```
   var fs = require('fs');
   //使用string写入文件
   var str = new String('data to append');
   fs.appendFile('message.txt', 'data to append', 'utf8', callback);
   //使用buffer写入文件
   var buf = new Buffer.from('data to append');
   fs.appendFile('message.txt', buf, (err) => {
       if(err) throw err;
       console.log('The "data to append" was appended to file!');
   });
   ```
   ###### 在执行写入文件之后不要使用提供的缓存区，因为一旦将其传递给写入函数，缓存区就处于写入操作的控制之下，直到函数结束之后才可以重新使用
 
# 5.3 利用async hooks跟踪异步请求和处理
   * async_hooks模块提供了创建跟踪Node异步请求和处理的方法（createHook()），下面简单介绍一下
   * async_hooks.createHook(callbacks)
   * createHook方法主要用于注册一系列回调函数，这些回调函数会在异步操作的各个生命周期的事件中被调用。回调函数（callbacks）包含init()、before()、after()和destroy()业务方法，一般这4个方法不需要全部使用，但init()方法一般是必须使用的

   * init(asyncId,type,triggerAsyncId,resource)
      - asyncId<number>：异步资源的唯一ID。当一个可能触发异步事件的类初始化的时候，init()方法将会被调用，然而随后的before()、after()和destroy()方法并不一定被调用。每个异步资源会被分配一个唯一的ID，即asyncId
	  - type<string>：异步资源的类型，这是Node.js内部定义好的，当然也提供了自定义的方案
	  - triggerAsyncId<number>：创建此异步资源的执行上下文的唯一ID，即此资源调用链上的父ID
	  - resource<Object>：一个代表异步资源的对象，可以从此对象中获得一些异步资源相关的数据
   
   * before(asyncId)
      - before回调表示当一个异步操作初始化或者完成时所对应的回调函数将被调用。asyncId表示执行回调函数的异步资源的唯一ID。理论上异步资源的回调将会被执行零次或者多次，因此before回调也可能被执行零到多次
   
   * after(asyncId)
      - after回调会在异步资源的回调被执行之后立即调用

   * destroy(asyncId)
      - 当asyncId代表的资源被销毁的时候，destrory回调被调用
   ```
   'use strict';
   const fs = require('fs');
   const asyncHooks = require('async_hooks');
   const hook = asyncHooks.createHook({
       init(asyncId, type, triggerAsyncId, resource) {
           fs.writeSync(1, `init: asyncId-${asyncId},type-${type},triggerAsyncId-${triggerAsyncId}\n`);
       },
       before(asyncId) {
           fs.writeSync(1, `before: asyncId-${asyncId}\n`);
       },
       after(asyncId) {
           fs.writeSync(1, `after: asyncId-${asyncId}\n`);
       },
       destroy(asyncId) {
           fs.writeSync(1, `destroy: asyncId-${asyncId}\n`);
       }
   }).enable();
   console.log('hello');
   console.log('async_hooks');
   ```
   #### 首先要使用require('async_hooks')引用async_hooks模块，然后调用createHook()方法创建跟踪Node异步请求和处理的方法。在createHook()方法内，分别实现了对init()、before()、after()和destroy()业务方法的定义。最后，分两次调用console.log()方法在控制台中输出不同的文本信息
   #### 两个console.log()方法调用的父级ID是相同的，但两个console.log()方法自身的ID是不同的。同时根据asyncId值判断，init()、before()、after()和destroy()这4个用于追踪的业务方法是依次被调用的

# 5.4 其他文件操作
   ### Node.js除了提供官方的API对文件操作进行支持外，也可以通过NPM安装第三方的模块来进行文件的操作。本节主要介绍如何通过Node.js和第三方模块来操作，如CSV文件、XML文件和JSON文件

# 5.5 实战——用IP地址来查询天气情况