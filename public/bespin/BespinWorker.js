bespin.tiki.register("::gherkin_syntax",{name:"gherkin_syntax",dependencies:{standard_syntax:"0.0.0"}});
bespin.tiki.module("gherkin_syntax:index",function(a,f){a=a("standard_syntax").StandardSyntax;var b={};b.start=[{regex:/^\s*(Scenario\sOutline:|Scenario:|Feature:|Background:|Esquema do Cenário:|Esquema do Cenario:|Funcionalidade:|Cenário:|Cenario:|Contexto:)/,tag:"keyword",then:"title_body"},{regex:/^\s*(Examples:|Exemplos:)\s*$/,tag:"keyword"},{regex:/^\s*(Given|When|Then|And|But|Dado|Quando|Então|Entao|E|Mas)/,tag:"module"},{regex:/^\s*#.*$/,tag:"comment"},{regex:/^\s*@.+$/,tag:"tags"}];b.title_body=[{regex:/.*$/,tag:"string",then:"start"}];f.GherkinSyntax=new a(b)});
bespin.tiki.register("::syntax_worker",{name:"syntax_worker",dependencies:{syntax_directory:"0.0.0",underscore:"0.0.0"}});
bespin.tiki.module("syntax_worker:index",function(a,f){var b=a("bespin:promise"),c=a("underscore")._;a("bespin:console");var d=a("syntax_directory").syntaxDirectory;f.syntaxWorker={engines:{},settings:{},annotate:function(g,j){function p(k){return k.split(":")}function n(){o.push(c(h).invoke("join",":").join(" "))}var m=this.engines,o=[],e=[],q=[],h=c(g.split(" ")).map(p);c(j).each(function(k){n();for(var r=[],t={},l=0;l<k.length;){for(var s;;){s=c(h).last();if(s.length<3)break;var i=s[2];if(k.substring(l,
l+i.length)!==i)break;h.pop()}i=m[s[0]].get(s,k,l);if(i==null)l={state:"plain",tag:"plain",start:l,end:k.length};else{h[h.length-1]=i.state;i.hasOwnProperty("newContext")&&h.push(i.newContext);l=i.token;i=i.symbol;if(i!=null)t["-"+i[0]]=i[1]}r.push(l);l=l.end}e.push(r);q.push(t)});n();return{states:o,attrs:e,symbols:q}},loadSyntax:function(g){var j=new b.Promise,p=this.engines;if(p.hasOwnProperty(g)){j.resolve();return j}var n=d.get(g);if(n==null)throw new Error('No syntax engine installed for syntax "'+
g+'".');n.extension.load().then(function(m){p[g]=m;if(n.settings!=null){m.settings={};n.settings.forEach(function(e){m.settings[e]=this.settings[e]},this)}var o=m.subsyntaxes;o==null?j.resolve():b.group(c(o).map(this.loadSyntax,this)).then(c(j.resolve).bind(j))}.bind(this));return j},setSyntaxSetting:function(g,j){this.settings[g]=j;return true}}});bespin.tiki.register("::stylesheet",{name:"stylesheet",dependencies:{standard_syntax:"0.0.0"}});
bespin.tiki.module("stylesheet:index",function(a,f){a("bespin:promise");a=a("standard_syntax").StandardSyntax;var b={regex:/^\/\/.*/,tag:"comment"},c=function(d){return[{regex:/^[^*\/]+/,tag:"comment"},{regex:/^\*\//,tag:"comment",then:d},{regex:/^[*\/]/,tag:"comment"}]};b={start:[{regex:/^([a-zA-Z-\s]*)(?:\:)/,tag:"identifier",then:"style"},{regex:/^([\w]+)(?![a-zA-Z0-9_:])([,|{]*?)(?!;)(?!(;|%))/,tag:"keyword",then:"header"},{regex:/^#([a-zA-Z]*)(?=.*{*?)/,tag:"keyword",then:"header"},{regex:/^\.([a-zA-Z]*)(?=.*{*?)/,
tag:"keyword",then:"header"},b,{regex:/^\/\*/,tag:"comment",then:"comment"},{regex:/^./,tag:"plain"}],header:[{regex:/^[^{|\/\/|\/\*]*/,tag:"keyword",then:"start"},b,{regex:/^\/\*/,tag:"comment",then:"comment_header"}],style:[{regex:/^[^;|}|\/\/|\/\*]+/,tag:"plain"},{regex:/^;|}/,tag:"plain",then:"start"},b,{regex:/^\/\*/,tag:"comment",then:"comment_style"}],comment:c("start"),comment_header:c("header"),comment_style:c("style")};f.CSSSyntax=new a(b)});
bespin.tiki.register("::standard_syntax",{name:"standard_syntax",dependencies:{syntax_worker:"0.0.0",syntax_directory:"0.0.0",underscore:"0.0.0"}});
bespin.tiki.module("standard_syntax:index",function(a,f){a("bespin:promise");var b=a("underscore")._;a("bespin:console");a("syntax_directory");f.StandardSyntax=function(c,d){this.states=c;this.subsyntaxes=d;this.settings={}};f.StandardSyntax.prototype={get:function(c,d,g){var j=c[0],p=c[1];if(!this.states.hasOwnProperty(p))throw new Error('StandardSyntax: no such state "'+p+'"');var n=d.substring(g),m={start:g,state:c},o=null;b(this.states[p]).each(function(e){var q=(e.regexSetting!=null?new RegExp(this.settings[e.regexSetting]):
e.regex).exec(n);if(q!=null){var h=q[0].length;m.end=g+h;m.tag=e.tag;var k=null;if(e.hasOwnProperty("symbol")){k=/^([^:]+):(.*)/.exec(e.symbol.replace(/\$([0-9]+)/g,function(t,l){return q[l]}));k=[k[1],k[2]]}var r=null;if(e.hasOwnProperty("then")){h=e.then.split(" ");e=[j,h[0]];if(h.length>1)r=h[1].split(":")}else if(h===0)throw new Error("StandardSyntax: Infinite loop detected: zero-length match that didn't change state");else e=c;o={state:e,token:m,symbol:k};if(r!=null)o.newContext=r;b.breakLoop()}},
this);return o}}});
bespin.metadata={stylesheet:{resourceURL:"resources/stylesheet/",name:"stylesheet",environments:{worker:true},dependencies:{standard_syntax:"0.0.0"},testmodules:[],provides:[{pointer:"#CSSSyntax",ep:"syntax",fileexts:["css","less"],name:"css"}],type:"plugins/supported",description:"CSS syntax highlighter"},syntax_worker:{resourceURL:"resources/syntax_worker/",description:"Coordinates multiple syntax engines",environments:{worker:true},dependencies:{syntax_directory:"0.0.0",underscore:"0.0.0"},testmodules:[],
type:"plugins/supported",name:"syntax_worker"},standard_syntax:{resourceURL:"resources/standard_syntax/",description:"Easy-to-use basis for syntax engines",environments:{worker:true},dependencies:{syntax_worker:"0.0.0",syntax_directory:"0.0.0",underscore:"0.0.0"},testmodules:[],type:"plugins/supported",name:"standard_syntax"},gherkin_syntax:{resourceURL:"resources/gherkin_syntax/",name:"gherkin_syntax",environments:{worker:true},dependencies:{standard_syntax:"0.0.0"},testmodules:[],provides:[{pointer:"#GherkinSyntax",
ep:"syntax",fileexts:["feature"],name:"gherkin"}],type:"plugins/supported",description:"Gherkin syntax highlighter"}};if(typeof window!=="undefined")throw new Error('"worker.js can only be loaded in a web worker. Use the "worker_manager" plugin to instantiate web workers.');var messageQueue=[],target=null;if(typeof bespin==="undefined")bespin={};
function pump(){if(messageQueue.length!==0){var a=messageQueue[0];switch(a.op){case "load":var f=a.base;bespin.base=f;bespin.hasOwnProperty("tiki")||importScripts(f+"tiki.js");if(!bespin.bootLoaded){importScripts(f+"plugin/register/boot");bespin.bootLoaded=true}var b=bespin.tiki.require;b.loader.sources[0].xhr=true;b.ensurePackage("::bespin",function(){var d=b("bespin:plugins").catalog,g=b("bespin:promise").Promise;if(bespin.hasOwnProperty("metadata")){d.registerMetadata(bespin.metadata);d=new g;
d.resolve()}else d=d.loadMetadataFromURL("plugin/register/worker");d.then(function(){b.ensurePackage(a.pkg,function(){target=b(a.module)[a.target];messageQueue.shift();pump()})})});break;case "invoke":f=function(d){postMessage(JSON.stringify({op:"finish",id:a.id,result:d}));messageQueue.shift();pump()};if(!target.hasOwnProperty(a.method))throw new Error("No such method: "+a.method);var c=target[a.method].apply(target,a.args);typeof c==="object"&&c.isPromise?c.then(f,function(d){throw d;}):f(c);break}}}
onmessage=function(a){messageQueue.push(JSON.parse(a.data));messageQueue.length===1&&pump()};
