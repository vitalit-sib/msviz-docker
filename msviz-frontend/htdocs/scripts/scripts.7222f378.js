"use strict";angular.module("thirdparties",[]).service("_",["$window",function(a){return a._}]).service("d3",["$window",function(a){return a.d3}]).service("fishtones",["$window",function(a){return a.fishtones}]).service("pviz",["$window",function(a){return a.pviz}]),angular.module("msvizUiApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.select","thirdparties","environment","matches","sequences"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("msvizUiApp").controller("MainCtrl",["$scope","$q","_","searchService","psmService","SearchIdSet","matchesProteinRefService","sequenceService",function(a,b,c,d,e,f,g,h){d.list().then(function(b){a.searches.all=b.searchIds}),a.searches={selected:[]},a.proteinRefs={},a.proteinMatch={},a.$watch("searches.selected",function(b){void 0!==b&&0!==c.size(b)&&(a.searchIdSet=(new f).add(b),g.findBySearchId(b[0]).then(function(b){a.proteinRefs.all=b}))}),a.showProtein=function(){b.all([h.get(a.proteinRefs.selected.AC,a.proteinRefs.selected.source),e.findAllBySearchIdsAndProteinId(a.searchIdSet,a.proteinRefs.selected.AC)]).then(function(b){a.proteinMatch.protein=b[0],a.proteinMatch.psms=b[1],console.info("CHANGED proteinMatch",a.proteinMatch)})}}]),angular.module("environment",["angularytics"]).config(["AngularyticsProvider",function(a){a.setEventHandlers(["Console","GoogleUniversal"])}]).service("EnvConfig",["$location","Angularytics",function(a,b){var c=80===a.$$port;return c?{isProd:!0,backendUrl:"http://msviz.vital-it.ch/backend"}:{isProd:!1,backendUrl:"http://localhost:9000"}}]).service("httpProxy",["$http","EnvConfig",function(a,b){var c=function(){return this};return c.prototype.get=function(c,d){return a.get(b.backendUrl+c,d).then(function(a){return a.data})},new c}]).directive("swaggerDoc",["EnvConfig",function(a){return{restrict:"EA",template:'<a href="'+a.backendUrl+'/docs/index.html">backend REST doc</a>'}}]),angular.module("matches",["thirdparties","environment"]),angular.module("matches").service("psmService",["$http","EnvConfig","httpProxy",function(a,b,c){var d=function(){return this};return d.prototype.findAllBySearchIdsAndProteinId=function(a,b){return c.get("/match/psms/"+a.list().join(",")+"/by-ac/"+b)},new d}]).factory("MatchesPsmPvizView",["_","pviz",function(a,b){var c=function(c,d,e){var f=this;console.info("pviz",b);var g=new b.SeqEntry({sequence:d.sequence}),h=new b.SeqEntryAnnotInteractiveView({model:g,el:c});h.render();var i=a.map(e,function(a){return console.log(a),{category:a.searchId,type:"psm",start:a.proteinList[0].startPos,end:a.proteinList[0].endPos}});return g.addFeatures(i),console.log("rendering",h),f};return c}]).directive("matchesPsmPviz",["MatchesPsmPvizView",function(a){var b=function(b,c){b.$watch("proteinMatch.psms",function(){if(void 0!==b.proteinMatch.protein){new a(c,b.proteinMatch.protein,b.proteinMatch.psms)}})};return{restrict:"E",link:b,template:'<div id="haha" style="width:100%; height:400px"></div>'}}]),angular.module("matches").factory("SearchIdSet",["_",function(a){var b=function(){var a=this;return a._list={},a};return b.prototype.add=function(b){var c=this;return a.isArray(b)?(a.each(b,function(a){c.add(a)}),c):(c._list[b]=!0,c)},b.prototype.list=function(){return a.keys(this._list)},b.prototype.size=function(){return a.size(this._list)},b}]).service("searchService",["httpProxy",function(a){var b=function(){return this};return b.prototype.list=function(){return a.get("/match/searches")},new b}]).directive("matchesSearchSelect",function(){var a=function(a,b){};return{restrict:"E",link:a,templateUrl:"views/matches/searches/matchesSearchSelect.html"}}),angular.module("matches").service("matchesProteinRefService",["httpProxy",function(a){var b=function(){return this};return b.prototype.findBySearchId=function(b){return a.get("/match/proteins/"+b)},new b}]).directive("matchesProteinRefSelect",function(){var a=function(a,b){};return{restrict:"E",link:a,templateUrl:"views/matches/searches/matchesProteinRefSelect.html"}}),angular.module("sequences",["thirdparties","environment"]).service("sequenceService",["httpProxy",function(a){var b=function(){var a=this;return a};return b.prototype.get=function(b,c){return a.get("/sequence/"+c+"/"+b)},new b}]);