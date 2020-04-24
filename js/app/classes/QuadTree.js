/**
 * ...
 * @author Ben
 */

define(['Class'],function(Class){
	
	var QuadTree = Class.extend({
		init:function(_maxSize, _maxDepth, _bounds){
			this.m_maxObjectCount = _maxSize;
			this.m_storedObjects = [];
			this.m_bounds = _bounds;
			this.cells = [];
			this._maxDepth = _maxDepth;
			this.depth = 1;
			this.returnCollide = false;
			this.obHit = null;
			this.refOb = null;
		}
	});
	
	QuadTree.prototype.overlap = function(group1, group2, runUntillFalse)
	{
		if(group1.length ==0)return;
		if(runUntillFalse == undefined) runUntillFalse = false;
		if (group2 == null) group2 = group1;
		for (var i = group2.length - 1; i >= 0; i--)
		{
			this.insert(group2[i]);
		}
		for (var j = group1.length - 1; j >= 0; j--)
		{
			this.returnCollide = this.retrieveObjectsInCollision(group1[j]);
			var counter = 0;
			while(runUntillFalse == true && this.returnCollide == true && counter <2)
			{
				this.returnCollide = this.retrieveObjectsInCollision(group1[j]);
				counter++;
			}
			this.returnCollide = false;
		}
		this.clear();
	}

	QuadTree.prototype.insert = function(objectToInsert){
		var iCell = null;
		if (this.cells[0] != null){
			iCell = this.getCellsToInsertObject(objectToInsert);
			//console.log(iCell);
			if (!(iCell & 0x0000)){
				if (iCell & 0x1000)this.cells[0].insert(objectToInsert);
				if (iCell & 0x0100)this.cells[1].insert(objectToInsert);
				if (iCell & 0x0010)this.cells[2].insert(objectToInsert);
				if (iCell & 0x0001)this.cells[3].insert(objectToInsert);
				return;
			}
			
		}

		this.m_storedObjects.push(objectToInsert);
		

		if(this.m_storedObjects.length > this.m_maxObjectCount && this.cells[0] == null && this.depth < this._maxDepth){
			if(this.cells[0] == null && this.depth <= this._maxDepth){
				subWidth = (this.m_bounds.width / 2);
				subHeight = (this.m_bounds.height /2);
				x = this.m_bounds.x;
				y = this.m_bounds.y;

				this.cells[0] = new QuadTree(this.m_maxObjectCount, this._maxDepth, {x:(x+subWidth),y:y,width:subWidth,height:subHeight});
				this.cells[1] = new QuadTree(this.m_maxObjectCount, this._maxDepth, {x:x,y:y,width:subWidth,height:subHeight});
				this.cells[2] = new QuadTree(this.m_maxObjectCount, this._maxDepth, {x:x,y:(y+subHeight),width:subWidth,height:subHeight});
				this.cells[3] = new QuadTree(this.m_maxObjectCount, this._maxDepth, {x:(x+subWidth),y:(y+subHeight),width:subWidth,height:subHeight});
				this.cells[0].depth = this.cells[1].depth = this.cells[2].depth = this.cells[3].depth = this.depth++;
			}
			var i = this.m_storedObjects.length - 1;
			while(i>=0){
				var tempHB = this.m_storedObjects[i];
				iCell = this.getCellsToInsertObject(tempHB);
				if (!(iCell & 0x0000)){
					if (iCell & 0x1000)this.cells[0].insert(this.m_storedObjects[i]);
					if (iCell & 0x0100)this.cells[1].insert(this.m_storedObjects[i]);
					if (iCell & 0x0010)this.cells[2].insert(this.m_storedObjects[i]);
					if (iCell & 0x0001)this.cells[3].insert(this.m_storedObjects[i]);
					this.m_storedObjects.splice(i, 1);
				}					
				i--;
			}
		}
	}

	QuadTree.prototype.remove = function(objectToRemove){
		if(this.rectOverlap(this.m_bounds, {x:objectToRemove.parent.x + objectToRemove.x,
											y:objectToRemove.parent.y + objectToRemove.y,
											width:objectToRemove.width,
											height:objectToRemove.height})){
			for (var l = this.m_storedObjects.length - 1; l >= 0; l--)
			{
				if (this.m_storedObjects[l] == objectToRemove)
				{
					this.m_storedObjects.splice(l, 1);
					break;
				}
			}
			if(this.cells[0] != null){
				for(var i=0; i<4;i++){
					this.cells[i].remove(objectToRemove);
				}
			}
		}
	}

	QuadTree.prototype.retrieveObjectsInArea = function(area){
		if (this.rectOverlap(this.m_bounds, {x:area.parent.x + area.x,
											y:area.parent.y + area.y,
											width:area.width,
											height:area.height})) {
			var returnedObjects = [];
			for (var i = this.m_storedObjects.length -1; i >= 0; i--) {
				returnedObjects.push(this.m_storedObjects[i]);
			}
			if (this.cells [0] != null) {
				for (var j = 0; j < 4; j++) {
					var cellObjects = this.cells[j].retrieveObjectsInArea(area);
					if (cellObjects != null) {
						returnedObjects = returnedObjects.concat(cellObjects);
					}
				}
			}
			return returnedObjects;
		}
		return null;
	}
	
	QuadTree.prototype.retrieveObjectsInCollision = function(area){
		
		var isCollide = false;
		var broadRect = this.broadPhaseRect(area);
		if (this.rectOverlap(this.m_bounds, broadRect)) {
		
			for (var i = this.m_storedObjects.length -1; i >= 0; i--) {
				if (area.parent != this.m_storedObjects[i].parent && this.rectOverlap(broadRect,this.broadPhaseRect(this.m_storedObjects[i])))
				{
					this.m_storedObjects[i].collisionResolution(area);
					area.collisionResolution(this.m_storedObjects[i]);
					isCollide = true;
				}					
			}
			if (this.cells [0] != null) {
				for (var j = 0; j < 4; j++) {
					var subTrue = this.cells[j].retrieveObjectsInCollision(area);
					if(subTrue == true) isCollide = true;
				}
			}
		}
		//console.log(isCollide);
		return isCollide;
	}
	
	QuadTree.prototype.broadPhaseRect = function(ob)
	{
		var rect =  {x:ob.parent.x + ob.x,
					y:ob.parent.y + ob.y,
					width:ob.width,
					height:ob.height};
		var xDif = ob.parent.x - ob.parent.last.x;
		var yDif = ob.parent.y - ob.parent.last.y;
		if(xDif > 0)
		{
			rect.x -= xDif;
			rect.width += xDif;
		}else
		{
			rect.width -= xDif;
		}
		if(yDif > 0)
		{
			rect.y -= yDif;
			rect.height += yDif;
		}else
		{
			rect.height -= yDif;
		}
		//console.log(rect);
		return rect;
	}

	QuadTree.prototype.clear = function(){
		this.m_storedObjects = [];

		for (var i = 0; i < this.cells.length; i++) {
			if (this.cells[i] != null) {
				this.cells[i].clear();
				this.cells[i] = null;
			}
		}
	}

	QuadTree.prototype.containsLocation = function(location){
		return this.valueInRange(location.x,this.m_bounds.x,(this.m_bounds.x+this.m_bounds.width)) && this.valueInRange(location.y,this.m_bounds.y,(this.m_bounds.y+this.m_bounds.height));
	}
	
	QuadTree.prototype.containsArea = function(location){
		return this.rectOverlap(this.m_bounds, {x:location.parent.x + location.x,
											y:location.parent.y + location.y,
											width:location.width,
											height:location.height});
		//return rectContains(m_bounds,location);
	}

	QuadTree.prototype.getCellToInsertObject = function(location){
		var temp = 0x0000;
		for (var i = 0; i < 4; i++) {
			if (this.cells[i].rectOverlap(this.cells[i].m_bounds, {x:location.parent.x + location.x,
											y:location.parent.y + location.y,
											width:location.width,
											height:location.height})) {
				switch(i){
					case 0:
						temp |= 0x1000;
						break;
					case 1:
						temp |= 0x0100;
						break;
					case 2:
						temp |= 0x0010;
						break;
					case 3:
						temp |= 0x0001;
						break;
				}
			}
		}
		return temp;
	}
	
	QuadTree.prototype.getCellsToInsertObject = function(location){
		var temp = 0x0000;
		for (var i = 0; i < 4; i++) {
			if (this.cells[i].rectOverlap(this.cells[i].m_bounds, {x:location.parent.x + location.x,
											y:location.parent.y + location.y,
											width:location.width,
											height:location.height})) {
				switch(i){
					case 0:
						temp |= 0x1000;
						break;
					case 1:
						temp |= 0x0100;
						break;
					case 2:
						temp |= 0x0010;
						break;
					case 3:
						temp |= 0x0001;
						break;
				}
				
			}
		}
		return temp;
	}

	QuadTree.prototype.valueInRange = function(value, min, max){
		return (value >= min) && (value <= max);
	}

	QuadTree.prototype.rectOverlap = function(a, b){
		return (a.x + a.width > b.x) && (b.x+b.width > a.x) && (a.y + a.height > b.y) && (b.y+b.height > a.y);
	}
	
	QuadTree.prototype.rectContains = function(A, B){
		return((B.left >= A.left) && (A.right >= B.right) && (A.bottom >= B.bottom) && (B.top >= A.top));
	}
	return QuadTree;
});