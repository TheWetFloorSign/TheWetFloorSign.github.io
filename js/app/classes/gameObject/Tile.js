/**
 * ...
 * @author Ben
 */

define(['BasicObject','GraphicsComponent','HitBox','Sprite','GameData'],function(BasicObject,GraphicsComponent,HitBox,Sprite,GameData){
	
	var Tile = BasicObject.extend({
		init:function(_td){
			this._super();
			this.name = "tile";
			this.testName = "";
			this.tileData = _td;
			this.canTouch = 0x0000;
			this.overlapBias = 10;
			if(_td.slope)this.slope = _td.slope;
			if(_td.hitbox)this.addHitBox();
			this.createAnimations();
		},
		
		updateMe:function(_dt)
		{
			this.preUpdate(_dt);
			this.updateComponents(_dt);	
			this._super(_dt);
		},
		
		addHitBox:function(_w,_h)
		{
			let hb = new HitBox(this,0,0,24,24);
			hb.collision1 = this.testCollision.bind(this);
			hb.collision2 = this.testCollision.bind(this);
			//hb.collision3 = this.exit;
			this.addComponent(hb);
		},
		
		createAnimations:function()
		{
			let gc = new GraphicsComponent(this);
			this.addComponent(gc);
			if(this.tileData.flip ==-1)gc._hFlip = -1;
			gc.sprite = new Sprite("tiles",this.tileData.x,this.tileData.y,this.tileData.width,this.tileData.height,0,0);
		},
		
		testCollision:function(hb)
		{
			let hitBox2 = hb;
			let target = hitBox2.target;
			let hitBox1 = hitBox2.targetHB;
			let yIndex = 1;
			let xIndex = 0;
			if(hitBox1.isTrigger == true)return;
			if (this.slope != undefined){
				this.slopeFormY(target, hitBox1, hitBox2);
				return;
			}
			let deltaXabs = Math.abs(target.x - target.last.x);
			let deltaYabs = Math.abs(target.y - target.last.y);
			
			if(deltaYabs > deltaXabs)
			{
				//if(this.x == 15 *24 && this.y == 10*24)console.log("because y delta");
				yIndex = -1;
			}else if(deltaYabs < deltaXabs)
			{
				//if(this.x == 15 *24 && this.y == 10*24)console.log("because x delta");
				xIndex = -1;
			}			
			
			if(deltaXabs != 0 && deltaYabs != 0)
			{
				xIndex = Math.min(Math.abs(this.x + hitBox2.x - (target.last.x + hitBox1.width + hitBox1.x)),
									Math.abs(target.last.x + hitBox1.x - (this.x + hitBox2.width + hitBox2.x)));
				yIndex = Math.min(Math.abs(this.y + hitBox2.y - (target.last.y + hitBox1.height + hitBox1.y)),
									Math.abs(target.last.y + hitBox1.y - (this.y + hitBox2.height + hitBox2.y)));
			}
			
			let thisOldBounds = {x:this.last.x + hitBox2.x,y:this.last.y+hitBox2.y,width:hitBox2.width,height:hitBox2.height};
			let targOldBounds = {x:target.last.x + hitBox1.x,y:target.last.y+hitBox1.y,width:hitBox1.width,height:hitBox1.height};
			
			if(this.xOverlap(thisOldBounds,targOldBounds) && !this.yOverlap(thisOldBounds,targOldBounds))
			{
				xIndex = -2;
				//if(this.x == 15 *24 && this.y == 10*24)console.log("old overlap x")
			}else if(!this.xOverlap(thisOldBounds,targOldBounds) && this.yOverlap(thisOldBounds,targOldBounds))
			{
				//yIndex = -1;
				//if(this.x == 15 *24 && this.y == 10*24)console.log("old overlap y")
			}
			
			if(xIndex<yIndex)
			{
				//if(this.x == 15 *24 && this.y == 10*24)console.log("x first");
				this.collisionResolutionX(target,hitBox1,hitBox2);
				if(this.rectOverlap({x:this.x + hitBox2.x,y:this.y+hitBox2.y,width:hitBox2.width,height:hitBox2.height},{x:target.x + hitBox1.x,y:target.y+hitBox1.y,width:hitBox1.width,height:hitBox1.height}))
				{
					this.collisionResolutionY(target,hitBox1,hitBox2);
				}
			}else
			{
				//if(this.x == 15 *24 && this.y == 10*24)console.log("y first");
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
		
		xOverlap:function(a,b)
		{
			return (a.y + a.height > b.y) && (b.y+b.height > a.y);
		},
		
		yOverlap:function(a,b)
		{
			return (a.x + a.width > b.x) && (b.x+b.width > a.x);
		},
		
		exit:function()
		{
			//console.log("We out");
		},
		
		collisionResolutionX:function(obj, hb1, hb2) {
			let overlap = 0;
			
			let ob1Delta = obj.x - obj.last.x;
			let ob2Delta = this.x - this.last.x;
			
			//if (ob1Delta != ob2Delta)
			//{
				let maxOverlap = Math.abs(ob1Delta) + Math.abs(ob2Delta) + this.overlapBias;
				if (Math.abs(obj.last.x + hb1.width + hb1.x - this.last.x)<Math.abs(this.last.x + hb2.width + hb2.x - obj.last.x))
				{
					overlap = (obj.x + hb1.width + hb1.x) - (this.x + hb2.x);
					if (this.canTouch & 0x1000 && (this.x + hb2.x + hb2.width/2 > obj.last.x + hb1.x + hb1.width/2))
					{
						obj.touching |=  0x0100;
						//console.log("in tile, obj touch right");
					}else
					{
						overlap = 0;
					}
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
				}
				obj.x -= overlap;
			//}
			
		},
	
		collisionResolutionY:function(obj, hb1, hb2) {
			let overlap = 0;
			
			let ob1Delta = obj.y - obj.last.y;
			let ob2Delta = this.y - this.last.y;
			if (ob1Delta != ob2Delta)
			{
				let maxOverlap = Math.abs(ob1Delta) + Math.abs(ob2Delta) + this.overlapBias;
				if (ob1Delta > 0 || Math.abs(obj.last.y + hb1.y + hb1.height - this.last.y)<Math.abs(this.last.y + hb2.y + hb2.height - obj.last.y))
				{
					overlap = (obj.y + hb1.y + hb1.height) - (this.y + hb2.y);
					if (this.canTouch & 0x0010 && (this.y + hb2.y + hb2.height/2 > obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0001; //down
						console.log("down 1")
					}else
					{
						overlap = 0;
					}
				}
				else if (ob1Delta < 0 || Math.abs(obj.last.y + hb1.y + hb1.height - this.last.y)>Math.abs(this.last.y + hb2.y + hb2.height - obj.last.y))
				{
					overlap = (obj.y + hb1.y) - (this.y + hb2.y + hb2.height);
					if (this.canTouch & 0x0001 && (this.y + hb2.y + hb2.height/2 < obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0010; //up
					}else
					{
						overlap = 0;
					}
				}
				obj.y -= overlap;
			}else
			{
				if(Math.abs(obj.y + hb1.y + hb1.height - this.y)>Math.abs(this.y + hb2.y + hb2.height - obj.y))
				{
					overlap = (obj.y + hb1.y + hb1.height) - (this.y + hb2.y);
					if (this.canTouch & 0x0010 && (this.y + hb2.y + hb2.height/2 > obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0001; //down
						console.log("down 2")
					}else
					{
						overlap = 0;
					}
				}else
				{
					overlap = (obj.y + hb1.y) - (this.y + hb2.y + hb2.height);
					if (this.canTouch & 0x0001 && (this.y + hb2.y + hb2.height/2 < obj.last.y + hb1.y + hb1.height/2))
					{
						obj.touching |=  0x0010; //up
					}else
					{
						overlap = 0;
					}
				}
				obj.y -= overlap;
			}		
			
		},
		
		slopeFormY:function(obj, hb1, hb2)
		{
			let slopePoint = obj.x + hb1.x +(hb1.width/2) - (this.x + hb2.x);	
			let lastSlopePoint = obj.last.x + hb1.x + (hb1.width/2) - (this.last.x + hb2.x);
			let yChange = this.slope[1] - this.slope[0];
			let slopeCol = false;
			let pointHeight = (yChange / hb2.width) * slopePoint + this.slope[0];
			let lastPointHeight = (yChange / hb2.width) * lastSlopePoint + this.slope[0];
			
			if ((obj.x + hb1.x + (hb1.width/2) >= this.x + hb2.x) && (obj.x + hb1.x + (hb1.width/2) <= this.x + hb2.x + hb2.width))
			{
				
				if ((slopePoint >= 0 && slopePoint <=hb2.width ) || (pointHeight <= Math.max(slope[0],slope[1]) && pointHeight>= Math.min(slope[0],slope[1]))) 
				{
					if (obj.y + hb1.y + hb1.height >= this.y + hb2.y + hb2.height - pointHeight-(4 * GameData.getTime()) && 
							(obj.y +hb1.height + hb1.y <= this.y + hb2.height + hb2.y - pointHeight + (4 * GameData.getTime()) || 
							obj.last.y + hb1.height + hb1.y <= this.y + hb2.height + hb2.y - lastPointHeight + (4 * GameData.getTime()))){
						if(obj.y - obj.last.y >=0)slopeCol = true;
					}
				}
			}
			if (slopeCol == true && (obj.keyManager == undefined || !obj.keyManager.isActionActivated("down")))
			{			
				obj.y = this.y + hb2.y + hb2.height - pointHeight - hb1.height -hb1.y;
				obj.touching |=  0x0001;
				//trace("collide");
			}
			return slopeCol;
		},
		
		onShowMe:function(){
			//this._scene.camera.addDraw(this.getComponent("GraphicsComponent"));
		}
	});
	
	
	
	return Tile;
});