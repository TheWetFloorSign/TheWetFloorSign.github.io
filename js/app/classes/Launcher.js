define(['Class','Game'],function(Class,Game){
	var Launcher = Class.extend({
		init:function(_title,_width,_height,_scale){
			var game = new Game(_title,_width,_height,_scale);
			game.start();
		}
	});
	return Launcher;
});