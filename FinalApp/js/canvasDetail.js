

var canvasDetail = {
	mesh: null,

	init: function( obj )
	{
		console.log( 'init canvas detail in ' );
		console.log( obj );
		this.start3D( obj );
	},

	start3D: function( obj )
	{
		var parent = document.getElementById("canvasDetail");
		var width = parent.clientWidth;
		var height = parent.clientHeight;
		
		camera = new THREE.PerspectiveCamera( 70, width / height, 1, 10000);
		camera.position.set( 0, 7, 166 );

		scene = new THREE.Scene();
		scene.add( new THREE.AmbientLight( 0x404040 ) );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		parent.appendChild( renderer.domElement );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 10, 0 );

		var objLoader = new THREE.OBJLoader();

		var filepath = 'meshes/'+obj+".obj";
		objLoader.load( filepath, function( object ){
			object.position.set( 0, 0, 0 );
			this.mesh = object;
			scene.add( this.mesh );
		});

		//Light
		spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
		spotLight.position.set( 0, 500, 0 );
		spotLight.castShadow = true;
		spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;
        scene.add( spotLight );

		function onWindowResize(){
			camera.aspect = parent.clientWidth / parent.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( parent.clientWidth, parent.clientHeight );
		}

		function render(){
			controls.update();
			renderer.render( scene, camera );
		}

		function animate(){
			requestAnimationFrame( animate );
			this.mesh.rotation.x += 0.0005;
			this.mesh.rotation.y += 0.01;
			render();
		}

		window.addEventListener( "resize", onWindowResize );
		animate();
	}
};