"use strict";angular.module("thirdparties",[]).service("_",["$window",function(a){return a._}]).service("d3",["$window",function(a){return a.d3}]).service("fishtones",["$window",function(a){return a.fishtones}]).service("pviz",["$window",function(a){return a.pviz}]),angular.module("msvizUiApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.select","thirdparties","environment","fishtones-wrapper","matches-psms","matches-basket","matches-psms-list","matches-protein","searches-list","qcSummary-list","matches-modif-filter","multi-searches","psms-alignment","ssm","sequences","experimental","xic","xic-services"]).config(["$routeProvider",function(a){a.when("/",{redirectTo:"/searches"}).when("/searches",{templateUrl:"scripts/main/searches/searches-list.html",controller:"SearchListCtrl"}).when("/qcSummary",{templateUrl:"scripts/main/qc/qcSummary-list.html",controller:"QcSummaryListCtrl"}).when("/proteins/:searchId",{templateUrl:"scripts/main/searches/proteinsID-list.html",controller:"ProteinIDsListCtrl"}).when("/compare/:searchIds",{templateUrl:"scripts/main/compare/searches/multi-searches.html",controller:"MultiSearchListCtrl"}).when("/compare/:searchIds/protein/:proteinAC",{templateUrl:"scripts/main/compare/protein/compare-protein.html",controller:"PsmsAlignmentCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("environment",["angularytics"]).config(["AngularyticsProvider",function(a){a.setEventHandlers(["Console","GoogleUniversal"])}]).service("EnvConfig",["$location","Angularytics",function(a,b){var c=80===a.$$port;return c?{isProd:!0,backendUrl:"http://msviz.vital-it.ch/backend"}:{isProd:!1,backendUrl:"http://localhost:9000"}}]).service("httpProxy",["$http","EnvConfig",function(a,b){var c=function(){return this};return c.prototype.get=function(c,d){return a.get(b.backendUrl+c,d).then(function(a){return a.data})},new c}]).directive("swaggerDoc",["EnvConfig",function(a){return{restrict:"EA",template:'<a href="'+a.backendUrl+'/docs/index.html">backend REST doc</a>'}}]),angular.module("fishtones-wrapper",["thirdparties"]).service("fishtonifyService",["_","fishtones",function(a,b){var c=function(){return this.richSeqShortcuter=new b.dry.RichSequenceShortcuter,this};return c.prototype.convertSpectrum=function(a){return new b.wet.ExpMSMSSpectrum({precMoz:a.ref.precursor.moz,precIntensity:a.ref.precursor.intensity,retentionTime:a.ref.precursor.retentionTime,precCharge:a.ref.precursor.charge,scanNumber:a.ref.scanNumber,mozs:a.peaks.mozs,intensities:a.peaks.intensities,intensityRanks:a.peaks.intensityRanks})},c.prototype.buildRichSeq=function(c){var d=this,e=(new b.dry.RichSequence).fromString(c.pep.sequence);return a.each(c.pep.modificationNames,function(c,d){a.each(c,function(a){e.addModification(d-1,b.dry.ResidueModificationDictionary.get(a))})}),{richSeq:e,richSeqShortcut:d.richSeqShortcuter.richSeqToString(e)}},new c}]),angular.module("matches-psms",["protein-matches-pviz-view","psm-service","thirdparties","environment","fishtones-wrapper"]).directive("matchesPsmPviz",["pviz","ProteinMatchesGlobalPvizView","fishtones","fishtonifyService","spectrumService",function(a,b,c,d,e){var f=function(a,b){b.fishTones=d.buildRichSeq(b),b.fishTones.theoMoz=c.dry.MassBuilder.computeMassRichSequence(b.fishTones.richSeq),e.findByRunIdAndId(b.spectrumId.runId,b.spectrumId.id).then(function(c){var e=d.convertSpectrum(c);b.fishTones.spectrum=e,a.$broadcast("basket-add",{type:"psm",bean:b})})},g=function(c,d){a.FeatureDisplayer.addMouseoverCallback(["psm"],function(a){c.$broadcast("show-match",{type:"psm",bean:a.data})}),a.FeatureDisplayer.addClickCallback(["psm"],function(a){f(c,a.data),c.pvizView.addSelPsm(a.data),c.pvizView.refreshView()}),c.$watch("proteinMatch",function(a){if(void 0!==a){var e=new b(d,a);return c.pvizView=e,e}}),a.FeatureDisplayer.addClickCallback(["aaInfo"],function(a){c.$broadcast("show-ptm-matches",{pos:a.data.pos})}),a.FeatureDisplayer.addClickCallback(["aaModif"],function(a){c.$broadcast("show-ptm-matches",{pos:a.start+1})}),a.FeatureDisplayer.addClickCallback(["ptmCount"],function(a){c.$broadcast("show-ptm-matches",{pos:a.data.pos})}),c.$on("show-ptm-matches",function(a,b){c.pvizView.setSelPsmPos(b.pos),c.pvizView.refreshView()}),c.$on("basket-remove",function(a,b){c.pvizView.removeSelPsm(b),c.pvizView.refreshView()})};return{restrict:"E",object:{proteinMatch:"="},link:g,template:'<div style="width:100%; height:400px"></div>'}}]).controller("MatchesPSMCtrl",["$scope","_","psmService",function(a,b,c){a.loadPSMSForSpectrum=function(){c.findAllBySearchIdAndSpectrumId(a.psm.searchId,a.psm.spectrumId.id).then(function(b){b.length>1&&(a.psm4spectrum=b)})},a.loadPSMSForSpectrum(),a.expandOtherMatchTable=function(){a.tableExpanded=a.tableExpanded?!1:!0}}]).directive("matchesPsmBox",function(){return{restrict:"E",scope:{psm:"="},templateUrl:"scripts/main/compare/protein/basket/matches-psm-box.html"}}).controller("detailedMatchCtrl",["$scope",function(a){a.$on("show-match",function(b,c){delete a.psm,delete a.psmIsoModif,a[c.type]=c.bean,a.$apply()})}]).directive("matchesOneLiner",function(){return{restrict:"E",templateUrl:"scripts/main/compare/protein/alignment/matches-one-liner.html"}}),angular.module("matches-psms-list",["thirdparties","environment","fishtones-wrapper"]).factory("MatchesFishtonesPsmSpectrumView",["_","fishtones",function(a,b){var c=function(a,c){var d=this,e=new b.match.PSMAlignment({richSequence:c.richSeq,expSpectrum:c.spectrum}),f=new b.match.MatchSpectrumView({model:e,el:a,tol:1e3,xZoomable:!0});return f.render(),d};return c}]).factory("MatchesFishtonesSSMSpectrumView",["_","fishtones","fishtonifyService",function(a,b,c){var d=function(a,d){var e=this,f=new b.match.SpectraPairAlignment({spectrumA:c.convertSpectrum(d.sp1),spectrumB:c.convertSpectrum(d.sp2)}),g=new b.match.SpectraPairAlignmentView({el:a,model:f,fragTol:50,enhanced:!0});return g.xZoomable(),g.render(),e};return d}]).directive("matchesFishtonesPsmSpectrum",["pviz","MatchesFishtonesPsmSpectrumView",function(a,b){var c=function(a,c){var d=new b(c,a.fishtonespsm);return d};return{link:c,scope:{fishtonespsm:"="},restrict:"A",template:"<div></div>"}}]).directive("matchesFishtonesSsm",["pviz","MatchesFishtonesSSMSpectrumView",function(a,b){var c=function(a,c){var d=new b(c,a.fishtonesssm);return d};return{link:c,scope:{fishtonesssm:"="},restrict:"A",template:"<div></div>"}}]),angular.module("matches-basket",["thirdparties","environment"]).controller("MatchesBasketCtrl",["$scope","$q","_",function(a,b,c){a.selectedItems=[],a.$on("basket-add",function(b,c){a.addSelected(c)}),a.addSelected=function(b){console.log(b.bean);var c=b.bean.fishTones.spectrum.attributes,d={precCharge:c.precCharge,precIntensity:c.precIntensity,precMoz:c.precMoz,retentionTime:c.retentionTime,searchId:b.bean.searchId},e={type:b.type,firstPsm:b.bean,otherPsms:[],ms2Info:d};a.selectedItems.push(e)},a.zoomSpectrum=function(a){console.log("zoom spectrum:"),console.log(a)},a.removeSelectedPSM=function(b){a.selectedItems=c.filter(a.selectedItems,function(a){return a.firstPsm!==b});var d={searchId:b.searchId,spNr:b.spectrumId.id};a.$emit("basket-remove",d)},a.loadXic=function(b){var c=b.firstPsm.fishTones.spectrum.attributes,d={precCharge:c.precCharge,precIntensity:c.precIntensity,precMoz:c.precMoz,retentionTime:c.retentionTime,searchId:b.firstPsm.searchId};a.$emit("show-xic-emit",d)}}]).directive("matchesBasketDetailsAll",function(){return{restrict:"E",templateUrl:"scripts/main/compare/protein/basket/detailed-all.html"}}),angular.module("matches-psm-iso-modif",["thirdparties"]).factory("PSMIsoModif",["_",function(a){var b=function(a){var b=this;return b._psms=a.psms,b._fixModif=a.fixModif,b._varModif=a.varModif,b._description=a.description,b};return b.prototype.getPSMs=function(){return this._psms},b.prototype.getFixModif=function(){return this._fixModif},b.prototype.getVarModif=function(){return this._varModif},b.prototype.getDescription=function(){var b=this;if(void 0===b._description){var c=b._psms[0].pep.sequence+" x"+b.countPSM();a.size(b._fixModif)&&(c+=" fixed:"+a.map(b._fixModif,function(a,b){return b+"@("+a.pos.join("/")+")"}).join(", ")),a.size(b._varModif)&&(c+=" variables:"+a.map(b._varModif,function(a,b){return b+" "+a.count+"@("+a.pos.join("/")+")"}).join(", ")),b._description=c}return b._description},b.prototype.countPSM=function(){return this._psms.length},b.prototype.getProteinList=function(){return this._psms[0].proteinList},b.prototype.hasUniquePSM=function(){return 1===this._psms.length},b}]).service("psmIsoModifBuilder",["_","PSMIsoModif",function(a,b){var c=function(){};return c.prototype._projectModif=function(b){var c=a.chain(b.pep.modificationNames).map(function(b,c){return a.map(b,function(a){return{modif:a,pos:c}})}).flatten().value();return c},c.prototype.buildList=function(b){var c=this;return a.chain(b).groupBy(function(b){return b.pep.sequence+":"+a.chain(c._projectModif(b)).groupBy("modif").map(function(a,b){return{modif:b,count:a.length}}).sortBy("modif").map(function(a){return a.modif+":"+a.count}).value().join(";")}).map(function(a){return c.buildOnePSMIsoModif(a)}).value()},c.prototype.buildOnePSMIsoModif=function(c){var d={},e=c[0].pep.sequence.length+2;a.each(c,function(b){a.each(b.pep.modificationNames,function(b,c){a.each(b,function(b){void 0===d[b]&&(d[b]=[],a.times(e,function(a){d[b][a]=0})),void 0===d[b][c]?d[b][c]=1:d[b][c]++})})});var f=a.size(c),g={},h={};return a.each(d,function(b,c){var d=[],e=[],i=0;a.each(b,function(a,b){if(0!==a){if(a===f)return void e.push(b-1);i+=a,d.push(b-1)}}),a.size(e)>0&&(g[c]={pos:e}),a.size(d)>0&&(h[c]={pos:d,count:i/f})}),new b({psms:c,fixModif:g,varModif:h})},new c}]),angular.module("ssm",["fishtones-wrapper"]).service("ssmService",["$http","EnvConfig","httpProxy",function(a,b,c){var d=function(){return this};return d.prototype.findSimilarSpectra=function(a){return c.get("/match/sim/"+a.runId+"/"+a.id+"/0.3/0.2")},new d}]),angular.module("searches-list",["thirdparties","environment"]).service("searchService",["httpProxy",function(a){var b=function(){return this};return b.prototype.list=function(){return a.get("/search")},new b}]).controller("SearchListCtrl",["$scope","searchService","$location",function(a,b,c){b.list().then(function(b){a.searches=b}),a.ids=[],a.selectedIds=[],a.searchIds="",a.titles="",a.addId=function(b){a.ids.push(b)},a.updateId=function(b){var c=a.selectedIds.indexOf(b);c>-1?a.selectedIds.splice(c,1):a.selectedIds.push(b)},a.getSearchIds=function(){a.selectedIds.forEach(function(b){var c=a.searches[b];""===a.searchIds?(a.searchIds=a.searchIds.concat(c.searchId),a.titles=a.titles.concat(c.title)):(a.searchIds=a.searchIds.concat(",").concat(c.searchId),a.titles=a.titles.concat(",").concat(c.title))});var b="compare/".concat(a.searchIds);c.path(b).search({param:a.titles})},a.checkAll=function(){a.ids.forEach(function(b){a.ids[b].checked=!0,a.selectedIds.push(b)})}}]),angular.module("qcSummary-list",["thirdparties","environment"]).service("qcSummaryService",["httpProxy",function(a){var b=function(){return this};return b.prototype.list=function(){return a.get("/qc/summary")},new b}]).controller("QcSummaryListCtrl",["$scope","qcSummaryService",function(a,b){b.list().then(function(b){a.summaries=b}),a.entries=[],a.selectedEntries=[],a.addId=function(b){a.entries.push(b)},a.updateId=function(b){var c=a.selectedEntries.indexOf(b);c>-1?a.selectedEntries.splice(c,1):a.selectedEntries.push(b)},a.checkAll=function(){a.summaries.forEach(function(a){a.Selected=!0,console.log(a)})}}]),angular.module("matches-protein",["thirdparties","environment","matches-psm-iso-modif"]).service("proteinMatchesRefService",["httpProxy",function(a){var b=function(){return this};return b.prototype.findBySearchId=function(b){return a.get("/match/protein-matches/"+b)},new b}]).controller("ProteinIDsListCtrl",["$scope","$routeParams","proteinMatchesRefService",function(a,b,c){a.searchId=b.searchId,c.findBySearchId(a.searchId).then(function(b){a.proteins=b})}]).factory("ProteinMatch",["_","psmIsoModifBuilder",function(a,b){var c=function(b,c,d){var e=this;return d=a.extend({},d),e._protein=b,e._psms=c,e._targetModification=d.targetModification,e};return c.prototype.getProtein=function(){return this._protein},c.prototype.getPSMs=function(){return this._psms},c.prototype.getTargetModification=function(){return this._targetModification},c.prototype.getMyBestPSMs=function(){var b=this,c=b.getProtein().proteinRef.identifiers,d=a.map(b.getPSMs(),function(b){var d=a.extend({},b);return d.proteinList=a.filter(b.proteinList,function(b){return a.contains(c,b.proteinRef.AC)}),d});return a.filter(d,function(a){return 1===a.matchInfo.rank})},c.prototype.getMyPSMs=function(){var b=this,c=b.getProtein().proteinRef.identifiers;return a.map(b.getPSMs(),function(b){var d=a.extend({},b);return d.proteinList=a.filter(b.proteinList,function(b){return a.contains(c,b.proteinRef.AC)}),d})},c.prototype.getMyPSMIsoModif=function(){var a=this;return b.buildList(a.getMyPSMs())},c.prototype.getAminoAcidInfo=function(){var b=this,c={},d=b.getTargetModification(),e=b.getProtein().sequence.split("");return a.each(b.getMyBestPSMs(),function(b){var f=function(c){return a.contains(b.pep.modificationNames[c],d)};a.each(b.proteinList,function(g){var h;for(h=g.startPos;h<=g.endPos;h++){var i;if(c[b.searchId]||(c[b.searchId]=[]),i=void 0===c[b.searchId][h]?c[b.searchId][h]={searchId:b.searchId,aa:e[h-1],pos:h,psms:[],depth:0}:c[b.searchId][h],d){var j;j=h===g.startPos?[0,1]:h===g.endPos?[h-g.startPos+1,h-g.startPos+2]:[h-g.startPos+1],a.some(j,f)&&(i.nbTargetModification=i.nbTargetModification?i.nbTargetModification+1:1)}i.psms.push(b),i.depth++}})}),a.chain(c).values().flatten().filter(function(a){return void 0!==a}).value()},c.prototype.getTargetAminoAcidWithTargetModif=function(){var b=this;return a.filter(b.getAminoAcidInfo(),function(a){return a.nbTargetModification})},c}]),angular.module("multi-searches",["thirdparties","environment","matches-modif-filter"]).service("multiSearchService",["httpProxy",function(a){var b=function(){return this};return b.prototype.findByMultiSearchId=function(b,c){return a.get("/compare/"+b+c)},b.prototype.prepareAmountProteins=function(a){var b={},c=Object.keys(a);return c.forEach(function(c){var d=Object.keys(a[c]);d.forEach(function(a){b[a]=b.hasOwnProperty(a)?b[a]+1:1})}),b},b.prototype.prepareInfoMap=function(a,b){var c=this,d=Object.keys(a),e=[];return d.forEach(function(d){var f=c.getProteinIdents.apply(void 0,[a,d,b]),g=0,h=null;f.protIdents.forEach(function(a){a&&(g+=a.mainProt.score.mainScore),!h&&a&&(h=a.mainProt.source)});var i={ac:d,source:h,score:g,datatable:f.datatable};e.push(i)}),e},b.prototype.prepareProteinInfos=function(a,b){var c=this,d={};return d.amountProteinHash=c.prepareAmountProteins(a),d.proteinInfos=c.prepareInfoMap(a,b),d},b.prototype.getProteinIdents=function(a,b,c){var d={},e=a[b],f=[],g=[],h=[],i=[];return c.forEach(function(a){e[a]?(f.push(e[a]),g.push(e[a].mainProt.score.mainScore.toFixed(0)),h.push(e[a].mainProt.nrPsms),i.push(e[a].mainProt.nrSequences)):(f.push(null),g.push(null),h.push(null),i.push(null))}),d.datatable=g.concat(h,i),d.protIdents=f,d},new b}]).controller("MultiSearchListCtrl",["$scope","$routeParams","$location","multiSearchService","ModifFilter",function(a,b,c,d,e){a.searchIds=b.searchIds.split(","),a.titles=c.search().param.split(","),d.findByMultiSearchId(a.searchIds,"").then(function(b){a.proteins=d.prepareProteinInfos(b,a.searchIds)});var f=function(){var c=void 0!==a.modifFilter.getSelectedModification()?"?withModif="+a.modifFilter.getSelectedModification():"";d.findByMultiSearchId(b.searchIds,c).then(function(b){a.proteins=d.prepareProteinInfos(b,a.searchIds)})};a.modifFilter=new e({onComplete:f,searchIds:a.searchIds})}]),angular.module("psms-alignment",["matches-modif-filter","matches-protein","sequences","matches-psms","thirdparties","environment","xic-services"]).controller("PsmsAlignmentCtrl",["$scope","$routeParams","$q","psmService","sequenceService","ProteinMatch","ModifFilter",function(a,b,c,d,e,f,g){a.searchIds=b.searchIds.split(",");var h=b.proteinAC.split(":");a.proteinAC=h[0],a.database=h[1],a.$on("show-xic-emit",function(b,c){a.$broadcast("show-xic-broadcast",c)});var i=function(){e.getSource(a.searchIds[0],a.database).then(function(b){c.all([e.get(a.proteinAC,b),d.findAllBySearchIdsAndProteinId(a.searchIds,a.proteinAC)]).then(function(b){a.proteinMatch=new f(b[0],b[1],{targetModification:a.modifFilter.getSelectedModification()})})})};a.modifFilter=new g({onComplete:i,searchIds:a.searchIds}),i()}]),angular.module("sequences",["thirdparties","environment"]).service("sequenceService",["httpProxy",function(a){var b=function(){var a=this;return a};return b.prototype.get=function(b,c){return a.get("/sequence/"+c+"/"+b)},b.prototype.getSource=function(b,c){return a.get("/search/"+b).then(function(a){var b=a.database.filter(function(a){return a.id===c});return b[0].version})},new b}]),angular.module("experimental",["thirdparties","environment"]).service("spectrumService",["$http","EnvConfig","httpProxy",function(a,b,c){var d=function(){return this};return d.prototype.findByRunIdAndId=function(a,b){return c.get("/exp/spectrum/"+a+"/"+b+"?sortByMoz=true&mostIntense=200")},new d}]),angular.module("matches-modif-filter",["thirdparties","searches-list"]).factory("ModifFilter",["_","psmService",function(a,b){var c=function(b){var c=this;return b=a.extend({},b),c.onComplete=b.onComplete,c._searchIds=b.searchIds,c.init(),c};return c.prototype.init=function(){var c=this;return c._availableModifications=void 0,c._selectedModification=void 0,b.findAllModificationsBySearchIds(c._searchIds).then(function(b){var d=[{value:void 0,name:"None",count:void 0}];a.each(b,function(a,b){d.push({value:b,name:b,count:a})}),c._availableModifications=d})},c.prototype.setSelectedModification=function(a){var c=this;return c._selectedModification=a,b.findAllProteinRefsBySearchIds(c._searchIds,c._selectedModification).then(function(){c.onComplete(c)}),c},c.prototype.getSelectedModification=function(){return this._selectedModification},c}]).directive("modifFilter",function(){var a=function(){};return{link:a,restrict:"E",scope:{filter:"="},templateUrl:"scripts/main/compare/protein/modif-filter.html"}}),angular.module("protein-matches-pviz-view",["pviz-custom-psm","thirdparties","environment","fishtones-wrapper"]).factory("ProteinMatchesGlobalPvizView",["_","pviz","pvizCustomPsm",function(a,b,c){var d=c.yo;d++;var e=function(a,c){var d=this;d.selPsms=[],d.protMatch=c;var e=new b.SeqEntry({sequence:c.getProtein().sequence}),f=new b.SeqEntryAnnotInteractiveView({model:e,el:a});return f.render(),d.seqEntry=e,d._showAllPsm=!1,d.refreshView(),d};return e.prototype.refreshView=function(){var a=this;a.seqEntry.clear(),a.seqEntry.addFeatures(a.getFeaturesAATargetModif()),a.seqEntry.addFeatures(a.getFeaturesPTMsCount()),a.seqEntry.addFeatures(a.getFeaturesAAInfos()),a.seqEntry.addFeatures(a.getFeaturesPSMs())},e.prototype.getFeaturesPSMs=function(){var b=this,c=b.protMatch.getTargetModification(),d=b._selPsmPos,e=b.protMatch.getMyPSMs(),f=a.filter(e,function(a){var b=a.proteinList[0];return d<=b.endPos&&d>=b.startPos+1}),g=a.groupBy(f,function(a){return a.spectrumId.id+a.spectrumId.runId}),h=a.chain(g).map(function(b){var d=a.sortBy(b,function(a){return a.matchInfo.rank}),e=a.countBy(d,function(a){return a.matchInfo.score.mainScore}),f=a.keys(e)[0],g=[];a.each(d,function(b){var d=b.proteinList[0],e=d.endPos-d.startPos+1;a.each(b.pep.modificationNames,function(h,i){if(0!==a.size(h)){var j=Math.max(-.3,i-1);j=Math.min(e-.7,j);var k="",l="";b.matchInfo.score.mainScore===parseFloat(f)&&(l=h[0]!==c?!1:!0,k=1===b.matchInfo.rank?"first":"firstWithConflict");var m=j+d.startPos-1;a.findWhere(g,{pos:m})||g.push({pos:m,modifNames:h,text:h.join(","),modifRank:k,selectedModif:l})}})});var h=d[0],i=h.proteinList[0];return{groupSet:h.searchId,category:"psms",categoryName:"",type:"psm",start:i.startPos-1,end:i.endPos-1,data:h,modif:g}}).filter(Boolean).map(function(c){var d=a.find(b.selPsms,function(a){return a.searchId===c.data.searchId&&a.spNr===c.data.spectrumId.id});return c.isSelected=void 0!==d?!0:!1,c}).flatten().value();return h},e.prototype.getFeaturesPSMIsoModifs=function(){var b=this,c=b.protMatch.getTargetModification(),d=a.chain(b.protMatch.getMyPSMIsoModif()).map(function(b){return a.map(b.getProteinList(),function(d){var e=[],f=d.endPos-d.startPos+1,g=function(a){var b=Math.max(-.3,a);return b=Math.min(f-.7,b),b-1};return a.each(b.getFixModif(),function(b,f){a.each(b.pos,function(a){e.push({pos:g(a)+d.startPos,modifName:f,text:f,isTarget:f===c,isFix:!0})})}),a.each(b.getVarModif(),function(b,f){a.each(b.pos,function(a){e.push({pos:g(a)+d.startPos,modifName:f,text:f,isTarget:f===c,isVar:!0})})}),{category:"psmIsoModifs",categoryName:"",type:"psmIsoModif",start:d.startPos-1,end:d.endPos-1,data:b,modif:e}})}).flatten().value();return d},e.prototype.getFeaturesPTMsCount=function(){var b=this;return a.map(b.protMatch.getAminoAcidInfo(),function(a){return{groupSet:a.searchId,category:"ptmCounts",categoryName:"",type:"ptmCount",start:a.pos-1,end:a.pos-1,data:a}})},e.prototype.getFeaturesAAInfos=function(){var b=this;return a.map(b.protMatch.getAminoAcidInfo(),function(a){return{groupSet:a.searchId,category:"aaInfos",categoryName:"",type:"aaInfo",start:a.pos-1,end:a.pos-1,data:a}})},e.prototype.getFeaturesAATargetModif=function(){var b=this;return a.chain(b.protMatch.getTargetAminoAcidWithTargetModif()).uniq("pos").map(function(a){return{category:"aaModif",categoryName:"",type:"aaModif",start:a.pos-1,end:a.pos-1,text:a.aa+a.pos}}).value()},e.prototype.setSelPsmPos=function(a){var b=this;b._selPsmPos=a},e.prototype.removeSelPsm=function(a){var b=this;b.selPsms=b.selPsms.filter(function(b){return!(b.searchId===a.searchId&&b.spNr===a.spNr)})},e.prototype.addSelPsm=function(a){var b=this,c={searchId:a.searchId,spNr:a.spectrumId.id};b.selPsms.push(c)},e}]),angular.module("psm-service",["thirdparties","environment","fishtones-wrapper"]).service("psmService",["_","$http","EnvConfig","httpProxy","fishtonifyService",function(a,b,c,d,e){var f=function(){return this};return f.prototype.addFishtonesObjects=function(b){return a.each(b,function(a){a.fishTones=e.buildRichSeq(a)}),b},f.prototype.findAllBySearchIdsAndProteinId=function(a,b){var c=this,e="/match/psms/"+a.join(",")+"/by-ac/"+b;return d.get(e).then(c.addFishtonesObjects)},f.prototype.findAllBySearchIdAndSpectrumId=function(a,b){var c=this,e="/match/psms/"+a+"/by-spectrum/"+b;return d.get(e).then(c.addFishtonesObjects)},f.prototype.findAllProteinRefsBySearchIds=function(a,b){var c="/match/proteins/"+a.join(",");return b&&(c+="?withModif="+b),d.get(c)},f.prototype.findAllModificationsBySearchIds=function(a){return d.get("/match/modifications/"+a.join(","))},new f}]),angular.module("pviz-custom-psm",["thirdparties","environment","fishtones-wrapper"]).service("pvizCustomPsm",["_","pviz",function(a,b){var c=.1;b.FeatureDisplayer.trackHeightPerCategoryType.psms=.5,b.FeatureDisplayer.trackHeightPerCategoryType.ptmCounts=c,b.FeatureDisplayer.trackHeightPerCategoryType.psmIsoModifs=c,b.FeatureDisplayer.trackHeightPerCategoryType.aaInfos=c,b.FeatureDisplayer.setCustomHandler("psm",{appender:function(b,c,d,e){var f=c.selectAll("g.feature.internal.data."+e).data(d).enter().append("g").attr("class","feature internal data "+e);return f.append("line").attr({"class":function(a){return a.isSelected?"selected":""}}),f.selectAll("circle").data(function(b){return a.filter(b.modif,function(a){return a.selectedModif})}).enter().append("circle").attr({r:2,"class":function(a){return"first"===a.modifRank?"is-first":"firstWithConflict"===a.modifRank?"is-firstWithConflict":""}}),f.selectAll("rect").data(function(b){return a.filter(b.modif,function(a){return a.selectedModif===!1})}).enter().append("rect").attr({width:4,height:1,"class":function(a){return"first"===a.modifRank?"is-non-selected-modif":""}}),f},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.5*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.4)+1}).attr("x2",function(b){return a.scales.x(b.end+.4)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.pos)}),b.selectAll("rect").attr("x",function(b){return a.scales.x(b.pos)}),b}}),b.FeatureDisplayer.setCustomHandler("psmIsoModif",{appender:function(b,c,d,e){var f=c.selectAll("g.feature.internal.data."+e).data(d).enter().append("g").attr("class","feature internal data "+e);return f.append("line"),f.selectAll("circle").data(function(b){return a.filter(b.modif,function(a){return a.isFix})}).enter().append("circle").attr({r:2,"class":function(a){return a.isTarget?"is-target":""}}),f.selectAll("path").data(function(b){return a.filter(b.modif,function(a){return a.isVar})}).enter().append("g").attr("class","fixModif").append("path").attr({d:"M0,-3,L3,3,L-3,3L0,-3","class":function(a){return a.isTarget?"is-target":""}}),f},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.4)+1}).attr("x2",function(b){return a.scales.x(b.end+.4)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.pos)}),b.selectAll("g.fixModif").attr("transform",function(b){return"translate("+a.scales.x(b.pos)+",0)"}),b}}),b.FeatureDisplayer.setCustomHandler("ptmCount",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr("class","feature internal data "+d);return e.append("line").style("stroke-width",function(a){var b=a.data.depth;return 2>=b?b:9>=b?b/2+1:b/4+3.5}),e.filter(function(a){return a.data.nbTargetModification}).classed("has-target-modif",!0).append("circle").attr("r",function(a){var b=a.data.nbTargetModification;return 1===b?2:b>=10?15:1.5*b}),e},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.5)}).attr("x2",function(b){return a.scales.x(b.end+.5)}),b.selectAll("circle").attr("cx",function(b){return a.scales.x(b.start)}),b}}),b.FeatureDisplayer.setCustomHandler("aaInfo",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr("class","feature internal data "+d);return e.append("line").style("stroke-width",function(a){var b=a.data.depth;return 2>=b?1:4>=b?b/2:b/4}),e.filter(function(a){return a.data.nbTargetModification}).classed("has-target-modif",!0).append("circle").attr("r",5),e},positioner:function(a,b){return b.attr("transform",function(b){return"translate(0,"+.4*a.scales.y(.5+b.displayTrack)+")"}),b.selectAll("line").attr("x1",function(b){return a.scales.x(b.start-.5)}).attr("x2",function(b){return a.scales.x(b.end+.5)}),b}}),b.FeatureDisplayer.setCustomHandler("aaModif",{appender:function(a,b,c,d){var e=b.selectAll("g.feature.internal.data."+d).data(c).enter().append("g").attr({"class":"feature internal data "+d}).style("transform","rotate(-90deg)");return e.append("text").text(function(a){return a.text}).attr("x",-a.scales.y(.9)),e},positioner:function(a,b){return b.selectAll("text").attr("y",function(b){return a.scales.x(b.start)}),b}})}]),angular.module("xic",["thirdparties","environment","xic-services"]).directive("xicFishtones",["pviz","xicFishtonesView","_","httpProxy","$q",function(a,b,c,d,e){var f=function(a,c){var f=function(d,e,f){var g=b(c,d,a.searchIds,e,f);return g},g=function(a,b){var c="/exp/xic/"+a+"/"+b+"?tolerance=10.0&rtTolerance=10.0";return d.get(c)},h=a.item.ms2Info,i=[];a.searchIds.forEach(function(a){i.push(g(a,h.precMoz))}),e.all(i).then(function(a){f(a,h.retentionTime,h.searchId)})};return{link:f,restrict:"A"}}]),angular.module("xic-services",["thirdparties","environment","fishtones-wrapper"]).factory("xicFishtonesView",["fishtones",function(a){var b=function(b,c,d,e,f){var g=this,h=new a.wet.Injection,i=new a.wet.XICCollection,j=function(a){return a.attributes.name},k=new a.wet.XICMultiPaneView({model:i,el:b,groupBy:j}),l=k.yo;l++;for(var m=0;m<c.length;m++){var n=c[m],o=new a.wet.XIC;o.set({retentionTimes:n.rt}),o.set({intensities:n.intensities}),o.set({injection:h}),o.set({name:d[m]}),o.set({target:0}),d[m]===f&&o.set({selectedRt:e}),i.add(o)}return g};return b}]);