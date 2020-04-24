define(['Class'],function(Class){
	var StatePlayerStand = Class.extend({
		init:function(_actor){
			this.actor = _actor;
			this.enter();
		}
		
	});
	
	StatePlayerStand.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerStand.prototype.update = function(_dt)
	{
		var up = this.actor.keyManager.isActionActivatedIn("up",1);
		//console.log(up);
		if (up) return "jump";	
		if ((this.actor.touching & 0x0001)==0 && (this.actor.wasTouching & 0x0001)==0)
			{
				console.log("we fallin'");
				return "fall";
			}
		return "";
	}
	
	StatePlayerStand.prototype.enter = function()
	{
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("ground", true);
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("fall", false);
		if(this.actor.jumpCount != undefined)
		{
			this.actor.jumpCount=0;
		}
	}
	
	StatePlayerStand.prototype.exit = function()
	{
	}
	
	return StatePlayerStand;
});