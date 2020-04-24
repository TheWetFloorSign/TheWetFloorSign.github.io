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
	
	var Player = BasicObject.extend({
		init:function(){
			this._super();
			this.name = "player";
			this.keyManager = null;
			this.jumpCount = 0;
			
			this.abilities = 0x0;
			
			var hb = new HitBox(this,-9,-24,18,24);
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
	Player.prototype.eventSystemCallback = function(eData)
	{
		console.log("callback");
		console.log(eData);
	}
	
	Player.prototype.createAnimations = function()
	{
		let gc = new GraphicsComponent(this);
		this.addComponent(gc);
		//gc.rotation = (90 * Math.PI/180);
		//gc._vFlip = -1;
		//gc.scrollMod.x = 0.2;
		gc.zBuff = 1;
		var aniMachine = new AnimationStateMachine();
		aniMachine.addVariables({left:false, ground:true, fall:false, dash:false, backdash:false, walk:false, crouch:false, action:false, kick:false, attack:0});
			
		aniMachine.library.addSprite("idle1",new Sprite("test",0,2,26,24));
		aniMachine.library.addSprite("idle2",new Sprite("test",0,54,26,25));
		aniMachine.library.addSprite("idle3",new Sprite("test",27,54,26,25));
		aniMachine.library.addSprite("idle4",new Sprite("test", 54, 55, 26, 24));
		
		aniMachine.library.addSprite("run1",new Sprite("test",2,112,37,24,0,-2));
		aniMachine.library.addSprite("run2",new Sprite("test",40,112,31,27,0,1));
		aniMachine.library.addSprite("run3",new Sprite("test",74,112,25,28));
		aniMachine.library.addSprite("run4",new Sprite("test",100,111,24,30));
		aniMachine.library.addSprite("run5",new Sprite("test",126,113,32,28));
		aniMachine.library.addSprite("run6",new Sprite("test",2,144,36,24,0,-2));
		aniMachine.library.addSprite("run7",new Sprite("test",40,144,31,27,0,1));
		aniMachine.library.addSprite("run8",new Sprite("test",73,144,26,28));
		aniMachine.library.addSprite("run9",new Sprite("test",100,143,24,30));
		aniMachine.library.addSprite("run10",new Sprite("test",126,145,32,28));
		
		aniMachine.library.addSprite("fall",new Sprite("test",81,55,17,42));
		
		aniMachine.library.addSprite("jump1",new Sprite("test",86,0,21,34));
		
		aniMachine.library.addSprite("punch1",new Sprite("test",27,1,33,25,3));
		aniMachine.library.addSprite("punch2",new Sprite("test",124,58,25,38,-1));
		aniMachine.library.addSprite("punch3",new Sprite("test",0,175,28,26,2));
		aniMachine.library.addSprite("punch4",new Sprite("test",28,174,49,27,12));
		
		aniMachine.library.addSprite("kick1", new Sprite("test", 104, 31, 49, 26));
		aniMachine.library.addSprite("kick2",new Sprite("test",98,58,25,33,-14));
		
		aniMachine.library.addSprite("dash1", new Sprite("test", 36, 27, 36, 21));
		
		aniMachine.library.addSprite("backDash1",new Sprite("test",108,0,21,30));
			
		let ani = new SpriteAnimation("idle",aniMachine.library,true,8);
		ani.addFrame(["idle1","idle1","idle2","idle2","idle3","idle3"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("idle", {left:false,ground:true, walk:false, dash:false, backdash:false, action:false});
			
		ani = new SpriteAnimation("walk",aniMachine.library,true,3);
		ani.addFrame(["run10","run1","run2","run3","run4","run5","run6","run7","run8","run9"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("walk", {left:false,ground:true, walk:true, action:false});
		
		ani = new SpriteAnimation("jump",aniMachine.library,true);
		ani.addFrame(["jump1"]);
		aniMachine.addAnimation(ani);
		aniMachine.addStateParams("jump", {left:false,ground:false, fall:false, action:false, dash:false, backdash:false});
		
		ani = new SpriteAnimation("fall",aniMachine.library,true);
		ani.addFrame(["fall"]);
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
		
		ani = new SpriteAnimation("punch1",aniMachine.library,false,3);
		ani.addFrame(["idle1","punch1"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("punch1", {action:true, attack:1});
		
		ani = new SpriteAnimation("punch2",aniMachine.library,false,4);
		ani.addFrame(["punch3","punch4","punch4"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("punch2", {action:true, attack:2});
		
		ani = new SpriteAnimation("kick",aniMachine.library,false,12);
		ani.addFrame(["kick2","kick1"]);
		aniMachine.animationList.push(ani);
		aniMachine.addStateParams("kick", {action:true, attack:4});
		
		aniMachine.defaultAnimation("idle");
		gc.spriteManager = aniMachine;
		gc.setRenderPoint(1,2);
	}
	
	return Player;
});