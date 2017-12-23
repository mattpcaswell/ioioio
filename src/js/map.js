class Map{
	constructor(tileMap){	//mapData is a two demensional array of tile values
		super();
		this.tileWidth = tileMap.tileWidth;
		this.tileHeight = tileMap.tileHeight;

		this.width = tileMap.width / tileWidth;
		this.height = tileMap.height / tileHeight;

		this.collisionGrid = [][];
		for(int x = 0; x < width; x ++){
			for(int y = 0; y < height; y ++){
				let item = tileMap.layers.collision.children.find(tile => {
					tile._x == x && tile._y == y;
				})
				if(item){
					collisionGrid[x][y] = true;
				}else{
					collisionGrid[x][y] = false;
				}
			}
		}
	}

	checkPoint(x, y){
		return collisionGrid[x / tileWidth][y / tileHeight];
	}
}