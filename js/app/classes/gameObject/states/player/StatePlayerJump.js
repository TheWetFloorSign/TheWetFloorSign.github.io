define(['Class','GameData','EventManager'],function(Class,GameData,EventManager){
	var StatePlayerJump = Class.extend({
		init:function(_actor){
			this.jumpTic = 10;
			this.actor = _actor;
			this.pl = null;
			this.eM = new EventManager();
			this.enter();
		}
		
	});
	
	StatePlayerJump.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerJump.prototype.update = function(_dt)
	{
		this.jumpTic-= (1 * GameData.getTime());
		//console.log("dt is " +_dt);
		console.log(this.jumpTic);
		this.pl.velocity.y = Math.floor(-7);
		if (this.jumpTic <= 0 || !this.actor.keyManager.isActionActivated("up") || this.actor.touching & 0x0010) return "fall";	
		if(this.actor.abilities & 0x1 && this.actor.jumpCount != undefined && this.actor.jumpCount <1 && this.actor.keyManager.isActionActivatedIn("up",1))
		{
			this.actor.jumpCount++;
			return "jump";
		}
		return "";
	}
	
	StatePlayerJump.prototype.enter = function()
	{
		this.jumpTic = 15;
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("ground", false);
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("fall", false);
		this.eM.dispatchEvent("playSound",{name:"jump",channel:"sfx"});
		this.pl = this.actor.getComponent("PhysicsLite");
		this.pl.velocity.y = Math.floor(-7);
	}
	
	StatePlayerJump.prototype.exit = function()
	{
	}
	
	return StatePlayerJump;
});