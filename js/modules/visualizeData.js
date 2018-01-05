/**
	@author: Amol Kapoor
	@date: 5-24-16

	Description: d3 module. Handles incoming email data and a div, and creates a visual display.
*/

/**
	Helper for ordering nodes on hover
*/
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

/**
	Converts a degree angle to radians

	@param: angle; int; num from 0 to 360
	@param: int representing radian conversion
*/
function toRadians (angle) {
  return angle * (Math.PI / 180);
}

/**
	Outputs a series of foci evenly spaced on a circle.

	@param: num; int; the number of foci
	@param: width; int; the width of the coordinate plane being mapped to
	@param: height; int; the height of the coordinate plane being mapped to
	@return: [{x,y}], a list of x/y points
*/
function identifyFoci(num, width, height) {
	var center = {
		x: width/2,
		y: height/2
	}

	var radius = Math.min(width, height)/3;

	var foci = [];
	var theta = 0;
	var dtheta = 360/num;

	for(var i = 0; i < num; i++, theta+=dtheta) {
		foci.push({
			x: Math.cos(toRadians(theta))*radius + center.x,
			y: Math.sin(toRadians(theta))*radius + center.y
		})
	}

	return foci;
}

/**
	Visualizes the data.

	TODO: display category names, figure out how to handle emails without categories
	and put emails that fall into multiple categories in middle space with color wheel mix

	@param: emails; [Email]; emails to map out
	@param: categories; [Category]; categories to sort emails
	@param: DOMelement; html/jquery/d3 identifier (where to draw the graph)
*/
function visualizeData(emails, categories, DOMelement) {

	//Set up for the visualization
	var width = Math.floor($(DOMelement).width());
	var height = Math.floor($(DOMelement).height());
	var nodeSize = 8;
	var nodeExpandedSize = 30;

	var foci = identifyFoci(categories.length + 1, width, height);

	var fill = d3.scale.category10();

	for(var index in foci) {
		foci[index].category = categories[index];
		foci[index].colorMapping = index;
		fill(index);
	}

	var nodes = emails.slice();

	for(var i = 0; i < nodes.length; i++) {
		var email = nodes[i];

		for(var j in foci) {
			if(foci[j].category && foci[j].category.match(email)) {
				email.focus = foci[j];
				email.focusId = foci[j].category.id;
			}
		}

		if(!email.focus) {
			email.focus = foci[j];
			email.focusId = "other";
		}
	}

	var svg = d3.select(DOMelement).append("svg")
	    .attr("width", width)
	    .attr("height", height);

	d3.nest()
		.key(function(d) { return d.focusId; })
		.entries(nodes)
		.forEach(force);

	function force(entry, i) {

		var nodes = entry.values;

		var force = d3.layout.force()
			.nodes(nodes)
			.gravity(.2)
			.charge(-100)
			.on("tick", tick)
			.start();

		var circle = svg.append("g")
			.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("transform", function(d) {
				return "translate(" + d.focus.x + "," + d.focus.y + ")"
			})
			.attr("r", function(d) { 
				d.size = d.unread ? nodeSize + 6 : nodeSize;
				return d.size; 
			})
			.style("fill", function(d) { return fill(d.focus.colorMapping); })
			.style("stroke", function(d) { return d3.rgb(fill(d.focus.colorMapping)).darker(2); })
			.call(force.drag)
			.on("mouseover", function(d) {
				d3.select(this).moveToFront();
				d3.select(this).transition().attr("r", function(d) { return nodeExpandedSize});
			})
			.on("mouseout", function(d) {
				d3.select(this).transition().attr("r", function(d) { return d.size});
			});

		function tick(e) {
			circle
	        //.each(collide(.5))
	        	.attr("cx", function(d) { return d.x; })
	        	.attr("cy", function(d) { return d.y; });
   		}
	}
}


