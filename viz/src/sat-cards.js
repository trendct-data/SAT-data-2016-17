const d3 = require("d3");;
const cards = require("./cards.js");
var data  = require("../data/sat-delta.json");

// filter out data with null scores
data = data.filter(function(a){
    return Number(a["avg score ela 2016-17"]) != 0
	&& !isNaN(Number(a["avg score ela 2016-17"]))
	&& Number(a["avg score math 2016-17"]) != 0
	&& !isNaN(Number(a["avg score math 2016-17"]))
});

var fa_arrow = function(dir){

    var dir = dir || "right";
    
    return '<i class="fa fa-arrow-' + dir + '" aria-hidden="true"></i>'
}

var sat_db = new cards.cards()
    .data(data)
    .container(d3.select("#container"))
    .draw(function(d){

	
	var detached = d3.select(document.createElement("div"));
	
	var header = detached.append("div").classed("card-heading", true);
	var body = detached.append("div").classed("card-body", true);

	header.append("div")
	    .classed("box", true)
	    .classed("math", true)
	    .classed("behind", function(){
		return Number(d["% behind math 2016-17"]) > 25;
	    })
	    .classed("ahead", function(){
		return Number(d["% goal math 2016-17"]) > 75;
	    })
	    .html(function(){
		if (Number(d["% goal math 2016-17"]) > 75)
		    return '<i class="fa fa-check" aria-hidden="true"></i>';
		if (Number(d["% behind math 2016-17"]) > 25)
		    return '<i class="fa fa-times" aria-hidden="true"></i>';
		return;
	    });
	
	header.append("div")
	    .classed("box", true)
	    .classed("ela", true)
	    .classed("behind", function(){
		return Number(d["% behind ela 2016-17"]) > 25;
	    })
	    .classed("ahead", function(){
		return Number(d["% goal ela 2016-17"]) > 75;
	    })
	    .html(function(){
		if (Number(d["% goal ela 2016-17"]) > 75)
		    return '<i class="fa fa-check" aria-hidden="true"></i>';
		if (Number(d["% behind ela 2016-17"]) > 25)
		    return '<i class="fa fa-times" aria-hidden="true"></i>';
		return;
	    });
	

	var bar_container = header.append("div")
	    .classed("bar-container", true);


	var math_bar = bar_container.append("div")
	    .classed("bar", true)
	    .classed("math", true)
	    .style("width", function(){
		if (isNaN(d["avg score math 2016-17"])) return "0%";
		if (isNaN(d["avg score ela 2016-17"])) return "0%";
		// var ret = ((Number(d["avg score math 2016-17"]) + Number(d["avg score ela 2016-17"])) * 100 / 1600);		
		var ret = Number(d["avg score math 2016-17"]) * 100 / 800;
		return ret + "%";
	    });

	var ela_bar = bar_container.append("div")
	    .classed("bar", true)
	    .classed("ela", true)
	    .style("width", function(){
		if (isNaN(d["avg score ela 2016-17"])) return "0%";		
		var ret = (Number(d["avg score ela 2016-17"]) * 100 / 800);
		return ret + "%";
	    });

	header.append("div")
	    .append("h3")
	    .append("span")
	    .text(function(obj){
		return d["district"];
	    })
	    .append("small")

	detached.append("div").classed("clear-both", true);

	header.append("h3")
	    .classed("subhed", true)
	    .append("small")
	    .html(function(){
		var ret =  "";

		var upscore = function(cat){
		if (Number(d[cat + " score diff"]) >= 20)
		    ret += "<span class='ahead'>" + fa_arrow("up");
		else if (Number(d[cat + " score diff"]) <= -20)
		    ret += "<span class='behind'>" + fa_arrow("down");
		else
		    ret += "<span>" + fa_arrow("right");
		
		ret += d["avg score " + cat + " 2016-17"]
			+ " " + cat.toUpperCase()
			+ "</span> ";
		};

		upscore("math");
		upscore("ela");

		
		// if (Number(d["ela score diff"]) >= 20)
		//     ret += fa_arrow("up");
		// else if (Number(d["ela score diff"]) <= -20)
		//     ret += fa_arrow("down");
		// else
		//     ret += fa_arrow("right");
		

		// ret += d["avg score ela 2016-17"]
		//     + " ELA"
		// ;


		return ret
	    });

	var table = body.append("table").classed("bullets", true);
	var thead = table.append("thead").append("tr")

	thead.append("th").text("");
	thead.append("th").text("2015-16");
	thead.append("th").text("2016-17");
	
	var tbody = table.append("tbody")

	// Describe the change math scores

	var add_label = function(label, val1, val2){
	    var new_item = table.append("tr");
	    
	    new_item.append("th")
		.text(label)

	    new_item.append("td")
		.text(val1);

	    new_item.append("td")
		.text(val2);
	    
	}

	add_label("Avg. Math score",d["avg score math 2015-16"],d["avg score math 2016-17"]);	

	// Describe the change in ELA scores
	add_label("Avg. ELA score",d["avg score ela 2015-16"], d["avg score ela 2016-17"]);	

	// Describe the % meeting ela goal
	add_label("College- and career-ready, ELA", d["% goal ela 2015-16"] + "%",d["% goal ela 2016-17"] + "%");

	// Describe the % meeting math goal
	add_label("College- and career-ready, Math", d["% goal math 2015-16"] + "%",d["% goal math 2016-17"] + "%");
	
	// Describe the % meeting Severely behind ELA
	add_label("Severely behind, ELA", d["% behind ela 2015-16"] + "%",d["% behind ela 2016-17"] + "%");

	// Describe the % meeting Severely behind Math
	add_label("Severely behind, Math", d["% behind math 2015-16"] + "%",d["% behind math 2016-17"] + "%");
	
	
	body.append("div")
	    .classed("footnote", true)
	    .text(function(){
		return "* Based on " + d["num tested math 2016-17"] + " Math tests and "
		+ d["num tested ela 2016-17"] + " ELA tests in 2016-17";
	    });

	body.append("div")
	    .classed("footnote", true)
	    .text("* 'Severely behind' refers to percent of students not meeting level 1");

	body.append("div")
	    .classed("footnote", true)
	    .text("* 'College- and career-ready' refers to percent of students meeting or exceeding level 3 or 4");

	body.append("div")
	    .classed("footnote", true)
	    .classed("sourceline", true)
	    .text("Source: edsight.ct.gov");

	
	return detached.html();
    })



