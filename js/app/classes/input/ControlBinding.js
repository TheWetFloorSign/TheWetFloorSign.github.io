define(['Class','IBinding'],function(Class,IBinding)
{
	var ControlBinding = Class.extend(
	{
		init:function(_keyCode)
		{
			this.keyCode = _keyCode;
			this.isActive = false;
		}
	});	
	return ControlBinding;
});