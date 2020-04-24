define(['Class','Attack','FrameData','GameData'],function(Class,Attack,FrameData,GameData){
	var timeMod = 1;
	var ComboManager = Class.extend({
		init:function(_actor)
		{
			this.id = "ComboManager";
			this.actor = _actor;
			this.gc = this.actor.getComponent("GraphicsComponent");
			this.pl = this.actor.getComponent("PhysicsLite");
			this.timer = 0;
			this.index = 0;
			this.forceTime = 0;
			this.targetAttack = null;
			this.forceDirection =1;
			this.recovery = false;
			this.inputs = [];
			this.frameData = new FrameData();
			this.force = [1,1,5,7];
			this.comboList = [{combo:[1],sequence:[1],time:[20]},
								{combo:[2],sequence:[4],time:[20]},
								{combo:[1,2],sequence:[1,2],time:[20,20]},
								{combo:[1,1,1,1],sequence:[1,1,2,3],time:[20,20,20,10]}];
			this.targetCombo = [];
		}
	});
	
	ComboManager.prototype.update = function()
	{
		if(this.gc == null)this.gc = this.actor.getComponent("GraphicsComponent");
		if(this.timer >0)this.timer-= GameData.getTime();
		if(this.targetAttack != null && this.timer <=this.forceTime)
		{
			this.pl.impulse({"x":this.targetAttack.damageBox.force.x * this.forceDirection,"y":this.targetAttack.damageBox.force.y},0);
			let nAttack = new Attack(0 + this.targetAttack.damageBox.offset.x,-24 + this.targetAttack.damageBox.offset.y,
									this.forceDirection,
									this.actor,
									this.targetAttack.damageBox.vector,
									{x:this.targetAttack.damageBox.size.w,y:this.targetAttack.damageBox.size.h});
			this.actor.add(nAttack);
			nAttack.onShowMe();
			this.forceTime = -100;
		}
		if(this.timer<=0)
		{
			this.index = 0;
			this.timer = 0;
			this.recovery = false;
			this.targetAttack = null;
			this.inputs = [];
			this.endCombo();
		}
	}
	
	ComboManager.prototype.addInput = function(_key)
	{
		if(this.recovery)return;
		this.inputs.push(_key);
		
		if(!this.isComboValid())
		{
			this.inputs.pop();
			this.index = 0;
			this.recovery = true;
			this.inputs = [];
			return;
		}
		this.timer = this.targetCombo.time[this.index];		
		this.targetAttack = null;
		for(let i=this.frameData.frameData.length-1;i>=0;i--)
		{
			if(this.frameData.frameData[i].ID == this.targetCombo.sequence[this.index])
			{
				this.targetAttack = this.frameData.frameData[i];
				break;
			}
		}
		this.forceTime = this.timer-this.targetAttack.damageBox.delay;
		this.forceDirection = this.actor._facing & 0x0100? 1:-1;
		this.gc.spriteManager.changeVariables("attack", this.targetCombo.sequence[this.index]);
		this.gc.spriteManager.changeVariables("action",true);
		this.index++;
	}
	
	ComboManager.prototype.isComboValid = function()
	{
		var isValid =false;
		for(var n=0;n<this.comboList.length;n++)
		{
			for(var i=0;i<this.inputs.length;i++)
			{
				if(this.comboList[n].combo[i] != undefined && this.inputs[i] == this.comboList[n].combo[i])
				{
					isValid = true;
				}else
				{
					isValid = false;
					break;
				}
			}
			if(isValid == true)
			{
				this.targetCombo = this.comboList[n];
				//console.log(this.targetCombo);
				break;
			}
		}
		return isValid;
	}
	
	ComboManager.prototype.endCombo = function()
	{
		this.gc.spriteManager.changeVariables("kick", false);
		this.gc.spriteManager.changeVariables("action", false);
		this.gc.spriteManager.changeVariables("attack", 0);
	}
	
	ComboManager.prototype.kill = function()
	{
	}
	return ComboManager;
});