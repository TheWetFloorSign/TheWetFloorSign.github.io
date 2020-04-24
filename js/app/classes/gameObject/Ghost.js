/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'Sprite',
		'KeyManager',
		'SpriteLibrary',
		'AnimationStateMachine',
		'HitBox',
		'SpriteAnimation',
		'StatePlayerFall',
		'StatePlayerIdle',
		'StatePlayerJump',
		'StatePlayerRun',
		'StatePlayerStand',
		'StatePlayerStance',
		'StatePlayerDash',
		'StatePlayerNoAction',
		'StatePlayerKick',
		'StatePlayerPunch',
		'StateManager',
		'EventManager',
		'PhysicsLite',
		'ComboManager'], 
		function(BasicObject,
		GraphicsComponent,
		Sprite,
		KeyManager,
		SpriteLibrary,
		AnimationStateMachine,
		HitBox,
		SpriteAnimation,
		StatePlayerFall,
		StatePlayerIdle,
		StatePlayerJump,
		StatePlayerRun,
		StatePlayerStand,
		StatePlayerStance,
		StatePlayerDash,
		StatePlayerNoAction,
		StatePlayerKick,
		StatePlayerPunch,
		StateManager,
		EventManager,
		PhysicsLite,
		ComboManager){
	
	var Ghost = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "ghost";
			this.keyManager = null;
			this.jumpCount = 0;
			
			this.abilities = 0x0;
			
			var hb = new HitBox(this,-8,-16,16,16);
			this.addComponent(hb);
			
			var pl = new PhysicsLite(this);
			this.addComponent(pl);
			
			var cm = new ComboManager(this);
			this.addComponent(cm);
			
			this.createAnimations();
			this.moveState = new StateManager(this);
			this.moveState.addState("idle",StatePlayerIdle);
			this.moveState.addState("run",StatePlayerRun);
			this.moveState.addState("dash",StatePlayerDash);
			this.moveState.changeState("idle");
			
			this.jumpState = new StateManager(this);
			this.jumpState.addState("stand",StatePlayerStand);
			this.jumpState.addState("fall",StatePlayerFall);
			this.jumpState.addState("jump",StatePlayerJump);
			this.jumpState.changeState("fall");
			
			this.actionState = new StateManager(this);
			this.actionState.addState("noAction",StatePlayerNoAction);
			this.actionState.addState("kick",StatePlayerKick);
			this.actionState.addState("punch",StatePlayerPunch);
			this.actionState.addState("stance",StatePlayerStance);
			this.actionState.changeState("noAction");
			
			this.eM = new EventManager();
			this.eM.dispatchEvent("testEvent",{data:"testData"});
			
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.moveState.update(_dt);
			this.jumpState.update(_dt);	
			this.actionState.update(_dt);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		}
	});
	Ghost.prototype.eventSystemCallback = function(eData)
	{
		console.log("callback");
		console.log(eData);
	}
	
	Ghost.prototype.createAnimations = function()
	{
		let gc = new GraphicsComponent(this);
		this.addComponent(gc);
		//gc.rotation = (90 * Math.PI/180);
		//gc._vFlip = -1;
		//gc.scrollMod.x = 0.2;
		gc.zBuff = 1;
		var aniMachine = new AnimationStateMachine();
		aniMachine.addVariables({left:false, ground:true, fall:false, dash:false, backdash:false, walk:false, crouch:false, action:false, kick:false, attack:0});
			
		aniMachine.library.addSprite("idle1",new Sprite("ghost",0,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle2",new Sprite("ghost",16,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle3",new Sprite("ghost",32,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle4",new Sprite("ghost",48,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle5",new Sprite("ghost",64,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle6",new Sprite("ghost",80,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle7",new Sprite("ghost",96,0,16,16,0,0,-1));
		aniMachine.library.addSprite("idle8",new Sprite("ghost",0,16,16,16,0,0,-1));
		aniMachine.library.addSprite("idle9",new Sprite("ghost",16,16,16,16,0,0,-1));
		aniMachine.library.addSprite("idle10",new Sprite("ghost",32,16,16,16,0,0,-1));
		
		aniMachine.library.addSprite("run1",new Sprite("ghost",80,32,16,16,0,0,-1));
		aniMachine.library.addSprite("run2",new Sprite("ghost",96,32,16,16,0,0,-1));
		aniMachine.library.addSprite("run3",new Sprite("ghost",0,48,16,16,0,0,-1));
		aniMachine.library.addSprite("run4",new Sprite("ghost",16,48,16,16,0,0,-1));
		aniMachine.library.addSprite("run5",new Sprite("ghost",32,48,16,16,0,0,-1));
		
		aniMachine.library.addSprite("fall1",new Sprite("ghost",0,32,16,16,0,0,-1));
		
		aniMachine.library.addSprite("jump1",new Sprite("ghost",48,16,16,16,0,0,-1));
		
		aniMachine.library.addSprite("punch1",new Sprite("ghost",27,1,33,25,3));
		aniMachine.library.addSprite("punch2",new Sprite("ghost",124,58,25,38,-1));
		aniMachine.library.addSprite("punch3",new Sprite("ghost",0,175,28,26,2));
		aniMachine.library.addSprite("punch4",new Sprite("ghost",28,174,49,27,12));
		
		aniMachine.library.addSprite("kick1", new Sprite("ghost", 104, 31, 49, 26));
		aniMachine.library.addSprite("kick2",new Sprite("ghost",98,58,25,33,-14));
		
		aniMachine.library.addSprite("dash1", new Sprite("ghost", 48, 64, 16, 16,0,0,-1));
		
		aniMachine.library.addSprite("backDash1",new Sprite("ghost",48, 64, 16, 16));
			
		let ani = new SpriteAnimation("idle",aniMachine.library,true,8);
		ani.addFrame(["idle6","idle7","idle8","idle9"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("idle", {left:false,ground:true, walk:false, dash:false, backdash:false, action:false});
			
		ani = new SpriteAnimation("walk",aniMachine.library,true,3);
		ani.addFrame(["run1","run2","run3","run4","run5"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("walk", {left:false,ground:true, walk:true, action:false});
		
		ani = new SpriteAnimation("jump",aniMachine.library,true);
		ani.addFrame(["jump1"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("jump", {left:false,ground:false, fall:false, action:false, dash:false, backdash:false});
		
		ani = new SpriteAnimation("fall",aniMachine.library,true);
		ani.addFrame(["fall1"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("fall", {left:false,ground:false, fall:true, action:false, dash:false, backdash:false});
		
		ani = new SpriteAnimation("dash",aniMachine.library,true);
		ani.addFrame(["dash1"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("dash", {left:false, action:false, dash:true, backdash:false});
		
		ani = new SpriteAnimation("backDash",aniMachine.library,true);
		ani.addFrame(["backDash1"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("backDash", {left:false, action:false, dash:false, backdash:true});
		
		aniMachine.defaultAnimation("idle");
		gc.spriteManager = aniMachine;
		gc.setRenderPoint(1,2);
	}
	
	return Ghost;
});