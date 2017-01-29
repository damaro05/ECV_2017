var APP = {
	init: function()
	{
		console.log("init APP");
		//2D
/*		this.canvas_painter = new CanvasPainter("#painter");
		this.canvas_painter.bindEvents();
		this.canvas_painter.animete();

		this.canvas_painter.onAction = function(action, parameters)
		{
			var json = {
				action: action,
				parameters: parameters
			}
			server.sendMessage( JSON.stringify(msg) );
		}

		server.on_message = function(id, msg)
		{
			var json = JSON.parse( msg );
			this.canvas_painter.executeAction( json.action, json.parameters);

		}*/
		this.start3D();
	
	},

	start3D: function()
	{
		var camera, scene, renderer, mesh;

		/*var parent = document.querySelector("#painter");
		var rect = parent.getBoundingClientRect();*/

		var contentCanvas = document.querySelector("#contentCanvas");
		var container = document.createElement( 'div' );
		container.setAttribute( "style","width:500; height:500");
		contentCanvas.appendChild(container);

		camera = new THREE.PerspectiveCamera( 70, container.clientWidth / container.clientHeight, 1, 10000);
		camera.position.z = 1000;

		scene = new THREE.Scene();

		var texture = new THREE.TextureLoader().load('img/texture1.jpg');
		//var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
		//var material = new THREE.MeshBasicMaterial( { map: texture } );
		var geometry = new THREE.BoxGeometry( 200, 200, 200 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.clientWidth, container.clientHeight );
		

		container.appendChild( renderer.domElement );




		function animate(){
			requestAnimationFrame( animate );
			mesh.rotation.x += 0.05;
			mesh.rotation.y += 0.01;

			renderer.render( scene, camera );

		}

		animate();
	}
};





//ECV 2017
//********
/*************************************** Data definition ***************************************/
function User( id ){
	if(id === undefined){ this.id = "";	}
	else{ this.id = id; }
	
	this.name = "";
	this.avatar = "img/avatar.jpg";
}

function Message( user ){	
	if ( user === undefined ){
		this.u_id = "";
		this.u_name = "";
		this.u_avatar = "img/avatar.jpg";
	}
	else{
		this.u_id = user.id;
		this.u_name = user.name;
		this.u_avatar = user.avatar;
	}
	this.text = "";
	this.time = "";
}

Message.prototype.toJSON = function(){
	return {
		u_id: this.u_id,
		u_name: this.u_name,
		u_avatar: this.u_avatar,
		m_text: this.text,
		m_time: this.time
	};
}

Message.prototype.fromJSON = function( o ){
	this.u_id = o.u_id;
	this.u_name = o.u_name;
	this.u_avatar = o.u_avatar;
	this.text = o.m_text;
	this.time = o.m_time;
}

var usr = new User();
var roomUsers = [];
/*usr.name="Abel";
usr.avatar="url('img/avatar.jpg')";
var m = new Message(usr);m.text="hola";
var d = new Date();
m.time=d.getTime();

var str = JSON.stringify( m.toJSON() );
var data = JSON.parse( str );
var m2 = new Message();
m2.fromJSON(data);*/

/*************************************** Server ***************************************/
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
	usr.id = id;
};

//this methods receives messages from other users (author_id its an unique identifier)
server.on_message = function( author_id, msg ){
	//message received
	//console.log("user " + author_id + " said " + msg);
	
	var m = new Message();
	m.fromJSON( JSON.parse(msg) );
	
	if( (roomUsers[author_id] === undefined ||  m.text === undefined) && author_id != usr.id ){
		//receive info about a user in the room
		var m2 = JSON.parse(msg);
		var user = {name:m2.name, avatar:m2.avatar};
		roomUsers[author_id] = user;
	}
	else{
		//Receive chat message
		receiveMsg( msg );
	}
}

//this methods is called when a new user is connected
server.on_user_connected = function(msg){
	//new user!
	//Lista de usuarios en el room y poder seleccionar uno para enviar mensaje/chat privado
	var id = msg;
	sendUserDataMsg(id);
	roomUsers[id] = {};
}

server.on_user_disconnected = function(user_id){
	//Unregister user
	delete roomUsers[user_id];
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


/*************************************** Listeners ***************************************/
var avatar = document.querySelectorAll(".avatar4");
for( var i = 0; i < avatar.length; i++){
	avatar[i].addEventListener("click", selectAvatar);
}

var loginbutton = document.querySelector(".mini2");
loginbutton.addEventListener("click", login);

var button = document.querySelector("button");
button.addEventListener("click", sendMsg);

var input = document.querySelector("#chatinput");
input.onkeydown = onEnterPressed;

//Print room name
var menu = document.querySelector("#menu");
var spanRoom = document.createElement("span");
spanRoom.innerText = room_name;
menu.appendChild( spanRoom );
/*************************************** Action functions ***************************************/
/* Function to select avatar in login page */
function selectAvatar(){
	usr.avatar = this.style.backgroundImage;
	for(var i = 0; i < avatar.length ; i++){
		avatar[i].style.opacity = "";
	}
	this.style.opacity = 0.5;
}

function login(){
	var u_name = document.querySelector("#user");
	
	if(u_name.value.trim().length > 0 ){
		usr.name = u_name.value;
		var l = document.querySelector(".login-externo");
		l.style.display = "none"
		var m = document.querySelector("#main");
		m.style.display = "inline";
		sendUserDataMsg();
	}
	APP.init();
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

function sendUserDataMsg( id ){
	server.sendMessage( JSON.stringify( usr ), id );
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


function drawCanvas(){
	var c = document.getElementById("theCanvas");
	var ctx = c.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillText("Hello World",10,50);
}

/*Prueba de codigo para menu desplegable*/
/*var item = document.querySelector(".dropbtn");
item.addEventListener("click", func);

var item2 = document.querySelector(".dropbtn2");
item2.addEventListener("click", func2);
function func() {
	//If other menu is showing (class "show"), hide it
	var otro = document.getElementById("myDropdown2").classList;
	if(otro[1] !== undefined) func2();
	//Show this menu
    document.getElementById("myDropdown").classList.toggle("show");
}
function func2() {
var otro = document.getElementById("myDropdown").classList;
	if(otro[1] !== undefined) func();
    document.getElementById("myDropdown2").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}*/


