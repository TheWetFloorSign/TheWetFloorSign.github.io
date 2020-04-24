define(['Class','ImageLoader','SpriteSheet'],function(Class,ImageLoader,SpriteSheet){
	var assets = {};
	var Assets = Class.extend({
		init:function(_assetList, callBack){
			
			var toLoad = 0;
			var loaded = 0;
			for(var key in _assetList)
			{	
				toLoad++;
			}
			
			for(var key in _assetList)
			{			
				var image = new Image();
				image.src = _assetList[key];
				assets[key] = {sheet:image,
								name:key,
								path:image.src};
				image.onload = function()
				{					
					loaded++;
					if(loaded == toLoad)
					{
						if(callBack != undefined)callBack();
					}
				}
			}
			
		}
	});
	
	Assets.getAssets = function(_name)
	{
		return assets[_name];
	}
	return Assets;
});