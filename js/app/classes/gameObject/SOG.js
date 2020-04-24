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
		'StatePlayerDash',
		'StatePlayerNoAction',
		'StatePlayerKick',
		'StatePlayerPunch',
		'StateManager',
		'EventManager',
		'PhysicsLite'], 
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
		StatePlayerDash,
		StatePlayerNoAction,
		StatePlayerKick,
		StatePlayerPunch,
		StateManager,
		EventManager,
		PhysicsLite){
	
	var Player = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "player";
			this.keyManager = null;
			
			var hb = new HitBox(this,0,0,18,45);
			this.addComponent(hb);
			
			var pl = new PhysicsLite(this);
			this.addComponent(pl);
			
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
	Player.prototype.eventSystemCallback = function(eData)
	{
	}
	
	Player.prototype.createAnimations = function()
	{
		var gc = new GraphicsComponent(this);
		this.addComponent(gc);
		//gc.rotation = (90 * Math.PI/180);
		//gc._vFlip = -1;
		//gc.scrollMod.x = 0.2;
		var aniMachine = new AnimationStateMachine();
		aniMachine.addVariables({left:false, ground:true, fall:false, dash:false, backdash:false, walk:false, crouch:false, action:false, kick:false, attack:0});
			
		aniMachine.library.addSprite("idle1",new Sprite("SOGSprites",415,0,26,47,0,-2));
		aniMachine.library.addSprite("idle2",new Sprite("SOGSprites",442,0,26,46,0,-1));
		aniMachine.library.addSprite("idle3",new Sprite("SOGSprites",469,0,26,45));
		aniMachine.library.addSprite("idle4",new Sprite("SOGSprites",496,0, 26,46,0,-1));
		
		aniMachine.library.addSprite("run1",new Sprite("SOGSprites" ,0,0,43,41,0,5));
		aniMachine.library.addSprite("run2",new Sprite("SOGSprites" ,43,0,34,31,0,10));
		aniMachine.library.addSprite("run3",new Sprite("SOGSprites" ,79,0,39,43,0,3));
		aniMachine.library.addSprite("run4",new Sprite("SOGSprites" ,119,0,44,37,0,5));
		aniMachine.library.addSprite("run5",new Sprite("SOGSprites" ,164,0,43,37,0,5));
		aniMachine.library.addSprite("run6",new Sprite("SOGSprites" ,207,0,42,41,0,5));
		aniMachine.library.addSprite("run7",new Sprite("SOGSprites" ,250,0,34,31,0,10));
		aniMachine.library.addSprite("run8",new Sprite("SOGSprites" ,285,0,39,43,0,3));
		aniMachine.library.addSprite("run9",new Sprite("SOGSprites" ,325,0,44,37,0,5));
		aniMachine.library.addSprite("run10",new Sprite("SOGSprites",370,0,43,37,0,5));
		
		aniMachine.library.addSprite("fall1",new Sprite("SOGSprites",523,0,36,56));
		aniMachine.library.addSprite("fall2",new Sprite("SOGSprites",560,0,36,56));
		aniMachine.library.addSprite("fall3",new Sprite("SOGSprites",597,0,36,56));
		aniMachine.library.addSprite("fall4",new Sprite("SOGSprites",634,0,36,56));
		
		aniMachine.library.addSprite("jump1",new Sprite("SOGSprites",429,57,36,43));
		aniMachine.library.addSprite("jump2",new Sprite("SOGSprites",466,57,36,43));
		aniMachine.library.addSprite("jump3",new Sprite("SOGSprites",503,57,36,43));
		aniMachine.library.addSprite("jump4",new Sprite("SOGSprites",540,57,36,43));
		
		aniMachine.library.addSprite("punch1",new Sprite("SOGSprites",577,57,35,42));
		aniMachine.library.addSprite("punch2",new Sprite("SOGSprites",613,57,34,42));
		aniMachine.library.addSprite("punch3",new Sprite("SOGSprites",648,57,57,37));
		aniMachine.library.addSprite("punch4",new Sprite("SOGSprites",671,0,45,37));
		
		aniMachine.library.addSprite("kick1", new Sprite("SOGSprites", 104, 31, 49, 26, -10, -1));
		aniMachine.library.addSprite("kick2",new Sprite("SOGSprites",98,58,25,33,-12,-8));
		
		aniMachine.library.addSprite("dash1", new Sprite("SOGSprites", 98, 86, 57, 27,0,18));
		
		aniMachine.library.addSprite("backDash1",new Sprite("SOGSprites",303,86,41,37,0,8));
			
		var ani = new SpriteAnimation("idle",aniMachine.library,true,8);
		ani.addFrame(["idle1","idle1","idle2","idle2","idle3","idle3","idle4","idle4"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("idle", {left:false,ground:true, walk:false, dash:false, backdash:false, action:false});
			
		ani = new SpriteAnimation("walk",aniMachine.library,true,4);
		ani.addFrame(["run10","run1","run2","run3","run4","run5","run6","run7","run8","run9"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("walk", {left:false,ground:true, walk:true, action:false});
		
		ani = new SpriteAnimation("jump",aniMachine.library,true);
		ani.addFrame(["jump1","jump2","jump3","jump4"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("jump", {left:false,ground:false, fall:false, action:false, dash:false, backdash:false});
		
		ani = new SpriteAnimation("fall",aniMachine.library,true);
		ani.addFrame(["fall1","fall2","fall3","fall4"]);
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
		
		ani = new SpriteAnimation("punch3",aniMachine.library,false);
		ani.addFrame(["punch2","punch2","punch2","punch2"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("punch3", {action:true, attack:3});
		
		ani = new SpriteAnimation("punch1",aniMachine.library,false);
		ani.addFrame(["punch1","punch2","punch3","punch4"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("punch1", {action:true, attack:1});
		
		ani = new SpriteAnimation("punch2",aniMachine.library,false,4);
		ani.addFrame(["punch3","punch4","punch4"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("punch2", {action:true, attack:2});
		
		ani = new SpriteAnimation("kick",aniMachine.library,false,12);
		ani.addFrame(["kick2","kick1"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("kick", {action:true, kick:true});
		
		aniMachine.defaultAnimation("idle");
		gc.spriteManager = aniMachine;
		gc.setRenderPoint(1,0);
	}
	
	return Player;
});