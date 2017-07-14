function Level (){
  this.sprites = [];
  this.paredeCooldown = 2;
  this.anterior = null
}

Level.prototype.init = function (w,h) {
  this.width = w
  this.height = h
  this.spawnY = 0
  this.distMinima = 80
  this.distMaxima = 128
};

Level.prototype.mover = function (dt, player) {
    for (var i = this.sprites.length-1;i>=0; i--) {
        this.sprites[i].mover(dt);
    	  if(this.sprites[i].pontuar && this.sprites[i].x < player.x) {
        		player.score+=1
        		this.sprites[i].pontuar = false;
    	  }
        if(
          this.sprites[i].x >  this.width+500 ||
          this.sprites[i].x < -100 ||
          this.sprites[i].y >  3000 ||
          this.sprites[i].y < -3000
        ){
            this.sprites.splice(i, 1);
          }
    }
};


Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
};


Level.prototype.colidiuCom = function (target, resolveColisao) {
    for (var i = 0; i < this.sprites.length; i++) {
      if(this.sprites[i].colidiuCom(target)){
        resolveColisao(this.sprites[i], target);
      }
    }
};


Level.prototype.boost = function (target){
  if(target.cooldown>0) return;
  target.vy = -200
  target.cooldown = 0.5;
}

Level.prototype.spawnParedes = function(score) {
	if(this.wallcooLdown > 0) {
		this.wallcooLdown -= dt
		return
	}
	
  var mod = score/100
  if(mod > 25) mod = 25
  var modHeight = 0
  if(this.anterior != null) {
    if(Math.random() < 0.5) modHeight = this.anterior.y*0.5
    else modHeight = -this.anterior.y*0.5
  }

	var topWall = new Sprite()
	topWall.pontuar = true
	topWall.x = this.width + 30
	topWall.y = modHeight+this.height*0.35*(-1+1*Math.random())
	topWall.width = 20
	topWall.height = this.height
	topWall.vx = -75-mod

	var bottomWall = new Sprite()
	bottomWall.pontuar = false
	bottomWall.x = topWall.x
	bottomWall.y = (topWall.y + topWall.height + this.distMinima*(1+Math.random()))
	bottomWall.width = topWall.width
	bottomWall.height = topWall.height
	bottomWall.vx = topWall.vx

  this.anterior = topWall

	this.sprites.push(topWall)
	this.sprites.push(bottomWall)
  var modCd = score/50
  if(modCd > 2) modCd = 2
	this.wallcooLdown = 2

}

Level.prototype.desenharInfo = function(ctx, player, colidiu) {
	ctx.fillText("Pontos: " + player.score, 550,10);
}

