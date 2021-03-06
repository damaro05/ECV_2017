//ECV 2017 - Abel Dell� // Sebati�n Maya
//****************************************

/*************************************** Data definition ***************************************/
/***********************************************************************************************/
var max = 20;
var min = -20;

function User( id ){
	if(id === undefined){ this.id = "";	}
	else{ this.id = id; }
	
	this.name = "";
	this.avatar = "url('img/avatar.jpg')";
	this.pos = { x: Math.floor( Math.random() * ( max-min+1 )) + min, 
				 y: 15, 
				 z: Math.floor( Math.random() * ( max-min+1 )) + min };
	this.mesh = null;
}

function Message( type, user ){
	//Types: uData, msg, canvas
	if ( type === undefined ){
		this.type = "";
	}
	else{
		this.type = type;
	}
	if ( user === undefined ){
		this.u_id = "";
		this.u_name = "";
		this.u_avatar = "img/avatar.jpg";
		this.u_pos = { x: 0, y: 15, z: 0};
		this.u_mesh = null;
	}
	else{
		this.u_id = user.id;
		this.u_name = user.name;
		this.u_avatar = user.avatar;
		this.u_pos = user.pos;
		this.u_mesh = user.mesh;
	}
	this.text = "";
	this.chat = "";
	this.time = "";
}

Message.prototype.toJSON = function(){
	return {
		m_type: this.type,
		u_id: this.u_id,
		u_name: this.u_name,
		u_avatar: this.u_avatar,
		u_pos: this.u_pos,
		u_mesh: this.u_mesh,
		m_text: this.text,
		m_chat: this.chat,
		m_time: this.time
	};
}

Message.prototype.fromJSON = function( o ){
	this.type = o.m_type;
	this.u_id = o.u_id;
	this.u_name = o.u_name;
	this.u_avatar = o.u_avatar;
	this.u_pos = o.u_pos;
	this.u_mesh = o.u_mesh;
	this.text = o.m_text;
	this.chat = o.m_chat;
	this.time = o.m_time;
}

var usr = new User();
/*************************************** Server ***************************************/
/**************************************************************************************/
var room_name = "ADSM";
var roomUsers = [];
var timer = null;
var reconnect = true;
var server = new SillyClient();
//server.connect("84.89.136.194:9000", room_name);

//this method is called when the user gets connected to the server
server.on_ready = function( id ){
	//user connected to server
	
	usr.id = id;
	console.log("I'm connected with id " + id + " and my position is (" + usr.pos.x +", "+ usr.pos.y + ", " + usr.pos.z+")");
	sendUserDataMsg();
	APP.init();
};

//this methods receives messages from other users (author_id its an unique identifier)
server.on_message = function( author_id, msg ){
	//message received
	//console.log("user " + author_id + " said " + msg);
	
	var m = new Message();
	m.fromJSON( JSON.parse(msg) );
	
	if( m.type === "uData"){
		newUser( msg );
	}
	else if( m.type === "msg"){
		//Receive chat message
		receiveMsg( msg );
	}
	else if( m.type == "UserPosition"){
		APP.updateUserPosition( msg );
		//console.log( "Type message " +m.type );
	}
	else if( m.type == "updateScene"){
		APP.updateScene( msg );
	}
	else{
		console.log("Type message error: "+m.type);
	}
}

//this methods is called when a new user is connected
server.on_user_connected = function( msg ){
	//new user!
	
	var id = msg;
	if(id != usr.id){ sendUserDataMsg(id); }
}

//this methods is called when an user is disconnected
server.on_user_disconnected = function(user_id){
	//Unregister user
	deleteUser( user_id );
	APP.deleteUserFromCanvas( user_id );
}

server.on_close = function(){
	//time 5s y reconectar
	//this methods is called when the server gets closed (its shutdown)
	
	//Reconexi�n al servidor por si se cae la red
	if( reconnect ){
		setTimeout(function(){
			server.connect("84.89.136.194:9000", room_name);
		}, 3000);
		sendUserDataMsg();
	}
};


/*************************************** Login Page ***************************************/
/******************************************************************************************/
var loginbutton = document.querySelector("#login-btn");
var avatar = document.querySelectorAll(".avatar-50");

//Listeners
loginbutton.addEventListener("click", login);
for( var i = 0; i < avatar.length; i++){
	avatar[i].addEventListener("click", selectAvatar);
}

//Functions
function login(){
	var u_name = document.querySelector("#user");
	
	if(u_name.value.trim().length > 0 ){
		usr.name = u_name.value;
		var l = document.querySelector("#login-main");
		l.style.display = "none"
		writeRoomName();
		var m = document.querySelector("#main");
		m.style.display = "block";
		var c = document.querySelector("#chat-general-content");
		c.style.display = "block";
		
		server.connect("84.89.136.194:9000", room_name);
	}
}

function selectAvatar(){
	usr.avatar = this.style.backgroundImage;
	for(var i = 0; i < avatar.length ; i++){
		avatar[i].classList.remove("avatar-select");
	}
	this.classList.add("avatar-select");
}


/*************************************** Main page ***************************************/
/*****************************************************************************************/
var dropdown1 = document.querySelector("#menu");
var dropdown2 = document.querySelector("#userList");
var filterinput = document.querySelector("#myInput");
var button = document.querySelector("button");
var input = document.querySelector("#chatinput");
var openChats = [];
var activeChat = "general";
var generalChat = document.querySelector("#chat_general");
var logout = document.querySelector("#logoutLink");7

