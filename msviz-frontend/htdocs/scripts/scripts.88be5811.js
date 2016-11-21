"use strict";angular.module("thirdparties",[]).service("_",["$window",function(a){return a._}]).service("d3",["$window",function(a){return a.d3}]).service("fishtones",["$window",function(a){return a.fishtones}]).service("pviz",["$window",function(a){return a.pviz}]),angular.module("msvizUiApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.select","thirdparties","environment","fishtones-wrapper","matches-psms","matches-basket","matches-psms-list","matches-proteins","matches-search","matches-search-results-filter","multi-matches-search","ssm","sequences","experimental"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/searches",{templateUrl:"views/matches/searches/search-list.html",controller:"SearchListCtrl"}).when("/proteins/:searchId",{templateUrl:"views/matches/searches/proteinsID-list.html",controller:"ProteinIDsListCtrl"}).when("/compare/:searchIds",{templateUrl:"views/matches/searches/multiSearchProteins-list.html",controller:"MultiSearchListCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("msvizUiApp").controller("MainCtrl",["$scope","$q","_","psmService","ProteinMatch","sequenceService","SearchResultsFilter",function(a,b,c,d,e,f,g){var h=function(){var c=a.searchResultsFilter.getSelectedProtein();b.all([f.get(c.AC,c.source),d.findAllBySearchIdsAndProteinId(a.searchResultsFilter.getSelectedSearchIds(),c.AC)]).then(function(b){a.proteinMatch=new e(b[0],b[1],{targetModification:a.searchResultsFilter.getSelectedModification()})})};a.searchResultsFilter=new g({onComplete:h})}]),angular.module("environment",["angularytics"]).config(["AngularyticsProvider",function(a){a.setEventHandlers(["Console","GoogleUniversal"])}]).service("EnvConfig",["$location","Angularytics",function(a,b){var c=80===a.$$port;return c?{isProd:!0,backendUrl:"http://msviz.vital-it.ch/backend"}:{isProd:!1,backendUrl:"http://localhost:9000"}}]).service("httpProxy",["$http","EnvConfig",function(a,b){var c=function(){return this};return c.prototype.get=function(c,d){return a.get(b.backendUrl+c,d).then(function(a){return a.data})},new c}]).directive("swaggerDoc",["EnvConfig",function(a){return{restrict:"EA",template:'<a href="'+a.backendUrl+'/docs/index.html">backend REST doc</a>'}}]),angular.module("fishtones-wrapper",["thirdparties"]).service("fishtonifyService",["_","fishtones",function(a,b){var c=function(){return this.richSeqShortcuter=new b.dry.RichSequenceShortcuter,this};return c.prototype.convertSpectrum=function(a){return new b.wet.ExpMSMSSpectrum({precMoz:a.ref.precursor.moz,precIntensity:a.ref.precursor.intensity,retentionTime:a.ref.precursor.retentionTime,precCharge:a.ref.precursor.charge,scanNumber:a.ref.scanNumber,mozs:a.peaks.mozs,intensities:a.peaks.intensities,intensityRanks:a.peaks.intensityRanks})},c.prototype.buildRichSeq=function(c){var d=this,e=(new b.dry.RichSequence).fromString(c.pep.sequence);return a.each(c.pep.modificationNames,function(c,d){a.each(c,function(a){e.addModification(d-1,b.dry.ResidueModificationDictionary.get(a))})}),{richSeq:e,richSeqShortcut:d.richSeqShortcuter.richSeqToString(e)}},new c}]),angular.module("matches-psms",["thirdparties","environment","fishtones-wrapper"]).service("psmService",["_","$http","EnvConfig","httpProxy","fishtonifyService",function(a,b,c,d,e){var f=function(){return this};return f.prototype.addFishtonesObjects=function(b){return a.each(b,function(a){a.fishTones=e.buildRichSeq(a)}),b},f.prototype.findAllBySearchIdsAndProteinId=function(a,b){var c=this,e="/match/psms/"+a.join(",")+"/by-ac/"+b;return d.get(e).then(c.addFishtonesObjects)},f.prototype.findAllBySearchIdAndSpectrumId=function(a,b){var c=this,e="/match/psms/"+a+"/by-spectrum/"+b;return d.get(e).then(c.addFishtonesObjects)},f.prototype.findAllProteinRefsBySearchIds=function(a,b){var c="/match/proteins/"+a.join(",");return b&&(c+="?withModif="+b),d.get(c)},f.prototype.findAllModificationsBySearchIds=function(a){return d.get("/match/modifications/"+a.join(","))},new f}]).service("pvizCustomPsm",["_","pviz",function(a,b){b.FeatureDisplayer.trackHeightPerCategoryType.psms=.4,b.FeatureDisplayer.setCustomHandler("psm",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr("class","feature internal data "+d);return e.append("line"),e.selectAll("circle").data(function(a){return a.modif}).enter().append("circle").attr({r:2,"class":function(a){return a.isTarget?"is-target":""}}),e},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.4)+1}).attr("x2",function(b){return a.scales.x(b.end+.4)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.pos)}),b}}),b.FeatureDisplayer.setCustomHandler("psmIsoModif",{appender:function(b,c,d,e){var f=c.selectAll("g.feature.internal.data."+e).data(d).enter().append("g").attr("class","feature internal data "+e);return f.append("line"),f.selectAll("circle").data(function(b){return a.filter(b.modif,function(a){return a.isFix})}).enter().append("circle").attr({r:2,"class":function(a){return a.isTarget?"is-target":""}}),f.selectAll("path").data(function(b){return a.filter(b.modif,function(a){return a.isVar})}).enter().append("g").attr("class","fixModif").append("path").attr({d:"M0,-3,L3,3,L-3,3L0,-3","class":function(a){return a.isTarget?"is-target":""}}),f},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.4)+1}).attr("x2",function(b){return a.scales.x(b.end+.4)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.pos)}),b.selectAll("g.fixModif").attr("transform",function(b){return"translate("+a.scales.x(b.pos)+",0)"}),b}}),b.FeatureDisplayer.setCustomHandler("aaInfo",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr("class","feature internal data "+d);return e.append("line").style("stroke-width",function(a){var b=a.data.depth;return 2>=b?b:4>=b?3:4}),e.filter(function(a){return a.data.nbTargetModification}).classed("has-target-modif",!0).append("circle").attr("r",5),e},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.5)}).attr("x2",function(b){return a.scales.x(b.end+.5)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.start)}),b}}),b.FeatureDisplayer.setCustomHandler("aaModif",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr({"class":"feature internal data "+d}).style("transform","rotate(-90deg)");return e.append("text").text(function(a){return a.text}).attr("x",-a.scales.y(.9)),e},positioner:function(a,b){return b.selectAll("text").attr("y",function(b){return a.scales.x(b.start)}),b}})}]).factory("ProteinMatchesGlobalPvizView",["_","pviz","pvizCustomPsm",function(a,b,c){var d=c.yo;d++;var e=function(a,c){var d=this;d.protMatch=c;var e=new b.SeqEntry({sequence:c.getProtein().sequence}),f=new b.SeqEntryAnnotInteractiveView({model:e,el:a});return f.render(),e.addFeatures(d.getFeaturesAATargetModif()),e.addFeatures(d.getFeaturesPSMs()),e.addFeatures(d.getFeaturesPSMIsoModifs()),e.addFeatures(d.getFeaturesAAInfos()),d};return e.prototype.getFeaturesPSMs=function(){var b=this,c=b.protMatch.getTargetModification(),d=a.chain(b.protMatch.getMyPSMs()).map(function(b){return a.map(b.proteinList,function(d){var e=[],f=d.endPos-d.startPos+1;return a.each(b.pep.modificationNames,function(b,g){if(0!==a.size(b)){var h=Math.max(-.3,g-1);h=Math.min(f-.7,h),e.push({pos:h+d.startPos-1,modifNames:b,text:b.join(","),isTarget:a.contains(b,c)})}}),{groupSet:b.searchId,category:"psms",categoryName:"",type:"psm",start:d.startPos-1,end:d.endPos-1,data:b,modif:e}})}).flatten().value();return d},e.prototype.getFeaturesPSMIsoModifs=function(){var b=this,c=b.protMatch.getTargetModification(),d=a.chain(b.protMatch.getMyPSMIsoModif()).map(function(b){return a.map(b.getProteinList(),function(d){var e=[],f=d.endPos-d.startPos+1,g=function(a){var b=Math.max(-.3,a);return b=Math.min(f-.7,b),b-1};return a.each(b.getFixModif(),function(b,f){a.each(b.pos,function(a){e.push({pos:g(a)+d.startPos,modifName:f,text:f,isTarget:f===c,isFix:!0})})}),a.each(b.getVarModif(),function(b,f){a.each(b.pos,function(a){e.push({pos:g(a)+d.startPos,modifName:f,text:f,isTarget:f===c,isVar:!0})})}),{category:"psmIsoModifs",categoryName:"",type:"psmIsoModif",start:d.startPos-1,end:d.endPos-1,data:b,modif:e}})}).flatten().value();return d},e.prototype.getFeaturesAAInfos=function(){var b=this;return a.map(b.protMatch.getAminoAcidInfo(),function(a){return{groupSet:a.searchId,category:"aaInfos",categoryName:"",type:"aaInfo",start:a.pos-1,end:a.pos-1,data:a}})},e.prototype.getFeaturesAATargetModif=function(){var b=this;return a.chain(b.protMatch.getTargetAminoAcidWithTargetModif()).uniq("pos").map(function(a){return{category:"aaModif",categoryName:"",type:"aaModif",start:a.pos-1,end:a.pos-1,text:a.aa+a.pos}}).value()},e}]).directive("matchesPsmPviz",["pviz","ProteinMatchesGlobalPvizView","fishtones","fishtonifyService","spectrumService",function(a,b,c,d,e){var f=function(a,b){b.fishTones=d.buildRichSeq(b),b.fishTones.theoMoz=c.dry.MassBuilder.computeMassRichSequence(b.fishTones.richSeq),e.findByRunIdAndId(b.spectrumId.runId,b.spectrumId.id).then(function(c){var e=d.convertSpectrum(c);b.fishTones.spectrum=e,a.$broadcast("basket-add",{type:"psm",bean:b})})},g=function(c,d){a.FeatureDisplayer.addMouseoverCallback(["psm"],function(a){c.$broadcast("show-match",{type:"psm",bean:a.data})}),a.FeatureDisplayer.addMouseoverCallback(["psmIsoModif"],function(a){c.$broadcast("show-match",{type:"psmIsoModif",bean:a.data})}),a.FeatureDisplayer.addClickCallback(["psm"],function(a){f(c,a.data)}),c.$watch("proteinMatch",function(a){if(void 0!==a){var c=new b(d,a);return c}})};return{restrict:"E",object:{proteinMatch:"="},link:g,template:'<div style="width:100%; height:400px"></div>'}}]).controller("MatchesPSMCtrl",["$scope","_","psmService",function(a,b,c){a.loadPSMSForSpectrum=function(){c.findAllBySearchIdAndSpectrumId(a.psm.searchId,a.psm.spectrumId.id).then(function(b){b.length>1&&(a.psm4spectrum=b)})},a.loadPSMSForSpectrum()}]).directive("matchesPsmBox",function(){return{restrict:"E",scope:{psm:"="},templateUrl:"views/matches/searches/matches-psm-box.html"}}).controller("detailedMatchCtrl",["$scope",function(a){a.$on("show-match",function(b,c){delete a.psm,delete a.psmIsoModif,a[c.type]=c.bean,a.$apply()})}]).directive("matchesOneLiner",function(){return{restrict:"E",templateUrl:"views/matches/searches/matches-one-liner.html"}}),angular.module("matches-psms-list",["thirdparties","environment","fishtones-wrapper"]).factory("MatchesFishtonesPsmSpectrumView",["_","fishtones",function(a,b){var c=function(a,c){var d=this,e=new b.match.PSMAlignment({richSequence:c.richSeq,expSpectrum:c.spectrum}),f=new b.match.MatchSpectrumView({model:e,el:a,tol:1e3,xZoomable:!0});return f.render(),d};return c}]).factory("MatchesFishtonesSSMSpectrumView",["_","fishtones","fishtonifyService",function(a,b,c){var d=function(a,d){var e=this,f=new b.match.SpectraPairAlignment({spectrumA:c.convertSpectrum(d.sp1),spectrumB:c.convertSpectrum(d.sp2)}),g=new b.match.SpectraPairAlignmentView({el:a,model:f,fragTol:50,enhanced:!0});return g.xZoomable(),g.render(),e};return d}]).directive("matchesFishtonesPsmSpectrum",["pviz","MatchesFishtonesPsmSpectrumView",function(a,b){var c=function(a,c){var d=new b(c,a.fishtonespsm);return d};return{link:c,scope:{fishtonespsm:"="},restrict:"A",template:"<div ></div>"}}]).directive("matchesFishtonesSsm",["pviz","MatchesFishtonesSSMSpectrumView",function(a,b){var c=function(a,c){var d=new b(c,a.fishtonesssm);return d};return{link:c,scope:{fishtonesssm:"="},restrict:"A",template:"<div ></div>"}}]),angular.module("matches-basket",["thirdparties","environment"]).controller("MatchesBasketCtrl",["$scope","$q","_","ssmService",function(a,b,c,d){a.selectedItems=[],a.$on("basket-add",function(b,c){a.addSelected(c)}),a.addSelected=function(b){c.contains(a.selectedItems,b)||a.selectedItems.push(b)},a.getSimSpectra=function(b){d.findSimilarSpectra(b).then(function(c){var d={type:"SSM",ref:b,matches:c};a.selectedItems.push(d)})},a.removeSelectedPSM=function(b){a.selectedItems=c.filter(a.selectedItems,function(a){return a!==b})}}]).directive("matchesBasketDetailsAll",function(){return{restrict:"E",templateUrl:"views/matches/basket/detailed-all.html"}}),angular.module("matches-psm-iso-modif",["thirdparties"]).factory("PSMIsoModif",["_",function(a){var b=function(a){var b=this;return b._psms=a.psms,b._fixModif=a.fixModif,b._varModif=a.varModif,b._description=a.description,b};return b.prototype.getPSMs=function(){return this._psms},b.prototype.getFixModif=function(){return this._fixModif},b.prototype.getVarModif=function(){return this._varModif},b.prototype.getDescription=function(){var b=this;if(void 0===b._description){var c=b._psms[0].pep.sequence+" x"+b.countPSM();a.size(b._fixModif)&&(c+=" fixed:"+a.map(b._fixModif,function(a,b){return b+"@("+a.pos.join("/")+")"}).join(", ")),a.size(b._varModif)&&(c+=" variables:"+a.map(b._varModif,function(a,b){return b+" "+a.count+"@("+a.pos.join("/")+")"}).join(", ")),b._description=c}return b._description},b.prototype.countPSM=function(){return this._psms.length},b.prototype.getProteinList=function(){return this._psms[0].proteinList},b.prototype.hasUniquePSM=function(){return 1===this._psms.length},b}]).service("psmIsoModifBuilder",["_","PSMIsoModif",function(a,b){var c=function(){};return c.prototype._projectModif=function(b){var c=a.chain(b.pep.modificationNames).map(function(b,c){return a.map(b,function(a){return{modif:a,pos:c}})}).flatten().value();return c},c.prototype.buildList=function(b){var c=this;return a.chain(b).groupBy(function(b){return b.pep.sequence+":"+a.chain(c._projectModif(b)).groupBy("modif").map(function(a,b){return{modif:b,count:a.length}}).sortBy("modif").map(function(a){return a.modif+":"+a.count}).value().join(";")}).map(function(a){return c.buildOnePSMIsoModif(a)}).value()},c.prototype.buildOnePSMIsoModif=function(c){var d={},e=c[0].pep.sequence.length+2;a.each(c,function(b){a.each(b.pep.modificationNames,function(b,c){a.each(b,function(b){void 0===d[b]&&(d[b]=[],a.times(e,function(a){d[b][a]=0})),void 0===d[b][c]?d[b][c]=1:d[b][c]++})})});var f=a.size(c),g={},h={};return a.each(d,function(b,c){var d=[],e=[],i=0;a.each(b,function(a,b){if(0!==a){if(a===f)return void e.push(b-1);i+=a,d.push(b-1)}}),a.size(e)>0&&(g[c]={pos:e}),a.size(d)>0&&(h[c]={pos:d,count:i/f})}),new b({psms:c,fixModif:g,varModif:h})},new c}]),angular.module("ssm",["fishtones-wrapper"]).service("ssmService",["$http","EnvConfig","httpProxy",function(a,b,c){var d=function(){return this};return d.prototype.findSimilarSpectra=function(a){return c.get("/match/sim/"+a.runId+"/"+a.id+"/0.3/0.2")},new d}]),angular.module("matches-search",["thirdparties","environment"]).factory("SearchSet",["_",function(a){var b=function(){var a=this;return a._list={},a};return b.prototype.add=function(b){var c=this;return a.isArray(b)?(a.each(b,function(a){c.add(a)}),c):(c._list[b.searchId]=b,c)},b.prototype.clear=function(){var b=this;return a.each(b.listIds(),function(a){delete b._list[a]}),b},b.prototype.remove=function(a){var b=this;return delete b._list[a.searchId],b},b.prototype.list=function(){return a.values(this._list)},b.prototype.listIds=function(b){var c=a.keys(this._list).sort();return b?c.join(b):c},b.prototype.size=function(){return a.size(this._list)},b}]).service("searchService",["httpProxy",function(a){var b=function(){return this};return b.prototype.list=function(){return a.get("/search")},new b}]).controller("SearchListCtrl",["$scope","searchService",function(a,b){b.list().then(function(b){a.searches=b}),a.ids=[],a.selectedIds=[],a.searchIds="",a.addId=function(b){a.ids.push(b)},a.updateId=function(b){var c=a.selectedIds.indexOf(b);c>-1?a.selectedIds.splice(c,1):a.selectedIds.push(b),console.log(a.selectedIds)},a.getSearchIds=function(){a.selectedIds.forEach(function(b){var c=a.searches[b];a.searchIds=""===a.searchIds?a.searchIds.concat(c.searchId):a.searchIds.concat(",").concat(c.searchId)}),console.log("String of searchIds="),console.log(a.searchIds)},a.checkAll=function(){a.ids.forEach(function(b){a.ids[b].checked=!0,a.selectedIds.push(b)})}}]),angular.module("matches-proteins",["thirdparties","environment","matches-psm-iso-modif"]).service("proteinMatchesRefService",["httpProxy",function(a){var b=function(){return this};return b.prototype.findBySearchId=function(b){return a.get("/match/protein-matches/"+b)},new b}]).controller("ProteinIDsListCtrl",["$scope","$routeParams","proteinMatchesRefService",function(a,b,c){a.searchId=b.searchId,c.findBySearchId(a.searchId).then(function(b){a.proteins=b})}]).factory("ProteinMatch",["_","psmIsoModifBuilder",function(a,b){var c=function(b,c,d){var e=this;return d=a.extend({},d),e._protein=b,e._psms=c,e._targetModification=d.targetModification,e};return c.prototype.getProtein=function(){return this._protein},c.prototype.getPSMs=function(){return this._psms},c.prototype.getTargetModification=function(){return this._targetModification},c.prototype.getMyPSMs=function(){var b=this,c=b.getProtein().proteinRef.identifiers;return a.map(b.getPSMs(),function(b){var d=a.extend({},b);return d.proteinList=a.filter(b.proteinList,function(b){return a.contains(c,b.proteinRef.AC)}),d})},c.prototype.getMyPSMIsoModif=function(){var a=this;return b.buildList(a.getMyPSMs())},c.prototype.getAminoAcidInfo=function(){var b=this,c={},d=b.getTargetModification(),e=b.getProtein().sequence.split("");return a.each(b.getMyPSMs(),function(b){var f=function(c){return a.contains(b.pep.modificationNames[c],d)};a.each(b.proteinList,function(g){var h;for(h=g.startPos;h<=g.endPos;h++){var i;if(c[b.searchId]||(c[b.searchId]=[]),i=void 0===c[b.searchId][h]?c[b.searchId][h]={searchId:b.searchId,aa:e[h-1],pos:h,psms:[],depth:0}:c[b.searchId][h],d){var j;j=h===g.startPos?[0,1]:h===g.endPos?[h-g.startPos+1,h-g.startPos+2]:[h-g.startPos+1],a.some(j,f)&&(i.nbTargetModification=i.nbTargetModification?i.nbTargetModification+1:1)}i.psms.push(b),i.depth++}})}),a.chain(c).values().flatten().filter(function(a){return void 0!==a}).value()},c.prototype.getTargetAminoAcidWithTargetModif=function(){var b=this;return a.filter(b.getAminoAcidInfo(),function(a){return a.nbTargetModification})},c}]),angular.module("multi-matches-search",["thirdparties","environment"]).service("multiSearchService",["httpProxy",function(a){var b=function(){return this};return b.prototype.findByMultiSearchId=function(b){return a.get("/compare/"+b)},new b}]).controller("MultiSearchListCtrl",["$scope","$routeParams","multiSearchService",function(a,b,c){a.searchIds=b.searchIds,c.findByMultiSearchId(a.searchIds).then(function(b){a.proteins=b})}]),angular.module("sequences",["thirdparties","environment"]).service("sequenceService",["httpProxy",function(a){var b=function(){var a=this;return a};return b.prototype.get=function(b,c){return a.get("/sequence/"+c+"/"+b)},new b}]),angular.module("experimental",["thirdparties","environment"]).service("spectrumService",["$http","EnvConfig","httpProxy",function(a,b,c){var d=function(){return this};return d.prototype.findByRunIdAndId=function(a,b){return c.get("/exp/spectrum/"+a+"/"+b+"?sortByMoz=true&mostIntense=200")},new d}]),angular.module("matches-search-results-filter",["thirdparties","matches-search"]).factory("SearchResultsFilter",["_","SearchSet","searchService","psmService",function(a,b,c,d){var e=function(c){var d=this;return c=a.extend({},c),d.onComplete=c.onComplete,d._selected={searches:new b},d._available={searches:new b},d.init(),d};return e.prototype.init=function(){var a=this;return a._available.searches.clear(),a._available.modifications=void 0,a._available.proteins=void 0,a._selected.modification=void 0,a._selected.protein=void 0,c.list().then(function(b){return a._available.searches.add(b)})},e.prototype.countAvailableSearches=function(){return a.size(this._available.searches.size())},e.prototype.getSelectedSearchIds=function(a){return this._selected.searches.listIds(a)},e.prototype.addSelectedSearch=function(a){var b=this;return b._selected.searches.add(a),b.updateSelectedSearches(),b},e.prototype.removeSelectedSearch=function(a){var b=this;return b._selected.searches.remove(a),b.updateSelectedSearches(),b},e.prototype.updateSelectedSearches=function(){var b=this,c=b.getSelectedSearchIds();return 0===a.size(c)?(delete b._available.modifications,delete b._available.proteins,b):(d.findAllModificationsBySearchIds(c).then(function(c){var d=[{value:void 0,name:"any",count:void 0}];a.each(c,function(a,b){d.push({value:b,name:b,count:a})}),b._available.modifications=d,c[b.getSelectedModification()]||delete b._selected.modification}),b)},e.prototype.setSelectedModification=function(a){var b=this;return b._selected.modification=a,b.updateSelectedModification(),b},e.prototype.getSelectedModification=function(){return this._selected.modification},e.prototype.updateSelectedModification=function(){var b=this;return d.findAllProteinRefsBySearchIds(b.getSelectedSearchIds(),b._selected.modification).then(function(c){b._available.proteins=c,a.find(c,function(c){return a.isEqual(c,b._selected.protein)})||delete b._selected.protein}),b},e.prototype.setSelectedProtein=function(a){var b=this;return b._selected.protein=a,b.updateSelectedProtein(),b},e.prototype.getSelectedProtein=function(){return this._selected.protein},e.prototype.updateSelectedProtein=function(){var a=this;return a.onComplete&&a.onComplete(a),a},e}]).directive("searchResultsFilter",function(){var a=function(){};return{link:a,restrict:"E",scope:{filter:"="},templateUrl:"views/matches/searches/search-results-filter.html"}});