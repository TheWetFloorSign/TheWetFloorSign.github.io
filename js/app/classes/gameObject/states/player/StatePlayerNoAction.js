define(['Class'],function(Class){
	var StatePlayerNoAction = Class.extend({
		init:function(_actor){
			this.fallTic = 10;
			this.actor = _actor;
			this.enter();
		}
		
	});
	
	StatePlayerNoAction.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerNoAction.prototype.update = function(_dt)
	{
		
		if(this.actor.keyManager.isActionActivatedIn("punch",1) || this.actor.keyManager.isActionActivatedIn("switch",1))
		{
			return "punch";
		}
		if(this.actor.keyManager.isActionActivatedIn("kick",1))
		{
			return "kick";
		}
		return "";
	}
	
	StatePlayerNoAction.prototype.enter = function()
	{
		//this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("action", false);
		//this.actor.getComponent("GraphicsComponent").spriteManager.changeVariables("kick", false);
	}
	
	StatePlayerNoAction.prototype.exit = function()
	{
	}
	
	return StatePlayerNoAction;
});