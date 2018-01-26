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
var config = require('./config');
var language = 'pt';
//var robot_name = 'Positivo';


// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

console.log("Using workspace ID "+WORKSPACEID);

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    },
    robot: {        
	//name: JSON.stringify(robot_name),
	//name: 'Bob',
	name: 'positivo',
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

if (language == 'en'){
	console.log("You can ask me to introduce myself or tell you a joke.");
	console.log("Try saying, \"" + tj.configuration.robot.name + ", please introduce yourself\" or \"" + tj.configuration.robot.name + ", who are you?\"");
	console.log("You can also say, \"" + tj.configuration.robot.name + ", tell me a joke!\"");
}
if (language == 'pt'){
	console.log("Sempre use o nome do Robo inicialmente, antes de perguntar e pergunte sobre a materia ou o professor !");
	console.log("Tente dizer, \"" + tj.configuration.robot.name + ", Apresente-se\" or \"" + tj.configuration.robot.name + ", quem é voce?\"");
	console.log("Voce também pode dizer, \"" + tj.configuration.robot.name + ", Fale sobre a matéria\"");
	console.log("Ou ainda Voce também pode dizer, \"" + tj.configuration.robot.name + ", Fale sobre o professor\"");
}

// listen for utterances with our attentionWord and send the result to
// the Conversation service
tj.listen(function(msg) {
    // check to see if they are talking to TJBot
    if (msg.startsWith(tj.configuration.robot.name)) {
        // remove our name from the message
        var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");

	console.log("Sending message "+turn+" to conversation");
        // send to the conversation service
        tj.converse(WORKSPACEID, turn, function(response) {
            // speak the result
            tj.speak(response.description);
        });
    }else{
	console.log("Nome do robo "+tj.configuration.robot.name);
	console.log("Invalid message "+msg);
    }	
});