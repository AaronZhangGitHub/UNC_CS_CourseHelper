var s = Snap("#lines-graphic");
Snap.load("line-thing.svg", doneLoading);

function doneLoading(data) {
	s.append(data);
	start();
}

function start() {
	var cidMapping = {1: [0], 2: [0], 3: [1], 4: [1], 5: [1], 6: [1], 7: [2, 3], 8: [2], 9: [1], 10: [4], 11: [4], 14: [5], 15: [3, 5], 17: [5], 18: [2, 5], 19: [2], 20: [6], 21: [5], 22: [5], 23: [4, 5], 24: [4], 25: [4, 5], 26: [7], 27: [7], 28: [7], 29: [3], 30: [4], 31: [3], 32: [2], 33: [2], 34: [2], 35: [7], 36: [6], 37: [4, 7], 38: [7]};
	var catidMapping = {0: [1, 2], 1: [3, 4, 5, 6, 9], 2: [7, 8, 18, 19, 32, 33, 34], 3: [7, 15, 29, 31], 4: [10, 11, 23, 24, 25, 30, 37], 5: [14, 15, 17, 18, 21, 22, 23, 25], 6: [20, 36], 7: [26, 27, 28, 35, 37, 38]};

	var categoryLines = s.selectAll("#Lines g");
	var classNodes = s.selectAll("#Text g");

	for(var i = 0; i < categoryLines.length; i++) {
		var line = categoryLines[i];
		line.hover(function(e) {
			var line = s.select("#" + e.target.parentNode.id);
			console.log(e);
			line.attr({opacity: .1});
		});

		line.unhover(function(e) {
			var line = s.select("#" + e.target.parentNode.id);
			line.attr({opacity: 1});
		});
	}
}