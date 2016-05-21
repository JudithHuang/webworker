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
Web Workers provide a simple means for web content to run scripts in background threads.
The worker thread can perform tasks without interfering with the user interface.
In addition, they can perform I/O using XMLHttpRequest. Once created, a worker can send
messages to the JavaScript code that created it by posting messages to an event handler
specified by that code (and vice versa.) This article provides a detailed introduction to
using web workers.
