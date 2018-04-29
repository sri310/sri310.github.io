
  $(document).ready(
  $('chartHolder').ready(bubbleChart())
  );
var filteredQuestions = [];
var call =0;
function bubbleChart(){

  var svg = d3version4.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var format = d3version4.format(",d");
  var selectTwo = [];
  var prev = null;

  var color = d3version4.scaleOrdinal(d3version4.schemeCategory20c);

  var pack = d3version4.pack()
    .size([width, height])
    .padding(1.5);



d3version4.csv("TopTags.csv", function(d) {
  d.value = +d.value;
  if (d.value) return d;
}, function(error, classes) {
  if (error) throw error;

  var root = d3version4.hierarchy({children: classes})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        if (id = d.data.id) {
          var id, i = id.lastIndexOf(".");
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.package); })
      .on("click", function(d){
        //console.log("click the node")
        var a = this.id
        var b = this
        if(selectTwo.length==1 && this==selectTwo[0]){
          document.getElementById('donut-charts').innerHTML =" Don't click the same tag twice";          
        }
        else{
        selectTwo.push(this)
        if(selectTwo.length==2){
          d3version4.select(this).style("fill","#ffff33") 
                        .style("stroke","deeppink") 
                        .style("stroke-width",5)                           
          display2(selectTwo[0].id,selectTwo[1].id, call+1)


        }
        else if (selectTwo.length ==1){
           d3version4.select(this).style("fill","#ffff33") 
                        .style("stroke","deeppink") 
                        .style("stroke-width",5) 
           document.getElementById("donut-charts").innerHTML="you have only clicked one tag, click another to compare";
        }
       
        else{
          d3version4.select(this).style("fill","#ffff33") 
                        .style("stroke","deeppink") 
                        .style("stroke-width",5) 
          d3version4.select(selectTwo[0]).style("fill",function(d){return color(d.package);})
                                        .style("stroke","#FFFFCC") 
                                        .style("stroke-width",0)  
          d3version4.select(selectTwo[1]).style("fill",function(d){return color(d.package);})
                                         .style("stroke","#FFFFCC") 
                                         .style("stroke-width",0)  
          selectTwo =[]
          selectTwo.push(b)
          d3version4.select(b).style("fill","#ffff33") 
                        .style("stroke","deeppink") 
                        .style("stroke-width",5) 
        }
      }
                     
      })
      .on("mouseover", function(d){
        if(selectTwo.length==0){
          d3version4.select(this).style("fill","yellow");
        }
        else{
        if(selectTwo.length==1){
          if(this!=selectTwo[0]){
            d3version4.select(this).style("fill","yellow");
          }
         }
         else{
          if((this!=selectTwo[0]) && (this!=selectTwo[1])){
            d3version4.select(this).style("fill","yellow");
          }
         }
      }
        d3version4.select(this).style("cursor","pointer");
      })
      .on("mouseout", function(d){
        if(selectTwo.length==0){
          d3version4.select(this).style("fill",function(d){return color(d.package);});
        }
        else{
         if(selectTwo.length==1){
          if(this!=selectTwo[0]){
            d3version4.select(this).style("fill",function(d){return color(d.package);});
          }
         }
         else{
          if((this!=selectTwo[0]) && (this!=selectTwo[1])){
            d3version4.select(this).style("fill",function(d){return color(d.package);});
          }
         }
      }
      });

  node.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.id; });

  node.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })      
    .selectAll("tspan")
    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .text(function(d) { return d ; })
      .style("fill", "black");

  node.append("title")
      .text(function(d) { return d.id + "\n" + format(d.value); });
});


}




function display2(tagName1, tagName2,call){
  
  document.getElementById('questionDisplay').innerHTML = tagName1 + "  " + tagName2;
  var dummyData = [];
  var lineData =[];
  var seriesString1 ="";
  var seriesString2 = "";
  d3version4.csv("Aggregate_data.csv", function(data){
    data.forEach(function(d){
      if(d.Tag == tagName1){
      
        var temp = {
          tag : d.Tag,
          goodQuality:  +d.Good_count,
          badQuality: +d.Bad_count,          
        }
        dummyData.push(temp);    
        seriesString1 = d.Month_ans_count; 
        //console.log("consoling inside if" + seriesString1);   
      }
      else if(d.Tag == tagName2){
        var temp = {
          tag : d.Tag,
          goodQuality:  +d.Good_count,
          badQuality: +d.Bad_count,          
        }
        dummyData.push(temp);  
        seriesString2 = d.Month_ans_count;
       // console.log(seriesString2);

      }
      else{
        //do nothing
      }
    });
    //after for each function since d3.csv is asynchronous
    
  var series1 = seriesString1.split(" ");
  var series2 = seriesString2.split(" ");
 // console.log(series1);
  for(var i=1; i<=12; i++){
    var temp = {
      date : i,
      [tagName1]: +series1[i-1],
      [tagName2]: +series2[i-1]
    }
    lineData.push(temp);
  }
 
   $.getScript('donutChart.js', function(){
      donut(dummyData,call);
    });
   $.getScript('lineChart.js', function(){
      line(lineData);
    });


  });
  

}




