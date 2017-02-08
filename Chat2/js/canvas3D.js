/***************************************  Canvas  ****************************************/
/*****************************************************************************************/
//posición random para la camara de cada usuario al iniciar sesion
//
var APP = {
	scene: null,
	camera: null,
	objects: null,

	init: function()
	{
		console.log("init APP");
		this.start3D();	

	},

	start3D: function()
	{
		var mesh, renderer;
		objects = [];
		/*Para el tema de la luz los objetos deben tener lo siguiente
		object.castShadow = true;
		object.receiveShadow = true;
		*/
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
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
		//var geometry = new THREE.BoxBufferGeometry( 5, 5, 5 );
		//Phong material admit shadows
		//var material = new THREE.MeshPhongMaterial( { color: 0xff0000, wireframe: true } );

		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 0, 5, 0 );
		scene.add( mesh );

		//Boxes
		material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 10, 5, 10 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
		
		material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 10, 5, -10 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
		
		material = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( -10, 5, 10 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
		
		material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( -10, 5, -10 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
		//End boxes
		
		//Light
		var spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
		spotLight.position.set( 0, 500, 0 );
		spotLight.castShadow = true;
		spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;

		scene.add (spotLight);
		
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		//renderer.shadowMap.enabled = true;
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
		

		//Objects
		for ( var i = 0; i < 10; i++ ){
			var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
			obj.position.x = Math.random() * 100 - 50;
			obj.position.y = 30;
			obj.position.z = Math.random() * 80 - 40;
			obj.rotation.x = Math.random() * 2 * Math.PI;
			obj.rotation.y = Math.random() * 2 * Math.PI;
			obj.rotation.z = Math.random() * 2 * Math.PI;

			//Last post 
			obj.lastPost = new THREE.Vector3();
			obj.lastPost.copy( obj.position );

			obj.name = "dragMesh"+i;
			//obj.castShadow = true;
			scene.add( obj );
			objects.push( obj );
		}

		//Drag controls
		var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
		dragControls.addEventListener( 'dragstart', function( event ){ controls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function( event ){ 
			controls.enabled = true;
			if(objects.length >= 1 ){
				objects.forEach(this.updateDrag); }
			} );

		function onWindowResize(){
			camera.aspect = parent.clientWidth / parent.clientHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( parent.clientWidth, parent.clientHeight );

			//updateForWindowResize() for each light
		}

		function render(){
			controls.update();
			renderer.render( scene, camera );

		}

		function animate(){
			requestAnimationFrame( animate );

			cameraPos = controls.getPos();
			if ( usr.pos.x != cameraPos.x || usr.pos.y != cameraPos.y || usr.pos.z != cameraPos.z ){
				//Update position
				usr.pos = controls.getPos();
				var msg = new Message("UserPosition", usr);
				server.sendMessage( JSON.stringify( msg ) );
			}else{

			}
			/*mesh.rotation.x += 0.05;
			mesh.rotation.y += 0.01;*/
			//console.log( roomUsers );

			render();
		}

		window.addEventListener( "resize", onWindowResize );
		animate();
	},

	newUser: function( user, meshId )
	{
		userGeometry = new THREE.SphereGeometry( 0.3, 12, 6 );
		userMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
		user.mesh = new THREE.Mesh( userGeometry, userMaterial );
		//Should be user.id instead of user.name
		user.mesh.name = meshId;
		user.mesh.position.set( user.pos.x, user.pos.y, user.pos.z );
		scene.add( user.mesh );

	},

	updateUserPosition: function( msg )
	{
		var m = new Message();
		m.fromJSON( JSON.parse(msg) );
		roomUsers[m.u_id].pos = m.u_pos;
		roomUsers[m.u_id].mesh.position.set( m.u_pos.x, m.u_pos.y, m.u_pos.z );
		//roomUsers.forEach(this.updateScene);

	},

	updateScene: function( obj )
	{
		//Actualizar la mesh del objecto modificado en la scena " a lo cutre porque Message no esta pensado para objetos"	
		var m = new Message();
		m.fromJSON( JSON.parse(obj) );
		objects.find( function(filter){ return filter.name === m.u_name } ).position.copy( m.u_pos );
	},

	updateDrag: function( obj, index )
	{
		if ( obj.lastPost.x != obj.position.x || obj.lastPost.y != obj.position.y || obj.lastPost.z != obj.position.z ){
			console.log("position change ");
			/*console.log("Last post " +JSON.stringify( obj.lastPost ) );
			console.log("Current post " +JSON.stringify( obj.position ) );*/
			obj.lastPost.copy( obj.position );
			//Guarrada para poder enviar la posicion del que modificamos 
			obj.pos = new THREE.Vector3();
			obj.pos.copy( obj.position );
			var msg = new Message("updateScene", obj);
			server.sendMessage( JSON.stringify( msg ) );

		}

	},

	deleteUserFromCanvas: function( userId )
	{
		var objectToRemove = scene.getObjectByName( userId );
		scene.remove( objectToRemove );
		/*scene.children.forEach(function(children, index){
			if( children.name === userId )
				//todo
		});*/
	}

};