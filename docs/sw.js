var serviceWorkerOption = {"assets":["/Simple-Line-Icons.eot","/Simple-Line-Icons.woff2","/Simple-Line-Icons.ttf","/Simple-Line-Icons.woff","/Simple-Line-Icons.svg","/MaterialIcons-Regular.eot","/MaterialIcons-Regular.woff2","/MaterialIcons-Regular.woff","/MaterialIcons-Regular.ttf","/bundle.js","/main.css"]};
        
        !function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";var i=["cc-static-v5"];self.addEventListener("install",function(t){t.waitUntil(caches.open("cc-static-v5").then(function(t){return t.addAll(["index.html","bundle.js","main.css","MaterialIcons-Regular.woff","Simple-Line-Icons.woff","https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff","https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff"])}))}),self.addEventListener("activate",function(t){t.waitUntil(caches.keys().then(function(t){return Promise.all(t.filter(function(t){return t.startsWith("cc-")&&!i.includes(t)}).map(function(t){return caches.delete(t)}))}))}),self.addEventListener("fetch",function(t){var e=new URL(t.request.url);if(e.origin===location.origin&&"/"===e.pathname)return void t.respondWith(caches.match("index.html"));t.respondWith(caches.match(t.request).then(function(e){return e||fetch(t.request)}))}),self.addEventListener("message",function(t){"skipWaiting"===t.data.action&&self.skipWaiting()})}]);