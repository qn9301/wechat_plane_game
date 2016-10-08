/**
 * design by Mr Zheng
 */
(function(){
	// 外框框
	var box = document.getElementById("main-box");
	var box_W = box.clientWidth
	var box_H = box.clientHeight
	var state = 1;
	var score = 0;
	// 飞机的类
	var plane = function(){
		this.stop = 0;
		this.state = 1;
		this.plane;
		this.timmer;
		this.x;
		this.y;
		this.width;
		this.height;
		this.score;
		this.blood;
		// 改变坐标的方法
		this._init = function(){
			this.createPlane();
			this.setPos();
		}
		// 被摧毁
		this.beDistoryed = function(){
			this.plane.src = this.plane.getAttribute("boom");
			this.stop = 1;
			score+=this.score;
			document.getElementById("score").innerHTML=score;
			var _this = this
			setTimeout(function(){
				_this.removeIt();
				_this.state = 0;
			},800)
		}
		// 飞机出界后销毁的方法
		this.removeIt = function(){
			this.plane.parentNode.removeChild(this.plane);
		}
		// 被攻击
		this.beAttacked = function(){
			var oldPic = this.plane.src
			var _this = this.plane;
			this.plane.src = this.plane.getAttribute("attacked");
			clearTimeout(this.timmer);
			this.timmer = setTimeout(function(){
				_this.src = oldPic;
			},300)
		}
		this.setPos = function(){
			this.plane.style.top = -this.height + "px";
			this.plane.style.left = (box_W-this.width)*Math.random() + "px"
		}
		// 飞机移动的方法
		this.move=function(user){
			if(!this.stop){
				this.plane.style.top = parseInt(this.plane.style.top) + this.speed + "px"
				if(this.checkUserPlane(user)){
					user.die();
				}
			}
		}
		// 判断是否出界
		this.checkOut = function(){
			if(parseInt(this.plane.style.top)>box.clientHeight){
				return true;
			}else{
				return false;
			}
		}
		// 检测是否与用户飞机相撞
		this.checkUserPlane = function(user){
			var u_T = parseInt(user.plane.style.top)
			var u_L = parseInt(user.plane.style.left)
			var u_W = parseInt(user.width)
			var u_H = parseInt(user.height)
			var p_T = parseInt(this.plane.style.top)
			var p_L = parseInt(this.plane.style.left)
			var p_W = parseInt(this.width)
			var p_H = parseInt(this.height)
			if(u_T+u_H>p_T && u_T<p_T+p_H && u_L+u_W>p_L && u_L < p_L+p_W){
				return true;
			}
			return false;
		}
	}
	// 用户飞机的类
	var userPlane = function(){
		this.createPlane=function(){
			this.plane = document.createElement("img");
			this.plane.src="./image/我的飞机.gif";
			this.plane.setAttribute("attacked","");
			this.plane.setAttribute("boom","./image/本方飞机爆炸.gif");
			this.blood = 1;
			this.width = 66;this.height=80;
			box.appendChild(this.plane);
		}
		this.setPos = function(){
			this.plane.style.top = box_H-this.height + "px"
			this.plane.style.left = (box_W-this.width)/2 + "px"
		}
		this.moveTo = function(x,y){
			if(x>this.width/2 && x<box.clientWidth-this.width/2){
				this.plane.style.left = x-this.width/2 + "px"
			}
			if(y>this.height/2 && y<box.clientHeight-this.height/2){
				this.plane.style.top = y-this.height/2 + "px"
			}
		}
		this.die = function(){
			state = 0;
			this.beDistoryed();
			box.onmousemove = null;
		}
		this.beDistoryed = function(){
			this.plane.src = this.plane.getAttribute("boom");
			document.getElementById("score2").innerHTML = score;
			document.getElementById("board").style.display="block";
		}
		this._init();
	}
	// 敌机1的类
	var dj1 = function(){
		this.score = 10;
		this.speed = 5+Math.floor(3*Math.random());
		this.createPlane=function(){
			this.plane = document.createElement("img");
			this.plane.src="./image/enemy1_fly_1.png";
			this.plane.setAttribute("attacked","");
			this.plane.setAttribute("boom","./image/小飞机爆炸.gif");
			this.blood = 1;
			this.width = 34;this.height=24;
			box.appendChild(this.plane);
		}
		this._init();
	}
	//敌机2的类
	var dj2 = function(){
		this.score = 30;
		this.speed = 3+Math.floor(3*Math.random());
		this.createPlane=function(){
			this.plane = document.createElement("img");
			this.plane.src="./image/enemy3_fly_1.png";
			this.plane.setAttribute("attacked","./image/中飞机挨打.png");
			this.plane.setAttribute("boom","./image/中飞机爆炸.gif");
			this.blood = 8;
			this.width = 46;this.height=60;
			box.appendChild(this.plane);
		}
		this._init();
	}
	//敌机3的类
	var dj3 = function(){
		this.score = 100;
		this.speed = 1+Math.floor(3*Math.random());
		this.createPlane=function(){
			this.plane = document.createElement("img");
			this.plane.src="./image/enemy2_fly_1.png";
			this.plane.setAttribute("attacked","./image/大飞机挨打.png");
			this.plane.setAttribute("boom","./image/大飞机爆炸.gif");
			this.blood = 20;
			this.width = 110;this.height=164;
			box.appendChild(this.plane);
		}
		this._init();
	}

	// 继承
	userPlane.prototype =new plane();
	dj1.prototype =new plane();
	dj2.prototype =new plane();
	dj3.prototype =new plane();

	// 飞机的类
	// 子弹的类
	var zidan = function(plane){
		this.state = 1;
		this.zidan;
		this.width=6;
		this.height=14;
		this.x;
		this.y;
		this.speed = 40;
		// 子弹的构造方法
		this._init = function(){
			this.create();
			this.setPos();
		}
		// 子弹创建的方法
		this.create = function(){
			this.zidan = document.createElement("img");
			this.zidan.src="./image/bullet1.png";
		}
		// 给子弹定位的方法
		this.setPos = function(){
			this.zidan.style.left = parseInt(plane.plane.style.left)+plane.width/2-this.width/2 +"px";
			this.zidan.style.top = parseInt(plane.plane.style.top)-this.height + "px";
			box.appendChild(this.zidan)
		}
		// 子弹飞行的方法
		this.move = function(){
			this.zidan.style.top = parseInt(this.zidan.style.top)-this.speed + "px";
			this.checkDj();
		}
		// 子弹检测出界的方法
		this.checkOut = function(){
			if(parseInt(this.zidan.style.top)<box.offsetTop-this.height){
				return true
			}else{
				return false
			}
		}
		// 子弹消失的方法
		this.removeIt = function(){
			this.zidan.parentNode.removeChild(this.zidan);
		}
		// 检测是否装机到敌机的方法
		this.checkDj = function(){
			if(!this.state)return
			var djL,djT,djW,djH;
			for(var i in djArr){
				djL = parseInt(djArr[i].plane.style.left);
				djT = parseInt(djArr[i].plane.style.top);
				djW = parseInt(djArr[i].width);
				djH = parseInt(djArr[i].height);
				if(parseInt(this.zidan.style.left)>djL && 
				   parseInt(this.zidan.style.left)<djL+djW-this.width &&
				   parseInt(this.zidan.style.top)>djT &&
				   parseInt(this.zidan.style.top)<djT+djH){
					if(djArr[i].blood<=1){
						if(!djArr[i].stop){
							djArr[i].beDistoryed();
							this.removeIt()
							this.state = 0;
							break;
						}
					}else{
						djArr[i].blood--;
						djArr[i].beAttacked();
						this.removeIt()
						this.state = 0;
						break;
					}
				}
			}
		}
		this._init();
	}

	var zidanArr = []
	var djArr = []


	
	/* 帧数50帧 */
	function start(){
		box.style.backgroundImage = "url(./image/background_1.png)"
		var user = new userPlane();
		// 用户飞机移动的方法
		box.onmousemove = function(e){
			e = e||window.event;
			var x = e.clientX-this.offsetLeft;
			var y = e.clientY-this.offsetTop;
			document.title = e.clientX +":"+e.clientY
			user.moveTo(x,y)
		}
		var x = 0;
		var y = 0;

		var startTimmer = setInterval(function(){
			if(!state){clearInterval(startTimmer);return false;}
			x++;
			box.style.backgroundPosition = "0 "+x+"px";
			for(var i in zidanArr){
				if(zidanArr[i]){
					if(!zidanArr[i].state){
						zidanArr[i]=null;
						zidanArr.splice(i,1);
						continue;
					}
					zidanArr[i].move();
					if(zidanArr[i].checkOut()){
						zidanArr[i].removeIt();
						zidanArr[i]=null;
						zidanArr.splice(i,1);
					}
				}
			}
			for(var j in djArr){
				if(djArr[j]){
					if(!djArr[j].state){
						djArr[j]=null;
						djArr.splice(j,1);
						continue;
					}
					djArr[j].move(user);
					if(djArr[j].checkOut()){
						djArr[j].removeIt();
						djArr[j]=null
						djArr.splice(j,1)
					}
				}
			}
			// 创建子弹
			if(x%5==0){
				zidanArr.push(new zidan(user))
			}
			if(x%25==0){
				y++;
				djArr.push(new dj1())
				if(y%5==0 && y>25){
					djArr.push(new dj2())
				}
				if(y%40==0 && y>50){
					djArr.push(new dj3())
				}
			}
		},20)
	}
	document.getElementById("replay").onclick = function(){
		window.location.reload();
	}
	document.getElementById("start").onclick = function(){
		this.style.display = "none";
		document.getElementById("score-box").style.display="block";
		start();
	}
}())