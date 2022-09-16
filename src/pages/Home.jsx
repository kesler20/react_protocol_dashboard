import React, { useEffect } from "react";
import Knobs from "../components/knob/knob";
import CustomizedSlider from "../components/slider/Slider";
import CustomizedSwitches from "../components/switch/IosSwitch";
import RESTfulApiInterface from "../API/RESTfulApi"
import PlotlyInterface from "../API/PlotlyInterface"
const Home = () => {
  useEffect(() => {
    const api = new RESTfulApiInterface("https://api.github.com/","",false)
    api.getResource("").then(res => console.log(res))
    const plotly = new PlotlyInterface("plot");

    const trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: "scatter",
    };

    const trace2 = {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: "scatter",
    };

    const data = [trace1, trace2];

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
