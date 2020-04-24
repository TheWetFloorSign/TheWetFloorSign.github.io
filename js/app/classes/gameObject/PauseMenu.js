/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','Sprite','Assets','EventManager','Text'],function(BasicObject,GraphicsComponent,Sprite,Assets,EventManager,Text){
	
	var PauseMenu = BasicObject.extend({
		init:function(_text){
			this._super();
			this.name = "pauseMenu";
			this.text = _text;
			this.width = 300;
			this.height = 200;
			this.x = 30;
			this.y = 60;
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
			if(this.keyManager.isActionActivatedIn("punch",1))this.eM.dispatchEvent("swapScene",{scene:"MainScreen"});
		},
		
		createAnimations:function()
		{
			var gc = new GraphicsComponent(this);
			gc.zBuff =6;
			gc.clampX = true;
			gc.clampY = true;
			this.addComponent(gc);
			var canv = document.createElement("CANVAS");
			
			text = new Text(this.text);
			
			this.add(text);
			
			text.onShowMe();
			text.x = this.x + 10;
			text.y = this.y + 10;
			text.changeColor('white');
			text.getComponent("GraphicsComponent").clampX = text.getComponent("GraphicsComponent").clampY = true;
			text.getComponent("GraphicsComponent").zBuff = gc.zBuff+1;
			
			canv.height = 120;
			canv.width = 300;
			canv.id = 'testId';
			var cont = canv.getContext("2d");
			
			gc.fillStyle = "rgba(0, 0, 100, 0.9)";			
			
			var imgData = new Image();
			imgData.src = canv.toDataURL();
			var _this = this;
			imgData.onload = function()
			{
				var astOb = {};
				astOb[_this.spriteSheet] = imgData.src;
				var ast = new Assets(astOb);
				_this.getComponent("GraphicsComponent").sprite = new Sprite(_this.spriteSheet,0,0,this.width,this.height,0,0);
				_this._view.camera.addDraw(_this.getComponent("GraphicsComponent"));
			}
			
			
		},
		onShowMe:function(){this.createAnimations();}
	});
	
	return PauseMenu;
});