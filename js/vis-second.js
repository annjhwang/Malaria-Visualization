// SVG dimensions

var width = 1000 - margin.left - margin.right, 
    height = 500 - margin.top - margin.bottom;
var margin = {top: 40, right: 150, bottom: 60, left: 260};

var svg = d3.select("#tree").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0;

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var tree = d3.layout.tree()
    .size([height, width]);

// Initialize data
loadData();
var data;
// Load CSV file
function loadData() {
	d3.json("data/malaria-parasites.json", function(error, json) {
    // when error 
    if (error) return console.warn(error);
    data = json;

    source = data[0];
    updateVisualization(source);
    function updateVisualization(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(source).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Declare the nodes
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes
        var treeNodes = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

        treeNodes.append("circle")
            .attr("r", 8)
            .style("fill", "#fff");

        treeNodes.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13; })
            .attr("dy", ".38em")
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1);

        // Declare the links¦
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; })
            .enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", diagonal);

    }

});
}


