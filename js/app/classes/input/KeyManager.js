define(['Class','BindingInfo','ControlBinding'],function(Class,BindingInfo,ControlBinding)
{	
	var KeyManager = Class.extend({
		init:function(){
			this.activationTimer = 0;
			this.bindings = [];
			this.filteredKeys = [];
			this.availableKeys = [];
			document.addEventListener("keydown",this.onKeyDown.bind(this));
			document.addEventListener("keyup",this.onKeyUp.bind(this));
		}
	});
	
	KeyManager.prototype.tick = function()
	{
		this.activationTimer++;
		//console.log(this.activationTimer);
	}
	
	KeyManager.prototype.addActionBinding = function(_action,_keyCode)
	{
		for (var i = this.bindings.length -1; i >=0; i--)
		{
			if (this.bindings[i].action == _action)
			{
				this.bindings[i].addBinding(new ControlBinding(_keyCode));
				return;
			} 
		}
		this.bindings.push(new BindingInfo(_action, new ControlBinding(_keyCode)));
	}
	
	KeyManager.prototype.isActionActivated = function(_action)
	{
		for (var i = this.bindings.length -1; i >=0; i--)
		{
			if (this.bindings[i].action == _action)
			{
				//console.log(this.bindings[i].lastActivatedTime);
				return this.bindings[i].isActivated();
			} 
		}
		return false;
	}
	
	KeyManager.prototype.isActionActivatedIn = function(_action,_frames)
	{
		for (var i = this.bindings.length -1; i >=0; i--)
		{
			if (this.bindings[i].action == _action && this.activationTimer - this.bindings[i].lastActivatedTime <= _frames)
			{
				return this.bindings[i].isActivated();
			} 
		}
		return false;
	}
	
	KeyManager.prototype.isActionDeactivatedIn = function(_action,_time)
	{
		for (var i = this.bindings.length -1; i >=0; i--)
		{
			if (this.bindings[i].action == _action && this.activationTimer - this.bindings[i].lastDeactivatedTime <= _time)
			{
				return !this.bindings[i].isActivated();
			} 
		}
		console.log("probably out of range");
		return false;
	}
	
	KeyManager.prototype.onKeyDown = function(e)
	{
		this.availableKeys = this.filterKeyBindings(e.keyCode);
		for(var i = this.availableKeys.length -1;i>= 0;i--){
			if(!this.availableKeys[i].isActivated()){
				this.availableKeys[i].setKeyActive(e.keyCode,true,this.activationTimer);
			}
		}	
	}
	KeyManager.prototype.onKeyUp = function(e)
	{
		this.availableKeys = this.filterKeyBindings(e.keyCode);
		for(var i = this.availableKeys.length -1;i>= 0;i--){
			if(this.availableKeys[i].isActivated()){
				this.availableKeys[i].setKeyActive(e.keyCode,false,this.activationTimer);
			}
		}
	}
	
	KeyManager.prototype.filterKeyBindings = function(_keyCode)
	{
		this.filteredKeys = [];
		for(var i = this.bindings.length - 1;i>=0;i--)
		{
			if(this.bindings[i].matchesKeyboardKey(_keyCode))this.filteredKeys.push(this.bindings[i]);
		}
		return this.filteredKeys;
	}
	
	return KeyManager;
});