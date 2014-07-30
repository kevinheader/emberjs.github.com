var App=Ember.Application.create({rootElement:"#builds-application"});App.Router.map(function(){this.route("release"),this.route("beta"),this.route("canary"),this.route("tagged")}),App.Router.reopen({notifyGoogleAnalytics:function(){var e=this.get("url");/^\//.test(e)||(e="/"+e),_gaq.push(["_trackPageview","/builds"+e])}.on("didTransition")}),App.CopyClipboardComponent=Ember.Component.extend({tagName:"span",hasFlash:ZeroClipboard.detectFlashSupport(),didInsertElement:function(){var e=new ZeroClipboard(this.$("button"),{moviePath:"/images/ZeroClipboard.swf",trustedDomains:["*"],allowScriptAccess:"always"});e.on("mousedown",function(){Em.run.later(this,function(){$(this).removeClass("loading"),$(this).removeAttr("disabled")},1e3),Em.run.next(this,function(){$(this).addClass("loading"),$(this).attr("disabled","disabled")})}),this.$("input").on("click",function(){$(this).select()})}}),App.S3Bucket=Ember.Object.extend({files:[],isLoading:!1,queryUseSSL:!0,objectUseSSL:!1,delimiter:"/",bucket:"builds.emberjs.com",endpoint:"s3.amazonaws.com",delimiterParameter:function(){var e=this.getWithDefault("delimiter","").toString();return e?"delimiter="+e:""}.property("delimiter"),markerParameter:function(){return"marker="+this.getWithDefault("marker","").toString()}.property("marker"),maxKeysParameter:function(){return"max-keys="+this.getWithDefault("maxKeys","").toString()}.property("maxKeys"),prefixParameter:function(){return"prefix="+this.getWithDefault("prefix","").toString()}.property("prefix"),queryProtocol:function(){return this.get("queryUseSSL")?"https://":"http://"}.property("queryUseSSL"),queryBaseUrl:function(){return this.get("queryProtocol")+this.get("endpoint")+"/"+this.get("bucket")}.property("queryProtocol","endpoint","bucket"),objectProtocol:function(){return this.get("objectUseSSL")?"https://":"http://"}.property("objectUseSSL"),objectBaseUrl:function(){return this.get("objectProtocol")+this.get("bucket")}.property("objectProtocol","bucket"),queryParams:function(){return this.get("delimiterParameter")+"&"+this.get("markerParameter")+"&"+this.get("maxKeysParameter")+"&"+this.get("prefixParameter")}.property("delimiterParameter","markerParameter","maxKeysParameter","prefixParameter"),queryUrl:function(){return this.get("queryBaseUrl")+"?"+this.get("queryParams")}.property("queryBaseUrl","queryParams"),filesPresent:function(){return this.get("files").length}.property("files.@each"),filterFiles:function(e){var t=this.get("files");return t.filter(function(t){return-1!==t.get("name").indexOf(e+".")})},load:function(){var e=this,t=this.get("objectBaseUrl");this.set("isLoading",!0),Ember.$.get(this.get("queryUrl"),function(r){e.set("isLoading",!1),e.set("response",r);for(var a=r.getElementsByTagName("Contents"),n=a.length,i=[],o=0;n>o;o++){var s=a[o].getElementsByTagName("Size")[0].firstChild.data,l=a[o].getElementsByTagName("Key")[0].firstChild.data,c=new Date(a[o].getElementsByTagName("LastModified")[0].firstChild.data);i.push(App.S3File.create({name:l,size:s,lastModified:c,relativePath:l,baseUrl:t}))}e.set("files",i.sort(function(e,t){return t.lastModified-e.lastModified}))})}.observes("queryUrl").on("init")}),App.S3File=Ember.Object.extend({scriptTag:function(){var e=Handlebars.Utils.escapeExpression(this.get("url"));return new Handlebars.SafeString('<script src="'+e+'"></script>').toString()}.property("url"),url:function(){return this.get("baseUrl")+"/"+this.get("relativePath")}.property("baseUrl","relativePath")}),App.Project=Ember.Object.extend(),App.Project.reopenClass({FIXTURES:[{projectName:"Ember",projectFilter:"ember",projectRepo:"emberjs/ember.js",channel:"tagged"},{projectName:"Ember Data",projectFilter:"ember-data",projectRepo:"emberjs/data",channel:"tagged"},{projectName:"Ember",projectFilter:"ember",projectRepo:"emberjs/ember.js",initialVersion:"1.6.0",initialReleaseDate:"2014-07-07",lastRelease:"1.6.1",futureVersion:"1.6.2",channel:"release",date:"2014-07-15",changelogPath:"CHANGELOG.md"},{projectName:"Ember",projectFilter:"ember",projectRepo:"emberjs/ember.js",lastRelease:"1.7.0-beta.4",futureVersion:"1.7.0-beta.5",finalVersion:"1.7.0",channel:"beta",cycleEstimatedFinishDate:"2014-08-19",date:"2014-07-30",nextDate:"2014-08-06",changelogPath:"CHANGELOG.md"},{projectName:"Ember Data",projectFilter:"ember-data",projectRepo:"emberjs/data",lastRelease:"1.0.0-beta.8",futureVersion:"1.0.0-beta.9",channel:"beta",date:"2014-05-29",changelogPath:"CHANGELOG.md"},{projectName:"Ember",projectFilter:"ember",projectRepo:"emberjs/ember.js",channel:"canary"},{projectName:"Ember Data",projectFilter:"ember-data",projectRepo:"emberjs/data",channel:"canary"}],all:function(e){var t;return t=e?this.FIXTURES.filterBy("channel",e):this.FIXTURES,t.map(function(e){return App.Project.create(e)})},find:function(e,t){var r=this.all(e);return t?r.filterBy("projectName",t):r}}),App.BuildCategoryMixin=Ember.Mixin.create({renderTemplate:function(){this.render("build-list")}}),App.ApplicationController=Ember.ObjectController.extend({isIndexActive:function(){return this.isActiveChannel("index")}.property("currentRouteName"),isTaggedActive:function(){return this.isActiveChannel("tagged")}.property("currentRouteName"),isChannelsActive:function(){var e=this;return!["index","tagged"].some(function(t){return t===e.get("currentRouteName")})}.property("currentRouteName"),isReleaseActive:function(){return this.isActiveChannel("release")}.property("currentRouteName"),isBetaActive:function(){return this.isActiveChannel("beta")}.property("currentRouteName"),isCanaryActive:function(){return this.isActiveChannel("canary")}.property("currentRouteName"),isActiveChannel:function(e){return-1!==this.get("currentRouteName").indexOf(e)}}),App.ProjectsMixin=Ember.Mixin.create({projects:function(){var e=App.Project.find(this.get("channel")),t=this.get("model"),r=this;return e.forEach(function(e){if("beta"===e.channel){e.isEmberBeta="Ember"===e.projectName,[1,2,3,4,5].forEach(function(t){var r=e.lastRelease.split("."),a=parseInt(r[r.length-1],10);e["beta"+t+"Completed"]=a>=t,e["isBeta"+t]=t===a});var a=App.Project.find("release",e.projectName)[0];a&&(e.lastStableVersion=a.initialVersion,e.lastStableDate=a.initialReleaseDate)}e.files=t.filterFiles(e.projectFilter),e.description=r.description(e),e.lastReleaseDebugUrl=r.lastReleaseUrl(e.projectFilter,e.channel,e.lastRelease,".js"),e.lastReleaseProdUrl=r.lastReleaseUrl(e.projectFilter,e.channel,e.lastRelease,".prod.js"),e.lastReleaseMinUrl=r.lastReleaseUrl(e.projectFilter,e.channel,e.lastRelease,".min.js"),"canary"===e.channel?e.lastRelease="latest":"false"!==e.changelog&&(e.lastReleaseChangelogUrl="https://github.com/"+e.projectRepo+"/blob/v"+e.lastRelease+"/"+e.changelogPath)}),e}.property("channel","model"),description:function(e){var t,r=e.lastRelease,a=e.futureVersion;return t="tagged"===this.get("channel")?"":r?"The builds listed below are incremental improvements made since "+r+" and may become "+a+".":a?"The builds listed below are not based on a tagged release. Upon the next release cycle they will become "+a+".":"The builds listed below are based on the most recent development.",new Handlebars.SafeString(t)},lastReleaseUrl:function(e,t,r,a){return"canary"===t?"http://builds.emberjs.com/canary/"+e+a:"http://builds.emberjs.com/tags/v"+r+"/"+e+a}}),App.CanaryRoute=Ember.Route.extend(App.BuildCategoryMixin,{model:function(){return App.S3Bucket.create({title:"Canary Builds",prefix:"canary/"})}}),App.CanaryController=Ember.ObjectController.extend(App.ProjectsMixin,{templateName:"buildList",channel:"canary"}),App.BetaRoute=Ember.Route.extend(App.BuildCategoryMixin,{model:function(){return App.S3Bucket.create({title:"Beta Builds",prefix:"beta/"})}}),App.BetaController=Ember.ObjectController.extend(App.ProjectsMixin,{templateName:"buildList",channel:"beta"}),App.ReleaseRoute=Ember.Route.extend(App.BuildCategoryMixin,{model:function(){return App.S3Bucket.create({title:"Release Builds",prefix:"release/"})}}),App.ReleaseController=Ember.ObjectController.extend(App.ProjectsMixin,{templateName:"buildList",channel:"release"}),App.TaggedRoute=Ember.Route.extend(App.BuildCategoryMixin,{model:function(){var e=App.S3Bucket.create({title:"Tagged Release Builds",prefix:"tags/",delimiter:""});return e}}),App.TaggedController=Ember.ObjectController.extend(App.ProjectsMixin,{channel:"tagged"}),Ember.Handlebars.helper("format-bytes",function(e){return(e/1024).toFixed(2)+" KB"}),Ember.Handlebars.helper("format-date-time",function(e,t,r){return r||(r=t,t=null),t?moment(e).format(t):moment(e).fromNow()}),Ember.Handlebars.helper("isHiDPIScreen",function(){return window.getDevicePixelRatio()>1});