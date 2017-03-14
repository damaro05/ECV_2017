/***************************************  Canvas  ****************************************/
/*****************************************************************************************/
//posición random para la camara de cada usuario al iniciar sesion
//
var APP = {
	scene: null,
	camera: null,
	objects: null,
	options: null,
	spotLight: null,
	dirLight: null,
	movementPoints: null,


	init: function()
	{
		console.log("init APP");
		movementPoints = 3;
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
		// camera.position.set( usr.pos.x, usr.pos.y, usr.pos.z);
		camera.position.set( 0, 7, 66 );

		scene = new THREE.Scene();
		scene.add( new THREE.AmbientLight( 0x404040 ) );


/*		var texture = new THREE.TextureLoader().load('img/Rubik.png');
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
		//End boxes*/
		
		
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		//renderer.shadowMap.enabled = true;
		parent.appendChild( renderer.domElement );

/*		//Ground
		var groundGeometry = new THREE.BoxGeometry( 10, 0.15, 10);
		var groundMaterial = new THREE.MeshPhongMaterial({
			color: 0xa0adaf,
			specular: 0xffffff
		});

		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.scale.multiplyScalar( 3 );
		ground.receiveShadow = true;
		scene.add( ground );
*/
		//	Controls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 10, 0 );

		//Light
		spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
		spotLight.position.set( 0, 500, 0 );
		spotLight.castShadow = true;
		spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;

		dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		dirLight.position.set( 0, 20, 0 );
		
		scene.add ( spotLight );
		// scene.add ( dirLight );
		//Objects
		// for ( var i = 0; i < 10; i++ ){
		// 	var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
		// 	obj.position.x = Math.random() * 100 - 50;
		// 	obj.position.y = 30;
		// 	obj.position.z = Math.random() * 80 - 40;
		// 	obj.rotation.x = Math.random() * 2 * Math.PI;
		// 	obj.rotation.y = Math.random() * 2 * Math.PI;
		// 	obj.rotation.z = Math.random() * 2 * Math.PI;

		// 	//Last post 
		// 	obj.lastPost = new THREE.Vector3();
		// 	obj.lastPost.copy( obj.position );

		// 	obj.name = "dragMesh"+i;
		// 	//obj.castShadow = true;
		// 	scene.add( obj );
		// 	objects.push( obj );
		// }

		//systems 
		var objLoader = new THREE.OBJLoader();
		// objLoader.setPath( '' );
		objLoader.load( 'meshes/internal_skelout_full.obj', function( object ){
			object.position.y = -40;
			scene.add( object );
		});

		objLoader.load( 'meshes/male.obj', function( object ){
			object.position.y = -40;
			object.position.x = 150;
			scene.add( object );
		});
		objLoader.load( 'meshes/skeleton.obj', function( object ){
			object.position.y = -40;
			object.position.x = 300;
			scene.add( object );
		});


		//Detail systems
/*		objLoader.load( 'meshes/heart.obj', function( object ){
			object.position.y = 0;
			object.position.x = -150;
			scene.add( object );
		});
		objLoader.load( 'meshes/skull.obj', function( object ){
			object.position.y = 0;
			object.position.x = -300;
			scene.add( object );
		});
		objLoader.load( 'meshes/femur.obj', function( object ){
			object.position.y = 0;
			object.position.x = -450;
			scene.add( object );
		});*/

		//Detail meshes
		var dhGeometry = new THREE.SphereGeometry( 0.8, 12, 12 );
		var dhMaterial = new THREE.MeshPhongMaterial( { color: 0xff9900 } );
		
		var dHeart = new THREE.Mesh( dhGeometry, dhMaterial );
		dHeart.position.set( 3, 19, 4 );
		dHeart.name = 20;
		dHeart.lastPost = new THREE.Vector3();
		dHeart.lastPost.copy( dHeart.position );

		var dSkull = new THREE.Mesh( dhGeometry, dhMaterial );
		dSkull.position.set( 300, 37, 2 );
		dSkull.name = 21;
		dSkull.lastPost = new THREE.Vector3();
		dSkull.lastPost.copy( dSkull.position );

		var dFemur = new THREE.Mesh( dhGeometry, dhMaterial );
		dFemur.position.set( 305, -10, 0 );
		dFemur.name = 22;
		dFemur.lastPost = new THREE.Vector3();
		dFemur.lastPost.copy( dFemur.position );

		var dHand = new THREE.Mesh( dhGeometry, dhMaterial );
		dHand.position.set( 129.5, 1, -1 );
		dHand.name = 23;
		dHand.lastPost = new THREE.Vector3();
		dHand.lastPost.copy( dHand.position );

		
		scene.add( dHeart );
		scene.add( dSkull );
		scene.add( dFemur );
		scene.add( dHand );
		objects.push( dHeart );
		objects.push( dSkull );
		objects.push( dFemur );
		objects.push( dHand );

		//Buttons
		/*options = document.createElement( 'div' );
		options.style.position = 'absolute';
		options.style.bottom = '30px';
		options.style.width = '45px';
		options.style.marginLeft = '25px';
		options.style.textAlign = 'center';
		options.style.color = 'white';
		options.innerHTML = 'Points: <input type="button" onclick="APP.centerUp();" value=" ^ " />\
									 <input type="button" onclick="APP.centerDown();" value=" v " />';

		parent.appendChild( options );*/

		//Drag controls
		var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
		dragControls.addEventListener( 'dragstart', function( event ){ 
			controls.enabled = false;
			this.detailView( event.object );
		});
		dragControls.addEventListener( 'dragend', function( event ){ 
			controls.enabled = true;
			if(objects.length >= 1 ){
				objects.forEach( this.updateDrag ); }
		});


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
				//Update light
				dirLight.position.set( usr.pos.x, usr.pos.y , usr.pos.z );
				//Temporal target pos on change
				usr.target = controls.getTargetPos();

				if( !usr.isTeacher )
					return;
				var msg = new Message("UserPosition", usr);
				server.sendMessage( JSON.stringify( msg ) );
			}else{

			}

			render();
		}

		window.addEventListener( "resize", onWindowResize );
		animate();
	},

	newUser: function( user, meshId )
	{
		userGeometry = new THREE.SphereGeometry( 0.8, 12, 12 );
		userMaterial = new THREE.MeshPhongMaterial( { color: 0xff9900 } );
		user.mesh = new THREE.Mesh( userGeometry, userMaterial );
		//Should be user.id instead of user.name
		user.mesh.name = meshId;
		user.mesh.position.set( user.pos.x, user.pos.y, user.pos.z );
		// scene.add( user.mesh );

	},

	updateUserPosition: function( msg )
	{
		var m = new Message();
		m.fromJSON( JSON.parse(msg) );
		roomUsers[m.u_id].pos = m.u_pos;
		roomUsers[m.u_id].mesh.position.set( m.u_pos.x, m.u_pos.y, m.u_pos.z );
		
		//Update camera and usr pos to avoid noise
		controls.setPosition( m.u_pos );
		usr.pos = m.u_pos;
		
		//Temporal solution for user target position
		usr.target = m.u_target;
		controls.setTargetPosition( m.u_target );
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
			console.log( obj.position );
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
	},

	centerUp: function()
	{
		controls.target.y += movementPoints;
	},

	centerDown: function()
	{
		controls.target.y -= movementPoints;
	},

	centerRight: function()
	{
		controls.target.x += movementPoints;
	},

	centerLeft: function()
	{
		controls.target.x -= movementPoints;
	},

	changeAnatomyMesh: function( object )
	{
		var size, id, targetpos, controlpos;
		var isDetail = false;
		var infoFrame;
		//When the paramether is mouseevent
		if( "srcElement" in object ){
			size = object.srcElement.id.length;
			id = parseInt( object.srcElement.id[size-1] );
		}else {
			id = parseInt( object.name );
			console.log( 'id ' + id );
			isDetail = true;
			infoFrame = document.querySelector( "#infoFrame" );
		}

		switch( id ){
			case 1:
				targetpos = new THREE.Vector3(0,10,0);
				controlpos = new THREE.Vector3(0,10,66);
				break;
			case 2:
				targetpos = new THREE.Vector3(150,10,0);
				controlpos = new THREE.Vector3(150,10,66);
				break;
			case 3:
				targetpos = new THREE.Vector3(300,10,0);
				controlpos = new THREE.Vector3(300,10,66);
				break;
				//Detail systems
			case 20:
			//Heart
				infoFrame.src = "infoPages/cardiovascular/heart.html";
				break;
			case 21:
			//Skull
				infoFrame.src = "infoPages/skeletal/skull.html";
				break;
			case 22:
			//Femur
				infoFrame.src = "infoPages/skeletal/femur.html";
				break;
			case 23:
				infoFrame.src = "infoPages/integumentary/hand.html";
				break;
			default:
				console.log( "Error: Invalid element selected" );
				break;
		}

		if( isDetail )
			return;
		controls.setTargetPosition( targetpos );
		controls.setPosition( controlpos );
		dirLight.target.position.copy( targetpos );
	},

};