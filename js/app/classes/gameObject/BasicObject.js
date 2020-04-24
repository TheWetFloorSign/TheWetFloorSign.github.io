/**
 * ...
 * @author Ben
 */

define(['Class','Display'], function(Class,Display){

	var BasicObject = Class.extend({
		init:function(){
			
			this._camera, this._view, this._alive, this._exists, this._immovable, this.touching = 0x0000, this.wasTouching = 0x0000, this.x = 0, this.y = 0, this.last={x:this.x,y:this.y}, this._yspeed, this._xspeed, this._input, this._aniMachine, this._vector, this._type, this._totalSpeed;
			
			this._facing = 0x0100;
			this._componentList = [];
			this._members = [];
			this._alive = true;
			this._exists = true;
			this.name = "name";
		},
		
		add:function(basicObject)
		{
			this._members.push(basicObject);
			basicObject._view = this._view;
		},
		
		updateMe:function(_dt)
		{	
			for(var i = this._members.length-1;i>-1;i--)
			{
				if(this._members[i]._exists == true)this._members[i].updateMe(_dt);
			}
			this.wasTouching = this.touching;
			this.touching = 0x0000;
			return this.touching;
		},
		
		preUpdate:function(_dt)
		{
			this.last = {x:this.x,y:this.y};
		},
		
		killMe:function()
		{
			//this._view.removeGameOb(this);
			for(var i = this._members.length-1;i>-1;i--)
			{
				this._members[i].killMe();
			}	
			this._members = [];
			this._view.camera.removeDraw(this.getComponent("GraphicsComponent"))
			this.removeComponents();
			this._alive = false;
			this._exists = false;
			this.resetMe();
		},
		
		reviveMe:function()
		{
			this._alive = true;
			this._exists = true;
		},
		
		addComponent:function(comp)
		{
			this._componentList.push(comp);
		},
		
		getComponent:function(comp)
		{
			//if (this._view != null)this._view.incre++;
			for (var i = this._componentList.length -1; i >= 0; i--)
			{
				if (this._componentList[i].id == comp)
				{
					return this._componentList[i];
				}
			}
			return null;
		},
		
		getMemberComponent:function(comp)
		{
			//if (this._view != null)this._view.incre++;
			var compArray = [];
			var tempComp = this.getComponents(comp);
			if(tempComp != null) compArray = compArray.concat(tempComp);
			for(var i = this._members.length-1;i>=0;i--)
			{
				compArray = compArray.concat(this._members[i].getMemberComponent(comp));
			}
			return compArray;
		},
		
		getComponents:function(comp)
		{
			var compArray = [];
			for (var i = this._componentList.length -1; i >= 0; i--)
			{
				if (this._componentList[i].id == comp)
				{
					compArray.push(this._componentList[i]);
				}
			}
			if (compArray.length > 0) return compArray;
			return null;
		},
		
		updateComponents:function(_dt)
		{
			for (var i = this._componentList.length -1; i >= 0; i--)
			{
				this._componentList[i].update(_dt);
			}
		},
		
		removeComponents:function()
		{			
			for (var i = this._componentList.length -1; i >= 0; i--)
			{
				this._componentList[i].kill();
			}
			this._componentList = [];
		},
		
		getTagged:function(tags)
		{
			//console.log(tags);
			var tempArray = [];
			for(var i=this._members.length-1;i>-1;i--)
			{
				if(this._members[i]._members.length !=0)
				{
					tempArray = tempArray.concat(this._members[i].getTagged(tags));
				}
				for(var j = tags.length-1;j>=0;j--)
				{
					
					if(this._members[i].name == tags[j])
					{
						tempArray.push(this._members[i]);
						break;
					}
				}			
			}
			return tempArray;
		},
		
		removeMember:function(_mem)
		{
			for(var i=this._members.length-1;i>-1;i--)
			{
				if(this._members[i]== _mem)
				{
					this._members[i].killMe();
					this._members.splice(i,1);
				}			
			}
		},
		
		removeAllMembers:function()
		{
			for(var i=this._members.length-1;i>-1;i--)
			{
				this._members[i].killMe();
				this._members.splice(i,1);
						
			}
		},
		
		getListComponents:function(comp, list)
		{
			var tempArray = [];
			for(var i=list.length-1;i>-1;i--)
			{
				var tempComp = list[i].getComponents(comp);
				if(tempComp != undefined)
				{
					tempArray = tempArray.concat(tempComp);
				}
			}
			return tempArray;
		},
		
		resetMe:function(){},
		
		showMe:function(scene, playerInfo)
		{
			this._view = scene;
			this._view.addGameObject(this);		
			
			if(playerInfo != undefined){
				this._playerInfo = playerInfo;
			}	
			this.resetMe();
			this.onShowMe();
		},
		
		onShowMe:function(){}
	});
	
	return BasicObject;
});