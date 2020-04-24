/**
 * ...
 * @author Ben
 */

define(['Class','Assets'], function(Class,Assets){
	var canvas,width,height,graphics,scale;
	var Display = Class.extend({
		init:function(_width,_height,_scale){
			this.width = _width;
			this.height = _height;
			this.scale = _scale;
			this.createDisplay();
		},
		
		createDisplay:function(){
			var body = document.body;
			var canv = document.getElementById('canvas');
			
			if(canv == null)
			{
				canv = document.createElement("CANVAS");
				canv.id = 'canvas';
				canv.width = (this.width * this.scale);
				canv.height = (this.height * this.scale);
				body.appendChild(canv);
				console.log(body);
				body.style.margin = 0;
				body.style.padding = 0;
				canv.margin = 0;
				canv.padding = 0;
			}
			
			this.graphics = document.getElementById('canvas').getContext("2d",{alpha:false});
			this.graphics.scale(this.scale,this.scale);
			this.graphics.imageSmoothingEnabled = false;
			this.graphics.webkitImageSmoothingEnabled = false;
			this.graphics.msImageSmoothingEnabled = false;
		}
	});
	
	
	
	Display.prototype.getWidth = function(){
		return this.width;
	};
	
	Display.prototype.getHeight = function(){
		return this.height;
	};
	
	Display.prototype.getTitle = function(){
		return this.title;
	};
	
	Display.prototype.getGraphics = function(){
		return this.graphics;
	};
	
	return Display;
});