define(['Class','Attack','GameData','EventManager'],function(Class,Attack,GameData,EventManager){
	var StatePlayerNoAction = Class.extend({
		init:function(_actor){
			this.kickTic = 24;
			this.actor = _actor;
			this.pl = null;
			this.cm = this.actor.getComponent("ComboManager");
			this.eM = new EventManager();
			this.enter();
		}
		
	});
	
	StatePlayerNoAction.prototype.handleInput = function()
	{
		
	}
	
	StatePlayerNoAction.prototype.update = function(_dt)
	{
		this.kickTic-= (1 * GameData.getTime());
		console.log("kicktime: " + this.kickTic);
		if(this.kickTic.toFixed(1) == 12)
		{
			/*this.pl.velocity.x = (this.actor._facing & 0x0100?1:-1) *10;
			this.actor.add(new Attack(0,0,(this.actor._facing & 0x0100?1:-1),this.actor,{x:8,y:0},{x:38,y:20}));*/
		}
		if(this.kickTic <=0)
		{
			return "noAction";
		}
		return "noAction";
	}
	
	StatePlayerNoAction.prototype.enter = function()
	{
		this.cm.addInput(2);
		this.eM.dispatchEvent("playSound",{name:"punch1",channel:"sfx"});
	}
	
	StatePlayerNoAction.prototype.exit = function()
	{
	}
	
	return StatePlayerNoAction;
});