/**
 * ...
 * @author Ben
 */

define(['Class','Camera'], function(Class,Camera){
	
	var GraphicsComponent = Class.extend({
		init:function(actor,camera){
			this.id = "GraphicsComponent";
			this._alive = true;
			this._exists = true;
				
			this._vFlip = 1;
			this._hFlip = 1;
			
			this.debug = false;
				
			this.renderPoint = {x:0,y:0};
				
			this.scrollMod = {x:1,y:1};
				
			this._camera;
				
			this.spriteManager;
			this.sprite = new Image(10,10);
				
			this.zBuff = 0;
			
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;
			
			this.clampX = false;
			this.clampY = false;
			
			this.alpha = 1;
				
			this.parent = actor;
			if(camera != undefined)
			{
				camera.addDraw(this);
				this._camera = camera;
			}
		}
	});
	
	GraphicsComponent.prototype.currentDisplay = function()
	{
		if (this.sprite == undefined) sprite =  new Image(10,10);
		return this.sprite;
	}
	
	GraphicsComponent.prototype.getRenderPoint = function()
	{
		return {x:(this.sprite.width/2)*this.renderPoint.x,y:(this.sprite.height/2)*this.renderPoint.y};
	}
	
	GraphicsComponent.prototype.setRenderPoint = function(_x,_y)
	{
		if(_y == undefined)_y = this.renderPoint.y;
		this.renderPoint = {x:_x,y:_y};
	}
	
	GraphicsComponent.prototype.sheet = function()
	{
		return this.sprite.sheet;
	}
	
	GraphicsComponent.prototype.width = function()
	{
		return this.sprite.width;
	}
	
	GraphicsComponent.prototype.height = function()
	{
		return this.sprite.height;
	}
	
	GraphicsComponent.prototype.xOff = function()
	{
		return this.sprite.xOff;
	}
	
	GraphicsComponent.prototype.yOff = function()
	{
		return this.sprite.yOff;
	}
	
	GraphicsComponent.prototype.camera = function(cam)
	{
		this._camera = cam;
		cam.addDraw(this);
	}	
	
	GraphicsComponent.prototype.update = function(_dt)
	{
		if(this.spriteManager)
		{
			this.sprite = this.spriteManager.updateAni(_dt);
		}
	}
	
	GraphicsComponent.prototype.kill = function()
	{
		if (this._camera) this._camera.removeDraw(this);
	}
	
	return GraphicsComponent;
});