$(function(){function e(e){var n,t;for(t=0;t<e.length;t++)n=document.createElement("meta"),n.name=e[t].name,n.content=e[t].content,document.head.appendChild(n)}function n(e){var n,t;for(t=0;t<e.length;t++)n=document.createElement("script"),n.src=a+e[t].src,n.async=!1,document.head.appendChild(n)}function t(t){e(t.meta),n(t.script)}var a="https://s3.amazonaws.com/apps.emberjs.com",c="https://s3.amazonaws.com/apps.emberjs.com/dashboard/index.json";$.getJSON(c,t)});