import React, { useEffect } from "react";
import PlotlyInterface from "../API/PlotlyInterface";
import { convert_df_to_objects } from "../helpers/functions";

const SofiaDiet = () => {
  /**
   * Converts the backend data array into traces objects with a name, a session_id as x axis
   * and a y axis being the rows
   * @param {*} backendData - the backend data array
   * @returns an array of traces [ { name: col, y: rows, x : session_id }]
   */
  const convertDataToTraces = (backendData) => {
    let traces = [];
    let sessionID = backendData.filter(
      (data) => data["session_id"] !== undefined
    )[0];
    sessionID["session_id"] = sessionID["session_id"].map((data) => {
      return new Date(data);
    });
    backendData.forEach((data) => {
      let columns = Object.keys(data);
      if (columns[0] === "session_id") {
        console.log("");
      } else {
        columns.forEach((column) => {
          try {
            traces.push({
              name: column,
              x: sessionID.session_id,
              y: data[columns],
              mode: "markers",
              type: "scatter",
              marker: { size: 12, opacity: 0.7 },
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
    return traces;
  };

  return (
    <div class="container mx-auto">
      <div id="plot" className="h-[500px] w-full" />
      <div class="grid gap-1 grid-cols-3 lg:grid-cols-2">
        {traces.map((trace, index) => {
          let Plotly = new PlotlyInterface(trace.name);
          setTimeout(() => {
            Plotly.changeLayout(
              "default",
              trace.name,
              trace.name,
              "session ID",
              "",
              false
            );
            Plotly.constructInitialPlot([trace]);
          }, 1000);
          return <div id={`${trace.name}`} key={index} />;
        })}
      </div>
    </div>
  );
};

export default SofiaDiet;
