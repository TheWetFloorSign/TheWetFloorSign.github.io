define(['Class','GameData'],function(Class,GameData){
	var StatePlayerStance = Class.extend({
		init:function(_actor){
			this.actor = _actor;
			this.tic = 0;
			this.timeMod = 1;
			this.enter();
		}
		
	});
	
	StatePlayerStance.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerStance.prototype.update = function(_dt)
	{
	
		if(this.timeMod >= 0.2)
		{
			this.tic++;
			this.timeMod = this.easeInOutCubic(this.tic,1,-0.8,15);
			GameData.setTime(this.timeMod);
		}		
		if (this.actor.keyManager.isActionDeactivatedIn("switch",1)) return "noAction";
		return "";
	}
	
	StatePlayerStance.prototype.enter = function()
	{
		GameData.setTime(0.2);
	}
	
	StatePlayerStance.prototype.easeInOutCubic = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t + 2) + b;
	}
	
	StatePlayerStance.prototype.exit = function()
	{
		GameData.setTime(1);
	}
	
	return StatePlayerStance;
});