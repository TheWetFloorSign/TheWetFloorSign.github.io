/**
 * ...
 * @author Ben
 */

define(['Class'], 
		function(Class){
	
	var FrameData = Class.extend({
		init:function(){
			this.frameData = [
				{
					name: "punch1",
					ID: 0,
					animationID: "punch1",
					damageBox:{
						size:{w:30,h:10},
						offset:{x:0,y:0},
						vector:{x:2,y:0},
						relative:true,
						force:{x:1,y:0},
						delay:0
					}					
				},
				{
					name: "punch2",
					ID: 1,
					animationID: "punch2",
					damageBox:{
						size:{w:30,h:10},
						offset:{x:0,y:0},
						vector:{x:2,y:0},
						relative:true,
						force:{x:1,y:0},
						delay:0
					}					
				},
				{
					name: "punch3",
					ID: 2,
					animationID: "punch3",
					damageBox:{
						size:{w:40,h:15},
						offset:{x:0,y:0},
						vector:{x:2,y:0},
						relative:true,
						force:{x:1,y:0},
						delay:0
					}					
				},
				{
					name: "punch4",
					ID: 3,
					animationID: "punch1",
					damageBox:{
						size:{w:25,h:30},
						offset:{x:0,y:-20},
						vector:{x:2,y:-12},
						relative:true,
						force:{x:1,y:0},
						delay:0
					}					
				},
				{
					name: "kick1",
					ID: 4,
					animationID: "kick1",
					damageBox:{
						size:{w:40,h:15},
						offset:{x:0,y:0},
						vector:{x:10,y:1},
						relative:true,
						force:{x:8,y:0},
						delay:14
					}					
				}
			
			];
		}
	});
	
	return FrameData;
});