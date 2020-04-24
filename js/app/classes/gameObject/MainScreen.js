/**
 * ...
 * @author Ben
 */

define(['Scene','Background','EventManager','GameObjects'], function(Scene,Background,EventManager,GameObjects){

	var MainScreen = Scene.extend({
		init:function(){
			
			this._super();
			this.eM = new EventManager();
		},
		updateMe:function(_dt)
		{				
			if(this.keyManager.isActionActivatedIn("pause",1) ||this.keyManager.isActionActivatedIn("kick",1)||this.keyManager.isActionActivatedIn("punch",1))this.eM.dispatchEvent("swapScene",{scene:"SwitchLevel"});
		},
		
		build:function(_data)
		{
			var val= (this._view.camera._width * this._view.scale)/1080;
			var bg = new Background(this._view.camera._width * this._view.scale,this._view.camera._height * this._view.scale,{"x":0,"y":0,"width":1080,"height":720,"sprite":"title","scale":((1/this._view.scale)*val)});
			this.add(bg);
			bg.onShowMe();
		},
		
		preUpdate:function(_dt)
		{
		}
	});
	
	return MainScreen;
});