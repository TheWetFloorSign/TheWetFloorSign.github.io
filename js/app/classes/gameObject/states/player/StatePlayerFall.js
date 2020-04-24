define(['Class','EventManager'],function(Class,EventManager){
	var StatePlayerFall = Class.extend({
		init:function(_actor){
			this.fallTic = 10;
			this.actor = _actor;
			this.eM = new EventManager();
			this.enter();
		}
		
	});
	
	StatePlayerFall.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerFall.prototype.update = function(_dt)
	{
		this.fallTic--;
		if((this.actor.touching & 0x0001)>0)
		{
			this.eM.dispatchEvent("playSound",{name:"land",random:true,channel:"sfx"});
			return "stand";
		}
		if(this.actor.getComponent("PhysicsLite").velocity.y>2)
		{
			this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("fall", true);
		}
		if(this.actor.abilities & 0x1 && this.actor.jumpCount != undefined && this.actor.jumpCount <1 && this.actor.keyManager.isActionActivatedIn("up",1))
		{
			this.actor.jumpCount++;
			return "jump";
		}
		return "";
	}
	
	StatePlayerFall.prototype.enter = function()
	{
		this.fallTic = 15;
		console.log("Actor:",this.actor.name)
		//this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("fall", true);
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("ground", false);
		if(this.actor.wasTouching & 0x0001)this.actor.getComponent("PhysicsLite").velocity.y = 0;
	}
	
	StatePlayerFall.prototype.exit = function()
	{
	}
	
	return StatePlayerFall;
});