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
	
	var Sign = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "sign";
			this._size = {width:18,height:18};
			this.text = "**Replace this text Replace this text Replace this text Replace this text**";
			if(_data != undefined)this.text = _data.text;
			this.createAnimations();
			
			var tv = new HitBox(this,-(this._size.width*0.75),-(this._size.height*0.75),this._size.width*2,this._size.height*2);
			tv.isTrigger = true;
			tv.collision1 = this.showText.bind(this);
			tv.collision3 = this.hideText.bind(this);
			this.addComponent(tv);
			this.tb = null;
			this.i = 0;
			this.eM = new EventManager();
		},
		
		updateMe:function(_dt){
			this.preUpdate(_dt);
			this.updateComponents(_dt);
		//	if(this.tb != null)this.tb.updateText(this.text + " " + String.fromCharCode(this.i++));
			if(this.i >120)this.i = 42;
			this._super(_dt);
		},
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		},
		
		showText:function(hb)
		{		
			var target = hb.target;
			if(target.name == "player")
			{
				this.tb = new TextBox(this.text);
				this.tb.x = this.x -30;
				this.tb.y = this.y - 48;
				this.add(this.tb);
				this.tb.onShowMe();
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
	Sign.prototype.createAnimations = function()
	{
		var gc = new GraphicsComponent(this);
		this.addComponent(gc);
		gc.sprite = new Sprite("sign",0,0,18,18,0,0);
	}
	
	return Sign;
});