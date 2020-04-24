define(['Class','Attack','EventManager','GameData','ComboManager'],function(Class,Attack,EventManager,GameData,ComboManager){
	var StatePlayerPunch = Class.extend({
		init:function(_actor){
			this.actor = _actor;
			this.eM = new EventManager();
			this.cm = this.actor.getComponent("ComboManager");
			this.switchTimer = 0;
			this.switchDelayed = false;
			this.enter();
		}
		
	});
	
	StatePlayerPunch.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerPunch.prototype.update = function(_dt)
	{
		if(this.actor.keyManager.isActionActivated("switch"))
		{
			this.switchTimer++;
			console.log(this.switchTimer);
			
		}else if(this.switchDelayed == true)
		{
			this.switchTimer = 0;
			this.switchDelayed = false;
			this.cm.addInput(3);
		}
		if(this.switchTimer >5)return "stance";
		if(this.switchTimer>0)return "";
		// if(this.actor.keyManager.isActionActivatedIn("punch",1))
		// {
			// this.eM.dispatchEvent("playSound",{name:"punch1"});
			// this.cm.addInput(1);
		// }
		return "noAction";
	}
	
	StatePlayerPunch.prototype.enter = function()
	{
		if(this.actor.keyManager.isActionActivatedIn("switch",1))
		{
			this.switchDelayed = true;
		}else
		{
			this.cm.addInput(1);
			this.eM.dispatchEvent("playSound",{name:"punch2",channel:"sfx"});
		}
		
	}
	
	StatePlayerPunch.prototype.exit = function()
	{
		this.switchTimer = 0;
			this.switchDelayed = false;
	}
	
	return StatePlayerPunch;
});