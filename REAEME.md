title: Web Woker
speaker: Judith Huang
url: https://github.com/judithhuang/webworker
transition: slide23
theme: dark
date: 2016年5月23日

[slide2]
# Web Worker
<small>演讲者：Judith Huang</small>

[slide2]
# Event Loop
<div class="text-center">
  <img src="/images/eventLoop.PNG" height="332" width="454">
</div>

[slide2]
# Web Worker
----
* 专用 Web Worker (Dedicated Web Worker) 提供了一个简单的方法使得 web 内容能够在后台运行脚本。一旦 worker 创建后，它可以向由它的创建者指定的事件监听函数传递消息，这样该 worker 生成的所有任务就都会接收到这些消息。

* worker 线程能够在不干扰 UI 的情况下执行任务。另外，它还能够使用 XMLHttpRequest (虽然 responseXML 与 channel 两个属性值始终是 null)来执行  I/O 操作。

[slide2]
# 关于线程安全
----
* Worker 接口会生成真正的操作系统级别的线程，如果你不太小心，那么并发(concurrency)会对你的代码产生有趣的影响。然而，对于 web worker 来说，与其他线程的通信点会被很小心的控制，这意味着你很难引起并发问题。你没有办法去访问非线程安全的组件或者是 DOM，此外你还需要通过序列化对象来与线程交互特定的数据。所以你要是不费点劲儿，还真搞不出错误来。

[slide2]

# window.postMessage
----
* window.postMessage 是一个用于安全的使用跨源通信的方法。通常，不同页面上的脚本只在这种情况下被允许互相访问，当且仅当执行它们的页面所处的位置使用相同的协议（通常都是 http）、相同的端口（http默认使用80端口）和相同的主机（两个页面的 document.domain 的值相同）。 在正确使用的情况下，window.postMessage 提供了一个受控的机制来安全地绕过这一限制。

[slide2]
# 生成 worker
----
* 创建一个新的 worker 十分简单。你所要做的就是调用 Worker() 构造函数，指定一个要在 worker 线程内运行的脚本的 URI，如果你希望能够收到 worker 的通知，可以将 worker 的 onmessage 属性设置成一个特定的事件处理函数。

[slide2]
# 生成 worker Demo
----
<pre>
  <code class="markdown">
    var myWorker = new Worker("my_task.js");

    myWorker.onmessage = function (oEvent) {
      console.log("Called back by the worker!\n");
    };

    myWorker.postMessage(""); // start the worker.
  </code>
</pre>

[slide2]
# 传递数据
----
* 在主页面与 worker 之间传递的数据是通过拷贝，而不是共享来完成的。传递给 worker 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 worker 不会共享同一个实例，最终的结果就是在每次通信结束时生成了数据的一个副本。大部分浏览器使用结构化拷贝来实现该特性。

[slide2]
# 传递数据
----
* 拷贝而并非共享的那个值称为 消息。再来谈谈 worker，你可以使用 postMessage() 将消息传递给主线程或从主线程传送回来。message 事件的 data 属性就包含了从 worker 传回来的数据。

[slide2]
# 通过转让所有权(可转让对象)来传递数据
----
* Google Chrome 17 与 Firefox 18 包含另一种性能更高的方法来将特定类型的对象(可转让对象) 传递给一个 worker/从 worker 传回 。可转让对象从一个上下文转移到另一个上下文而不会经过任何拷贝操作。这意味着当传递大数据时会获得极大的性能提升。如果你从 C/C++ 世界来，那么把它想象成按照引用传递。然而与按照引用传递不同的是，一旦对象转让，那么它在原来上下文的那个版本将不复存在。

[slide2]
# 通过转让所有权(可转让对象)来传递数据
----
* 该对象的所有权被转让到新的上下文内。例如，当你将一个 ArrayBuffer 对象从主应用转让到 Worker 中，原始的 ArrayBuffer 被清除并且无法使用。它包含的内容会(完整无差的)传递给 Worker 上下文。
* 要了解更多关于可转让对象的信息，[请查看 HTML5Rocks](https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast)


[slide2]
# 生成subworker
----
* 如果需要的话 Worker 能够生成更多的 Worker。这样的被称为 subworker，它们必须托管在与父页面相同的源内。同理，subworker 解析 URI 时会相对于父 worker 的地址而不是自身的页面。这使得 worker 容易监控它们的依赖关系。

* Chrome 目前并不支持subworker。

