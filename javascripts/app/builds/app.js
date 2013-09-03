var App=Ember.Application.create({rootElement:"#builds-application"});App.Router.map(function(){this.resource("release",function(){this.route("latest"),this.route("daily")}),this.resource("beta",function(){this.route("latest"),this.route("daily")}),this.resource("canary",function(){this.route("latest"),this.route("daily")}),this.route("tagged")}),App.CopyClipboardComponent=Ember.Component.extend({tagName:"span",didInsertElement:function(){var e=new ZeroClipboard(this.$("a"),{moviePath:"/images/ZeroClipboard.swf",trustedDomains:["*"],allowScriptAccess:"always"})}}),App.S3Bucket=Ember.Object.extend({files:[],isLoading:!1,useSSL:!1,delimiter:"/",bucket:"builds.emberjs.com",endpoint:"s3.amazonaws.com",protocol:function(){return this.get("useSSL")?"https://":"http://"}.property("useSSL"),hostname:function(){return this.get("bucket")?this.get("endpoint")+"/"+this.get("bucket"):this.get("endpoint")}.property("bucket","endpoint"),delimiterParameter:function(){var e=this.getWithDefault("delimiter","").toString();return e?"delimiter="+e:""}.property("delimiter"),markerParameter:function(){return"marker="+this.getWithDefault("marker","").toString()}.property("marker"),maxKeysParameter:function(){return"max-keys="+this.getWithDefault("maxKeys","").toString()}.property("maxKeys"),prefixParameter:function(){return"prefix="+this.getWithDefault("prefix","").toString()}.property("prefix"),baseUrl:function(){return this.get("protocol")+this.get("hostname")}.property("protocol","hostname"),objectBaseUrl:function(){return this.get("protocol")+this.get("bucket")}.property("protocol","bucket"),queryParams:function(){return this.get("delimiterParameter")+"&"+this.get("markerParameter")+"&"+this.get("maxKeysParameter")+"&"+this.get("prefixParameter")}.property("delimiterParameter","markerParameter","maxKeysParameter","prefixParameter"),url:function(){return this.get("baseUrl")+"?"+this.get("queryParams")}.property("baseUrl","queryParams"),filesPresent:function(){return this.get("files").length}.property("files.@each"),load:function(){var e=this,t=this.get("objectBaseUrl");this.set("isLoading",!0),Ember.$.get(this.get("url"),function(n){e.set("isLoading",!1),e.set("response",n);var r=n.getElementsByTagName("Contents"),i=r.length,s=[];for(var o=0;o<i;o++){var u=r[o].getElementsByTagName("Size")[0].firstChild.data,a=r[o].getElementsByTagName("Key")[0].firstChild.data,f=new Date(r[o].getElementsByTagName("LastModified")[0].firstChild.data);s.push(App.S3File.create({name:a,size:u,lastModified:f,relativePath:a,baseUrl:t}))}e.set("files",s.sort(function(e,t){return t.lastModified-e.lastModified}))})}.observes("queryUrl").on("init")}),App.S3File=Ember.Object.extend({scriptTag:function(){var e=Handlebars.Utils.escapeExpression(this.get("url"));return(new Handlebars.SafeString('<script src="'+e+'"></script>')).toString()}.property("url"),url:function(){return this.get("baseUrl")+"/"+this.get("relativePath")}.property("baseUrl","relativePath")}),App.BetaRoute=Ember.Route.extend({redirect:function(){this.transitionTo("beta.latest")}}),App.BetaLatestRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Beta Builds",prefix:"beta/"})}}),App.BetaDailyRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Beta Builds",delimiter:"",prefix:"beta/daily",marker:"beta/daily/"+moment().subtract("days",14).format("YYYYMMDD")})}}),App.CanaryRoute=Ember.Route.extend({redirect:function(){this.transitionTo("canary.latest")}}),App.CanaryLatestRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Canary Builds",prefix:"latest/"})}}),App.CanaryDailyRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Canary Builds",delimiter:"",prefix:"canary/daily",marker:"canary/daily/"+moment().subtract("days",14).format("YYYYMMDD")})}}),App.ReleaseRoute=Ember.Route.extend({redirect:function(){this.transitionTo("release.latest")}}),App.ReleaseLatestRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Release Builds",prefix:"stable/"})}}),App.ReleaseDailyRoute=Ember.Route.extend({model:function(){return App.S3Bucket.create({title:"Release Builds",delimiter:"",prefix:"stable/daily",marker:"stable/daily/"+moment().subtract("days",14).format("YYYYMMDD")})}}),App.TaggedRoute=Ember.Route.extend({model:function(){var e=App.S3Bucket.create({title:"Tagged Release Builds",prefix:"tags/",delimiter:""});return e}}),Ember.Handlebars.helper("format-bytes",function(e){return(e/1024).toFixed(2)+" KB"}),Ember.Handlebars.helper("format-date-time",function(e){return moment(e).fromNow()});