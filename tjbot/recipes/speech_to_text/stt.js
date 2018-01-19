/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var TJBot = require('tjbot');
var config = require('../conversation/config');

// obtain our credentials from config.js
var credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['microphone' ,'speaker'];

// set up TJBot's configuration
var tjConfig = {
		log: {
			level: 'verbose'
		},
		robot: {        
			name: 'fernanda',
			gender: 'female'
		},
		wave: {
			servoPin: 7 // corresponds to BCM 7 / physical PIN 26
		},
		listen: {
			microphoneDeviceId: "plughw:1,0", // plugged-in USB card 1, device 0; see arecord -l for a list of recording devices
			inactivityTimeout: -1, // -1 to never timeout or break the connection. Set this to a value in seconds e.g 120 to end connection after 120 seconds of silence
			language: 'pt-BR' // see TJBot.prototype.languages.listen
		},
		speak: {
			language: 'pt-BR', // see TJBot.prototype.languages.speak
			voice: undefined, // use a specific voice; if undefined, a voice is chosen based on robot.gender and speak.language
			speakerDeviceId: "plughw:0,0" // plugged-in USB card 1, device 0; see aplay -l for a list of playback devices
		}
};



// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};

var out = "Ayrton Senna da Silva (São Paulo, 21 de mar\u00E7o de 1960 \u2014 Bolonha, 1 de maio de 1994) foi um piloto brasileiro de F\u00F3rmula 1, tr\u00EAs vezes campe\u00E3o mundial, nos anos de 1988, 1990 e 1991. Foi tamb\u00E9m vice-campe\u00E3o no controverso campeonato de 1989 e em 1993. Senna morreu em um acidente no Aut\u00F3dromo Enzo e Dino Ferrari, em \u00CDmola, durante o Grande Pr\u00EAmio de San Marino de 1994. Est\u00E1 entre os pilotos de F\u00F3rmula Um mais influentes e bem-sucedidos da era moderna e \u00E9 considerado um dos maiores pilotos da hist\u00F3ria do esporte. Em 2012, foi eleito pela rede BBC o melhor piloto de todos os tempos.";

console.log("Starting program");

// listen for speech
tj.listen(function(msg) {
    tj.speak(out);    
});

console.log("Program finished");

