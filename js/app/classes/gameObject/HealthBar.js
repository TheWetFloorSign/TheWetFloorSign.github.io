/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'EventManager',
		'Sprite',
		'Assets'], 
		function(BasicObject,
		GraphicsComponent,
		EventManager,
		Sprite,
		Assets){
	
	var HealthBar = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "healthBar";
			this.eM = new EventManager();
			
			this.x = this.y = 10;
			
			this.health = 20;
			
			var gc = new GraphicsComponent(this);
			gc.sprite = new Sprite("test",0,80,14,8,0,0);
			gc.clampX = gc.clampY = true;
			gc.zBuff = 5;
			gc.scaleX = gc.scaleY = 2;
			this.addComponent(gc);
		},	
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		createAnimations:function()
		{
			var blip0 = new Sprite("test",12,97,5,6);
			var blip1 = new Sprite("test",6,97,5,6);
			var blip2 = new Sprite("test",0,97,5,6);
			var blip3 = new Sprite("test",9,90,5,6);
			var gc = this.getComponent("GraphicsComponent");
			var canv = document.createElement("CANVAS");
			var canWidth = 80;
			var canHeight = 8;
			canv.height = this.height = canHeight;
			canv.width = this.width = canWidth;
			canv.id = 'testId';
			var cont = canv.getContext("2d");
			for(var i = 0;i<=10;i++)
			{	
				var xOff = 0;
				if(i>0)xOff = 1;
				if(i>=10)xOff = 2;
				
				var sheet = Assets.getAssets("test").sheet;
				var _x = 3 + (i * 4);
				var _y = 0;
				var _width = 4;
				var _height = 8;
				cont.save();
				cont.translate(_x,_y);
				cont.drawImage(sheet,(xOff *5),80,_width,_height,0,0,_width,_height);
				cont.restore();
			}
			
			for(var i = 0;i<=0;i++)
			{	
				var xOff = 0;
				if(i>0)xOff = 1;
				if(i>=9)xOff = 2;
				
				var sheet = Assets.getAssets("test").sheet;
				var _x = 0 + (i * 4);
				var _y = 1;
				var _width = 8;
				var _height = 8;
				cont.save();
				cont.translate(_x,_y);
				cont.drawImage(sheet, 15,89,_width,_height,0,0,_width,_height);
				cont.restore();
			}
			
			for(var i = 1;i<=9;i++)
			{	
				var num = 0;
				if((i*3)<=this.health)
				{
					num = 3;
				}else
				{
					var iDif = (i*3) - this.health;
					if(iDif <0)break;
					if(iDif>=3)
					{
						num = 0;
					}else
					{
						num = 3-iDif;
					}
				}
				
				var targ = eval("blip" +num);
				var sheet = Assets.getAssets("test").sheet;
				var _x = 4 + (i * 4);
				var _y = 1;
				var _width = targ.width;
				var _height = targ.height;
				cont.save();
				cont.translate(_x,_y);
				cont.drawImage(sheet,targ.x,targ.y,_width,_height,0,0,_width,_height);
				cont.restore();
			}
			var imgData = new Image();
			imgData.src = canv.toDataURL();
			var _this = this;
			imgData.onload = function()
			{
				var ast = new Assets({"healthBar":imgData.src});
				_this.getComponent("GraphicsComponent").sprite = new Sprite("healthBar",0,0,canWidth,canHeight,0,0);
				_this._view.camera.addDraw(_this.getComponent("GraphicsComponent"));
			}
		},
		
		onShowMe:function(){
			this.createAnimations();
		}
	});
	
	return HealthBar;
});