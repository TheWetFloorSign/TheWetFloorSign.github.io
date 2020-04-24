/**
 * ...
 * @author Ben
 */

define(['Class','Display','Assets'], function(Class,Display,Assets){
	
	var Camera = Class.extend({
		init:function(_width,_height,_scale,_display){
			this._width = _width;
			this._height = _height;
			this._scale = _scale;
			this._lowZ = 0;
			this._highZ = 0;
			this._gcList = [];
			this._shake = null;
			this.cameraBounds = null;
			if(_display == undefined)
			{
				_display = new Display(_width,_height,_scale);
			}
			this._graphics = _display.getGraphics();
			this.deadZone = {x:(_width/2)-_width/12,
							y:_height/2,
							width:_width/6,
							height:(_height/8)*2};
			this.cameraView = {x:0,y:0,width:_width,height:_height};
			this.scroll = {x:0,y:0};
			this._graphics.strokeStyle = "#FF00FFFF";
		}
	});
	
	Camera.prototype.getWidth = function(){
		return this._width;
	};
	
	Camera.prototype.getHeight = function(){
		return this._height;
	};
	
	Camera.prototype.getGraphics = function(){
		return this._graphics;
	};
	
	Camera.prototype.addDraw = function(gc)
	{
		for (let i = this._gcList.length - 1; i >= 0; i--)
		{
			if (gc == this._gcList[i])
			{
				return;
			}
		}
		this._gcList.push(gc);
		
		if(gc.zBuff < this._lowZ)
		{
			this._lowZ = gc.zBuff;
		}
		
		if(gc.zBuff > this._highZ)
		{
			this._highZ = gc.zBuff;
		}
	}
		
	Camera.prototype.removeDraw = function(gc)
	{
		for (let i = this._gcList.length - 1; i >= 0; i--)
		{
			if (gc == this._gcList[i])
			{
				this._gcList.splice(i, 1);
				return;
			}
		}
	}
	
	Camera.prototype.clear = function()
	{
		this.target = null;
		this._gcList = [];
		this.cameraView.x = this.cameraView.y = 0;
	}
	
	Camera.prototype.follow = function(target){
		this.target = target;
	}
	
	Camera.prototype.update = function(_dt)
	{
		//this._graphics.clearRect(0,0,this._width,this._height);
		if(this.target != null){
				
			//var offset = (target.facing & ExtraFunctions.RIGHT)?-1:1;
			/*if(this.target._facing & 0x0100)
			{
				this.targetDeadX  = (this._width/2)-(this._width/8)*3;
			}else
			{
				this.targetDeadX  = (this._width/2)+(this._width/8);
			}
			if(this.targetDeadX != this.deadZone.x)
			{
				var xMod = (this.target.x != this.target.last.x?2:1);
				if(this.targetDeadX>this.deadZone.x)this.deadZone.x += Math.min(2 * xMod,(this.targetDeadX-this.deadZone.x));
				if(this.targetDeadX<this.deadZone.x)this.deadZone.x += Math.max(-2 * xMod,(this.targetDeadX-this.deadZone.x));
			}*/
			let offset = 0;
			
			/** if the left 'edge' of the camera is less than it's current edge (scroll.x),
				scroll.x gets reduced to edge
				*/
			let edge = this.target.x - this.deadZone.x;
			
			if(this.scroll.x > edge){
				this.scroll.x = edge;
			}
			edge = this.target.x - this.deadZone.width - this.deadZone.x;
			if(this.scroll.x < edge){
				this.scroll.x = edge;
			}
			edge = this.target.y - this.deadZone.y;
			if(this.scroll.y > edge){
				this.scroll.y = edge;
			}
			edge = this.target.y - this.deadZone.height - this.deadZone.y;
			
			if(this.scroll.y < edge){
				this.scroll.y = edge;
			}
			
			/*if(edge != target.y){
				(target.y > edge)? scroll.y-=3: scroll.y+=3;
			}*/
			//scroll.x += movementBuffer;
			
			if(this.cameraBounds!= null){
				if(this.scroll.x <this.cameraBounds.x) this.scroll.x = this.cameraBounds.x;
				if(this.scroll.x + this._width >this.cameraBounds.width) this.scroll.x = this.cameraBounds.width - this._width;
				if(this.scroll.y <this.cameraBounds.y) this.scroll.y = this.cameraBounds.y;
				if(this.scroll.y + this._height>this.cameraBounds.height) this.scroll.y = this.cameraBounds.height - this._height;
				if(this._height - this.scroll.y > this.cameraBounds.height -this.cameraBounds.y)this.scroll.y = -(this._height-this.cameraBounds.height)/2;
				if(this._width - this.scroll.x > this.cameraBounds.width -this.cameraBounds.x)this.scroll.x = -(this._width-this.cameraBounds.width)/2;
			}
			
			
			this.cameraView.x = this.scroll.x;
			this.cameraView.y = this.scroll.y;
		}
		if(this._shake != null)
		{
			this._shake.time -= 1;
			var sRand = 0;
			var done = false;
			while(done == false)
			{
				sRand = (Math.random() * (this._shake.value + this._shake.value)) - this._shake.value;
				if(Math.abs(sRand)>=this._shake.value/2)done = true;
			}
			this._shake.x = sRand;
			this._shake.y = sRand;
			if(this._shake.time <=0) this._shake = null;
		}
		this._graphics.fillStyle = "grey";
		this._graphics.fillRect(0,0,this._width,this._height);
		//this._graphics.save();
		for(let z = this._lowZ; z<=this._highZ; z++)
		{
			for(let i = this._gcList.length -1;i>=0;i--)
			{
				if(z == this._gcList[i].zBuff)
				{
					this.render(this._gcList[i]);
					//this._graphics.restore();
				}
			}
		}
		
	}
	
	Camera.prototype.addShake = function(data)
	{
		this._shake = data;
	}
	
	Camera.prototype.render = function(gc){
		let asset = gc.currentDisplay();
		let renderPoint = gc.getRenderPoint();
		if(asset == null)
		{
			return;
		}
		
		//let _x = gc.parent.x -(gc.clampX == false?(this.cameraView.x*gc.scrollMod.x):0 ) - (gc._hFlip ==-1?gc.width():0);
		let _x = gc.parent.x -(gc.clampX == false?(this.cameraView.x*gc.scrollMod.x):0 );	
		//let _y = gc.parent.y -(gc.clampY == false?(this.cameraView.y*gc.scrollMod.y):0 ) + (gc._vFlip ==-1?gc.height():0);
		let _y = gc.parent.y -(gc.clampY == false?(this.cameraView.y*gc.scrollMod.y):0 );
		
		let _width = gc.width();
		let _height = gc.height();
		let _sclX = gc.scaleX;
		let _sclY = gc.scaleY;
		let flipX = gc._hFlip * asset.hFlip || 1;
		let flipY = gc._vFlip || 1;
		
		let targetX = -(renderPoint.x);
		let targetY = -(renderPoint.y);
		let offX = asset.offsetX || 0;
		let offY = asset.offsetY || 0;
			
		if(_x + (_sclX * (targetX + _width)) + offX < 0 || _x + (_sclX * (targetX)) + offX > this.width ||
		_y + (_sclY * (targetY + _height)) + offY < 0 || _y + (_sclY * (targetY)) + offY > this.height)
		{
			return;
		}
		
		this._graphics.save();
		//this._graphics.translate(_x+asset.offsetX*flipX+(_width * _sclX/2),_y+asset.offsetY*flipY+(_height * _sclY/2));
		
		this._graphics.translate((_x+offX*flipX)<< 0,(_y+offY*flipY)<< 0);
		if(this._shake != null)this._graphics.translate(this._shake.x,this._shake.y);
		if(gc.rotation != 0)this._graphics.rotate(gc.rotation);
		if(_sclX * flipX != 1 || _sclY * flipY != 1)this._graphics.scale(_sclX * flipX,_sclY * flipY);
		if(gc.alpha != 1)this._graphics.globalAlpha = gc.alpha;
		if(asset.sheet != undefined)
		{
			let sheet = Assets.getAssets(asset.sheet).sheet;
			this._graphics.drawImage(sheet,asset.x,asset.y,_width,_height,targetX,targetY,_width,_height);
		}
		
		if(gc.fillStyle != undefined)
		{
			this._graphics.fillStyle = gc.fillStyle;
			this._graphics.fillRect(targetX,targetY,_width,_height);
		}
		if(gc.debug == true)
		{
			this._graphics.beginPath();
			this._graphics.fillStyle = "#FF000030";
			this._graphics.strokeRect(targetX,targetY,_width,_height);
		}
		
		this._graphics.restore();
		//this._graphics.myDrawImage(gc.currentDisplay(),gc.parent.x - this.cameraView.x,gc.parent.y- this.cameraView.y,gc.width(),gc.height());
	};
	
	return Camera;
});