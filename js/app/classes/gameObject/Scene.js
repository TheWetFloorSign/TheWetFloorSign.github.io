/**
 * ...
 * @author Ben
 */

define(['BasicObject'], function(BasicObject){

	var Scene = BasicObject.extend({
		
		updateMe:function(_dt)
		{	
			for(var i = this._members.length-1;i>-1;i--)
			{
				this._members[i].updateMe(_dt);
			}
		},
		
		preUpdate:function(_dt)
		{
		}
	});
	
	return Scene;
});