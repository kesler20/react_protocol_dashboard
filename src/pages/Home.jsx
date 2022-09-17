import React, { useEffect } from "react";
import CustomizedSlider from "../components/slider/Slider";
import CustomizedSwitches from "../components/switch/IosSwitch";
import RESTfulApiInterface from "../API/RESTfulApi";
import PlotlyInterface from "../API/PlotlyInterface";
import { convert_df_to_objects } from "../helpers/functions";
import { useState } from "react";

const refreshTime = 10; //hr

setTimeout(() => {
  localStorage.remove("fitness");
}, 1000 * 60 * 60 * refreshTime);

const Home = () => {
  const [data, setData] = useState([]);
  const [plotly, setPlotly] = useState(new PlotlyInterface("plot"));
  const [traces, setTraces] = useState([]);

  useEffect(() => {
    ["fitness"].forEach((endpoint) => {
      /**
       * get backend data from the data base
       */
      let backendData = localStorage.getItem(endpoint);

      /**
       * if the data is in localStorage convert it to an object
       */
      if (backendData !== null) {
        backendData = JSON.parse(backendData);
        setData(
          backendData.map((data) => {
            return data;
          })
        );
        setTraces(convertDataToTraces(backendData));
        /**
         * convert the data to traces
         * plot the data
         */
        plotly.changeLayout(
          "light",
          "Fitness Overview",
          "values",
          "session ID",
          "",
          true
        );
        plotly.constructInitialPlot(convertDataToTraces(backendData));
      } else {
        /**
         * if the data is not in database call it from the backend
         */
        const dbApi = new RESTfulApiInterface(
          `http://127.0.0.1:8000/sofia-api/${endpoint}`,
          "",
          false
        );

        /**
         * convert the data from the backend into an array of objects
         * store the data from the within the state
         * save the updated data to local storage
         */
        dbApi.getResource("").then((res) => {
          backendData = JSON.parse(res.resource);
          backendData = convert_df_to_objects(backendData);

          setData(
            backendData.map((data) => {
              return data;
            })
          );
          localStorage.setItem(endpoint, JSON.stringify(backendData));
          setTraces(convertDataToTraces(backendData));

          /**
           * convert the data to traces
           * plot the data
           */
          plotly.changeLayout(
            "light",
            "Fitness Overview",
            "values",
            "session ID",
            "",
            true
          );
          plotly.constructInitialPlot(convertDataToTraces(backendData));
        });
      }
    });
  }, []);

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

export default Home;

//TODO: include pagination to include the different tables of th3e database
