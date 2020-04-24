/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','HitBox','Sprite','Tile','Assets','EventManager'],function(BasicObject,GraphicsComponent,HitBox,Sprite,Tile,Assets,EventManager){
	
	var TileLevel = BasicObject.extend({
		init:function(levelPath){
			this._super();
			this.name = "tileLevel";
			this.levelData = "";
			var that = this;
			if(levelPath != undefined)this.levelPath = levelPath;
			this.loadJSON(this.loadingJSON.bind(this));
			this.eM = new EventManager();
			
		},
		
		loadingJSON:function(response)
		{
			this.levelData = JSON.parse(response);
			this.buildLevel();
		},
		
		loadJSON:function(callback) 
		{   
			/*if (window.File && window.FileReader && window.FileList && window.Blob) {
			  console.log("Great success! All the File APIs are supported.");
			  var reader = new FileReader();
			  reader.readAsText('levels/'+this.levelPath, "UTF-16");
			  reader.onload = function(){
				console.log(evt.target.result);
				//callback(evt.target.result);
			  }
			} else {*/
				var xobj = new XMLHttpRequest();
				var that = this;
				xobj.overrideMimeType("application/json");
				xobj.open('GET', 'levels/'+this.levelPath, true); // Replace 'my_data' with the path to your file
				xobj.onreadystatechange = function () {
					  if (xobj.readyState == 4 && xobj.status == "200") {
						// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
						callback(xobj.responseText);
					  }
				};
				xobj.send(null);  
			//}
		},
		
		updateMe:function(_dt)
		{
			this._super(_dt);
			this.updateComponents(_dt);	
		},
		
		buildLevel:function()
		{
			for(var i = this.levelData.background.length-1;i>-1;i--)
			{
				for(var j = this.levelData.background[i].length-1;j>-1;j--)
				{
					if(this.levelData.background[i][j] == undefined) continue;
					if(this.levelData.background[i][j] !=0 && this.levelData.background[i][j] !=0 &&this.levelData.background[i][j] !=0)
					{
						var tempTile = new Tile(this.getTileData(this.levelData.background[i][j]));
						tempTile.y = (i * 24);
						tempTile.x = j * 24;
						
						if(this.levelData.background[i][j+1] == undefined || this.levelData.background[i][j+1] ==0 || this.getTileData(this.levelData.background[i][j+1]).hitbox == undefined)
						{
							tempTile.canTouch |= 0x0100;
						}
						if(this.levelData.background[i][j-1] == undefined || this.levelData.background[i][j-1] ==0 || this.getTileData(this.levelData.background[i][j-1]).hitbox == undefined)
						{
							tempTile.canTouch |= 0x1000;
						}
						if(this.levelData.background[i+1] == undefined || this.levelData.background[i+1][j] == undefined || this.levelData.background[i+1][j] ==0 || this.getTileData(this.levelData.background[i+1][j]).hitbox == undefined || this.getTileData(this.levelData.background[i+1][j]).slope != undefined)
						{
							tempTile.canTouch |= 0x0001;
						}
						if(this.levelData.background[i-1] == undefined || this.levelData.background[i-1][j] == undefined || this.levelData.background[i-1][j] ==0 || this.getTileData(this.levelData.background[i-1][j]).hitbox == undefined || this.getTileData(this.levelData.background[i-1][j]).slope != undefined)
						{
							tempTile.canTouch |= 0x0010;
						}
						this.add(tempTile);
					}					
				}
			}			
			this.createAnimations();
		},
		
		getTileData:function(_id)
		{
			for(var i = this.levelData.tiles.length-1;i>=0;i--)
			{
				if(this.levelData.tiles[i].id == _id)
				{
					var tileOb = {x:this.levelData.tiles[i].frames[0].framePosition[0],
								y:this.levelData.tiles[i].frames[0].framePosition[1],
								width:this.levelData.tiles[i].frames[0].frameSize[0],
								height:this.levelData.tiles[i].frames[0].frameSize[1],								
								slope:this.levelData.tiles[i].slope,
								flip:this.levelData.tiles[i].frames[0].flip};
					if(this.levelData.tiles[i].hitbox)
					{
						tileOb.hitbox ={x:this.levelData.tiles[i].hitbox[0].boxPosition[0],
										y:this.levelData.tiles[i].hitbox[0].boxPosition[1],
										width:this.levelData.tiles[i].hitbox[0].boxSize[0],
										height:this.levelData.tiles[i].hitbox[0].boxSize[1]};
					}
					return tileOb;
				}
			}
			return {x:0,y:0,width:24,height:24,hitbox:{x:0,y:0,width:24,height:24}};
		},
		
		createAnimations:function()
		{
			var gc = new GraphicsComponent(this);
			gc.rotation = 0;
			this.addComponent(gc);
			var canv = document.createElement("CANVAS");
			var canWidth = 0;
			var canHeight = 0;
			for(var i = this._members.length-1;i>-1;i--)
			{
				if(this._members[i].x > canWidth) canWidth = this._members[i].x;
				if(this._members[i].y > canHeight) canHeight = this._members[i].y;
			}
			canHeight += 24;
			canWidth += 24;
			canv.height = this.height = canHeight;
			canv.width = this.width = canWidth;
			canv.id = 'testId';
			var cont = canv.getContext("2d");
			cont.imageSmoothingEnabled = false;
			cont.mozImageSmoothingEnabled = false;
			cont.webkitImageSmoothingEnabled = false;
			cont.msImageSmoothingEnabled = false;
			for(var i = this._members.length-1;i>-1;i--)
			{
				var gc = this._members[i].getComponent("GraphicsComponent");
				let asset = gc.currentDisplay();
				let renderPoint = gc.getRenderPoint();
				if(asset == null)
				{
					return;
				}
				
				let _x = gc.parent.x;	
				let _y = gc.parent.y;
				
				let _width = gc.width();
				let _height = gc.height();
				let _sclX = gc.scaleX;
				let _sclY = gc.scaleY;
				let flipX = 1;
				let flipY = 1;
				
				let targetX = -(renderPoint.x);
				let targetY = -(renderPoint.y);
				if(gc._hFlip == -1)
				{
					flipX = -1;
					_x += _width;
				}
				if(gc._vFlip == -1)
				{
					flipY = -1;
					//_y += _height;
				}
				cont.save();
				//this._graphics.translate(_x+asset.offsetX*flipX+(_width * _sclX/2),_y+asset.offsetY*flipY+(_height * _sclY/2));
				let offX = asset.offsetX || 0;
				let offY = asset.offsetY || 0;
				cont.translate(_x+offX*flipX,_y+offY*flipY);
				cont.rotate(gc.rotation);
				cont.scale(_sclX * flipX,_sclY * flipY);
				
				if(asset.sheet != undefined)
				{
					let sheet = Assets.getAssets(asset.sheet).sheet;
					cont.drawImage(sheet,asset.x,asset.y,_width,_height,targetX,targetY,_width,_height);
				}
				cont.restore();
				//cont.drawImage(Assets.getAssets(curMem.sheet()).sheet,curMem.currentDisplay().x,curMem.currentDisplay().y,curMem.width(),curMem.height(),curMem.parent.x,curMem.parent.y,curMem.width(),curMem.height());
			}
			var imgData = new Image();
			imgData.src = canv.toDataURL();
			var _this = this;
			imgData.onload = function()
			{
				var ast = new Assets({"tileMap":imgData.src});
				_this.getComponent("GraphicsComponent").sprite = new Sprite("tileMap",0,0,canWidth,canHeight);
				_this._view.camera.addDraw(_this.getComponent("GraphicsComponent"));
				ast = null;
				_this = null;
			}
			this.eM.dispatchEvent("levelBuilt",{});
		},
		onShowMe:function(){}
	});
	
	return TileLevel;
});