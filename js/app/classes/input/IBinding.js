define(['Class'],function(Class){
	var IBinding = Class.extend({
		init:function(_keyCode){
			this.keyCode = _keyCode;
			this.isActive = false;
		}
	});
	return IBinding;
});