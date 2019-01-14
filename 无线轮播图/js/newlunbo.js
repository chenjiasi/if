var lunbotu = (function() {
	//	var timer = null
	return {
		init: function(ele) {
			if(typeof ele == 'string') {
				ele = document.querySelector(ele);
			}
			this.ele = ele
			this.$tipBox = ele.querySelector('.banner-tip'); //获取小圆圈
			this.$tipLiAll = this.$tipBox.children; //获取圆圈的子集
			this.$preBtn = ele.querySelector('.left-btn'); // 左边小盒子
			this.$nextBtn = ele.querySelector('.right-btn'); //右边小盒子
			this.$bannerBox = ele.querySelector('.banner-image'); //大盒子图片ul
			this.$bannerLiAll = this.$bannerBox.children; //大盒子图片合集
			var first = this.$bannerLiAll[0]; //第一张图片
			var last = this.$bannerBox.lastElementChild; //最后一张图片
			this.$bannerBox.appendChild(first.cloneNode(true)); //克隆节点
			this.$bannerBox.insertBefore(last.cloneNode(true), first); //克隆节点
			this.$bannerBox.style.left = '-600px'; //图片的初始位置
			for(var i = 0; i < this.$tipLiAll.length; i++) {
				this.$tipLiAll[i].index = i
			}
			//把index 变成全局的INDEX ，方便下面点击事件的调用
			this.index = 0;
			//调用函数
			this.event();//调用event里面所有方法
			this.autoPlay();//调用自动播放
		},
		//方法
		event: function() {
			var _this = this 
			_this.ele.onmouseenter = function() {
				clearInterval(_this.timer);//进入图片后清除定时器
				_this.$preBtn.style.display = 'block';
				_this.$nextBtn.style.display = 'block';
				_this.$showImage;//调用函数，运动功能
			}
			_this.ele.onmouseleave = function() {
				_this.$preBtn.style.display = 'none'
				_this.$nextBtn.style.display = 'none'
				_this.autoPlay(_this.index)
			}
			_this.$preBtn.onclick = function() {
				_this.showImage(--_this.index);
			}
			_this.$nextBtn.onclick = function() {
				_this.showImage(++_this.index);
			}
			_this.$tipBox.onclick = function(e) {
				var e = e || window.event
				var target = e.target || e.srcElement;
				if(target.nodeName == 'LI') {
					_this.showImage(target.index)
				}
			}
		},
		//展示图片，核心
		showImage: function(index) {
			var _this = this
			var maxIndex = _this.$tipLiAll.length - 1;//设定最大值，以便循环
			if(index > maxIndex) {
				index = 0; //到达最大的时候返回第一张克隆，欺骗手法
				this.$bannerBox.style.left = 0;
			} else if(index < 0) {
				index = maxIndex;//到达第一张的时候返回最后一张克隆，欺骗手法
				this.$bannerBox.style.left = (-600 * (maxIndex + 2)) + 'px';
			}
			for(var i = 0; i < this.$tipLiAll.length; i++) {
				this.$tipLiAll[i].removeAttribute('class');//清除所有摁扭样式
			}
			this.index = index;//把传入的index 赋值给全局，用来改变摁扭的样式
			this.$tipLiAll[this.index].className = 'active';//改变摁扭的样式
			//写运动
			function move(ele, attr, mubiao) {
				if (typeof ele == 'string') {
       			 ele = document.querySelector(ele);
    		}
				clearInterval(ele.timer)//清除之前运动的定时器，防止连续点击的时候出现BUG
				var init = parseFloat(getStyle(ele, attr));
				ele.timer = setInterval(function(){
					var speed = (mubiao - init) / 20;//缓冲运动的速度在定时器里面计算
					if(speed > 0) {
						speed = Math.ceil(speed);//向上取值让缓冲运动可以运动到目标点
					} else {
						speed = Math.floor(speed);
					}
					init += speed //距离累加造成运动
					if((speed >= 0 && init > mubiao) || (speed <= 0 && init < mubiao)) {
						init = mubiao;//速度过快的时候有时候会超出目标。等于正好
//						clearInterval(ele.timer);//到达的时候清除定时器
					}
					ele.style[attr] = init + 'px';//让物体运动
				}, 10)
				//获取输入的元素的非行内样式
				function getStyle(ele, attr) {
					if(window.getComputedStyle) {
						return window.getComputedStyle(ele, null)[attr];
					}
					return ele.currentStyle[attr];
				}
			}
			//调用运动，输入数值，index+1是因为索引可能为0
			move(_this.$bannerBox, 'left', (-600 * (index + 1)))
		},
		autoPlay(index) {
			index = index || 0;
			this.timer = setInterval(() => {
				index++;
				if(index >this.$tipLiAll.length -1 ) {
					index = 0;
					this.$bannerBox.style.left = 0;//欺骗手法。
				}
				this.showImage(index);//自动播放调用运动
			}, 2000)
		}
	}
}())