//Listeners
dropdown1.addEventListener("click", showDropdown1);
dropdown2.addEventListener("click", showDropdown2);
filterinput.addEventListener("keyup", filterFunction);
button.addEventListener("click", sendMsg);
input.onkeydown = onEnterPressed;
generalChat.addEventListener("click", function(){ showChat("general") });
logoutLink.addEventListener("click", logOut);

//Functions
function writeRoomName(){
	var menu = document.querySelector("#roomName");
	menu.innerText = room_name;
}

function showDropdown1(){
	document.querySelector("#myDropdown1").classList.toggle("show");
}

function showDropdown2(){
	document.querySelector("#myDropdown2").classList.toggle("show");
}

function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown2");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
		if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} else {
			a[i].style.display = "none";
		}
	}
}

function newUser( msg ){
	var m = new Message();
	m.fromJSON( JSON.parse(msg) );
	//Aqui se puede a�adir id en lugar de name para luego hacer el delete by id
	var user = {name:m.u_name, avatar:m.u_avatar, pos:m.u_pos};

	roomUsers[m.u_id] = user;
	
	var userList = document.querySelector("#myDropdown2");
	var aUser = document.createElement("a");
	aUser.id = m.u_id;
	aUser.innerText = m.u_name;
	userList.appendChild( aUser );
	
	aUser.addEventListener( "click", function(){ openchat(m.u_id); } );

	//Create user in 3D canvas
	APP.newUser( user, m.u_id );
}

function deleteUser( id ){
	var del = document.getElementById(id);
	del.remove();
	
	delete roomUsers[id];
}

function openchat( id ){
	
	if(openChats.includes(id) == false){
		openChats.push(id);
		
		createChat( id );
	}
	
	//visualizar el chat con el usuario pasado y ocultar el chat activo
	showChat( id );
}
function createChat( id ){
	var chatsList = document.querySelector(".openchats");
	var divChatList = document.createElement("div");
	var divChatListAvatar = document.createElement("div");
	var spanUserName = document.createElement("span");
	
	divChatList.id = "chat_" + id;
	divChatList.className = "chat";
	divChatListAvatar.className = "avatar avatar-25 div-center";
	divChatListAvatar.style = "background-image: " + roomUsers[id].avatar;
	spanUserName.innerText = roomUsers[id].name;
	
	divChatList.appendChild( divChatListAvatar );
	divChatList.appendChild( spanUserName );
	chatsList.appendChild( divChatList );
	
	var divChatsContent = document.querySelector("#chatContents");
	var divChat = document.createElement("div");
	divChat.id = "chat-"+id+"-content";
	divChat.className = "msgs";
	divChatsContent.appendChild( divChat );
	
	divChatList.addEventListener("click", function(){ showChat(id) });
	
	openChats.push(id);
}

function showChat( id ){
	//Ocultar chat anterior
	document.querySelector("#chat_" + activeChat).classList.toggle("chat-active");
	document.querySelector("#chat-" + activeChat + "-content").style.display = "none";
	//Mostrar nuevo chat activo
	document.querySelector("#chat_" + id).classList.toggle("chat-active");
	document.querySelector("#chat-" + id + "-content").style.display = "block";
	
	activeChat = id;
}

//Message functions
//-- Add message in messages box
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
	divAvatar.className = "avatar avatar-25 avatar-msg";

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

	var msgs;
	if(message.chat === "general") msgs = document.querySelector("#chat-general-content");
	else{
		if(received){
			if(!openChats.includes(message.u_id)){ createChat( message.u_id ); }
			msgs = document.querySelector("#chat-"+message.u_id+"-content");
		}
		else{
			msgs = document.querySelector("#chat-"+activeChat+"-content");
		}
	}
	
	//Add message in msgs box
	msgs.appendChild( msg );
	//Auto scroll when user send a message
	msgs.scrollTop = msgs.scrollHeight;
}

//-- Send user data message to other users
function sendUserDataMsg( id ){
	var msg = new Message("uData", usr);
	server.sendMessage( JSON.stringify( msg ), id );
}

//-- Send text message to server
function sendMsg(){
	var input = document.querySelector("#chatinput");
	var text = input.value;
	input.value = "";
	input.focus();
	
	if(text.trim().length != 0){
		var d = new Date();
		var m = new Message( "msg", usr );
		m.text = text;
		m.chat = activeChat;
		m.time = d.getTime();
		addMsgs( m );
		
		//Send message to server
		if(activeChat === "general"){	server.sendMessage( JSON.stringify( m ) ); }
		else{ server.sendMessage( JSON.stringify( m ), activeChat ); }
	}
}

function onEnterPressed( event ){
	var key = event.which || event.keyCode;
	if(key == 13){
		sendMsg();
		var input = document.querySelector("#chatinput");
		input.value = input.value.trim();
		event.preventDefault();
	}
}

//-- Receive text message from other users
function receiveMsg( message ){
	var m = new Message();
	m.fromJSON( JSON.parse(message) );
	
	addMsgs( m, true );
}

function logOut(){
	reconnect = false;
	server.close();
	document.querySelector("#main").style.display = "none";
	document.querySelector("#login-main").style.display = "block";
}
