define(['Class'],function(Class)
{
	var eventList = [];
	var EventManager = Class.extend({
		init:function()
		{
			//eventList = [];
		},
		
		
		addEventListener:function(strEventName, obSource, fnCallback)
		{
			if(eventList[strEventName] == undefined)
			{
				eventList[strEventName] = [];
			}
			eventList[strEventName].push({obj:obSource, callBack:fnCallback});
		},
		
		
		removeEventListener:function(strEventName, obSource, fnCallback)
		{
			if(eventList[strEventName] != undefined)
			{
				for(var i = eventList[strEventName].length-1;i>=0;i--)
				{
					if(eventList[strEventName][i].obj == obSource)
					{
						eventList[strEventName].splice(i,1);
						if(eventList[strEventName].length ==0)
						{
							delete eventList[strEventName];
						}
						break;
					}
				}
			}
		},
		
		dispatchEvent:function(strEventName, objEventData)
		{
			if(eventList[strEventName] != undefined)
			{
				for(var i = eventList[strEventName].length-1;i>=0;i--)
				{					
					// maybe check for null ref?
					eventList[strEventName][i].callBack(objEventData);
				}
			}
		}
	});
	
	return EventManager;
});