/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','Sprite','Assets','EventManager','Text'],function(BasicObject,GraphicsComponent,Sprite,Assets,EventManager,Text){
	
	var TextBox = BasicObject.extend({
		init:function(_text){
			this._super();
			this.name = "textBox";
			this.text = _text;
			this.tf = null;
			this.width = 80;
			this.height = 30;
			var num = 0;
			while(Assets.getAssets("textSprite"+num) != undefined)
			{
				num++;
			}
			this.spriteSheet = "textSprite"+num.toString();
			var astOb = {};
				astOb[this.spriteSheet] = "";
				var ast = new Assets(astOb);
			
			this.eM = new EventManager();
			
		},
		
		updateMe:function(_dt)
		{
			this._super(_dt);
			this.updateComponents(_dt);	
		},
		
		updateText:function(_text)
		{
			this.text = _text;
			this.createAnimations();
		},
		
		createAnimations:function()
		{
			var gc = this.getComponent("GraphicsComponent");
			if(gc == null)
			{
				gc = new GraphicsComponent(this);
				this.addComponent(gc);
				this.tf = new Text(this.text);
			
				this.add(this.tf);
	
			}
			gc.zBuff =1;
			//gc.clampX = true;
			//gc.clampY = true;
			
			this.tf.updateText(this.text);
			var canv = document.createElement("CANVAS");
			
			
			this.tf.x = this.x + 10;
			this.tf.y = this.y + 10;
			this.tf.changeColor('white');
			//text.getComponent("GraphicsComponent").clampX = text.getComponent("GraphicsComponent").clampY = true;
			this.tf.getComponent("GraphicsComponent").zBuff = gc.zBuff+1;
			
			canv.height = (this.tf.height /5)+10;
			canv.width = (this.tf.width /5) + 20;
			canv.id = 'testId';
			var cont = canv.getContext("2d");
			
			gc.fillStyle = "rgba(0, 0, 0, 0.7)";			
			
			var imgData = new Image();
			imgData.src = canv.toDataURL();
			var _this = this;
			imgData.onload = function()
			{
				var astOb = {};
				astOb[_this.spriteSheet] = imgData.src;
				var ast = new Assets(astOb);
				var gc = _this.getComponent("GraphicsComponent");
				if(gc != null)
				{
					gc.sprite = new Sprite(_this.spriteSheet,0,0,this.width,this.height,0,0);
					_this._view.camera.addDraw(gc);
				}
				gc = null;
				ast = null;
				astOb = null;
				_this = null;
			}
			
			
		},
		onShowMe:function(){this.createAnimations();}
	});
	
	return TextBox;
});