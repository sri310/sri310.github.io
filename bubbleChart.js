//Reference for bubble chart - https://bl.ocks.org/mbostock/4063269
  $(document).ready(
  $('chartHolder').ready(bubbleChart())
  );
var filteredQuestions = [];
function bubbleChart(){
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var format = d3.format(",d");
  var selectTwo = [];
  var prev = null;

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

  d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
}


d3.csv("TopTags.csv", function(d) {
  d.value = +d.value;
  if (d.value) return d;
}, function(error, classes) {
  if (error) throw error;

  var root = d3.hierarchy({children: classes})
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
      .style("hover","black")
      .on("click", function(d){      
        var a = this.id
        var b = this
        
        if(prev!=null){          
          d3.select(prev).style("fill",function(d){return color(d.package);})  
                         .style("stroke","#FFFFCC") 
                        .style("stroke-width",0)                       
                        
          prev = b
        }
        else{
          prev = b
        }
        console.log(a)
        filteredQuestions =[]
        display(a)        
        d3.select(this).style("fill","#ffff33") 
                        .style("stroke","deeppink") 
                        .style("stroke-width",5) 

                        

                     
      })
      .on("mouseover", function(d){
        d3.select(this).style("cursor","pointer");
        if(this!=prev){
       d3.select(this).style("fill","#ffff00");
     }


      })

      .on("mouseout", function(d){
        if(this!=prev){
           d3.select(this).style("fill", function(d){ return color(d.package);})
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

 $('.arrowClass').hover(function(){
  console.log("arrowMove");
  $(this).css("cursor","pointer");
 });

function display(tagName){
  document.getElementById('questionDisplay').innerHTML = "<b>You have selected: "+tagName.toUpperCase()+"</b>";
  d3.csv("Final_data_classify.csv", function(data){
    data.forEach(function(d){
      if(d.Tag == tagName){
        //console.log(d.text);
        var temp = {
          text : d.text,
          quality:  d.quality,
          bar: d.qual_ans,
          user_reputation: d.user_reputation,
          accept: +d.has_accepted_ans,
          code: +d.has_code_col,
          noAns: +d.No_of_ans

        }
        filteredQuestions.push(temp);
        displayDifferentQuestion(null);
      }
    });
  });
  console.log(filteredQuestions);
}
var index = 0;
function displayDifferentQuestion(arrow){
  if(arrow == null){
    index =0;
  }
  else if(arrow.id == "leftArrow"){
    if(index==0){
      index =0;
      return;
    }
    else{
      index = index-1;
    }    
  }
  else{
     if(index == filteredQuestions.length-1){
        index =0;
      }
      else{
        index = index+1;
      }   

  }

    if(filteredQuestions[index].quality>=50){
       //document.getElementById('qDisplay').innerHTML = "<mark style= \x22 background-color: green; color: black \x22>" +filteredQuestions[index].text + "</mark>";
       document.getElementById('qDisplay').innerHTML = "<div style= \x22 color: green \x22>" +filteredQuestions[index].text + "</div>";
       }
    else{
     // document.getElementById('qDisplay').innerHTML = "<mark style= \x22 background-color: red; color: black \x22>" +filteredQuestions[index].text + "</mark>";
            document.getElementById('qDisplay').innerHTML = "<div style= \x22 color: red \x22>" +filteredQuestions[index].text + "</div>";
    }
    var insertCorrectImage = "<img src =\x22 correct.png \x22 width =\x22 20px \x22 height = \x22 20px\x22/> ";
    var insertWrongImage = "<img src =\x22 wrong.png \x22 width =\x22 20px \x22 height = \x22 20px\x22/> "

    var acceptImg, codeImg;
    if(filteredQuestions[index].accept == 1){
      acceptImg = insertCorrectImage;
    }
    else{
      acceptImg = insertWrongImage;
    }
    if(filteredQuestions[index].accept == 1){
      codeImg = insertCorrectImage;
    }
    else{
      codeImg = insertWrongImage;
    }

    document.getElementById('statsHolder').innerHTML="<b><u>Question Stats</u></b> <br> User Reputaion: "+filteredQuestions[index].user_reputation
                                                    +"<br>Acccepted answer: "+acceptImg+"<br>Code"+codeImg+"<br> No. of Answers: "+filteredQuestions[index].noAns;
                                                    //debugger;
    $('#statsHolder').removeClass("statStyleClass");
    $('#statsHolder').addClass("styleChange");
   var seriesString = filteredQuestions[index].bar.split(" ");
   var series = [];
   var i =0;
   for(i=0; i<seriesString.length; i++){
    var temp = {
      label : "ans "+ (i+1).toString(),
      value : +seriesString[i]
    }
    series.push(temp);    

   }
   $.getScript('barChart.js', function(){
      barChart(series);
    })
  
 
}



