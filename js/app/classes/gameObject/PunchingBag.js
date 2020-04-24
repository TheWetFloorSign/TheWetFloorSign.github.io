/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'Sprite',
		'HitBox'], 
		function(BasicObject,
		GraphicsComponent,
		Sprite,
		HitBox){
	
	var PunchingBag = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "punchingBag";
			this.createAnimations();
			this.rotateVal =0;
			this.vel = {x:0,y:0};
			
			var hb = new HitBox(this,0,0,13,30);
			this.addComponent(hb);
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			if(this.vel.y < 6) this.vel.y +=0.5;
			this.y+=this.vel.y;
			this.x+=this.vel.x;
			console.log(this.vel);
			if(this.vel.x !=0)
			{
				if(this.vel.x>0)this.vel.x += Math.max(-1,-this.vel.x);
				if(this.vel.x<0)this.vel.x += Math.min(1,-this.vel.x);
			}
			this.updateComponents(_dt);
			this._super(_dt);
		},
		onShowMe:function(){
			this._scene.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		testCollision:function()
		{
			
		}
	});
	PunchingBag.prototype.createAnimations = function()
	{
		console.log("in create");
		var gc = new GraphicsComponent(this);
		this.addComponent(gc);
		gc.sprite = new Sprite("punchingBag",0,0,13,31,0,0);
		console.log(window);
	}
	
	return PunchingBag;
});