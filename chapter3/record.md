# 6.1 构建TCP服务器
   #### OSI参考模型将网络通信功能划分为7层，即物理层、数据链路层、网络层、传输层、会话层、表示层和应用层。TCP协议就是位于传输层的协议。Node.js在创建一个TCP服务器的时候使用的是net（网络）模块

## 6.1.1 使用Node.js创建TCP服务器
   ###### 为了使用Node.js创建TCP服务器，首先要使用require('net')来加载net模块，然后使用net模块的createServer方法就可以轻松地创建一个TCP服务器
   ```
   net.createServer([options][,connectionListerner])
   ```
   * options是一个对象参数值，有两个布尔类型的属性allowHalfOpen和pauseOnConnect。这两个属性默认都是false
   * connectionListener是一个当客户端与服务端建立连接时的回调函数，这个回调函数以socket端口对象作为参数
   ```
   var net = require('net');
   var server = net.createServer(function (socket) {
       console.log('someone connects');
   });
   ```
   
## 6.1.2 监听客户端的连接
   ###### 使用TCP服务器的listen方法就可以开始监听客户端的连接
   ```
   server.listen(port[,host][,backlog][,callback])
   ```
   * port参数为需要监听的端口号，参数值为0的时候将随机分配一个端口号
   * host为服务器地址
   * backlog为连接等待队列的最大长度
   * callback为回调函数
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       console.log('someone connects');
   });
   
   server.listen(18001, function () {
       console.log('server is listening');
   });
   ```
   ###### server.listen()方法其实触发的是server下的listening事件，所以也可以手动监听listening事件
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       console.log('someone connects');
   });
   
   server.listen(18001);
   
   server.on('listening', function () {
       console.log('server is listening');
   });
   ```
   ###### 除了listening事件外，TCP服务器还支持以下事件
   * connection：当有新的链接创建时触发，回调函数的参数为socket连接对象
   * close：TCP服务器关闭的时候触发，回调函数没有参数
   * error：TCP服务器发生错误的时候触发，回调函数的参数为error对象
   ```
   var net = require('net');
   
   var server = new net.Server();
   
   server.on('connection', function (socket) {
       console.log('someone connects');
   });
   
   server.listen(18001);
   
   server.on('listening', function () {
       console.log('server is listening');
   });
   
   server.on('close', function () {
       console.log('server closed');
   });
   
   server.on('error', function (err) {
       console.log('error');
   });
   ```
## 6.1.3 查看服务器监听的地址
   ###### 当创建了一个TCP服务器后，可以通过server.address()方法来查看这个TCP服务器监听的地址，并返回一个JSON对象。这个对象的属性有
   * port：TCP服务器监听的端口号
   * family：说明TCP服务器监听的地址是IPv6还是IPv4
   * address：TCP服务器监听的地址
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       console.log('someone connects');
   });
   
   server.listen(18001, function () {
       var address = server.address();
       console.log('the port of server is ' + address.port);
       console.log('the address of server is ' + address.address);
       console.log('the famaily of server is ' + address.family);
   });
   ```
## 6.1.4 连接服务器的客户端数量
   ###### 创建一个TCP服务器后，可以通过server.getConnections()方法获取连接这个TCP服务器的客户端数量。这个方法是一个异步的方法，回调函数有两个参数
   * 第一个参数为error对象。
   * 第二个参数为连接TCP服务器的客户端数量
   ###### 除了获取连接数量外，也可以通过设置TCP服务器的maxConnections属性来设置这个TCP服务器的最大连接数量。当连接数量超过最大连接数量的时候，服务器将拒绝新的连接
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       console.log('someone connects');
       server.maxConnections = 3;
       server.getConnections(function (err, count) {
           console.log('the count of client is ' + count);
       });
   });
   
   server.listen(18001, function () {
       console.log('server is listening');
   });
   ```
## 6.1.5 获取客户端发送的数据
   ###### socket对象可以用来获取客户端发送的流数据，每次接收到数据的时候触发data事件，通过监听这个事件就可以在回调函数中获取客户端发送的数据
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       socket.on('data', function (data) {
           console.log(data.toString());
       });
   });
   
   server.listen(18001, function () {
       console.log('server is listening');
   });
   ```
   ###### socket对象除了有data事件外，还有connect、end、error、timeout等事件
## 6.1.6 发送数据给客户端
   ###### 利用socket.write()可以使TCP服务器发送数据。这个方法只有一个必需参数，就是需要发送的数据；第二个参数为编码格式，可选。同时，可以为这个方法设置一个回调函数
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       var address = server.address();
       var message = 'client, the server address is ' + JSON.stringify(address);
       socket.write(message, function () {
           var writeSize = socket.bytesWritten;
           console.log(message + 'has send');
           console.log('the size of message is ' + writeSize);
       });
       socket.on('data', function (data) {
           console.log(data.toString());
           var readSize = socket.bytesRead;
           console.log('the size of data is ' + readSize);
       });
   });
   
   server.listen(18001, function () {
       console.log('server is listening');
   });
   ```
   ###### 在上面这段代码中还用到了socket对象的bytesWritten和bytesRead属性，这两个属性分别代表着发送数据的字节数和接收数据的字节数
   ###### 除了上面这两个属性外，socket对象还有以下属性：
   * socket.localPort：本地端口的地址
   * socket.localAddress：本地IP地址
   * socket.remotePort：远程端口地址
   * socket.remoteFamily：远程IP协议簇
   * socket.remoteAddress：远程的IP地址
   ```
   var net = require('net');
   
   var server = net.createServer(function (socket) {
       console.log('localPort: ' + socket.localPort);
       console.log('localAdress: ' + socket.localAddress);
       console.log('remotePort: ' + socket.remotePort);
       console.log('remoteFamily: ' + socket.remoteFamily);
       console.log('remoteAddress: ' + socket.remoteAddress);
   });
   
   server.listen(18001, function () {
       console.log('server is listening');
   });
   ```

# 6.2 构建TCP客户端
   #### Node.js在创建一个TCP客户端的时候同样使用的是net（网络）模块。
 ## 6.2.1 使用Node.js创建TCP客户端
   ###### 创建一个TCP客户端只需要创建一个连接TCP客户端的socket对象即可，创建一个socket对象的时候可以传入一个json对象。这个对象有以下属性
   ```
   var net = require('net');
   var client = new net.Socket();
   ```
   * fd：指定一个存在的文件描述符，默认值为null
   * readable：是否允许在这个socket上读，默认值为false
   * writeable：是否允许在这个socket上写，默认值为false
   * allowHalfOpen：该属性为false时，TCP服务器接收到客户端发送的一个FIN包后将会回发一个FIN包；该属性为true时，TCP服务器接收到客户端发送的一个FIN包后不会回发FIN包
## 6.2.2 连接TCP服务器
   ###### 创建了一个socket对象后，使用socket对象的connect()方法就可以连接一个TCP服务器
   ```
   var net = require('net');
   var client = net.Socket();
   
   client.connect(18001, '127.0.0.1', function () {
       console.log('connect the server');
   });
   ```