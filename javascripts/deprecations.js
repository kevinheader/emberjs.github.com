$(function(){$("#toc-list .level-1 > a").click(function(){return $(this).parent().find("> ol").slideToggle(function(){positionBackToTop(!0)}),!1}),$(function(){$(".anchorable-toc").each(function(){var t=$(this),a=t.attr("id"),i="#"+a,e='<a class="toc-anchor" href="'+i+'"></a>';t.prepend(e)})})}),function(){var t,a=$("#toc-list");$("h3, h4").each(function(){var i=$(this);if("H3"===i.prop("tagName")){var e=$("<li class='level-1'><a href='#"+i.attr("id")+"'>"+i.text()+"</a><ol></ol></li>");t=e.find("ol"),e.appendTo(a)}else t.append("<li class='level-3'><a href='#"+i.attr("id")+"'>"+i.text()+"</a></li>")})}();