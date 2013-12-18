!function(a,b,c){"use strict";function d(a){return null!=a&&""!==a&&"hasOwnProperty"!==a&&g.test("."+a)}function e(a,b){if(!d(b))throw f("badmember",'Dotted member path "@{0}" is invalid.',b);for(var e=b.split("."),g=0,h=e.length;h>g&&a!==c;g++){var i=e[g];a=null!==a?a[i]:c}return a}var f=b.$$minErr("$resource"),g=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;b.module("ngResource",["ng"]).factory("$resource",["$http","$q",function(a,d){function g(a){return h(a,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function h(a,b){return encodeURIComponent(a).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,b?"%20":"+")}function i(a,b){this.template=a,this.defaults=b||{},this.urlParams={}}function j(g,h,q){function r(a,b){var c={};return b=n({},h,b),m(b,function(b,d){p(b)&&(b=b()),c[d]=b&&b.charAt&&"@"==b.charAt(0)?e(a,b.substr(1)):b}),c}function s(a){return a.resource}function t(a){o(a||{},this)}var u=new i(g);return q=n({},k,q),m(q,function(e,g){var h=/^(POST|PUT|PATCH)$/i.test(e.method);t[g]=function(g,i,j,k){var q,v,w,x={};switch(arguments.length){case 4:w=k,v=j;case 3:case 2:if(!p(i)){x=g,q=i,v=j;break}if(p(g)){v=g,w=i;break}v=i,w=j;case 1:p(g)?v=g:h?q=g:x=g;break;case 0:break;default:throw f("badargs","Expected up to 4 arguments [params, data, success, error], got {0} arguments",arguments.length)}var y=this instanceof t,z=y?q:e.isArray?[]:new t(q),A={},B=e.interceptor&&e.interceptor.response||s,C=e.interceptor&&e.interceptor.responseError||c;m(e,function(a,b){"params"!=b&&"isArray"!=b&&"interceptor"!=b&&(A[b]=o(a))}),h&&(A.data=q),u.setUrlParams(A,n({},r(q,e.params||{}),x),e.url);var D=a(A).then(function(a){var c=a.data,d=z.$promise;if(c){if(b.isArray(c)!==!!e.isArray)throw f("badcfg","Error in resource configuration. Expected response to contain an {0} but got an {1}",e.isArray?"array":"object",b.isArray(c)?"array":"object");e.isArray?(z.length=0,m(c,function(a){z.push(new t(a))})):(o(c,z),z.$promise=d)}return z.$resolved=!0,a.resource=z,a},function(a){return z.$resolved=!0,(w||l)(a),d.reject(a)});return D=D.then(function(a){var b=B(a);return(v||l)(b,a.headers),b},C),y?D:(z.$promise=D,z.$resolved=!1,z)},t.prototype["$"+g]=function(a,b,c){p(a)&&(c=b,b=a,a={});var d=t[g].call(this,a,this,b,c);return d.$promise||d}}),t.bind=function(a){return j(g,n({},h,a),q)},t}var k={get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}},l=b.noop,m=b.forEach,n=b.extend,o=b.copy,p=b.isFunction;return i.prototype={setUrlParams:function(a,c,d){var e,h,i=this,j=d||i.template,k=i.urlParams={};m(j.split(/\W/),function(a){if("hasOwnProperty"===a)throw f("badname","hasOwnProperty is not a valid parameter name.");!new RegExp("^\\d+$").test(a)&&a&&new RegExp("(^|[^\\\\]):"+a+"(\\W|$)").test(j)&&(k[a]=!0)}),j=j.replace(/\\:/g,":"),c=c||{},m(i.urlParams,function(a,d){e=c.hasOwnProperty(d)?c[d]:i.defaults[d],b.isDefined(e)&&null!==e?(h=g(e),j=j.replace(new RegExp(":"+d+"(\\W|$)","g"),h+"$1")):j=j.replace(new RegExp("(/?):"+d+"(\\W|$)","g"),function(a,b,c){return"/"==c.charAt(0)?c:b+c})}),j=j.replace(/\/+$/,""),j=j.replace(/\/\.(?=\w+($|\?))/,"."),a.url=j.replace(/\/\\\./,"/."),m(c,function(b,c){i.urlParams[c]||(a.params=a.params||{},a.params[c]=b)})}},j}])}(window,window.angular),function(a,b,c){"use strict";b.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(a,d){function e(){var a,e,f,i;for(a in h)k(g[a])&&d.cookies(a,c);for(a in g)e=g[a],b.isString(e)?e!==h[a]&&(d.cookies(a,e),i=!0):b.isDefined(h[a])?g[a]=h[a]:delete g[a];if(i){i=!1,f=d.cookies();for(a in g)g[a]!==f[a]&&(k(f[a])?delete g[a]:g[a]=f[a],i=!0)}}var f,g={},h={},i=!1,j=b.copy,k=b.isUndefined;return d.addPollFn(function(){var b=d.cookies();f!=b&&(f=b,j(b,h),j(b,g),i&&a.$apply())})(),i=!0,a.$watch(e),g}]).factory("$cookieStore",["$cookies",function(a){return{get:function(c){var d=a[c];return d?b.fromJson(d):d},put:function(c,d){a[c]=b.toJson(d)},remove:function(b){delete a[b]}}}])}(window,window.angular),function(a,b){"use strict";function c(){this.$get=["$$sanitizeUri",function(a){return function(b){var c=[];return f(b,i(c,function(b,c){return!/^unsafe/.test(a(b,c))})),c.join("")}}]}function d(a){var c=[],d=i(c,b.noop);return d.chars(a),c.join("")}function e(a){var b,c={},d=a.split(",");for(b=0;b<d.length;b++)c[d[b]]=!0;return c}function f(a,c){function d(a,d,f,h){if(d=b.lowercase(d),x[d])for(;s.last()&&y[s.last()];)e("",s.last());w[d]&&s.last()==d&&e("",d),h=t[d]||!!h,h||s.push(d);var i={};f.replace(m,function(a,b,c,d,e){var f=c||d||e||"";i[b]=g(f)}),c.start&&c.start(d,i,h)}function e(a,d){var e,f=0;if(d=b.lowercase(d))for(f=s.length-1;f>=0&&s[f]!=d;f--);if(f>=0){for(e=s.length-1;e>=f;e--)c.end&&c.end(s[e]);s.length=f}}var f,h,i,s=[],u=a;for(s.last=function(){return s[s.length-1]};a;){if(h=!0,s.last()&&z[s.last()])a=a.replace(new RegExp("(.*)<\\s*\\/\\s*"+s.last()+"[^>]*>","i"),function(a,b){return b=b.replace(p,"$1").replace(r,"$1"),c.chars&&c.chars(g(b)),""}),e("",s.last());else if(0===a.indexOf("<!--")?(f=a.indexOf("--",4),f>=0&&a.lastIndexOf("-->",f)===f&&(c.comment&&c.comment(a.substring(4,f)),a=a.substring(f+3),h=!1)):q.test(a)?(i=a.match(q),i&&(a=a.replace(i[0],""),h=!1)):o.test(a)?(i=a.match(l),i&&(a=a.substring(i[0].length),i[0].replace(l,e),h=!1)):n.test(a)&&(i=a.match(k),i&&(a=a.substring(i[0].length),i[0].replace(k,d),h=!1)),h){f=a.indexOf("<");var v=0>f?a:a.substring(0,f);a=0>f?"":a.substring(f),c.chars&&c.chars(g(v))}if(a==u)throw j("badparse","The sanitizer was unable to parse the following block of html: {0}",a);u=a}e()}function g(a){if(!a)return"";var b=/^(\s*)([\s\S]*?)(\s*)$/,c=b.exec(a);return c[0]="",c[2]&&(D.innerHTML=c[2].replace(/</g,"&lt;"),c[2]=D.innerText||D.textContent),c.join("")}function h(a){return a.replace(/&/g,"&amp;").replace(s,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function i(a,c){var d=!1,e=b.bind(a,a.push);return{start:function(a,f,g){a=b.lowercase(a),!d&&z[a]&&(d=a),d||A[a]!==!0||(e("<"),e(a),b.forEach(f,function(d,f){var g=b.lowercase(f),i="img"===a&&"src"===g||"background"===g;C[g]!==!0||B[g]===!0&&!c(d,i)||(e(" "),e(f),e('="'),e(h(d)),e('"'))}),e(g?"/>":">"))},end:function(a){a=b.lowercase(a),d||A[a]!==!0||(e("</"),e(a),e(">")),a==d&&(d=!1)},chars:function(a){d||e(h(a))}}}var j=b.$$minErr("$sanitize"),k=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,l=/^<\s*\/\s*([\w:-]+)[^>]*>/,m=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,n=/^</,o=/^<\s*\//,p=/<!--(.*?)-->/g,q=/<!DOCTYPE([^>]*?)>/i,r=/<!\[CDATA\[(.*?)]]>/g,s=/([^\#-~| |!])/g,t=e("area,br,col,hr,img,wbr"),u=e("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),v=e("rp,rt"),w=b.extend({},v,u),x=b.extend({},u,e("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),y=b.extend({},v,e("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),z=e("script,style"),A=b.extend({},t,x,y,w),B=e("background,cite,href,longdesc,src,usemap"),C=b.extend({},B,e("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,span,start,summary,target,title,type,valign,value,vspace,width")),D=document.createElement("pre");b.module("ngSanitize",[]).provider("$sanitize",c),b.module("ngSanitize").filter("linky",["$sanitize",function(a){var c=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,e=/^mailto:/;return function(f,g){function h(a){a&&n.push(d(a))}function i(a,c){n.push("<a "),b.isDefined(g)&&(n.push('target="'),n.push(g),n.push('" ')),n.push('href="'),n.push(a),n.push('">'),h(c),n.push("</a>")}if(!f)return f;for(var j,k,l,m=f,n=[];j=m.match(c);)k=j[0],j[2]==j[3]&&(k="mailto:"+k),l=j.index,h(m.substr(0,l)),i(k,j[0].replace(e,"")),m=m.substring(l+j[0].length);return h(m),a(n.join(""))}}])}(window,window.angular),function(a,b){"use strict";function c(){function a(a,c){return b.extend(new(b.extend(function(){},{prototype:a})),c)}function c(a,b){var c=b.caseInsensitiveMatch,d={originalPath:a,regexp:a},e=d.keys=[];return a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?|\*])?/g,function(a,b,c,d){var f="?"===d?d:null,g="*"===d?d:null;return e.push({name:c,optional:!!f}),b=b||"",""+(f?"":b)+"(?:"+(f?b:"")+(g&&"(.+?)"||"([^/]+)")+(f||"")+")"+(f||"")}).replace(/([\/$\*])/g,"\\$1"),d.regexp=new RegExp("^"+a+"$",c?"i":""),d}var d={};this.when=function(a,e){if(d[a]=b.extend({reloadOnSearch:!0},e,a&&c(a,e)),a){var f="/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";d[f]=b.extend({redirectTo:a},c(f,e))}return this},this.otherwise=function(a){return this.when(null,a),this},this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(c,e,f,g,h,i,j,k){function l(a,b){var c=b.keys,d={};if(!b.regexp)return null;var e=b.regexp.exec(a);if(!e)return null;for(var f=1,g=e.length;g>f;++f){var h=c[f-1],i="string"==typeof e[f]?decodeURIComponent(e[f]):e[f];h&&i&&(d[h.name]=i)}return d}function m(){var a=n(),d=q.current;a&&d&&a.$$route===d.$$route&&b.equals(a.pathParams,d.pathParams)&&!a.reloadOnSearch&&!p?(d.params=a.params,b.copy(d.params,f),c.$broadcast("$routeUpdate",d)):(a||d)&&(p=!1,c.$broadcast("$routeChangeStart",a,d),q.current=a,a&&a.redirectTo&&(b.isString(a.redirectTo)?e.path(o(a.redirectTo,a.params)).search(a.params).replace():e.url(a.redirectTo(a.pathParams,e.path(),e.search())).replace()),g.when(a).then(function(){if(a){var c,d,e=b.extend({},a.resolve);return b.forEach(e,function(a,c){e[c]=b.isString(a)?h.get(a):h.invoke(a)}),b.isDefined(c=a.template)?b.isFunction(c)&&(c=c(a.params)):b.isDefined(d=a.templateUrl)&&(b.isFunction(d)&&(d=d(a.params)),d=k.getTrustedResourceUrl(d),b.isDefined(d)&&(a.loadedTemplateUrl=d,c=i.get(d,{cache:j}).then(function(a){return a.data}))),b.isDefined(c)&&(e.$template=c),g.all(e)}}).then(function(e){a==q.current&&(a&&(a.locals=e,b.copy(a.params,f)),c.$broadcast("$routeChangeSuccess",a,d))},function(b){a==q.current&&c.$broadcast("$routeChangeError",a,d,b)}))}function n(){var c,f;return b.forEach(d,function(d){!f&&(c=l(e.path(),d))&&(f=a(d,{params:b.extend({},e.search(),c),pathParams:c}),f.$$route=d)}),f||d[null]&&a(d[null],{params:{},pathParams:{}})}function o(a,c){var d=[];return b.forEach((a||"").split(":"),function(a,b){if(0===b)d.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];d.push(c[f]),d.push(e[2]||""),delete c[f]}}),d.join("")}var p=!1,q={routes:d,reload:function(){p=!0,c.$evalAsync(m)}};return c.$on("$locationChangeSuccess",m),q}]}function d(){this.$get=function(){return{}}}function e(a,c,d,e,f){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(g,h,i,j,k){function l(){n&&(n.$destroy(),n=null),o&&(f.leave(o),o=null)}function m(){var i=a.current&&a.current.locals,j=i&&i.$template;if(j){var m=g.$new(),r=k(m,b.noop);r.html(j),f.enter(r,null,o||h,function(){!b.isDefined(p)||p&&!g.$eval(p)||c()}),l();var s=d(r.contents()),t=a.current;if(n=t.scope=m,o=r,t.controller){i.$scope=n;var u=e(t.controller,i);t.controllerAs&&(n[t.controllerAs]=u),r.data("$ngControllerController",u),r.children().data("$ngControllerController",u)}s(n),n.$emit("$viewContentLoaded"),n.$eval(q)}else l()}var n,o,p=i.autoscroll,q=i.onload||"";g.$on("$routeChangeSuccess",m),m()}}}var f=b.module("ngRoute",["ng"]).provider("$route",c);f.provider("$routeParams",d),f.directive("ngView",e),e.$inject=["$route","$anchorScroll","$compile","$controller","$animate"]}(window,window.angular);