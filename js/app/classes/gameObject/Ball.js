/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'PhysicsLite',
		'Sprite',
		'HitBox',
		'GameData'], 
		function(BasicObject,
		GraphicsComponent,
		PhysicsLite,
		Sprite,
		HitBox,
		GameData){
	
	var Ball = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "ball";
			this._size = {width:18,height:18};
			this._scale = 3;
			if(_data != undefined && _data.scale != undefined) this._scale = data.scale;
			this.createAnimations();
			this.rotateVal =0;
			this.vel = {x:0,y:0};
			
			var pl = new PhysicsLite(this);
			pl.gravity = 0.5;
			this.addComponent(pl);
			
			var hb = new HitBox(this,-(this._size.width * this._scale)/2,-(this._size.height * this._scale)/2,this._size.width * this._scale,this._size.height * this._scale);
			hb.collision1 = this.testCollision.bind(this);
			hb.collision2 = this.testCollision.bind(this);
			this.addComponent(hb);
			
			var tv = new HitBox(this,-(this._size.width*this._scale*0.75),-(this._size.height*this._scale *0.75),this._size.width*2*this._scale,this._size.height*2*this._scale);
			tv.isTrigger = true;
			tv.collision1 = this.wander.bind(this);
			tv.collision2 = this.wander.bind(this);
			this.addComponent(tv);
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			if(this.vel.y < 2) this.vel.y += (0.05 * GameData.getTime());
			if(this.vel.y<-2) this.vel.y = -2;
			this.y+= (this.vel.y * GameData.getTime());
			this.x+= (this.vel.x * GameData.getTime());
			if(this.vel.x !=0)
			{
				if(this.vel.x>0)this.vel.x += Math.max(-0.25,-this.vel.x)* GameData.getTime();
				if(this.vel.x<0)this.vel.x += Math.min(0.25,-this.vel.x)* GameData.getTime();
			}
			this.getComponent("GraphicsComponent").rotation = (this.rotateVal * Math.PI/180);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		wander:function(hb)
		{
			
			/*var target = hb.target;
			if(target.name == "player")console.log("in here");
			if(target.name == "player")this.vel.x += 1 * Math.sign(target.x-this.x);
			if(Math.abs(this.vel.x)>6)this.vel.x = 6* Math.sign(this.vel.x);*/
		},
		
		testCollision:function(hb)
		{
			var target = hb.target;
			if(target.name != "player"){return;}
			if(target.x - target.last.x>this.x-this.last.x)
			{
				if(Math.abs(this.vel.x)<6)this.vel.x+= ((target.x-target.last.x)*0.15);
				this.rotateVal+= (this.vel.x*5/this._scale)* GameData.getTime();
			}else if(target.x - target.last.x<this.x-this.last.x)
			{
				if(Math.abs(this.vel.x)<6)this.vel.x+= ((target.x-target.last.x)*0.15);
				this.rotateVal+=(this.vel.x*5/this._scale)* GameData.getTime();
			}
		}
	});
	Ball.prototype.createAnimations = function()
	{
		var gc = new GraphicsComponent(this);
		this.addComponent(gc);
		//gc.rotation = (90 * Math.PI/180);
		//gc._vFlip = -1;
		//gc.scrollMod.x = 0.2;
		gc.scaleX = gc.scaleY = this._scale;
		gc.sprite = new Sprite("ball",0,0,18,18,0,0);
		gc.setRenderPoint(1,1);
	}
	
	return Ball;
});