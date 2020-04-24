/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'Sprite',
		'HitBox',
		'AnimationStateMachine',
		'SpriteAnimation',
		'GameData',
		'HealthComponent',
		'PhysicsLite',
		'EventManager'], 
		function(BasicObject,
		GraphicsComponent,
		Sprite,
		HitBox,
		AnimationStateMachine,
		SpriteAnimation,
		GameData,
		HealthComponent,
		PhysicsLite,
		EventManager){
	
	var Dummy = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "dummy";
			this.createAnimations();
			this.rotateVal =0;
			this.vel = {x:0,y:0};
			this.tic = 20;
			this.walking = false;
			this.firstTime = true;
			
			//console.log(_data);
			
			var hb = new HitBox(this,-11,-30,22,30);
			this.addComponent(hb);
			
			this.eM = new EventManager();
			
			var hc = new HealthComponent(this,5,5);
			this.addComponent(hc);
			var tv = new HitBox(this,-150,-60,330,120);
			tv.isTrigger = true;
			/*tv.collision1 = this.wander.bind(this);
			tv.collision2 = this.wander.bind(this);*/
			this.addComponent(tv);
			
			var pl = new PhysicsLite(this);
			this.addComponent(pl);
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			
			/*this.y+=this.vel.y* GameData.getTime();
			this.x+=this.vel.x* GameData.getTime();
			if(this.vel.y < 6) this.vel.y +=0.5* GameData.getTime();
			if(this.vel.x !=0)
			{
				if(this.vel.x>0)this.vel.x += Math.max(-0.5,-this.vel.x) * GameData.getTime();
				if(this.vel.x<0)this.vel.x += Math.min(0.5,-this.vel.x) * GameData.getTime();
			}*/
			this.updateComponents(_dt);
			if(this._alive == false)
			{
				if(this.firstTime == true)
				{
					this.eM.dispatchEvent("died",{});
					this.tic = 80;
					this.getComponent("GraphicsComponent").rotation = 90*Math.PI/180;
					this.getComponent("PhysicsLite").gravity = 0.3;
					this.getComponent("PhysicsLite").resistance = 0.6;
					this.getComponent("PhysicsLite").velocity.x *= 2;
					this.getComponent("PhysicsLite").velocity.y-=5;
					this.firstTime = false;
				}
				this.ragDoll();
			}
			this._super(_dt);
		},
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		wander:function(hb)
		{
			var target = hb.target;
			if(this._alive == false)return;
			if(target.name == "player")
			{
				this.tic-= (1 * GameData.getTime());
			}
			if(this.tic <= 0)
			{
				this.tic = 40;
				if(this.getComponent("GraphicsComponent")._hFlip != Math.sign(target.x - this.x))
				{
					this.getComponent("GraphicsComponent")._hFlip = Math.sign(target.x - this.x);
					return;
				}
				/*this.vel.x += 3 * Math.sign(target.x-this.x);
				if(Math.abs(this.vel.x)>3)this.vel.x = 3* Math.sign(this.vel.x);*/
				this.getComponent("PhysicsLite").impulse({x: 6 * Math.sign(target.x-this.x),y:0});
				this.walking = !this.walking;
				this.getComponent("GraphicsComponent").spriteManager.changeVariables("walk", this.walking);
			}
			
		},
		ragDoll:function()
		{
			
			if(this.tic <=40 && this.getComponent("GraphicsComponent").alpha>0)this.getComponent("GraphicsComponent").alpha-= Math.min(0.025,this.getComponent("GraphicsComponent").alpha);
			if(this.tic <=0)this.killMe();
			this.tic--;
		},
		killMe:function()
		{			
			this._super();
			
		},
		
		testCollision:function()
		{
			
		}
	});
	Dummy.prototype.createAnimations = function()
	{
		var gc = new GraphicsComponent(this);
		gc.zBuff = 1;
		this.addComponent(gc);
		var aniMachine = new AnimationStateMachine();
		aniMachine.addVariables({walk:false});
			
		aniMachine.library.addSprite("walk1",new Sprite("rubDummy",0,0,26,28));
		aniMachine.library.addSprite("walk2",new Sprite("rubDummy",27,0,22,30));
				
		var ani = new SpriteAnimation("forward",aniMachine.library,true,8);
		ani.addFrame("walk1");
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("forward", {walk:true});
		
		var ani = new SpriteAnimation("back",aniMachine.library,true,8);
		ani.addFrame("walk2");
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("back", {walk:false});
		
		aniMachine.changeVariables("walk", false);
		
		aniMachine.defaultAnimation("back");
		gc.spriteManager = aniMachine;
		gc.setRenderPoint(1,2);
	}
	
	return Dummy;
});