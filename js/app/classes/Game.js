define(['Class','Camera','Assets','KeyManager','EventManager','SceneList','AudioManager','GameData'],
function(Class,Camera,Assets,KeyManager,EventManager,SceneList,AudioManager,GameData){
	var _this;
	
	var title,width,height,g,running,scale,keyManager;
	keyManager = new KeyManager();
	
	var Game = Class.extend({
		init:function(_title,_width,_height,_scale){
			_this = this;
			this.currentLevel = 1;
			title = _title;
			if(_scale == undefined)_scale = 1;
			var running = false;
			
			this.loadAssets();
			
			this.objectList = [];
			document.title = title;
			width = _width/_scale;
			height = _height/_scale;
			this.scale = _scale;
			
			this.camera = new Camera(width,height,this.scale);
			this.eM = new EventManager();
			this.eM.addEventListener("swapScene",this,this.swap.bind(this));
			this.eM.addEventListener("HitStop",this,this.addTimer.bind(this));
			this.eM.addEventListener("CameraShake",this,this.addShake.bind(this));
			console.log("in here");
			keyManager.addActionBinding("left",65);
			keyManager.addActionBinding("right",68);
			keyManager.addActionBinding("dashLeft",81);
			keyManager.addActionBinding("dashRight",69);
			keyManager.addActionBinding("up",87);
			keyManager.addActionBinding("up",32);
			keyManager.addActionBinding("down",83);
			keyManager.addActionBinding("switch",74);
			keyManager.addActionBinding("punch",75);
			keyManager.addActionBinding("kick",76);
			keyManager.addActionBinding("pause", 80);
			keyManager.addActionBinding("reset", 82);
			keyManager.addActionBinding("lBracket", 219);
			keyManager.addActionBinding("rBracket", 221);
			keyManager.addActionBinding("one", 49);
			keyManager.addActionBinding("two", 50);
			keyManager.addActionBinding("three", 51);
			//this.music();
		},
		
		loadAssets:function()
		{
			var ast = new Assets({"test":"images/BeatEmUpSprites20160327.png",
									"bg":"images/Background.png",
									"punchingBag":"images/DummySprites.png",
									"rubDummy":"images/RubDummy.png",
									"tiles":"images/TileSheet.png",
									"ball":"images/BeachBallSprites.png",
									"aptBg":"images/AptBackground.png",
									"SOGSprites":"images/SuperOffice_Sprites.png",
									"sign":"images/Sign.png",
									"title":"images/TitleSplash.png",
									"ghost":"images/New Piskel.png"},
									this.loadSounds.bind(this));
									//this.build.bind(this));
		},
		
		loadSounds:function()
		{
			this.aud = new AudioManager({"bgMusic":"audio/mus_SG_Intro.mp3",
										"punch1":"audio/sfx_Punch_Light.mp3",
										"punch2":"audio/sfx_Punch_Heavy.mp3",
										"dash":"audio/sfx_Dash.mp3",
										"jump":"audio/sfx_Jump.mp3",
										"land":"audio/sfx_Landing.mp3",
										"wiff":"audio/sfx_Wiff.mp3",
										"mus2":"audio/Yes - Roundabout.mp3"},
										this.build.bind(this));
		}
	});
	
	Game.prototype.build = function(data){
		running = false;
		this.camera.clear();
		if(data == undefined)data = {"scene":"MainScreen"};
		if(this.scene)this.scene.killMe();
		this.scene = new SceneList.getScene(data.scene);
		this.scene._view = this;
		this.scene.keyManager = keyManager;
		this.scene.build();
		//this.eM.dispatchEvent('playSound',{'name':'bgMusic',channel:'music'});
		//this.eM.dispatchEvent('playSound',{'name':'mus2',channel:'music'});
		this.timer = 0;
		running = true;
		this.run();
		console.log(window);
	}
	
	Game.prototype.addTimer = function(data)
	{
		this.slowdown = data;
	}
	
	Game.prototype.addShake = function(data)
	{
		this.camera.addShake(data);
	}
	
	Game.prototype.swap = function(data){
		running = false;
		this.camera.clear();
		if(data == undefined)data = {scene:"MainScreen"};
		if(this.scene)this.scene.killMe();
		this.scene = null;
		this.scene = new SceneList.getScene(data.scene);
		this.scene._view = this;
		this.scene.keyManager = keyManager;
		
		this.scene.build();
		console.log(this.scene.getTagged('player'));
		this.timer = 0;
		running = true;
	}
	
	Game.prototype.tick = function(_dt){
		//var total = 0;
		/*for(var i = this.fpsList.length-1;i>=0;i--)
		{
			total += this.fpsList[i];
		}
		this.fpsCounter.innerHTML = ((1000 * this.fpsList.length)/total).toFixed(2) + " fps<br>"+
									this.fps + " target fps";*/
		keyManager.tick();	
		if(GameData.getTime() != 0)
		{
			this.scene.updateMe(_dt);
			this.aud.update(_dt);
		}
		
		
		if(this.slowdown != undefined && this.slowdown != null)
		{
			this.slowdown.time -= _dt;
			GameData.setTime(this.slowdown.value);
			if(this.slowdown.time <=0)
			{
				this.slowdown = null;
				GameData.setTime(1);
			}
		}
		
		if(keyManager.isActionActivated("lBracket"))
		{
			if(GameData.getTime() > 0.2)
			{
				GameData.setTime(GameData.getTime() - 0.05);
			}
		}
		if(keyManager.isActionActivated("rBracket"))
		{
			if(GameData.getTime() < 1)
			{
				GameData.setTime(GameData.getTime() + 0.05);
			}
		}
	}
	
	Game.prototype.render = function(){
		this.camera.update();
	}
	
	Game.prototype.run = function(){
		
		var self = this;
		this.fps =60;
		this.timePerTick = 1000/this.fps;
		this.delta = 0;
		this.now;
		this.last = Date.now();
		this.timer = 0;
		this.ticks = 0;
		this.fpsList = [];
		/*this.fpsCounter = document.createElement("p");
		this.fpsCounter.style.position = 'absolute';
		this.fpsCounter.style.left = '10px';
		this.fpsCounter.style.top = '0px';
		this.fpsCounter.style.backgroundColor = 'white';
		document.body.appendChild(this.fpsCounter);*/
		this.loop();
	}
	
	Game.prototype.loop = function()
	{
		window.requestAnimationFrame(this.loop.bind(this));
		if(!running)return;
		this.now = Date.now();
		this.delta = this.now -this.last;
		this.timer += this.delta;
		this.last = this.now;
		this.ticks += this.delta;
		if(this.timer>this.timePerTick*2)this.timer = this.timePerTick*2;
		if(this.timer >= this.timePerTick){	
			
			//this.dt = (this.timer/1000) * (this.fps/60);
			//console.log(this.delta);
			this.fpsList.push(this.ticks);
			this.ticks=0;
			if(this.fpsList.length>20)this.fpsList.splice(0,1);
			this.tick(this.delta/1000);				
			this.timer -=this.timePerTick;
		}
		this.render();
		
	}
	
	Game.prototype.start = function(){
		if(running)return;
		/*running = true;
		this.run();*/
	}
	
	Game.prototype.getWidth = function(){
		return width;
	}
	
	Game.prototype.getHeight = function(){
		return height;
	}
	return Game;
});