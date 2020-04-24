/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','Sprite'], 
		function(BasicObject,GraphicsComponent,Sprite){
	
	var Background = BasicObject.extend({
		init:function(_w,_h,_sprite){
			this._super();
			this.scale = 1;
			if(_sprite != undefined)
			{
				this.sprite = new Sprite(_sprite.sprite,_sprite.x,_sprite.y,_sprite.width,_sprite.height);
				this.scale = _sprite.scale;
			}else
			{
			this.sprite = new Sprite("bg",0,0,500,300);
			}
			this.stageSize = {width:_w,height:_h};
			
		},
		
		createAnimations:function()
		{
			var gc = new GraphicsComponent(this);
			gc.sprite = this.sprite;
			if(this.sprite != undefined) gc.sprite = this.sprite;
			gc.zBuff = -1;
			gc.scaleX = gc.scaleY = this.scale;
			
			var scW = this._view.getWidth();
			var scH = this._view.getHeight();
			
			var divis = this.stageSize.width-scW==0?1:(this.stageSize.width-scW);
			gc.scrollMod.x = (gc.width() * gc.scaleX) >scW ? ((gc.width() * gc.scaleX - scW) /divis):1;
			
			divis = (this.stageSize.height-scH==0?1:(this.stageSize.height-scH));
			gc.scrollMod.y = (gc.height() * gc.scaleY) > scH ? ((gc.height() * gc.scaleY - scH) /divis):1;
			this.addComponent(gc);			
		},
		onShowMe:function(){
			this.createAnimations();
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		}
	});
	
	return Background;
});