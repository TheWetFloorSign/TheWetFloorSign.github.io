/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'GraphicsComponent',
		'Sprite',
		'HitBox',
		'EventManager',
		'TextBox'], 
		function(BasicObject,
		GraphicsComponent,
		Sprite,
		HitBox,
		EventManager,
		TextBox){
	
	var Upgrade = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "upgrade";
			this._size = {width:8,height:7};
			this.createAnimations();
			
			var tv = new HitBox(this,-(this._size.width*0.75),-(this._size.height*0.75),this._size.width*2,this._size.height*2);
			tv.isTrigger = true;
			tv.collision1 = this.applyUpgrade.bind(this);
			this.addComponent(tv);
			this.eM = new EventManager();
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.updateComponents(_dt);
			this._super(_dt);
		},
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		applyUpgrade:function(hb)
		{		
			var target = hb.target;
			if(target.name == "player")
			{
				target.abilities |= 0x1;
				this.killMe();
			}
		},
		
		hideText:function(hb)
		{		
			var target = hb.target;
			if(target.name == "player")
			{
				this.removeMember(this.tb);
				this.tb = null;
			}
		}
	});
	Upgrade.prototype.createAnimations = function()
	{
		var gc = new GraphicsComponent(this);
		this.addComponent(gc);
		gc.sprite = new Sprite("test",0,89,8,7,0,0);
	}
	
	return Upgrade;
});