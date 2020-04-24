define(['Class'],function(Class){
	var SpriteLibrary = Class.extend({
		init:function(){
			this._spriteDict = [];
		}
		
	});
	
	SpriteLibrary.prototype.getSprite = function(name)
	{
		if (this._spriteDict[name] != null)
		{
			return this._spriteDict[name];
		}else{
			console.log("No sprite sheet of name " + sheet + " has been added");
			return null;
		}
	}
	
	SpriteLibrary.prototype.addSprite = function(name, sprite)
	{
		if (this._spriteDict[name] != null)
		{
			throw new Error("Sprite of name " + name + " has already been added");
		}else{
			this._spriteDict[name] = sprite;
		}
	}
		
	return SpriteLibrary;
});