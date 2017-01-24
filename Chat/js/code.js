//ECV 2017
//********

var room_name = "ADSM";
var timer = null;
var reconnect = true;

//connect to the server
var server = new SillyClient();
server.connect("84.89.136.194:9000", room_name);

//this method is called when the user gets connected to the server
server.on_ready = function( id ){
	//user connected to server
	console.log("I'm connected with id " + id );
};

//this methods receives messages from other users (author_id its an unique identifier)
server.on_message = function( author_id, msg ){
	//message received
	//console.log("user " + author_id + " said " + msg);
	receiveMsg( msg );
}

//this methods is called when a new user is connected
server.on_user_connected = function(msg){
	//new user!
	//Lista de usuarios en el room y poder seleccionar uno para enviar mensaje/chat privado
}

server.on_close = function(){
	//time 5s y reconectar
	//this methods is called when the server gets closed (its shutdown)
	
	if( reconnect ){
		//Div de reconectando en 3..2..1..
		setTimeout(function(){
			server.connect("84.89.136.194:9000", room_name);
		}, 3000);
	}
};

var loginbutton = document.querySelector(".mini2");
loginbutton = addEventListener("click", login);

var avatar = document.querySelectorAll(".avatar4");
for( var i = 0; i < avatar.length; i++){
	avatar[i].addEventListener("click", selectAvatar);
}

var button = document.querySelector("button");
button.addEventListener("click", sendMsg);

var input = document.querySelector("#chatinput");
input.onkeydown = onEnterPressed;

function User( name, avatar ){
	if(name === undefined){ this.name = "";	}
	else{ this.name = user.name; }
	
	if(avatar === undefined){ this.avatar = "img/avatar.jpg";	}
	else{ this.avatar = user.avatar; }
}

function Message( user ){	
	if ( user === undefined ){
		this.u_name = "";
		this.u_avatar = "img/avatar.jpg";
	}
	else{
		this.u_name = user.name;
		this.u_avatar = user.avatar;
	}
	this.text = "";
	this.time = "";
}

Message.prototype.toJSON = function(){
	return {
		u_name: this.u_name,
		u_avatar: this.u_avatar,
		m_text: this.text,
		m_time: this.time
	};
}

Message.prototype.fromJSON = function( o ){
	this.u_name = o.u_name;
	this.u_avatar = o.u_avatar;
	this.text = o.m_text;
	this.time = o.m_time;
}

var usr = new User();
usr.name="Abel";
usr.avatar="url('img/avatar.jpg')";
/*var m = new Message(usr);
m.text="hola";
var d = new Date();
m.time=d.getTime();

var str = JSON.stringify( m.toJSON() );
var data = JSON.parse( str );
var m2 = new Message();
m2.fromJSON(data);*/

function selectAvatar(){
	usr.avatar = this.style.backgroundImage;
	for(var i = 0; i < avatar.length ; i++){
		avatar[i].style.opacity = "";
	}
	this.style.opacity = 0.5;
}

function login(){
	var u_name = document.querySelector("#user");
	console.log(u_name.value + " // " + usr.avatar);
	
	if(u_name.value.trim().length > 0 ){
		usr.name = u_name.value;
		var l = document.querySelector(".login-externo");
		l.style.display = "none"
		var m = document.querySelector("#main");
		m.style.display = "inline";
	}
}

function addMsgs( message, received=false ){
	var msg = document.createElement("div");

	msg.className = "msg snd";
	if( received ) msg.className = "msg rcv";
		
	var divUsername = document.createElement("div");
	var divDate = document.createElement("div");
	var parrafText = document.createElement("p");
	var divInfo = document.createElement("div");
	var divAvatar = document.createElement("div");

	divUsername.className = "msg-username";
	divDate.className = "msg-date";
	parrafText.className = "msg-text";
	divInfo.className = "msg-info";
	divAvatar.className = "avatar avatar3";

	divUsername.innerText = message.u_name;
	var d = new Date(message.time);
	divDate.innerText = d.toDateString();
	parrafText.innerText = message.text;

	divInfo.appendChild(divUsername);
	divInfo.appendChild(divDate);
	divInfo.appendChild(parrafText);

	//var urlAvatar = "background-image: url(' " + message.u_avatar + " ')";
	var urlAvatar = "background-image: " + message.u_avatar;
	divAvatar.style = urlAvatar;

	msg.appendChild(divAvatar);
	msg.appendChild(divInfo);

	var msgs = document.querySelector("#msgs");
	//Add message in msgs box
	msgs.appendChild( msg );
	//Auto scroll when user send a message
	msgs.scrollTop = msgs.scrollHeight;
}

function sendMsg(){
	var input = document.querySelector("#chatinput");
	var text = input.value;
	input.value = "";
	input.focus();
	
	if(text.trim().length != 0){
		var d = new Date();
		var m = new Message( usr );
		m.text = text;
		m.time = d.getTime();
		addMsgs( m );
		
		//Send message to server
		server.sendMessage( JSON.stringify( m ) );
	}
}

function onEnterPressed( event ){
	var key = event.which || event.keyCode;
	if(key == 13) sendMsg();
}

function receiveMsg( message ){
	var m = new Message();
	m.fromJSON( JSON.parse(message) );
	
	//addMsgs( m.u_name, m.text, true );
	addMsgs( m, true );
}

function logOut(){
	reconnect = false;
}

/*window.onbeforeunload = function(e) {
	logOut();
}*/


function createDivMessage(){

}