/**
 * ...
 * @author Ben
 */

define(['Class','GameData'], function(Class,GameData){
	
	var PhysicsLite = Class.extend({
		init:function(actor,camera){
			this.id = "PhysicsLite";
			this.velocity = {x:0,y:0};
			this.gravity = 1;
			this.resistance = 1;
			this.queuedImpulses = [];
				
			this.parent = actor;
		}
	});
	
	PhysicsLite.prototype.update = function(_dt)
	{
		if(this.queuedImpulses.length>0)this.applyImpulses();
		let gameTime = GameData.getTime();
		this.parent.x += (this.velocity.x * gameTime);
		this.parent.y += (this.velocity.y * gameTime);
		if(this.parent.name == "player")
		{
			/*console.log("Parent:",this.parent.name,
					" velocity:",this.velocity.y,
					" parent y:",this.parent.y,
					" parent touching:",(this.parent.touching & 0x0001) == true)*/
		}
		
		if(this.velocity.x !=0)
		{
			this.velocity.x -= Math.min(1,Math.abs(this.velocity.x)) * Math.sign(this.velocity.x) * gameTime * this.resistance;
		}
		
		if(this.parent.touching & 0x0001 && this.velocity.y >0)
		{
			this.velocity.y = 1;
		}else if(this.velocity.y < (8 * this.gravity * gameTime))
		{
			this.velocity.y += (0.4 * this.gravity * gameTime);
		}
		//if(this.parent.name == "player")console.log(this.parent.name+" velocity after:",this.velocity.y)
	}
	
	PhysicsLite.prototype.impulse = function(force,delay)
	{		
		if(delay == null || delay == undefined) delay = 0;
		//console.log(delay);
		this.queuedImpulses.push({"force":force,"delay":delay});
	}
	
	PhysicsLite.prototype.applyImpulses = function()
	{
		for(var len = this.queuedImpulses.length-1; len>=0;len--)
		{
			if(this.queuedImpulses[len].delay >0)
			{
				this.queuedImpulses[len].delay -= GameData.getTime();
			}else
			{
				this.velocity.x += this.queuedImpulses[len].force.x;
				this.velocity.y += this.queuedImpulses[len].force.y;
				
				this.queuedImpulses.splice(len,1);
			}
		}
	}
	
	PhysicsLite.prototype.kill = function()
	{
	}
	
	return PhysicsLite;
});