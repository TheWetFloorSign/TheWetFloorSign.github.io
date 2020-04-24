/**
 * ...
 * @author Ben
 */

define(['Class'], function(Class){
	
	var HitBox = Class.extend({
		init:function(actor,_x,_y,_width,_height){
			this.id = "HitBox";
			
			
			this.lastWidth = this.width = _width;
			this.lastHeight = this.height = _height;
			this.lastX = this.x = _x;
			this.lastY = this.y = _y;
			
			this.isTrigger = false;
			
			this.parent = actor;
			this.target = null;
			this.targetHB = null;
			
			
			this.newSize = false;
			
			this.collision1 = null;
			this.collision2 = null;
			this.collision3 = null;
			
			this._internalCollisionList = [];
		}
	});
	
	HitBox.prototype.newHitBox = function(_x,_y,_width,_height)
	{
		
		this.tempWidth = _width;
		this.tempHeight = _height;
		this.tempX = _x;
		this.tempY = _y;
		
		this.newSize = true;
	}	
	
	HitBox.prototype.update = function(_dt)
	{
		if(this.newSize == true)
		{
			this.lastX = this.x;
			this.lastY = this.y;
			this.lastWidth = this.width;
			this.lastHeight = this.height;
			
			this.x = this.tempX;
			this.y = this.tempY;
			this.width = this.tempWidth;
			this.height = this.tempHeight;
			
			this.newSize = false;
		}
		
	}
	
	HitBox.prototype.collisionResolution = function(ob)
	{	
		this.target = ob.parent;
		this.targetHB = ob;
		var index = null;
		for(var i = this._internalCollisionList.length-1;i>=0;i--)
		{
			if(this._internalCollisionList[i].ob == ob)
			{
				var index = i;
				break;
			}
		}
		if(index == null)
		{
			if(this.collision1 != null)this.collision1(this);
			this._internalCollisionList.push({ob:ob,state:true});
		}else if (this._internalCollisionList[index].state == false)
		{
			if(this.collision2 != null)this.collision2(this);
			this._internalCollisionList[index].state = true;
		} 
	}
	
	HitBox.prototype.exitCollision = function()
	{
		for (var i = this._internalCollisionList.length-1;i>=0;i--)
		{
			if (this._internalCollisionList[i].state == false)
			{
				this.targetHB = this._internalCollisionList[i].ob;
				this.target = this.targetHB.parent;
				if(this.collision3 != null)this.collision3(this);
				this._internalCollisionList.splice(i,1);
				
			}else{
				this._internalCollisionList[i].state = false;
			}			
		}		
	}
	
	HitBox.prototype.kill = function(){}
	
	return HitBox;
});