define(['Class'],function(Class){
	var timeMod = 1;
	var Gamedata = Class.extend({
		init:function(){}
	});
	
	Gamedata.getTime = function()
	{
		return timeMod;
	}
	Gamedata.setTime = function(_val)
	{
		console.log("time set:",_val)
		timeMod = _val;
	}
	return Gamedata;
});