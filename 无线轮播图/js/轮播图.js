var lunbotu = (function() {
	var timer = null;
	return {
		init:function(ele) {
			if(typeof ele == 'string') {
				ele = document.querySelector(ele);
			}
			this.$ele = ele;
			this.$tipBox = ele.querySelector('.banner-tip');
			this.$tipLiAll = this.$tipBox.children;
			this.$preBtn = ele.querySelector('.left-btn');
			this.$nextBtn = ele.querySelector('.right-btn');
			this.$bannerBox = ele.querySelector('.banner-image');
			this.$bannerLiAll = this.$bannerBox.children;
			var first = this.$bannerLiAll[0];
			var last = this.$bannerBox.lastElementChild;
			this.$bannerBox.appendChild(first.cloneNode(true));
			this.$bannerBox.insertBefore(last.cloneNode(true), first);
			this.$bannerBox.style.left = '-600px';
			for(var i = 0; i < this.$tipLiAll.length; i++) {
				this.$tipLiAll[i].index = i;
			}
			this.index = 0;
			this.event();
			this.autoPlay(this.index);
		},
		event: function() {
			var _this = this;
			this.$tipBox.onclick = function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;
				if(target.nodeName == 'LI') {
					_this.showImage(target.index);
				}
			};
			this.$preBtn.onclick = function() {
				_this.showImage(--_this.index);
			}
			this.$nextBtn.onclick = function() {
				_this.showImage(++_this.index);
			}

		},
		showImage: function(index) {
			var maxIndex = this.$tipLiAll.length - 1;
			var _this = this
			if(index > maxIndex) {
				index = 0;
				this.$bannerBox.style.left = 0;
			} else if(index < 0) {
				index = maxIndex;
				this.$bannerBox.style.left = -600 * (maxIndex + 2) + 'px';
			}
			this.index = index;
			for(var i = 0; i < this.$tipLiAll.length; i++) {
				this.$tipLiAll[i].removeAttribute('class');
			}
			this.$tipLiAll[index].className = 'active';//给对应的小圆点加样式
			//时间
			function move(ele, attr, target) {
				if(typeof ele == 'string') {
					ele = document.querySelector(ele);
				}
				clearInterval(ele.timer);
				var init = parseFloat(getStyle(ele, attr));
				ele.timer = setInterval(function() {
					var speed = (target - init) / 10;
					if(speed > 0) {
						speed = Math.ceil(speed);
					} else {
						speed = Math.floor(speed);
					}
					init += speed
					if((speed >= 0 && init >= target) || (speed <= 0 && init <= target)) {
						init = target;
						clearInterval(ele.timer);
					}
					//      if (attr == 'opacity') {
					//          ele.style[attr] = init / 100;
					//      } else {
						console.log(attr)
					ele.style[attr] = init + 'px';
					//      }
				}, 10);
				_this.$bannerBox.onmouseover = function(){
					clearInterval(timer);
					_this.$preBtn.style.display = 'block';
					_this.$nextBtn.style.display = 'block'
				}
				function getStyle(ele, attr) {
					if(window.getComputedStyle) {
						return window.getComputedStyle(ele, null)[attr];
					}
					return ele.currentStyle[attr];
				}
			}
			move(this.$bannerBox, 'left', -600 * (index + 1));
		},
		autoPlay(index) {
			clearInterval(timer);
			index = index || 0;
			timer = setInterval(() => {
				index++;
				if(index > 4) {
					index = 0;
				}
				this.showImage(index);
			}, 2000)
		}
	}
}())