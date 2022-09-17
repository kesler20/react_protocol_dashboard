import React, { useEffect } from "react";
import Knobs from "../components/knob/knob";
import CustomizedSlider from "../components/slider/Slider";
import CustomizedSwitches from "../components/switch/IosSwitch";
import RESTfulApiInterface from "../API/RESTfulApi";
import PlotlyInterface from "../API/PlotlyInterface";
const Home = () => {
  useEffect(() => {
    const api = new RESTfulApiInterface("https://api.github.com/", "", false);
    api.getResource("").then((res) => console.log(res));

    const dbApi = new RESTfulApiInterface(
      "http://127.0.0.1:8000/sofia-api/workout",
      "",
      false
    );

    let backendData = [];
    dbApi.getResource("").then((res) => {
      backendData = JSON.parse(res.resource)
    });

    let columns = Object.keys(backendData)
    // assuming that each column has the same rows
    let rows = Object.keys(columns[0]) 


    const plotly = new PlotlyInterface("plot");

    plotly.constructInitialPlot(data);
  });
  return (
    <>
      <div id="plot" className="h-[500px] w-full" />
      <div className="flex flex-col justify-evenly items-center w-[280px] h-[330px] shadow-xl rounded-xl">
        <CustomizedSlider />
        <CustomizedSwitches />
        <Knobs
          onValueChange={(e) => console.log(e)}
          on={true}
          onPowerBtnClicked={console.log("clicked")}
        />
      </div>
    </>
  );
};

export default Home;
