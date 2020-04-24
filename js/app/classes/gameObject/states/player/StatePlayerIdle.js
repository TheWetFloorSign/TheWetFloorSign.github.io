define(['Class'],function(Class){
	var StatePlayerIdle = Class.extend({
		init:function(_actor){
			this.canDash = true;
			this.actor = _actor;
			this.enter();
		}
		
	});
	
	StatePlayerIdle.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerIdle.prototype.update = function(_dt)
	{
		if(this.actor.keyManager.isActionActivated("left") || this.actor.keyManager.isActionActivated("right"))
			{
				return "run";
			}
		if(this.actor.keyManager.isActionActivatedIn("dashLeft",1) || this.actor.keyManager.isActionActivatedIn("dashRight",1))
			{
				return "dash";
			}
		return "";
	}
	
	StatePlayerIdle.prototype.enter = function()
	{
		this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("walk", false);
	}
	
	StatePlayerIdle.prototype.exit = function()
	{
	}
	
	return StatePlayerIdle;
});