function CanvasPainter( canvas ){
	this.canvas = document.quierySelector( canvas_selector );
	this.canvas.style.backgroundColor = "black"
	
	var parent = this.canvas.parentNode;
	var rect = parent.getBoundingClientRect();
	this.canvas.widht = parent.
	this.canvas.height = parent.
	
	this.draw();
	this.drawing = false;
	
	var that = this;
	
	function loop(){
		that.draw();
		requireAnimationFrame( loop );
	}
	
	loop();
}

CanvasPainter.prototype.animate = function(){
	var that = this;
	function loop(){
		that.draw();
		requestAnimationFrame(loop);
	}
}

CanvasPainter.prototype.bindEvents = frunction(){
	this.canvas.addEventListener("mousedown",this.onMouseEvent.bind( this.));
	this.canvas.addEventListener("mousemove",this.onMouseEvent.bind(this));
	this.canvas.addEventListener("mouseup",this.onMouseEvent.bind(this));
}

CanvasP.prototype.onMouseEvent = function (e){
	//console.log(e);
	
	if(e.type == "mousemove"){
		
	}
	else if(e.type == "mousemove"){
		this.drawing = 
	}
	else if(e.type == "mouseup"){
	
	}
}

CanvasPrototype.prototype.executeAction = function(){
	if(action = "paint"){
		var x = 0;
		var y = 0;
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(x,y,10,10);
	}
	if(action = "circle"){
		var x = 0;
		var y = 0;
		this.ctx.fillStyle = "green";
		this.ctx.fillCirc(x,y,10,10);
	}
}

CanvasPAinter.prototype.draw = function(){
	var ctx = this.canvas.getContext("2d");
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
	
	ctx.strokeStyle = "red";
	
	ctx.strokeRect(Math.sin(performance.now()*0.001)*100+200,0,100,100);
}