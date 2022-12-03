import TraceBuilder from "./TraceBuilder";
import LayoutBuilder from "./LayoutBuilder";
import DatabaseApi from "../APIs/DatabaseApi";

/**
 * This is an interface for the Plotly Library
 *
 * @param canvasID - this is the id of the div where the plot will be generated
 * @param {*} plotly - this takes the window.Plotly object
 *
 * properties:
 * - fontColor - this will change the font color of the title and y/x axis labels
 * - plotColor - this changes the color of the paper and the plot
 * - gridColor - this changes the color of the grid within the plot
 */
export default class PlotBuilder {
  constructor(canvasID) {
    this.canvasID = canvasID;
    this.plotly = window.Plotly;

    // this is a collection of traces
    this.plotData = [];
    this.layout = {};

    this.config = {
      responsive: true,
      editable: true,
      displaylogo: false,
      displayModeBar: true,
      scrollZoom: false,
      showLink: false,
      linkText: "This text is custom!",
      plotlyServerURL: "https://chart-studio.plotly.com",
    };
  }

  buildPlotly() {
    return this;
  }

  addYAxisRange(range) {
    this.layout.yaxis = { ...this.layout.yaxis, range };
    return this;
  }

  addXAxisRange(range) {
    this.layout.xaxis = { ...this.layout.xaxis, range };
    return this;
  }

  // the trace removal function should keep the traceIDs as they are
  addTrace(type, name) {
    const traceBuilder = new TraceBuilder(type, name);
    traceBuilder.addMarker().addMode("markers");
    const trace = traceBuilder.buildTrace();
    this.plotData.push(trace);
    return this;
  }

  removeTrace(traceID) {
    this.plotData = this.plotData.filter((trace, index) => index == traceID);
    return this;
  }

