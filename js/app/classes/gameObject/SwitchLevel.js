/**
 * ...
 * @author Ben
 */

define(['Scene','TileLevel','QuadTree','Background','EventManager','GameObjects','HealthBar','PauseMenu','Minimap','Observer'], function(Scene,TileLevel,QuadTree,Background,EventManager,GameObjects,HealthBar,PauseMenu,Minimap,Observer){

	var SwitchLevel = Scene.extend({
		init:function(){
			
			this._super();
			this.eM = new EventManager();
			this.eM.addEventListener("swapLevel",this,this.build.bind(this));
			this.path = "Appartments.json";
			this.pSpawn = null;
			this.pause = false;
			this.pMenu = null;
			this.pFacing = 0x0000;
			this.collisionMask = [[["player","ball","punchingBag","dummy",'ghost'],["tile","platform"]],
									[["player"],["door","ball","dummy","sign","upgrade"]],
									[["attack"],["punchingBag","ball","dummy"]]
									];
		},
		updateMe:function(_dt)
		{				
			if(this.keyManager.isActionActivatedIn("pause",1))
			{
				this.pause = !this.pause;
				if(this.pause == true)
				{
					this.pMenu = new PauseMenu();
					this.pMenu.keyManager = this.keyManager;
					this.add(this.pMenu);
					this.pMenu.onShowMe();
				}else
				{
					this.removeMember(this.pMenu);
					this.pMenu = null;
				}
			}
			if(this.pause == true)
			{
				this.pMenu.updateMe(_dt);
				return;
			}
			for(var i = this._members.length-1;i>-1;i--)
			{
				//console.log("Is this even working",this._members[i]);
				if(this._members[i]._exists == true)this._members[i].updateMe(_dt);
			}
			if(this.quad)
			{
				for(var i = 0;i<this.collisionMask.length;i++)
				{				
				this.quad.overlap(this.getListComponents("HitBox",this.getTagged(this.collisionMask[i][0])),this.getListComponents("HitBox",this.getTagged(this.collisionMask[i][1])),false);
				}
			}
			var tempAr = this.getMemberComponent("HitBox");
		
			for (var i=tempAr.length-1;i>-1;i--)
			{
				tempAr[i].exitCollision();
			}
		},
		
		build:function(_data)
		{
			if(_data != undefined)
			{
				this.path = _data.level;
				this.pSpawn = _data.pSpawn;
			}
			var p = this.getTagged(['player'])[0];
			if(p != undefined)
			{
				this.pFacing = p._facing;
			}
			this.removeAllMembers();
			this.eM = new EventManager();
			this.eM.addEventListener("levelBuilt",this,this.buildAgain.bind(this));
			this.level = null;
			this.level = new TileLevel(this.path);	
			this.add(this.level);
		},
		
		buildAgain:function()
		{
			this.eM.removeEventListener("levelBuilt",this,this.buildAgain.bind(this));
			this.quad = new QuadTree(16,6,{x:0,y:0,width:this.level.width,height:this.level.height});
			this._view.camera.cameraBounds = {x:0,y:0,width:this.level.width,height:this.level.height};
			/*for(var i = this.level.levelData.spawns.length-1;i>=0;i--)
			{
				var go = GameObjects.getGameObject("Player");
				if(this.pSpawn != null)
				{
					go.x = this.pSpawn.x;
					go.y = this.pSpawn.y;
				}else
				{
					go.x = this.level.levelData.spawns[i].location.x;
					go.y = this.level.levelData.spawns[i].location.y;
				}
				console.log(this.pFacing);
				if(this.pFacing != 0x0000)
				{
					if(this.pFacing == 0x1000)
					{
						go.getComponent("GraphicsComponent")._hFlip = -1;
						
					}
					go._facing = this.pFacing;
				}				
				go.keyManager = this.keyManager;
				this.add(go);
				go.onShowMe();
				this._view.camera.follow(go);
			}*/
			
			for(var i = this.level.levelData.objectSpawns.length-1;i>=0;i--)
			{
				var go = GameObjects.getGameObject(this.getObName(this.level.levelData.objectSpawns[i].id),this.level.levelData.objectSpawns[i].data);
				go.x = this.level.levelData.objectSpawns[i].location.x;
				go.y = this.level.levelData.objectSpawns[i].location.y;
				if(go.name == "player" || go.name == "ghost")
				{
					go.keyManager = this.keyManager;
					this._view.camera.follow(go);
					if(this.pSpawn != null)
					{
						go.x = this.pSpawn.x;
						go.y = this.pSpawn.y;
					}
				}
				
				this.add(go);
				go.onShowMe();
			}
			var bg = new Background(this.level.width,this.level.height,this.level.levelData.bg);
			this.add(bg);
			bg.onShowMe();
			
			var hb = new HealthBar();
			this.add(hb);
			hb.onShowMe();
			
			var mm = new Minimap();
			var tArray = [];
			var tWidth = Math.ceil(this.level.width / 216);
			var tHeight = Math.ceil(this.level.height / 216);
			for(var i = 0;i<tHeight;i++)
			{
				var tArray2 = [];
				for(var j=0;j<tWidth;j++)
				{
					tArray2.push(0);
				}
				tArray.push(tArray2);
			}
			mm.mapData = tArray;
			this.add(mm);
			mm.onShowMe();
			mm.target = this.getTagged(["player"])[0];
			mm.areaSize = {width:this.level.width,height:this.level.height};
			
			var obs = new Observer();
			this.add(obs);
			obs.onShowMe();
		},
		
		keepInScene:function(_go)
		{
			this._keepList.push(_go);
		},
		
		killMe:function()
		{
			this.eM.removeEventListener("swapLevel",this,this.build.bind(this));
			this._super();
		},
		
		getObName:function(id)
		{
			for(var i = this.level.levelData.objects.length-1;i>=0;i--)
			{
				if(id == this.level.levelData.objects[i].id)
				{
					return this.level.levelData.objects[i].idName;
				}
			}
			
			return "Ball";
		},
		
		add:function(basicObject)
		{
			this._super(basicObject);
		},
		
		preUpdate:function(_dt)
		{
		}
	});
	
	return SwitchLevel;
});