/**
 * ...
 * @author Ben
 */

define(['Class','GameData'], function(Class,GameData){
	
	var HealthComponent = Class.extend({
		init:function(actor,max,start){
			this.id = "HealthComponent";
			this.maxHealth = max||-1;
			this.health = start||-1;				
			this.parent = actor;
		}
	});
	
	HealthComponent.prototype.update = function(_dt)
	{
		if(this.maxHealth >0 && this.health<=0)
		{
			this.parent._alive = false;
		}
	}
	
	HealthComponent.prototype.kill = function()
	{
	}
	
	return HealthComponent;
});