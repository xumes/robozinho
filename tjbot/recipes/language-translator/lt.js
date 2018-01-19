
var config = require('./config');

var translate = function(inputText,source_lang, dest_lang,callback){
	
	var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

	var language_translator = new LanguageTranslatorV2({
	  username: config.credentials.lt.username,
	  password: config.credentials.lt.password,
	  url: 'https://gateway.watsonplatform.net/language-translator/api/'
	});

	language_translator.translate({
	  text: inputText, source : source_lang, target: dest_lang },
	  function (err, response) {
		  return callback(err,response.translations[0].translation);
	});
};

module.exports.translate = translate;

if (process.argv.length < 5){
	console.log("Usage node lt <text_to_translate> source_lg dest_lg");
}	
else{
	var args = process.argv.slice(2);
	translate(args[0],args[1],args[2],function(err,response){
		 console.log("Text to Translate : "+args[0]);
		 if (err){
		   console.log(err);
		 }  
		 else {
		   console.log("Translated Text : "+response);
		 }  
	});
}