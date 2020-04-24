define(['Class','SwitchLevel','MainScreen'],
function(Class,SwitchLevel,MainScreen){
		
			var sO = {};
			
			sO["SwitchLevel"] = SwitchLevel;
			sO["MainScreen"] = MainScreen;
			
			var SceneList = Class.extend({
				init:function(){}
			});
			
			SceneList.getScene = function(_name,_data)
			{
				return new sO[_name](_data);
			}
	return SceneList;
});