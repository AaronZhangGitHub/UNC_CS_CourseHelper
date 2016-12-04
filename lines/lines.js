window.loadSVG = function() {
  window.lineSvg = Snap("#lines-graphic");
  start();
  // Snap.load("lines/line-thing.svg", doneLoading);
}

/*
function doneLoading(data) {
	window.lineSvg.append(data);
	start();
}
*/

function start() {

/*
	// scroll handling
	var windowWidth = $(window).width();
	var pageX = 0;
	$(document).on( "mousemove", function( event ) {
	  pageX = event.pageX;
	});

	if(pageX / windowWidth > .8) {
		var leftPos = $('#lines-graphic').scrollLeft();
	    console.log(leftPos);    
	    $("#lines-graphic").animate({
	        scrollLeft: leftPos - 200
	    }, 800);
	}
*/





	var cidMapping = {1: [0], 2: [0], 3: [1], 4: [1], 5: [1], 6: [1], 7: [2, 3], 8: [2], 9: [1], 10: [4], 11: [4], 14: [5], 15: [3, 5], 17: [5], 18: [2, 5], 19: [2], 20: [6], 21: [5], 22: [5], 23: [4, 5], 24: [4], 25: [4, 5], 26: [7], 27: [7], 28: [7], 29: [3], 30: [4], 31: [3], 32: [2], 33: [2], 34: [2], 35: [7], 36: [6], 37: [4, 7], 38: [7]};
	var catidMapping = {0: [1, 2], 1: [3, 4, 5, 6, 9], 2: [7, 8, 18, 19, 32, 33, 34], 3: [7, 15, 29, 31], 4: [10, 11, 23, 24, 25, 30, 37], 5: [14, 15, 17, 18, 21, 22, 23, 25], 6: [20, 36], 7: [26, 27, 28, 35, 37, 38]};

	var categoryLines = window.lineSvg.selectAll("#Lines > path");
	// categoryLines = window.lineSvg.selectAll(".cls-3, .cls-4, .cls-5, .cls-5, .cls-6, .cls-7, .cls-8");
	var classNodes = window.lineSvg.selectAll("#Text > g");

	for(var i = 0; i < categoryLines.length; i++) {
		var line = categoryLines[i];
		line.mouseover(function(e) {
			var selectedCatId = parseInt(e.target.id.split("-")[1]);
			for(var j = 0; j < categoryLines.length; j++) {
				var currCatId = parseInt(categoryLines[j].node.id.split("-")[1]);
				if(currCatId != selectedCatId) {
					categoryLines[j].animate({opacity: .1}, 150);
				}
			}

			for(var k = 0; k < classNodes.length; k++) {
				var currCid = parseInt(classNodes[k].node.id.split("-")[1]);
				console.log(classNodes[k].node);
				if(catidMapping[selectedCatId].indexOf(currCid) == -1) {
					classNodes[k].animate({opacity: .1}, 150);
				}
			}
		});

		line.mouseout(function(e) {
			var selectedCatId = e.target.id.split("-")[1];
			for(var j = 0; j < categoryLines.length; j++) {
				var currCatId = categoryLines[j].id.split("-")[1];
				if(currCatId != selectedCatId) {
					categoryLines[j].animate({opacity: 1}, 150);
				}
			}

			for(var k = 0; k < classNodes.length; k++) {
				var currCid = classNodes[k].node.id.split("-")[1];
				if(catidMapping[parseInt(selectedCatId)].indexOf(parseInt(currCid)) == -1) {
					classNodes[k].animate({opacity: 1}, 150);
				}
			}
		});
	}
}