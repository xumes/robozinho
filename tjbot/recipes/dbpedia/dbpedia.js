var SPARQL_SEARCH_PT_IN_DOCUMENT = "http://pt.dbpedia.org/sparql?default-graph-uri=&query=SELECT+?property+WHERE+{+<PAGE>+SEARCH_KEY+?property+.}&format=json&timeout=0";

var SPARQL_SEARCH_EN_IN_DOCUMENT = "http://dbpedia.org/sparql?default-graph-uri=&query=SELECT+?property+WHERE+{+<PAGE>+SEARCH_KEY+?property+.}&format=json&timeout=0";

var SPARQL_SEARCH_FOR_DOCUMENTS = "https://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=select+?person+?name+where+{+?person+a+dbo:Person+;+foaf:name+?name+filter+(?name+like+\"SEARCH_KEY\")}&format=json&run=+Run+Query";

//var SPARQL_SEARCH_FOR_DOCUMENTS = "http://pt.dbpedia.org/sparql?default-graph-uri=&query=select+*+{+?results+<http://xmlns.com/foaf/0.1/name>+\"SEARCH_KEY\"@pt+}&format=json";

var request = require('request');

//var iconv  = require('iconv-lite');

var searchForDocs = function(searchKey, callback){
	searchKey = searchKey.replace(" ","+");
	var searchQuery = SPARQL_SEARCH_FOR_DOCUMENTS.replace("SEARCH_KEY", searchKey);

	searchQuery = encodeURI(searchQuery);
	console.log("Search for Documents in query: "+searchQuery);

	request({
		uri: searchQuery,
		method: 'GET',
		encoding: null,
	}, function (error, response, body) {
		//console.log("Error : " + error);
		//console.log("Response : " + response);
		//console.log("body : " + body);	
		return callback(error,response,body);
	});
};

function formatEndPointPT(source,callback){
	var output = "";
	if (source.indexOf("dbpedia")>0 && source.indexOf("pt.dbpedia") === -1){
		output = source.substr(0, source.indexOf("dbpedia")) + "pt." + source.substr( source.indexOf("dbpedia"));
		return callback(output);
	}
	else{
		return callback(source);
	}
}

function formatEndPointEN(source,callback){
	var output = "";
	if (source.indexOf("pt.dbpedia") !== -1){
		output = source.replace("pt.","");
		return callback(output);
	}
	else{
		return callback(source);
	}
}

var searchInDoc = function(searcherLanguage,pageLanguage,page,searchKey,callback){

	var searchQuery = "";
	if (searcherLanguage === "pt")
	{
		if (pageLanguage === "pt"){
			formatEndPointPT(page,function(output){
				searchQuery = SPARQL_SEARCH_PT_IN_DOCUMENT.replace("PAGE",output);
			});
		}
		if (pageLanguage === "en"){
			formatEndPointEN(page,function(output){
				searchQuery = SPARQL_SEARCH_EN_IN_DOCUMENT.replace("PAGE",output);
			});
		}
	}
	if (searcherLanguage === "en")
	{
		if (pageLanguage === "pt"){
			formatEndPointPT(page,function(output){
				searchQuery = SPARQL_SEARCH_EN_IN_DOCUMENT.replace("PAGE",output);
			});
		}
		if (pageLanguage === "en"){
			formatEndPointEN(page,function(output){
				searchQuery = SPARQL_SEARCH_EN_IN_DOCUMENT.replace("PAGE",output);
			});
		}
	}

	searchQuery = searchQuery.replace("SEARCH_KEY", searchKey);

	searchQuery = encodeURI(searchQuery);

	console.log("URL to search: "+searchQuery);
	
	request({
		uri: searchQuery,
		method: 'GET',
		encoding: null,
	}, function (error, response, body) {

		return callback(error,response,body);
	});	
};

var formatResponseSearchForDocs = function(content,language,callback){

	for(var i = 0; i < content.results.bindings.length; i++) {

		console.log(' Language : '+language);
		console.log(' Item : '+content.results.bindings[i].person.value);

		if (content.results.bindings[i].person.value.indexOf("http://dbpedia.org/resource/") !==-1 && language === "pt"){
			formatEndPointPT(content.results.bindings[i].person.value,function(output){
				return callback(output);
			});			
		}

		if (content.results.bindings[i].person.value.indexOf("http://dbpedia.org/resource/") !==-1 && language === "en"){
			return callback(output);
		}

		if (content.results.bindings[i].person.value.indexOf("http://pt.dbpedia.org/resource/") !==-1 && language === "pt"){
			return callback(output);
		}

		if (content.results.bindings[i].person.value.indexOf("http://pt.dbpedia.org/resource/") !==-1 && language === "en"){
			formatEndPointEN(content.results.bindings[i].person.value,function(output){
				return callback(output);
			});
		}
	}

	//return callback(content.results.bindings[0].person.value);
};

var formatDatesToSpell = function(content, callback){
	var d = new Date(content);
	
	return callback(d.getDate()+ " de "+formatMonthPT(d.getMonth()+1)+" de "+d.getFullYear());	
};

var formatMonthPT = function(content){
	switch(content){
	   case 1: return "Janeiro";
	   case 2: return "Fevereiro";
	   case 3: return "Março";
	   case 4: return "Abril";
	   case 5: return "Maio";
	   case 6: return "Junho";
   	   case 7: return "Julho";
   	   case 8: return "Agosto";
   	   case 9: return "Setembro";
   	   case 10: return "Outubro";
   	   case 11: return "Novembro";
   	   case 12: return "Dezembro";
	}
}

var formatResponseSearchInDoc = function (content,callback){

	data = [];
	for(var i = 0; i < content.results.bindings.length; i++) {

		data.push(content.results.bindings[i].property.value);

		if (data[i].indexOf("http://dbpedia.org/resource/") !==-1){
			data[i] = data[i].substr("http://dbpedia.org/resource/".length).replace(/_/gi," ");
		}

		if (data[i].indexOf("http://pt.dbpedia.org/resource/") !==-1){
			data[i] = data[i].substr("http://pt.dbpedia.org/resource/".length).replace(/_/gi," ");
		}
	}
	return callback(data);
};

module.exports.searchInDoc = searchInDoc;
module.exports.searchForDocs = searchForDocs;
module.exports.formatResponseSearchForDocs = formatResponseSearchForDocs;
module.exports.formatResponseSearchInDoc = formatResponseSearchInDoc;
module.exports.formatDatesToSpell = formatDatesToSpell;

if (process.argv.length>=4){
	var args = process.argv.slice(2);
	if (args.length < 5){
		console.log("USAGE: node dbpedia.js <function> <searcherLanguage> <pageLanguage> <page> <searchKey>");
	}
	else
	{	
		if (args[0] === "searchInDoc")
		{
			searchInDoc(args[1],args[2],args[3],args[4],function callback(error, response, body){
				console.log('statusCode:', response && response.statusCode);
				if (error){
					console.log("Error to process the URL");						
				}

				if (!error && response.statusCode === 200) {
					console.log("Process with Success !");
					body = JSON.parse(body);
					console.log(body); // Print the json response
					console.log("Formatting the response ");
					formatResponseSearchInDoc(body,function callback(data){	        	
						for(var i=0;i<data.length;++i){
							console.log(data[i]);
						}
					});
				}
			});
		}	
	}	
}	