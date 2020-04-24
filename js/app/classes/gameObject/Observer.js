/**
 * ...
 * @author Ben
 */

define(['BasicObject',
		'EventManager',
		'GameObjects'], 
		function(BasicObject,
		EventManager,
		GameObjects){
	
	var Observer = BasicObject.extend({
		init:function(_data){
			this._super();
			this.name = "observer";
			this.x = 200;
			this.y = 100;
			this.eM = new EventManager();
			this.eM.addEventListener("died",this,this.testFN.bind(this));
		},
		testFN:function(_data)
		{
			//console.log("making a dummy")
			var go = GameObjects.getGameObject("Dummy",{});
			go.x = go.last.x = this.x;
			go.y = go.last.y = this.y;
			go.reviveMe();
			this.add(go);
			//console.log(go);
			go.onShowMe();
			
		}
	});
	
	return Observer;
});