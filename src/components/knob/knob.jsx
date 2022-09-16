import React from "react";
import { Knob, Pointer, Value, Arc } from "rc-knob";
import "./knob.css";
import { AiOutlinePoweroff } from "react-icons/ai";

const Knobs = (props) => {
  const { onValueChange, onPowerBtnClicked } = props;

  return (
    <div className="knob__outer">
      <div className="knob__inner">
        <div className="circular-dot" style={{ "--i": 1 }}></div>
        <div className="circular-dot" style={{ "--i": 2 }}></div>
        <div className="circular-dot" style={{ "--i": 3 }}></div>
        <div className="circular-dot" style={{ "--i": 4 }}></div>
        <div className="circular-dot" style={{ "--i": 5 }}></div>
        <div className="circular-dot" style={{ "--i": 6 }}></div>
        <div
          id="powerBtn"
          className={props.on ? "" : "power-off"}
          onClick={onPowerBtnClicked}
        >
          <AiOutlinePoweroff />
        </div>
        <Knob
          className="knob__slider"
          size={100}
          angleOffset={220}
          angleRange={280}
          min={1}
          max={5}
          onChange={(value) => onValueChange(value)}
        >
          <Arc arcWidth={7} color="#FC5A96" radius={47.5} />
          <Pointer width={4} radius={40} type="circle" color="#ffff" />
          <Value marginBottom={40} className="knob__slider__value" />
        </Knob>
      </div>
    </div>
  );
};

export default Knobs;
