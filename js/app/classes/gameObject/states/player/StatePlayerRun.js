define(['Class','EventManager','GameData'],function(Class,EventManager,GameData){
	var StatePlayerRun = Class.extend({
		init:function(_actor){
			this.canDash = true;
			this.actor = _actor;
			this.aniMachine = null;
			this.direction = null;
			this._speed = 3.2;
			this.tic = 4;
			this.eM = new EventManager();
			this.enter();
		}
		
	});
	
	StatePlayerRun.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerRun.prototype.update = function(_dt)
	{
		var left = this.actor.keyManager.isActionActivated("left");
		var right = this.actor.keyManager.isActionActivated("right");
		if(!left && !right)
			{
				return "idle";
			}
		if(this.actor.keyManager.isActionActivatedIn("dashLeft",1) || this.actor.keyManager.isActionActivatedIn("dashRight",1))
			{
				return "dash";
			}
		if(left)
		{
			this.actor.x-= (this._speed * GameData.getTime());
			//this.aniMachine.changeVariables("left", true);
			this.actor._facing = 0x1000;
			if(this.direction != -1)
			{
				this.direction = -1;
				this.actor.getComponent("GraphicsComponent")._hFlip = this.direction;
			}
		}else{
			this.actor.x+= (this._speed * GameData.getTime());
			this.aniMachine.changeVariables("left", false);
			this.actor._facing = 0x0100;
			if(this.direction != 1)
			{
				this.direction = 1;
				this.actor.getComponent("GraphicsComponent")._hFlip = this.direction;
			}
		}
		
		if((this.actor.wasTouching & 0x0001)<0 && (this.actor.touching & 0x0001)>0)
		{
			this.tic = 20;
		}
		
		this.tic-= GameData.getTime();
		if(this.tic<=0)
		{
			this.tic = 20;
			if((this.actor.touching & 0x0001)>0)this.eM.dispatchEvent("playSound",{name:"wiff",random:true,channel:'sfx'});
		}
		
		return "";
	}
	
	StatePlayerRun.prototype.enter = function()
	{
		this.aniMachine = this.actor.getComponent("GraphicsComponent").spriteManager;
		var left = this.actor.keyManager.isActionActivated("left");
		var right = this.actor.keyManager.isActionActivated("right");
		this.aniMachine.changeVariables("walk", true);
		if(left)
		{
			//this.aniMachine.changeVariables("left", true);
			this.direction = -1;
		}else{
			this.direction = 1;
		}
		this.actor.getComponent("GraphicsComponent")._hFlip = this.direction;
	}
	
	StatePlayerRun.prototype.exit = function()
	{
	}
	
	return StatePlayerRun;
});