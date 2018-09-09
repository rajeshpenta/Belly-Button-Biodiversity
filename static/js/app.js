function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const metadataURL = "/metadata/" + sample;
  d3.json(metadataURL).then(function(data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    metadataPanel = d3.select("#sample-metadata");
      
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
          var cell = metadataPanel.append("p");
          cell.text(key + ": " + value);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const sampleDataURL = "/samples/"+sample;
  d3.json(sampleDataURL).then(function(data){
    result=[]
    for (var i = 0; i < data.otu_ids.length; i++) {
      result.push({"otu_ids": data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values": data.sample_values[i]});

  };
  result.sort((a, b) => b.sample_values - a.sample_values);
  result = result.slice(0, 10);
  console.log(result);

    // Trace1 for the sample data
    var trace1 = {
      values: result.map(row => row.sample_values),
      labels: result.map(row => row.otu_ids),
      hovertext: result.map(row => row.otu_labels),
      type: "pie",
      orientation: "h"
    };
    var pieChart = [trace1];
    Plotly.newPlot("pie", pieChart);

  
    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    var bubbleChart = [trace2];
    Plotly.newPlot("bubble", bubbleChart);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
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
