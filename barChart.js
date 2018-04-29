//Reference for bar chart - http://bl.ocks.org/jonahwilliams/2f16643b999ada7b1909
function barChart(data){

	var margin = {top: 10, right: 180, bottom: 80, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    $("#svga").empty();


var svg = d3.select("#svga")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

	var y = d3.scaleLinear()
			.domain([0, d3.max(data, function(d){
				//debugger;
				return +d.value;
			})])
			.range([height, 0]);


			var x = d3.scaleBand()
			.domain(data.map(function(d){ return d.label;}))
			.paddingInner(0.1)
      		.paddingOuter(0.5)
			.rangeRound([0, (width+10)],.1);



	    var xAxis = d3.axisBottom()
		.scale(x);
	    

	
	    var yAxis = d3.axisLeft()
		.scale(y);
	 

	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "12px")
      	.style("text-anchor", "end")
      	.style("font-family","caudex")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-90)" );


 	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis)
    	.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", -33)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-family","caudex")
          .style("fill","black")
          .text("Answer Quality");
  
	svg.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/data.length)
		.attr("height", function(d){
			return height - y(+d.value);
		})
		.attr("x", function(d, i){
			return ((width+10)/ (data.length)) * i ;
		})
		.attr("y", function(d){
			return y(+d.value);
		})
		.append("title")
		.text(function(d){
			return d.label + " : " + d.value;
		});





}