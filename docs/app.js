// Belly Button Biodiversity - Plotly.js
//samples.json> got data for names, metadata, samples
// BONUS: Build the Gauge Chart
// define function for panel  and gauge chart

function buildMetadata(sample) {
   d3.json("samples.json").then((data) => {
     var metadata= data.metadata;
     //console.log(metadata);
     var resultsarray= metadata.filter(sampleobject => 
       sampleobject.id == sample);
     var result= resultsarray[0]
     //console.log(reult);
     var wfreq = result.wfreq;
     var panel = d3.select("#sample-metadata");
     panel.html("");
     Object.entries(result).forEach(([key, value]) => {
       panel.append("h6").text(`${key}: ${value}`);
     });
   
  // GAUAGE CHART
   var gauge_data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
         axis: { range: [0, 9] 
         },
          steps: [
            { range: [0, 1], color: "lightcyan" },
            { range: [1, 2], color: "paleturquoise" },
            { range: [2, 3], color: "mediumturquoise" },
            { range: [3, 4], color: "turquoise" },
            { range: [4, 5], color: "darkturquoise" },
            { range: [5, 6], color: "cadetblue" },
            { range: [6, 7], color: "steelblue" },
            { range: [7, 8], color: "blue" },
            { range: [8, 9], color: "navyblue" }
                  
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: wfreq
          }
        }
      }
    ];
  
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gauge_data, layout);
   });
}

 
// define function for bar chart and bubble plot
 
 function buildCharts(sample) {
 
 // Use `d3.json` to fetch the sample data for the plots
 d3.json("samples.json").then((data) => {
   var samples= data.samples;
   var resultsarray= samples.filter(sampleobject => 
       sampleobject.id == sample);
   var result= resultsarray[0]
 
   var ids = result.otu_ids;
   var labels = result.otu_labels;
   var values = result.sample_values;
   //console.log(values);
 
// BUBBLE PLOT
 
   var LayoutBubble = {
     margin: { t: 0 },
     xaxis: { title: "OTU ID" },
     hovermode: "closest",
     };
 
     var DataBubble = [ 
     {
       x: ids,
       y: values,
       text: labels,
       mode: "markers",
       marker: {
         color: ids,
         size: values,
         }
     }
   ];
 
   Plotly.newPlot("bubble", DataBubble, LayoutBubble);
 
 
// BAR CHART

   var bar_data =[
     {
       y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
       x:values.slice(0,10).reverse(),
       text:labels.slice(0,10).reverse(),
       type:"bar",
       orientation:"h"
 
     }
   ];
 
   var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     margin: { t: 30, l: 150 }
   };
 
   Plotly.newPlot("bar", bar_data, barLayout);

  
 });
 }
 function init() {
   // Grab a reference to the dropdown select element
   var selector = d3.select("#selDataset");
   
   // Use the list of sample names to populate the select options
   d3.json("samples.json").then((data) => {
     var sampleNames = data.names;
     sampleNames.forEach((sample) => {
       selector
         .append("option")
         .text(sample)
         .property("value", sample);
     });
   
     // Use the first sample from the list to build the initial plots
     const firstSample = sampleNames[0];
     buildCharts(firstSample);
     buildMetadata(firstSample);
   });
   }
   
   function optionChanged(newSample) {
   // Fetch new data each time a new sample is selected
   buildCharts(newSample);
   buildMetadata(newSample);
   }
   
   
   
   // Initialize the dashboard
   init();