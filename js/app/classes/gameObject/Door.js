/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'HitBox',
		'GraphicsComponent',
		'EventManager',
		'Sprite'], 
		function(BasicObject,
		HitBox,
		GraphicsComponent,
		EventManager,
		Sprite){
	
	var Door = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "door";
			this.eM = new EventManager();
			this.level = _data.level;
			this.pSpawn = _data.position;
			var hb = new HitBox(this,0,0,24,48);
			hb.collision2 = this.testCollision.bind(this);
			this.addComponent(hb);
			
			var gc = new GraphicsComponent(this);
			gc.fillStyle = "rgb(0,0,0,1)";
			gc.sprite = new Sprite("tiles",24,0,24,48,0,0);
			this.addComponent(gc);
		},	
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},	
		
		testCollision:function()
		{
			var target = this.getComponent("HitBox").target;
			if(target.name != "player"){return;}
			if(target.name == "player" && target.keyManager.isActionActivatedIn("punch",1))
			{
				console.log(this._view);
				this.eM.dispatchEvent("swapLevel",{level:this.level,pSpawn:this.pSpawn});
			}
			
		}
	});
	
	return Door;
});