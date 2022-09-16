///////////////////////////////////
// INTERFACE FOR THE PLOTLY LIBRARY
///////////////////////////////////

/**
 * This is an interface for the Plotly Library
 *
 * @param {*} canvasID - this is the id of the div where the plot will be generated
 *
 * ### Dev Information
 * - this is the plotly cdn
 * ```HTML
 * <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
 * ```
 * for dark mode set the colors to be
 * this.fontColor = "#76889a";
 * this.plotColor = "#1b2444";
 * this.gridColor = "#525f89";
 */
 export default class PlotlyInterface {
    /**
     * Take the plotly object from the window
     * to allow this make sure that the following plotly cdn provided above is included in the index.html document
     * ensure that the plotly constant is initialized within a useEffect or a componentDidMount callback
     * this will ensure that the div with the plotly ID is in the DOM when the function runs
     * 
     * @param canvasID - this the id of the div where the plot will be generated 
     */
    constructor(canvasID) {
      this.canvasID = canvasID;
      this.plotly = window.Plotly;
      this.plotTitle = "Generated Number Stream";
      this.yTicks = "Value";
      this.xTicks = "Epoch Time";
      this.zTicks = "Random Value";
      this.fontColor = "black";
      this.plotColor = "rgb(250,250,250)";
      this.gridColor = "";
      this.layout = {
        title: this.plotTitle,
        font: { color: this.fontColor },
        paper_bgcolor: this.plotColor,
        plot_bgcolor: this.plotColor,
        scene: { xaxis: {}, yaxis: {}, zaxis: {} },
        yaxis: {
          title: this.yTicks,
          gridcolor: this.gridColor,
          titlefont: {
            family: "Arial, sans-serif",
            size: 18,
            color: this.fontColor,
          },
        },
        xaxis: {
          title: this.xTicks,
          titlefont: {
            family: "Arial, sans-serif",
            size: 18,
            color: this.fontColor,
          },
        },
        zaxis: {
          title: this.zTicks,
          gridcolor: this.gridColor,
          titlefont: {
            family: "Arial, sans-serif",
            size: 18,
            color: this.fontColor,
          },
        },
      };
      this.config = {
        responsive: true,
        editable: true,
        displaylogo: false,
        scrollZoom: false,
        showLink: false,
        displayModeBar: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
      };
    }
  
    /**
     * Build a plot from scratch
     *
     * @param {*} plotData - array containing the traces of the plot
     *  - i.e. plotData = [ trace1, trace2, ....]
     *  - where traces are { x: [], y: [], mode: "markers", markers : {color : 'blue'}}
     */
    constructInitialPlot(plotData) {
      this.plotly.newPlot(this.canvasID, plotData, this.layout, this.config);
    }
  
    /**
     * Add traces to the initial plot
     *
     * @param newDataY - this is an array of arrays containing the last y value of each trace
     * @param newDataX - this is an array of arrays containing the last x value of each trace
     */
    updateInitialPlot(newDataY, newDataX) {
      /*
  
      - new Data is an object with a y and an x property which are array of arrays
  
      - [[trace1],[trace2],[trace3]...[traceN]]
      - where N is the size of the outer array
      - trace ids are required by the extendTraces method
      
      */
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
      /*
      
      - to ensure that the graph always displays the maximum and the minimum values
      - update the layout as the traces are added
  
      */
      let dataMatrix = [];
      newDataY.forEach((val) => {
        dataMatrix.push(val[0]);
      });
  
      if (newDataY.length > 0) {
        this.plotly.relayout(this.canvasID, {
          yaxis: {
            range: [Math.min(...dataMatrix) - 50, Math.max(...dataMatrix) + 50],
          },
        });
      }
    }
  
    /**
     *
     * @param {*} x - used as x values fro the scatter plots and bar charts,
     * as labels for the pie chart and ignored for heat maps
     * @param {*} xTicks - used for the x labels
     * @param {*} y - used as y values for the scatter plots an the bar charts,
     * used as values for the pie chart and z for the heat map
     * @param {*} yTicks - used for the y labels
     * @param {*} type - the plots can be either [ scatter, scatter3d, bar, heatmap and pie ]
     * @param {*} mode - the mode of the graph is either [ lines, lines+markers, markers ]
     * @param {*} markerSymbol - this is the symbol of the marker ["circle", "square", "diamond", "cross"]
     * @param {*} date - this is a boolean which makes the x values date times if true
     * @returns trace - object of the following form { x, y, type, mode, marker, opacity, line }
     */
    createPlotData(x, y, z, type, mode, markerSymbol, markerSize, color) {
      if (type === "bar") return { x, y, type, mode };
      if (type === "heatmap") return { z, type };
  
      let opacity = 0.8;
      let marker = {
        size:
          markerSize === undefined || markerSize.length === 0 ? 10 : markerSize,
        color: color.length === 0 ? undefined : color,
        colorscale: "Jet",
        opacity: 0.8,
        symbol: markerSymbol,
        line: { width: 1, dash: "dot" },
      };
      let line = mode.includes("lines") ? { width: 2 } : {};
  
      let trace =
        ["scatter3d", "scatter"].indexOf(type) !== -1
          ? { x, y, type, mode, marker, opacity, line }
          : { labels: x, values: y, type: "pie" };
      if (type === "scatter3d") {
        trace = { ...trace, z };
        this.config.scrollZoom = true;
      }
  
      return trace;
    }
  
    /**
     * This function allows to change the layout of the instanced plot
     * after running this function call the construct initial plot function
     * @param {*} theme - can be either [seaborn, dark, light, gray ]
     * @param {*} plotTitle - string if left "" default title will be used
     * @param {*} yTicks - string if left "" default title will be used
     * @param {*} xTicks - string if left "" default title will be used
     */
    changeLayout(theme, plotTitle, yTicks, xTicks, zTicks, displayModeBar) {
      if (theme === "default") {
        this.layout.fontColor = "#76889a";
        this.layout.plotColor = "#1b2444";
        this.layout.gridColor = "#525f89";
      } else {
        let themes = {
          seaborn: "rgb(234,234,242)",
          dark: "black",
          light: "white",
          gray: "rgb(229,236,246)",
        };
        this.layout.paper_bgcolor = themes[`${theme}`];
        this.layout.plot_bgcolor = themes[`${theme}`];
        this.layout.yaxis.gridColor =
          theme === "dark" || theme === "light" ? "rgb(50,50,20)" : "white";
      }
      this.layout.xaxis.title = xTicks === "" ? this.xTicks : xTicks;
      this.layout.yaxis.title = yTicks === "" ? this.yTicks : yTicks;
      this.layout.zaxis.title = zTicks === "" ? this.zTicks : zTicks;
      if (zTicks !== "") {
        this.layout.scene.xaxis = { title: this.layout.xaxis.title };
        this.layout.scene.yaxis = { title: this.layout.yaxis.title };
        this.layout.scene.zaxis = { title: this.layout.zaxis.title };
      }
      this.layout.title = plotTitle === "" ? this.plotTitle : plotTitle;
      this.config.displayModeBar = displayModeBar;
    }
  }