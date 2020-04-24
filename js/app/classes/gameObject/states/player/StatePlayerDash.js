define(['Class','GameData','EventManager'],function(Class,GameData,EventManager){
	var StatePlayerDash = Class.extend({
		init:function(_actor){
			this.dashTic = 10;
			this.dashVec = 0;
			this.actor = _actor;
			this.pl = null;
			this.aniMachine = null;
			this.eM = new EventManager();
			this.enter();
		}
		
	});
	
	StatePlayerDash.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerDash.prototype.update = function(_dt)
	{
		this.pl.velocity.x = (16 * this.dashVec) +((Math.floor( -16 * Math.sqrt(1 - (this.dashTic / 20) * (this.dashTic / 20)) + 4)) * this.dashVec);
		this.dashTic-= (1 * GameData.getTime());
		if(this.dashTic <10)
		{
			if(this.actor.keyManager.isActionActivatedIn("dashLeft",1) || this.actor.keyManager.isActionActivatedIn("dashRight",1))
			{
				this.aniMachine.changeVariables("dash", false);
				this.aniMachine.changeVariables("backdash", false);
				return "dash";
			}
		}
		if(this.dashTic<=0)
		{
			this.aniMachine.changeVariables("dash", false);
			this.aniMachine.changeVariables("backdash", false);
			return "idle";
		}
		return "";
	}
	
	StatePlayerDash.prototype.enter = function()
	{
		this.aniMachine = this.actor.getComponent("GraphicsComponent").spriteManager;
		var left = this.actor.keyManager.isActionActivated("dashLeft");
		var right = this.actor.keyManager.isActionActivated("dashRight");
		this.dashTic = 20;
		this.dashVec = (right == true?1:-1);
		this.pl = this.actor.getComponent("PhysicsLite");
		if (this.actor._facing == 0x1000)
		{
			this.aniMachine.changeVariables((!right?"dash":"backdash"), true);
		}else{
			this.aniMachine.changeVariables((!right?"backdash":"dash"), true);
		}
		this.eM.dispatchEvent("playSound",{name:"dash",random:true,channel:"sfx"});
	}
	
	StatePlayerDash.prototype.exit = function()
	{
		
	}
	
	return StatePlayerDash;
});