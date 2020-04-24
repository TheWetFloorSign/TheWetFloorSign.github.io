/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'HitBox',
		'GraphicsComponent',
		'EventManager',
		'PhysicsLite'], 
		function(BasicObject,
		HitBox,
		GraphicsComponent,
		EventManager,
		PhysicsLite){
	
	var Attack = BasicObject.extend({
		init:function(x,y,dir,actor,force,size){
			this._super();
			this.name = "attack";
			this.tic = 10;
			this.vel = {x:0,y:0};
			this.offset = {x:x,y:y};
			this.force = force;
			this.parent = actor;
			this.size = size;
			this.x = ((this.offset.x + (dir ==-1 ? this.size.x :0)) * dir) + this.parent.x;
			this.y = this.offset.y + this.parent.y;			
			this.dir = dir;
			this.eM = new EventManager();
			var hb = new HitBox(this,0,0,size.x,size.y);
			hb.collision1 = this.testCollision.bind(this);
			this.addComponent(hb);
		},
		
		updateMe:function(_dt){
			if(this._alive)
			{
				this.tic--;
				if(this.tic ==0)this._alive = false;
			}else
			{
				this.killMe();
			}
			this.preUpdate(_dt);
			this.x = ((this.offset.x + (this.dir ==-1 ? this.size.x :0)) * this.dir) + this.parent.x;
			this.x = this.x << 0;
			this.y = this.offset.y + this.parent.y;
			this.y = this.y << 0;
			//console.log(this.x);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		onShowMe:function(){
			let gc = new GraphicsComponent(this);
			gc.debug = true;
			gc.sprite = new Image(this.size.x,this.size.y);
			this.addComponent(gc);
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		testCollision:function(_gc)
		{
			var target = _gc.target;
			if(_gc.targetHB.isTrigger == true) return;
			if(target.name == "player" || target.name == "tile"){return;}
			this.eM.dispatchEvent("HitStop",{time:0.01 * this.force.x,value:0});
			this.eM.dispatchEvent("CameraShake",{time:3,value:0.1 * this.force.x});
			console.log(this.force.y);
			console.log(target.name);
			target.getComponent("PhysicsLite").impulse({x:(this.force.x *this.dir),y:this.force.y});
			var hc = target.getComponent("HealthComponent");
			if(hc != null)
			{
				hc.health--;
			}
		}
	});
	
	return Attack;
});