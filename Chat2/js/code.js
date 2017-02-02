//ECV 2017 - Abel Dellà // Sebatián Maya
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
				 z: Math.floor( Math.random() * ( max-min+1 )) + min }
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
	}
	else{
		this.u_id = user.id;
		this.u_name = user.name;
		this.u_avatar = user.avatar;
		this.u_pos = user.pos;
	}
	this.text = "";
	this.time = "";
}

Message.prototype.toJSON = function(){
	return {
		m_type: this.type,
		u_id: this.u_id,
		u_name: this.u_name,
		u_avatar: this.u_avatar,
		u_pos: this.u_pos,
		m_text: this.text,
		m_time: this.time
	};
}

Message.prototype.fromJSON = function( o ){
	this.type = o.m_type;
	this.u_id = o.u_id;
	this.u_name = o.u_name;
	this.u_avatar = o.u_avatar;
	this.u_pos = o.u_pos;
	this.text = o.m_text;
	this.time = o.m_time;
}

var usr = new User();

/***************************************  Canvas  ****************************************/
/*****************************************************************************************/
//posición random para la camara de cada usuario al iniciar sesion
//
var APP = {
	scene: null,
	camera: null,

	init: function()
	{
		console.log("init APP");
		this.start3D();	

	},

	start3D: function()
	{
		var mesh, renderer;

		/*var parent = document.querySelector("#painter");
		var rect = parent.getBoundingClientRect();*/
		var parent = document.getElementById("3DCanvas");
		var width = parent.clientWidth;
		var height = parent.clientHeight;
		//var container = document.createElement( 'div' );
		//container.setAttribute( "style","width:500; height:500");
		//contentCanvas.appendChild(container);

		camera = new THREE.PerspectiveCamera( 70, width / height, 1, 10000);
		camera.position.set( usr.pos.x, usr.pos.y, usr.pos.z);

		scene = new THREE.Scene();
		scene.add( new THREE.AmbientLight( 0x404040 ) );

		var texture = new THREE.TextureLoader().load('img/Rubik.png');
		var geometry = new THREE.BoxGeometry( 5, 5, 5 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
		//var geometry = new THREE.BoxBufferGeometry( 5, 5, 5 );
		//var material = new THREE.MeshPhongMaterial( { color: 0xff0000, wireframe: true } );

		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 0, 5, 0 );
		scene.add( mesh );

		//Boxes
		material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 10, 5, 10 );
		scene.add( mesh );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 10, 5, -10 );
		scene.add( mesh );
		material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( -10, 5, 10 );
		scene.add( mesh );
		material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( -10, 5, -10 );
		scene.add( mesh );
		//End boxes

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		parent.appendChild( renderer.domElement );

		//Ground
		var groundGeometry = new THREE.BoxGeometry( 10, 0.15, 10);
		var groundMaterial = new THREE.MeshPhongMaterial({
			color: 0xa0adaf,
			specular: 0xffffff
		});

		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.scale.multiplyScalar( 3 );
		ground.receiveShadow = true;
		scene.add( ground );

		//	Controls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 10, 0 );
		controls.update();

		function onWindowResize(){
			camera.aspect = parent.clientWidth / parent.clientHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( parent.clientWidth, parent.clientHeight );

			//updateForWindowResize() for each light
		}

		function render(){

			renderer.render( scene, camera );

		}

		function animate(){
			requestAnimationFrame( animate );
			/*mesh.rotation.x += 0.05;
			mesh.rotation.y += 0.01;*/

			render();			
		}

		window.addEventListener( "resize", onWindowResize );
		animate();
	},

	newUser: function( user ){
		userGeometry = new THREE.SphereGeometry( 0.3, 12, 6 );
		userMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		var userMesh = new THREE.Mesh( userGeometry, userMaterial );
		console.log( user.pos );
		userMesh.position.set( user.pos.x, user.pos.y, user.pos.z );
		scene.add( userMesh );

	}

};
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
	console.log("I'm connected with id " + id );
	usr.id = id;
	sendUserDataMsg();
	APP.init();
};

//this methods receives messages from other users (author_id its an unique identifier)
server.on_message = function( author_id, msg ){
	//message received
	console.log("user " + author_id + " said " + msg);
	
	var m = new Message();
	m.fromJSON( JSON.parse(msg) );
	
	if( m.type === "uData"){
		newUser( msg );
	}
	else if( m.type === "msg"){
		//Receive chat message
		receiveMsg( msg );
	}
	else if( m.type == "canvas3D"){
		console.log( "Type message " +m.type );
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

server.on_user_disconnected = function(user_id){
	//Unregister user
	deleteUser( user_id );
}

server.on_close = function(){
	//time 5s y reconectar
	//this methods is called when the server gets closed (its shutdown)
	
	//Reconexión al servidor por si se cae la red
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
var openchats = [];

//Listeners
dropdown1.addEventListener("click", showDropdown1);
dropdown2.addEventListener("click", showDropdown2);
filterinput.addEventListener("keyup", filterFunction);
button.addEventListener("click", sendMsg);
input.onkeydown = onEnterPressed;

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

	var user = {name:m.u_name, avatar:m.u_avatar, pos:m.u_pos};

	roomUsers[m.u_id] = user;
	
	var userList = document.querySelector("#myDropdown2");
	var aUser = document.createElement("a");
	aUser.id = m.u_id;
	aUser.innerText = m.u_name;
	userList.appendChild( aUser );
	
	//aUser = document.querySelector("#"+m.u_id);
	aUser.addEventListener( "click", function(){ openchat(m.u_id); } );

	//Create user in 3D canvas
	APP.newUser( user );
}

function deleteUser( id ){
	var del = document.getElementById(id);
	del.remove();
	
	delete roomUsers[id];
}

function openchat( id ){
	var i;
	
	for(i = 0; i<openchats.length ; i++){
		if( openchats[i] === id){
			//Abrimos nuevo chat (div en barra lateral y div en contenedor mensajes
			break;
		}
	}
	
	
	//visualizar el chat con el usuario pasado y ocultar el chat activo
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

	var msgs = document.querySelector("#chat-general-content"); //MODIFICAR EL NOMBRE SEGUN EL CHAT ACTIVO
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
		m.time = d.getTime();
		addMsgs( m );
		
		//Send message to server
		server.sendMessage( JSON.stringify( m ) );
	}
}

function onEnterPressed( event ){
	var key = event.which || event.keyCode;
	if(key == 13){
		sendMsg();
		var input = document.querySelector("#chatinput");
		input.value = input.value.trim();
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
}
