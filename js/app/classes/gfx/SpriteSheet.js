define(['Class'],function(Class){
	var Sprite = Class.extend({
		init:function(_sheet,_x,_y,_width,_height){
			this.sheet = _sheet;
			this.x = _x;
			this.y = _y;
			this.width = _width;
			this.height = _height;
		}
		
	});
	Sprite.prototype.crop = function(_x,_y,_width,_height){
		return {"sheet":this.sheet,"x":_x,"y":_y,"width":_width,"height":_height};
	}
	
	return Sprite;
});