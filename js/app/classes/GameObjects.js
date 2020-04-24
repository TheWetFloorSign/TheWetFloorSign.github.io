define(['Class',
		'Ball',
		'Door',
		'Dummy',
		'Player',
		'PunchingBag',
		'SOG',
		'Sign',
		'Platform',
		'Upgrade',
		'Ghost'],
function(Class,
		Ball,
		Door,
		Dummy,
		Player,
		PunchingBag,
		SOG,
		Sign,
		Platform,
		Upgrade,
		Ghost){
		
			var gO = {};
			
			gO["Ball"] = Ball;
			gO["Door"] = Door;
			gO["Player"] = Player;
			gO["Sign"] = Sign;
			gO["SOG"] = SOG;
			gO["PunchingBag"] = PunchingBag;
			gO["Dummy"] = Dummy;
			gO["Platform"] = Platform;
			gO["Upgrade"] = Upgrade;
			gO["Ghost"] = Ghost;
			
			var GameObjects = Class.extend({
				init:function(){}
			});
			
			GameObjects.getGameObject = function(_name,_data)
			{
				return new gO[_name](_data);
			}
	return GameObjects;
});