  addPlotTitle(title) {
    const layoutBuilder = new LayoutBuilder(title);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addZoomScroll() {
    this.config.scrollZoom = true;
    return this;
  }

  removeZoomScroll() {
    this.config.scrollZoom = false;
    return this;
  }

  // this function can be passed to the layout builder
  removeLegends() {
    this.layout = { ...this.layout, showlegend: false };
    return this;
  }

  addLegends() {
    this.layout = { ...this.layout, showlegend: true };
    return this;
  }

  removeAllAxis() {
    const layoutBuilder = new LayoutBuilder("title");
    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .removeZeroLine("x")
      .removeZeroLine("y")
      .buildLayout();
    return this;
  }

  importTrace(trace, traceID) {
    if (this.plotData.length === 0) {
      this.plotData = [trace];
    } else {
      this.plotData.splice(trace, 0, traceID);
    }
    return this;
  }

  importLayout(layout) {
    this.layout = layout;
    return this;
  }

  addAxis(axis, label) {
    let layoutBuilder = new LayoutBuilder("title");
    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .addAxis(axis, label)
      .buildLayout();
    return this;
  }

  /**
   * this function can be called like a plot
   * which means that it can be called after setting the x and y axis and by passing the traceID
   * the function ll set x -> labels, y -> values
   * @param {*} traceID
   * @returns
   */
  addLabelsAndValues(traceID) {
    let trace = this.plotData[traceID];
    let traceBuilder = new TraceBuilder();

    traceBuilder
      .addTraceData(trace)
      .addLabels(traceBuilder.buildTrace().x)
      .addValues(traceBuilder.buildTrace().y);

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addArrayData(traceID) {
    let trace = this.plotData[traceID];
    let traceBuilder = new TraceBuilder();

    traceBuilder.addTraceData(trace).trace.z = [traceBuilder.buildTrace().z];

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addAxisDimension(axis, data, label, traceID) {
    // get the desired trace to add dimensions to
    let trace = this.plotData[traceID];

    // initialize a builder for trace and layout and pass it the current data
    // then add the axis, data and the label
    const traceBuilder = new TraceBuilder();
    const layoutBuilder = new LayoutBuilder();
    traceBuilder.addTraceData(trace).addAxis(axis, data);
    layoutBuilder.addLayoutData(this.layout).addAxis(axis, label);

    // style the layout in case of a 3d plot
    if (axis === "z") {
      this.config.scrollZoom = true;
      layoutBuilder.add3DStyles();
    }

    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addColorDimension(data, colorDimensionName, traceID) {
    // assuming that the marker has already being created,
    // and so make sure that no marker has been created after
    let trace = this.plotData[traceID];

    const traceBuilder = new TraceBuilder();
    traceBuilder
      .addTraceData(trace)
      .addColor(data, colorDimensionName)
      .addColorScale()
      .changeColorScale("Jet");
    return this;
  }

  addSizeDimension(data, traceID) {
    // assuming that the marker has already being created,
    // and so make sure that no marker has been created after
    let trace = this.plotData[traceID];

    let traceBuilder = new TraceBuilder();
    traceBuilder.addTraceData(trace).addRelativeSizeToMarkers(data);
    return this;
  }

  addScatterPlot(traceID) {
    // get the desired trace
    let plotType = "scatter";
    let trace = this.plotData[traceID];

    if (trace.x !== undefined || trace.y !== undefined) {
      if (trace.x.length >= 1500 || trace.y.length >= 1500) {
        plotType = "scattergl";
      }
    }

    const traceBuilder = new TraceBuilder(plotType);
    traceBuilder
      .addTraceData(trace)
      .addMarker("circle")
      .addMarkerLine()
      .addPlotType("scatter")
      .addMarkerSize(18)
      .addMode("markers");

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addLinePlot(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter");
    traceBuilder
      .addTraceData(trace)
      .addLine()
      .addPlotType("scatter")
      .addMode("lines");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  add3DPlot(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");

    traceBuilder
      .addTraceData(trace)
      .addPlotType("scatter3d")
      .addMode("markers")
      .addMarker("circle");

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addBoxPlot(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder
      .addTraceData(trace)
      .addPlotType("box")
      .addBoxPoints("all")
      .addUnderlyingData();
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addPieChart(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder
      .addTraceData(trace)
      .addPlotType("pie")
      .addHoverInfo("label+percent+name")
      .addValues(traceBuilder.buildTrace().x)
      .addLabels(traceBuilder.buildTrace().y);
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addHeatmap(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder.addTraceData(trace).addPlotType("heatmap");

    let newTrace = traceBuilder.buildTrace();
    newTrace.colorscale = "Hot";
    this.plotData[traceID] = newTrace;
    return this;
  }

  addBarChart(traceID) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder.addTraceData(trace).addPlotType("bar").addMarker("circle");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addSurface(traceID) {
    // implement
    // var data = [
    //   {
    //     z: z_data,
    //     type: "surface",
    //   },
    // ];

    // var layout = {
    //   title: "Mt Bruno Elevation",
    //   autosize: false,
    //   width: 500,
    //   height: 500,
    //   margin: {
    //     l: 65,
    //     r: 50,
    //     b: 65,
    //     t: 90,
    //   },
    // };
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("surface");
    traceBuilder.addTraceData(trace).addPlotType("surface");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addHistogram(traceID) {
    const traceBuilder = new TraceBuilder("histogram");
    traceBuilder.addTraceData({}).addPlotType("histogram").addOpacity(0.5);
    this.plotData[traceID] = traceBuilder.buildTrace();
  }

  addIndicators(value, reference) {
    this.plotData = [
      {
        type: "indicator",
        value,
        delta: { reference },
        gauge: { axis: { visible: false, range: [0, value + 50] } },
        domain: { row: 1, column: 0 },
      },
      {
        type: "indicator",
        mode: "number+delta",
        value,
        domain: { row: 0, column: 0 },
      },
    ];

    this.config = {
      editable: false,
    };

    this.layout = {
      title: "",
      width: 250,
      height: 250,
      margin: { t: 25, b: 25, l: 25, r: 25 },
      grid: { rows: 2, columns: 1, pattern: "independent" },
      template: {
        data: {
          indicator: [
            {
              title: { text: "Current Value" },
              mode: "number+delta+gauge",
              delta: { reference },
            },
          ],
        },
      },
    };
    return this;
  }

  addDarkMode() {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    let backgroundColor = "#1b2444";
    let paperBgColor = "#1b2444";
    let gridColor = "#768db7";
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("#33ffe6", "Arial, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "x")
      .addZeroLine("x", gridColor)
      .addZeroLine("Y", gridColor)
      .addGridColor(gridColor, "y");
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addLightMode() {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    const backgroundColor = "white";
    const paperBgColor = "white";
    const gridColor = "#edf3f4";
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("black", "Arial, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "y")
      .addGridColor(gridColor, "x")
      .addZeroLine("x", gridColor)
      .addZeroLine("y", gridColor);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addModeBar() {
    this.config.displayModeBar = true;
    return this;
  }

  removeModeBar() {
    this.config.displayModeBar = false;
    return this;
  }

  addBackgroundColor(color, gridcolor, paperColor) {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    const backgroundColor = color;
    const paperBgColor = paperColor === undefined ? color : paperColor;
    const gridColor = gridcolor === undefined ? "#edf3f4" : gridcolor;
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("black", "Arial, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "y")
      .addGridColor(gridColor, "x")
      .addZeroLine("x", gridColor)
      .addZeroLine("y", gridColor);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  /**
   * Build a plot from scratch
   *
   * @param {*} plotData - array containing the traces of the plot
   *  - i.e. plotData = [ trace1, trace2, ....]
   *  - where traces are { x: [], y: [], mode: "markers", markers : {color : 'blue'}}
   */
  constructInitialPlot(plotData, layout) {
    this.plotData = plotData === undefined ? this.plotData : plotData;
    layout = layout === undefined ? this.layout : layout;
    this.plotly.newPlot(this.canvasID, this.plotData, layout, this.config);
  }

  /**
   * Add traces to the initial plot
   *
   * @param newDataY - this is an array of arrays containing the last y value of each trace
   * @param newDataX - this is an array of arrays containing the last x value of each trace
   */
  updateInitialPlot(newDataY, newDataX, xaxisRange) {
    const traceIDs = [];
    for (let i = 0; i < newDataY.length; i++) {
      traceIDs.push(i);
    }

    this.plotly.extendTraces(
      this.canvasID,
      {
        y: [...newDataY],
        x: [...newDataX],
      },
      traceIDs
    );

    let dataMatrix = [];
    newDataY.forEach((val) => {
      dataMatrix.push(val[0]);
    });

    if (newDataY.length > 0) {
      this.plotly.relayout(this.canvasID, {
        yaxis: {
          ...this.layout.yaxis,
          range: [Math.min(...dataMatrix) - 40, Math.max(...dataMatrix) + 40],
        },
        xaxis: {
          ...this.layout.xaxis,
          range: xaxisRange,
        },
      });
    }
  }
}