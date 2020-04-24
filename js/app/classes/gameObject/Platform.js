/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','HitBox','Sprite','GameData'],function(BasicObject,GraphicsComponent,HitBox,Sprite,GameData){
	
	var Platform = BasicObject.extend({
		init:function(_td){
			this._super();
			this.name = "platform";
			this.testName = "";
			this.canTouch = 0x1111;
			this.overlapBias = 10;
			this.tic = 90;
			this.dir = -1;
			this.addHitBox();
			this.createAnimations();
		},
		
		updateMe:function(_dt)
		{
			this.preUpdate(_dt);
			this.updateComponents(_dt);	
			this.tic-= 1 * GameData.getTime();
			this.y -= Math.sin(this.dir * ((this.tic-90)/180)) * 5 * GameData.getTime();
			this.x -= Math.sin(this.dir * ((this.tic-90)/180)) * 5 * GameData.getTime();
			if(this.tic <= 0)
			{
				this.dir  = this.dir *-1;
				this.tic = 180;
			}
			this._super(_dt);
		},
		
		addHitBox:function(_w,_h)
		{
			var hb = new HitBox(this,0,0,24,24);
			hb.collision1 = this.testCollision.bind(this);
			hb.collision2 = this.testCollision.bind(this);
			//hb.collision3 = this.exit;
			this.addComponent(hb);
		},
		
		createAnimations:function()
		{
			var gc = new GraphicsComponent(this);
			this.addComponent(gc);
			gc.sprite = new Sprite("tiles",0,24,24,24,0,0);
		},
		
		testCollision:function(hb)
		{
			var hitBox2 = hb;
			var target = hitBox2.target;
			var hitBox1 = hitBox2.targetHB;
			var yIndex = 1;
			var xIndex = 0;
			if(hitBox1.isTrigger == true)return;
			if (this.slope != undefined){
				this.slopeFormY(target, hitBox1, hitBox2);
				return;
			}
			var delta1Xabs = Math.abs(target.x - target.last.x);
			var delta1Yabs = Math.abs(target.y - target.last.y);
			
			var delta2Xabs = Math.abs(this.x - this.last.x);
			var delta2Yabs = Math.abs(this.y - this.last.y);
			
			var deltaXabs = delta1Xabs + delta2Xabs;
			var deltaYabs = delta1Yabs + delta2Yabs;
			if(deltaYabs > deltaXabs)
			{
				yIndex = -1;
			}else if(deltaYabs < deltaXabs)
			{
				xIndex = -1;
			}			
			
			if(deltaXabs != 0 && deltaYabs != 0)
			{
				xIndex = Math.min(Math.abs(this.last.x + hitBox2.x - (target.last.x + hitBox1.width + hitBox1.x)),Math.abs(target.last.x + hitBox1.x - (this.last.x + hitBox2.x + hitBox2.width)));
				yIndex = Math.min(Math.abs(this.last.y + hitBox2.y - (target.last.y + hitBox1.height + hitBox1.y)),Math.abs(target.last.y + hitBox1.y - (this.last.y + hitBox2.y + hitBox2.height)));
			}
			
			if(0 > this.y - this.last.y &&((target.wasTouching & 0x0010) ==0 || (target.touching & 0x0010) == 0)) target.y += (this.y - this.last.y);
			if(0 < this.y - this.last.y &&((target.wasTouching & 0x0001) ==0 || (target.touching & 0x0001) == 0)) target.y += (this.y - this.last.y);
			
			if(0 > this.x - this.last.x &&!((target.wasTouching & 0x1000) !=0 || (target.touching & 0x1000) != 0))
			{
				target.x += (this.x - this.last.x);
			}			
			if(0 < this.x - this.last.x &&!((target.wasTouching & 0x0100) !=0 || (target.touching & 0x0100) != 0))
			{
				target.x += (this.x - this.last.x);
			}
			
			//console.log("is colliding");
			
			if(xIndex<yIndex)
			{
				this.collisionResolutionX(target,hitBox1,hitBox2);
				if(this.rectOverlap({x:this.x+hitBox2.x,y:this.y+hitBox2.y,width:hitBox2.width,height:hitBox2.height},{x:target.x+hitBox1.x,y:target.y+hitBox1.y,width:hitBox1.width,height:hitBox1.height}))
				{
					this.collisionResolutionY(target,hitBox1,hitBox2);
				}
			}else
			{
				this.collisionResolutionY(target,hitBox1,hitBox2);
				if(this.rectOverlap({x:this.x+hitBox2.x,y:this.y+hitBox2.y,width:hitBox2.width,height:hitBox2.height},{x:target.x+hitBox1.x,y:target.y+hitBox1.y,width:hitBox1.width,height:hitBox1.height}))
				{
					this.collisionResolutionX(target,hitBox1,hitBox2);
				}
			}
		},
		
		rectOverlap:function(a, b){
			return (a.x + a.width > b.x) && (b.x+b.width > a.x) && (a.y + a.height > b.y) && (b.y+b.height > a.y);
		},
		
		exit:function()
		{
			console.log("We out");
		},
		
		collisionResolutionX:function(obj, hb1, hb2) {
			var overlap = 0;
			
			var ob1Delta = obj.x - obj.last.x;
			var ob2Delta = this.x - this.last.x;
			
			//if (ob1Delta != ob2Delta)
			//{
				var maxOverlap = Math.abs(ob1Delta) + Math.abs(ob2Delta) + this.overlapBias;
				if (Math.abs(obj.last.x + hb1.width + hb1.x - this.last.x)<Math.abs(this.last.x + hb2.width + hb2.x - obj.last.x))
				{
					overlap = (obj.x + hb1.width + hb1.x) - (this.x + hb2.x);
					if (this.canTouch & 0x1000 && (this.x + hb2.x + hb2.width/2 > obj.last.x + hb1.x + hb1.width/2))
					{
						obj.touching |=  0x0100;
						console.log("in tile, obj touch right");
					}else
					{
						overlap = 0;
					}
					if(this.rectOverlap({x:this.last.x,y:this.last.y,width:hb2.width,height:hb2.height},{x:obj.last.x,y:obj.last.y,width:hb1.width,height:hb1.height})) overlap = 0;
				}
				else if (Math.abs(obj.last.x + hb1.width +hb1.x - this.last.x)>Math.abs(this.last.x + hb2.width +hb2.x - obj.last.x))
				{
					overlap = (obj.x +hb1.x) -(this.x + hb2.width + hb2.x);
					if (this.canTouch & 0x0100 && (this.x + hb2.width/2 + hb2.x < obj.last.x + hb1.width/2 + hb1.x))
					{
						obj.touching |=  0x1000;
					}else
					{
						overlap = 0;
					}
					if(this.rectOverlap({x:this.last.x,y:this.last.y,width:hb2.width,height:hb2.height},{x:obj.last.x,y:obj.last.y,width:hb1.width,height:hb1.height})) overlap = 0;
				}
				obj.x -= overlap;
			//}
			
		},
	
		collisionResolutionY:function(obj, hb1, hb2) {
			var overlap = 0;
			
			var ob1Delta = obj.y - obj.last.y;
			var ob2Delta = this.y - this.last.y;
			
			if (ob1Delta != ob2Delta)
			{
				var maxOverlap = Math.abs(ob1Delta) + Math.abs(ob2Delta) + this.overlapBias;
				//if (ob1Delta > ob2Delta || Math.abs(obj.y + hb1.height - this.y)<Math.abs(this.y + hb2.height - obj.y))
				if (ob1Delta > ob2Delta)
				{
					
					overlap = (obj.y + hb1.y + hb1.height) - (this.y + hb2.y);
					if (this.canTouch & 0x0010 && (this.y + hb2.y + hb2.height/2 > obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0001;
					}else
					{
						overlap = 0;
					}
					if((obj.wasTouching & 0x0010) != 0 ||(obj.touching & 0x0010) != 0) overlap = 0;
				}
				//else if (ob1Delta < ob2Delta || Math.abs(obj.y + hb1.height - this.y)>Math.abs(this.y + hb2.height - obj.y))
				else if (ob1Delta < ob2Delta)
				{
					overlap = (obj.y + hb1.y) - (this.y + hb2.y + hb2.height);
					if (this.canTouch & 0x0001 && (this.y + hb2.y + hb2.height/2 < obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0010;
					}else
					{
						overlap = 0;
					}
					if((obj.wasTouching & 0x0001) != 0 || (obj.touching & 0x0001) != 0) overlap = 0;
				}
				obj.y -= overlap;
			}		
			
		},
		
		slopeFormY:function(obj, hb1, hb2)
		{
			var slopePoint = obj.x + (hb1.width/2) - (this.x + hb2.x);	
			var lastSlopePoint = obj.last.x + (hb1.width/2) - (this.last.x + hb2.x);
			var yChange = this.slope[1] - this.slope[0];
			var slopeCol = false;
			var pointHeight = (yChange / hb2.width) * slopePoint + this.slope[0];
			var lastPointHeight = (yChange / hb2.width) * lastSlopePoint + this.slope[0];
			
			if ((obj.x + (hb1.width/2) >= this.x + hb2.x) && (obj.x + (hb1.width/2) <= this.x + hb2.x + hb2.width))
			{
				
				if ((slopePoint >= 0 && slopePoint <=hb2.width ) || (pointHeight <= Math.max(slope[0],slope[1]) && pointHeight>= Math.min(slope[0],slope[1]))) 
				{
					if (obj.y +hb1.height >= this.y + hb2.height - pointHeight-6 && (obj.y +hb1.height <= this.y + hb2.height - pointHeight+4 || obj.last.y + hb1.height<= this.y+hb2.height -lastPointHeight +4)){
						slopeCol = true;
					}
				}
			}
			if (slopeCol == true && (obj.keyManager == undefined || !obj.keyManager.isActionActivated("down")))
			{			
				obj.y = this.y +hb2.height - pointHeight - hb1.height;
				obj.touching |=  0x0001;
				//trace("collide");
			}
			return slopeCol;
		},
		
		onShowMe:function(){
			this._view.camera.addDraw(this.getComponent("GraphicsComponent"));
		}
	});
	
	
	
	return Platform;
});