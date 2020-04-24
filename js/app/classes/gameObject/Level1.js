/**
 * ...
 * @author Ben
 */

define(['Scene','Ball','Player','TileLevel','QuadTree','Background'], function(Scene,Ball,Player,TileLevel,QuadTree,Background){

	var Level1 = Scene.extend({
		
		updateMe:function(_dt)
		{	
			for(var i = this._members.length-1;i>-1;i--)
			{
				this._members[i].updateMe(_dt);
			}
			this.quad.overlap(this.getListComponents("HitBox",this.getTagged(["player","ball"])),this.getListComponents("HitBox",this.getTagged(["tile"])));
			this.quad.overlap(this.getListComponents("HitBox",this.getTagged(["player"])),this.getListComponents("HitBox",this.getTagged(["ball"])));
			
			var tempAr = this.getMemberComponent("HitBox");
		
			for (var i=tempAr.length-1;i>-1;i--)
			{
				tempAr[i].exitCollision();
			}
		},
		
		build:function(scene, keyManager)
		{
			this.quad = new QuadTree(12,6,{x:0,y:0,width:800,height:800});
			this._scene = scene;
			var player = new Player();
			this.keyManager = keyManager;
			player.keyManager = keyManager;
			this.add(new TileLevel("Appartments.json"));
			this.add(player);
			player.x = player.y = 48;
			for(var i = 0;i<1;i++)
			{
				var ball = new Ball();
				ball.y = 72;
				ball.x = 24+(i*24);
				this.add(ball);
				ball.onShowMe();
			}
			player.onShowMe();
			
			var bg = new Background();
			this.add(bg);
			bg.onShowMe();
			
			this._scene.camera.follow(player);
		},
		
		preUpdate:function(_dt)
		{
		}
	});
	
	return Level1;
});