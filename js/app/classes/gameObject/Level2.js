/**
 * ...
 * @author Ben
 */

define(['Scene','Ball','Player','TileLevel','QuadTree','Background','PunchingBag','EventManager','Door','GameObjects'], function(Scene,Ball,Player,TileLevel,QuadTree,Background,PunchingBag,EventManager,Door,GameObjects){

	var Level2 = Scene.extend({
		init:function(){
			
			this._super();
			this.path = "Appartments.json";
		},
		updateMe:function(_dt)
		{	
			for(var i = this._members.length-1;i>-1;i--)
			{
				this._members[i].updateMe(_dt);
			}
			if(this.quad)
			{
				this.quad.overlap(this.getListComponents("HitBox",this.getTagged(["player","ball","punchingBag"])),this.getListComponents("HitBox",this.getTagged(["tile"])));
				this.quad.overlap(this.getListComponents("HitBox",this.getTagged(["player"])),this.getListComponents("HitBox",this.getTagged(["door","ball","dummy"])));
				this.quad.overlap(this.getListComponents("HitBox",this.getTagged(["attack"])),this.getListComponents("HitBox",this.getTagged(["punchingBag","ball"])));
			}
			
			var tempAr = this.getMemberComponent("HitBox");
		
			for (var i=tempAr.length-1;i>-1;i--)
			{
				tempAr[i].exitCollision();
			}
		},
		
		build:function(scene, keyManager)
		{
			this.eM = new EventManager();
			this.eM.addEventListener("levelBuilt",this,this.buildAgain.bind(this));
			this._scene = scene;
			this.level = new TileLevel(this.path);
			
			this.keyManager = keyManager;			
			this.add(this.level);
			var bg = new Background();
			this.add(bg);
			bg.onShowMe();
		},
		
		buildAgain:function()
		{
			this.eM.removeEventListener("levelBuilt",this,this.buildAgain.bind(this));
			this.quad = new QuadTree(16,6,{x:0,y:0,width:this.level.width,height:this.level.height});
			console.log(this.level.levelData.spawns);
			for(var i = this.level.levelData.spawns.length-1;i>=0;i--)
			{
				var go = GameObjects.getGameObject("Player");
				go.x = this.level.levelData.spawns[i].location.x;
				go.y = this.level.levelData.spawns[i].location.y;
				go.keyManager = this.keyManager;
				this.add(go);
				go.onShowMe();
				this._scene.camera.follow(go);
			}
			
			for(var i = this.level.levelData.objectSpawns.length-1;i>=0;i--)
			{
				var go = GameObjects.getGameObject(this.getObName(this.level.levelData.objectSpawns[i].id));
				if(go.name == "door")go.level = this.level.levelData.objectSpawns[i].data.level;
				go.x = this.level.levelData.objectSpawns[i].location.x;
				go.y = this.level.levelData.objectSpawns[i].location.y;
				this.add(go);
				go.onShowMe();
			}
		},
		
		getObName:function(id)
		{
			for(var i = this.level.levelData.objects.length-1;i>=0;i--)
			{
				console.log(this.level.levelData.objects[i].id);
				if(id == this.level.levelData.objects[i].id)
				{
					return this.level.levelData.objects[i].idName;
				}
			}
			
			return "Ball";
		},
		
		preUpdate:function(_dt)
		{
		}
	});
	
	return Level2;
});