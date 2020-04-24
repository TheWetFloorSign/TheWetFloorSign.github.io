define(['Class', 'SpriteLibrary','GameData'],function(Class, SpriteLibrary,GameData){
	var AnimationStateMachine = Class.extend({
		init:function(){
			this.stateList = [];
			this.animationList = [];
			this._transitionVars = [];
			this._stateVars = [];
			
			this._curFrame = 0;
			this.aniTic = 0;
			this.defAnimationDelay = 4;
			this.animationDelay = 0;
			this.library = new SpriteLibrary();
		}
		
	});
	
	AnimationStateMachine.prototype.aniState = function(){
		return (this.stateList.length>0)?this.stateList[this.stateList.length-1]:this._default;
	}
	
	AnimationStateMachine.prototype.sprite = function()
	{
		return this._sprite;
	}
	
	AnimationStateMachine.prototype.defaultAnimation = function(_def){
		this._default = this.findAni(_def);
		this._sprite = this._default.animationSet[this._curFrame];
	}
	
	AnimationStateMachine.prototype.aniFrame = function(){
		if(this.stateList.length>0) return this.stateList[this.stateList.length-1].animationSet[this._curFrame];
		else return this._default.animationSet[this._curFrame];
	}
	
	AnimationStateMachine.prototype.stateName = function(){
		return this.stateList[this.stateList.length-1].name;
	}
	
	AnimationStateMachine.prototype.states = function(){
		var sStates = "";
		for(var i = 0;i<this.stateList.length;i++){
			sStates+= this.stateList[i].name + " ";
		}
		return sStates;
	}
	
	AnimationStateMachine.prototype.updateAni = function(_dt){
		this.aniTic+= (1 * GameData.getTime());
		if(this.aniTic>=this.aniState().frameDelay || this.aniTic ==-1){
			this.aniTic=-1;
			this._curFrame++;
			if(this._curFrame>=this.stateList[this.stateList.length-1].animationSet.length){
				if(this.stateList[this.stateList.length-1].loop ==false){
					this.popState(true);
				}
				this._curFrame = 0;
			}
			if(this.stateList.length<=0){
				this.stateList.push(this._default);
				this._curFrame = 0;
			}
			this._sprite = this.aniState().animationSet[this._curFrame];
				
		}
		return this._sprite;
		
	}
	
	AnimationStateMachine.prototype.changeVariables = function(variable, value)
	{
		if (this._transitionVars[variable] == undefined)
		{
			return;
		}
		//if (value is typeof(_transitionVars[variable]))
		//{
		if(this._transitionVars[variable] != value)
		{
			this._transitionVars[variable] = value;
			
		}	
		this.parseTransVars();		
		//}		
	}
	
	AnimationStateMachine.prototype.addVariables = function(variableObj)
	{
		for (tranVar in variableObj)
		{
			this._transitionVars[tranVar] = variableObj[tranVar];
		}
	}
	
	AnimationStateMachine.prototype.addStateParams = function(state,variableObj)
	{
		if (this.findAni(state) == null)
		{
			return;
		}			
		
		this._stateVars[state] = variableObj;
		this.parseTransVars();
	}
	
	AnimationStateMachine.prototype.addState = function(blit, frameBuffer, priority){
		var exists = false;
		(frameBuffer ==undefined)?this.animationDelay = this.defAnimationDelay:this.animationDelay = frameBuffer;
		for(var i = this.stateList.length -1; i>=0;i--){
			if(this.stateList[i] != null && this.stateList[i].name == blit){
				exists = true;
			}
		}
		if (!exists && blit != ""){
			this.popState();
			this.stateList.push(this.findAni(blit));
			this._curFrame = 0;
			this.aniTic = -1;
			this._sprite = this.aniState().animationSet[this._curFrame];
		}
	}
	
	AnimationStateMachine.prototype.addAnimation = function(animation){
		this.animationList.push(animation);
		this.parseTransVars();
	}
	
	AnimationStateMachine.prototype.popState = function(all){
		if(all == undefined)
		{
			all = false;
		}
		for(var i = (all? this.stateList.length : 1);i>0;i--){
			this.stateList.pop();
		}
		
	}
	
	AnimationStateMachine.prototype.parseTransVars = function()
	{
		isMatch = true;
		var longest = "";
		var curLength = 0;
		var potentialStates = [];
		for (var iState in this._stateVars) 
		{
			isMatch = true;
			for (var iVar in this._stateVars[iState])
			{
				if (this._stateVars[iState][iVar] != this._transitionVars[iVar]){
					isMatch = false;
				}
			}
			if (isMatch)
			{
				potentialStates[iState] = this._stateVars[iState];
			}
		}
		//console.log(potentialStates);
		for (var iState2 in potentialStates) 
		{
			var length = 0;
			//console.log(potentialStates);
			for (var iVar2 in potentialStates[iState2])
			{
				length++;
			}
			if (length >= curLength)
			{
				longest = iState2;
				curLength = length;
			}
		}
		//console.log(longest);
		this.addState(longest);
		
	}
	
	AnimationStateMachine.prototype.findAni = function(ani){
		for (var i = this.animationList.length - 1; i >=0; i--){
			if (this.animationList[i].name == ani){
				return this.animationList[i];
			}
		}
		return null;
	}
	
	return AnimationStateMachine;
});