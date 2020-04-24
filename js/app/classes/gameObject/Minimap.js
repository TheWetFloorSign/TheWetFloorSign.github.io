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
	
	var Minimap = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "minimap";
			this.subTic = 1;
			this.canv = document.createElement("CANVAS");
			var canWidth = 40;
			var canHeight = 40;
			this.canv.height = this.height = canHeight;
			this.canv.width = this.width = canWidth;
			this.canv.id = 'testId';
			this.eM = new EventManager();
			
			this.mapData = [[0,0,0,0,0],
							[0,0,0,0,0],
							[0,0,0,0,0]];
			
			this.x = 182;
			this.y = 2;
			this.lastPos = {x:0,y:0};
			this.areaSize = {width:800,height:600};
			
			this.target = null;
			
			
			var gc = new GraphicsComponent(this);
			gc.sprite = new Sprite("test",0,80,14,8,0,0);
			gc.clampX = gc.clampY = true;
			gc.zBuff = 5;
			gc.scaleX = gc.scaleY = 1;
			this.addComponent(gc);
			
		},	
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.updateComponents(_dt);
			this.checkMapPosition();
			this._super(_dt);
		},
		
		checkMapPosition:function()
		{
			if(this.target == null)return;
			//this.subTic++;
			//if(this.subTic>60)this.subTic =0;
			
			let unitWidth = this.areaSize.width/this.mapData[0].length;
			let xPos = Math.floor(this.target.x/unitWidth);
			
			let unitHeight = this.areaSize.height/this.mapData.length;
			let yPos = Math.floor(this.target.y/unitHeight);
			
			let drawFlag = false;
			//console.log(xPos + "   " + yPos);
			if(this.mapData[yPos] != undefined && this.mapData[yPos][xPos] != undefined)
			{
				if(this.mapData[yPos][xPos] == 0)
				{
					this.mapData[yPos][xPos] = 1;
					drawFlag = true;
				}
			}
			
			if(this.lastPos.x != xPos || this.lastPos.y != yPos)
			{
				this.lastPos = {x:xPos,y:yPos};
				drawFlag = true;
			}
			if(drawFlag)this.createAnimations();
		},
		
		createAnimations:function()
		{
			if(this.target == null)return;
			
			console.log("doing a redraw");
			let cont = this.canv.getContext("2d");
			cont.fillStyle = "rgb(0,0,0,1)";
			cont.fillRect(0,0,40,40);
			
			let unitWidth = this.areaSize.width/this.mapData[0].length;
			let xPos = Math.floor(this.target.x/unitWidth);
			
			let unitHeight = this.areaSize.height/this.mapData.length;
			let yPos = Math.floor(this.target.y/unitHeight);
						
			cont.save();
			cont.translate(-(xPos * 5)+15,-(yPos * 5)+15);
			cont.globalAlpha = 1;
			cont.strokeStyle = "rgb(255,255,255,0.5)";
			for(let i = this.mapData.length-1;i>=0;i--)
			{	
				//console.log(this.mapData[i]);
				for(let j = this.mapData[i].length-1;j>=0;j--)
				{
					if(this.mapData[i][j] != 0)
					{
						cont.fillStyle = "#0000FF";
						cont.fillRect((j*5),(i*5),5,5);
						if(i == yPos && j == xPos)
						{
							cont.fillStyle = "rgb(255,255,255,"+(Math.sin(this.subTic/10)+1)/2+")";
							cont.fillRect((j*5)+1,(i*5)+1,4,4);
						}
					}
					cont.beginPath();
					
					cont.strokeRect((j*5)+0.5,(i*5)+0.5,5,5);
				}
			}
			cont.beginPath();
			cont.strokeStyle = "rgb(50,200,0,1)";
			cont.strokeRect(0.5,0.5,this.mapData[0].length*5,this.mapData.length*5);
			cont.restore();
			let imgData = new Image();			
			let _this = this;
			imgData.onload = function()
			{
				let ast = new Assets({"minimap":imgData.src});
				_this.getComponent("GraphicsComponent").sprite = new Sprite("minimap",0,0,this.width,this.height,0,0);
				
			}
			imgData.src = this.canv.toDataURL();
		},
		
		onShowMe:function(){
			this.x = this._view.camera._width - (this.canv.width * this.getComponent("GraphicsComponent").scaleX) - 2;
			this.y = 2;
			this.createAnimations();
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		}
	});
	
	return Minimap;
});