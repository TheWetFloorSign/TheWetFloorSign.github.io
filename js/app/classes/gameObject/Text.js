/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','HitBox','Sprite','Tile','Assets'],function(BasicObject,GraphicsComponent,HitBox,Sprite,Tile,Assets){
	
	var Text = BasicObject.extend({
		init:function(_text){
			this._super();
			this.name = "text";
			this.textColor = 'black';
			this.text = "Test the text draw";
			if(_text != undefined)this.text = _text;
			let num = 0;
			while(Assets.getAssets("textSprite"+num) != undefined)
			{
				num++;
			}
			this.spriteSheet = "textSprite"+num.toString();
			var astOb = {};
				astOb[this.spriteSheet] = "";
				var ast = new Assets(astOb);
			
			this.canv = document.createElement("CANVAS");
			this.cont = this.canv.getContext("2d");
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
		
		changeColor:function(_color)
		{
			this.textColor = _color;
			this.createAnimations();
		},
		
		createAnimations:function()
		{
			var gc = this.getComponent("GraphicsComponent");
			if(gc == null)
			{
				gc = new GraphicsComponent(this);
				this.addComponent(gc);
			}
			gc.zBuff =1;
			//gc.clampX = true;
			gc.scaleX = gc.scaleY = 0.20;
			
			
			var canWidth = 100/gc.scaleX;
			var canHeight = 5/gc.scaleY;
			this.canv.height = this.height = canHeight;
			this.canv.width = this.width = canWidth;
			this.canv.id = 'testId';
			this.cont = this.canv.getContext("2d");
			this.cont.webkitImageSmoothingEnabled = false;
			//graphics.mozImageSmoothingEnabled = false;
			this.cont.imageSmoothingEnabled = false;
			var fontSize = 40;
			this.cont.font = 'bold '+fontSize+'px Arial ';
			var aText = this.text.split(" ");
			
			var iStart=0, iEnd=0, tLength=0, yIndex = 0;
			var tText = "", lastText = "";
			var endArray = [];
			for(var i = 0;i<=aText.length-1;i++)
			{
				lastText = tText;
				tText += aText[i]+" ";
				tLength = this.cont.measureText(tText).width;
				if(tLength>=canWidth)
				{
					if(iEnd == 0)
					{
						endArray.push(tText);
						tText = "";
					}else{
						endArray.push(lastText);
						tText = lastText = "";
						i--;
						iEnd = 0;
					}
					yIndex++;
					continue;
				}
				if(i == aText.length-1)
				{
					endArray.push(tText);
					yIndex++;
				}
				iEnd++;
			}
			this.canv.height = this.height = canHeight = 30+ (yIndex * fontSize);
			this.cont.font = 'bold '+fontSize+'px Arial ';
			this.cont.fillStyle = this.textColor;
			for(var i = 0;i<=endArray.length-1;i++)
			{
				this.cont.fillText(endArray[i],1,30 + (i * fontSize));
			}
			
			
			var imgData = new Image();
			imgData.src = this.canv.toDataURL();
			var _this = this;
			imgData.onload = function()
			{
				var astOb = {};
				astOb[_this.spriteSheet] = imgData.src;
				var ast = new Assets(astOb);
				var gc = _this.getComponent("GraphicsComponent");
				if(gc != null)
				{
					gc.sprite = new Sprite(_this.spriteSheet,0,0,canWidth,canHeight,0,0);
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
	
	return Text;
});