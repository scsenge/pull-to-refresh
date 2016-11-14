angular
	.module('app')
	.directive('pullToRefresh', pullToRefresh);

function pullToRefresh() {
	return {
		templateUrl: 'directives/progressbar.html',
		transclude: true,
		scope: {
			updateFn: '&',
			refreshingInProgress: '=?',
			barColor: '=?',
			requiredPercentage: '=?'
		},
		link: function (scope, element) {
			element.bind("touchend", onTouchEnd);
			element.bind("touchmove", onTouchMove);
			element.bind("touchstart", onTouchStart);
			element.bind("mouseup", onMouseUp);
			element.bind("mousemove ", onMouseMove);
			element.bind("mousedown ", onMouseStart);

			scope.requiredPercentage = angular.isDefined(scope.requiredPercentage) ? scope.requiredPercentage : 0.25;
			scope.barColor = angular.isDefined(scope.barColor) ? scope.barColor : "#127ba3";

			overWriteColor();


			function overWriteColor() {
				document.getElementsByClassName('slice1')[0].style.borderColor = scope.barColor;
				document.getElementsByClassName('slice2')[0].style.borderColor = scope.barColor;
				document.getElementsByClassName('cssload-speeding-wheel')[0].style.borderLeftColor = scope.barColor;
				document.getElementsByClassName('cssload-speeding-wheel')[0].style.borderRightColor = scope.barColor;
			}

			function onMouseMove(event) {
				event.preventDefault();
				if(this.mousedown) {
					var windowHeight = window.innerHeight;
					this.currentMousePosition = event.pageY;
					if(!this.reachedTheTop) {
						var allowUp = (document.getElementsByClassName('scrollablecontainer')[0].scrollTop > 1);
						var up = (event.pageY > this.slideBeginY);
						var down = (event.pageY < this.slideBeginY);
						var slideBeginY = event.pageY;
						if((!(up && allowUp)) && !down) {
							this.reachedTheTop = true;
							this.refreshStartPosition = this.currentMousePosition;
						}
					} else {
						progressBarUpdate(this.refreshStartPosition,this.currentMousePosition, windowHeight);
					}
				}
			}

			function onTouchMove(event) {
				var windowHeight =  window.innerHeight;
				this.currentMousePosition = event.changedTouches[0].clientY;
				if(!this.reachedTheTop) {
					var allowUp = (document.getElementsByClassName('scrollablecontainer')[0].scrollTop > 1);
					var up = (event.changedTouches[0].pageY > this.slideBeginY);
					var down = (event.changedTouches[0].pageY < this.slideBeginY);
					this.slideBeginY = event.changedTouches[0].pageY;
					if((up && !allowUp) && !down) {
						this.reachedTheTop = true;
						this.refreshStartPosition = this.currentMousePosition;
					}
				} else {
					progressBarUpdate(this.refreshStartPosition, this.currentMousePosition, windowHeight);
				}
			}

			function onMouseUp(e) {
				event.preventDefault();
				this.mousedown = false;
				if(this.reachedTheTop) {
					this.reachedTheTop = false;
					if(isRefreshNeeded(this.currentMousePosition, this.refreshStartPosition)) {
						progressBarToRefreshPosition();
						scope.updateFn().then(function () {
							progressBarRestore();
						});
					} else {

						progressBarRestore()
					}
				}
			}

			function onTouchEnd(e) {
				if(this.reachedTheTop) {
					this.reachedTheTop = false;
					if(isRefreshNeeded(this.currentMousePosition, this.refreshStartPosition)) {
						progressBarToRefreshPosition();
						scope.updateFn().then(function () {
							progressBarRestore();
						});
					} else {

						progressBarRestore();
					}
				}
			}

			function onMouseStart(event) {
				event.preventDefault();
				this.slideBeginY = event.pageY;
				this.mousedown = true;
			}

			function onTouchStart(event) {
				this.slideBeginY = event.changedTouches[0].pageY;
			}

			function isRefreshNeeded(currentMousePosition,refreshStartPosition) {
				var w =  window.innerHeight;
				return (currentMousePosition - refreshStartPosition) > w * scope.requiredPercentage;
			}

			function getPercentage(refreshStartPosition, currentMousePosition, w) {
				return Math.max(Math.min((currentMousePosition - refreshStartPosition) / (w * scope.requiredPercentage) * 100, 100), 0);
			}

			function rotate(element, degree) {
				element[0].style.transform = 'rotate(' + degree + 'deg)';
				element[0].style.webkitTransform = 'rotate(' + degree + 'deg)';
				element[0].style.MozTransform = 'rotate(' + degree + 'deg)';
				element[0].style.msTransform = 'rotate(' + degree + 'deg)';
				element[0].style.OTransform = 'rotate(' + degree + 'deg)';
			}

			function progressBarRestore() {
				scope.refreshingInProgress = false;
				setProgressBarPosition(0);
				setProgressBarColorAndOpacity(0);
				setProgressAngle(0);
			}

			function progressBarToRefreshPosition() {
				scope.refreshingInProgress = true;
				var refreshingPlace = -40 +  window.innerHeight * scope.requiredPercentage;
				setProgressBarPosition(refreshingPlace);
			}

			function setProgressBarPosition(pulledDown) {
				var pbelement = document.getElementsByClassName("progress-bar-container");
				//progress-bar-position
				var translation = Math.min(pulledDown,  window.innerHeight * scope.requiredPercentage) + Math.max(pulledDown -  window.innerHeight * scope.requiredPercentage, 0) * 0.1;
				pbelement[0].style.transform = 'translate(0px,' + translation + 'px)';
				pbelement[0].style.webkitTransform = 'translate(0px,' + translation + 'px)';
				pbelement[0].style.MozTransform = 'translate(0px,' + translation + 'px)';
				pbelement[0].style.msTransform = 'translate(0px,' + translation + 'px)';
				pbelement[0].style.OTransform = 'translate(0px,' + translation + 'px)';
			}

			function setProgressBarColorAndOpacity(percentage) {
				//progress-bar-icon opacity and color
				document.getElementsByClassName("reloadicon")[0].style.opacity = percentage / 100;
				if(percentage / 100 >= 1) {
					console.log('itt');
					document.getElementsByClassName("reloadicon")[0].style.color = scope.barColor;
				} else {
					document.getElementsByClassName("reloadicon")[0].style.color = "#333";
				}
			}

			function setProgressAngle(percentage) {
				// caluclate the angle
				var drawAngle = percentage / 100 * 360;
				// calculate the angle to be displayed if each half
				if(drawAngle <= 180) {
					firstHalfAngle = drawAngle;
					secondHalfAngle = 0;
				} else {
					firstHalfAngle = 180;
					secondHalfAngle = drawAngle - 180;
				}
				//loading bar percentage angle
				rotate(document.getElementsByClassName("slice1"), firstHalfAngle);
				rotate(document.getElementsByClassName("slice2"), secondHalfAngle);
			}

			function progressBarUpdate(refreshStartPosition, currentMousePosition, w) {
				console.log(refreshStartPosition);
				var pulledDown = currentMousePosition - refreshStartPosition;
				var percentage = getPercentage(refreshStartPosition, currentMousePosition, w);
				// set the transitions:
				setProgressBarPosition(pulledDown);
				setProgressBarColorAndOpacity(percentage);
				setProgressAngle(percentage);

			}
		}
	}
};