[slide2]
# 嵌入式 worker
----
* 目前没有一种「官方」的方法能够像 script 元素一样将 worker 的代码嵌入的网页中。但是如果一个 script 元素没有 src 特性，并且它的 type 特性没有指定成一个可运行的 mime-type，那么它就会被认为是一个数据块元素，并且能够被 JavaScript 使用。「数据块」是 HTML5 中一个十分常见的特性，它可以携带几乎任何文本类型的数据。所以，你能够以如下方式嵌入一个 worker：

[slide2]

<pre>
  <code class="markdown">
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      var myVar = "Hello World!";
      // 剩下的 worker 代码写到这里。
    </script>
    <script type="text/javascript">
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。
      function pageLog (sMsg) {
        // 使用 fragment：这样浏览器只会进行一次渲染/重排。
        var oFragm = document.createDocumentFragment();
        oFragm.appendChild(document.createTextNode(sMsg));
        oFragm.appendChild(document.createElement("br"));
        document.querySelector("#logDisplay").appendChild(oFragm);
      }
    </script>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      onmessage = function (oEvent) {
        postMessage(myVar);
      };
      // 剩下的 worker 代码写到这里。
    </script>
    <script type="text/javascript">
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。

      // 在过去...：
      // 我们使用 blob builder
      // ...但是现在我们使用 Blob...:
      var blob = new Blob(Array.prototype.map.call(document.querySelectorAll("script[type=\"text\/js-worker\"]"), function (oScript) { return oScript.textContent; }),{type: "text/javascript"});

      // 创建一个新的 document.worker 属性，包含所有 "text/js-worker" 脚本。
      document.worker = new Worker(window.URL.createObjectURL(blob));

      document.worker.onmessage = function (oEvent) {
        pageLog("Received: " + oEvent.data);
      };

      // 启动 worker.
      window.onload = function() { document.worker.postMessage(""); };
    </script>
    </head>
    <body><div id="logDisplay"></div></body>
    </html>
    ````
  </code>
</pre>
现在，嵌入式 worker 已经嵌套进了一个自定义的 document.worker 属性中。

[slide2]
# 超时与间隔
----
* Worker 能够像主线程一样使用超时与间隔。这会十分有用，比如说，如果你想让 worker 线程周期性而并非不间断的运行代码。

* JavaScript 定时器: setTimeout()， clearTimeout()， setInterval()。

[slide2]
# 终止 worker
----
* 如果你想立即终止一个运行中的 worker，可以调用 worker 的 terminate()方法：

<pre>
  <code class="markdown">
    myWorker.terminate();
  </code>
</pre>

* worker 线程会被立即杀死，不会留下任何机会让它完成自己的操作或清理工作。

* Workers 也可以调用自己的 nsIWorkerScope.close() 方法来关闭自己：

<pre>
  <code class="markdown">
    self.close();
  </code>
</pre>

[slide2]
# 处理错误
----
* 当 worker 出现运行时错误时，它的 onerror 事件处理函数会被调用。它会收到一个实现了 ErrorEvent 接口名为 error的事件。该事件不会冒泡，并且可以被取消；为了防止触发默认动作，worker 可以调用错误事件的 preventDefault() 方法。

* 错误事件拥有下列三个它感兴趣的字段：

  * message: 可读性良好的错误消息。
  * filename: 发生错误的脚本文件名。
  * lineno: 发生错误时所在脚本文件的行号。

[slide2]
# 访问 navigator 对象
----
* Workers 可以在它的作用域内访问 navigator 对象。它含有如下能够识别浏览器的字符串，就像在普通脚本中做的那样：

  * appName
  * appVersion
  * platform
  * userAgent

[slide2]
# 引入脚本与库
----
* Worker 线程能够访问一个全局函数，importScripts() ，该函数允许 worker 将脚本或库引入自己的作用域内。你可以不传入参数，或传入多个脚本的 URI 来引入；以下的例子都是合法的：

<pre>
  <code class="markdown">
    importScripts();                        /* 什么都不引入 */
    importScripts('foo.js');                /* 只引入 "foo.js" */
    importScripts('foo.js', 'bar.js');      /* 引入两个脚本 */
  </code>
</pre>

[slide2]

* 浏览器将列出的脚本加载并运行。每个脚本中的全局对象都能够被 worker 使用。如果脚本无法加载，将抛出 NETWORK_ERROR 异常，接下来的代码也无法执行。而之前执行的代码(包括使用 window.setTimeout() 延迟执行的代码)却依然能够使用。importScripts() 之后的函数声明依然能够使用，因为它们始终会在其他代码之前运行。
