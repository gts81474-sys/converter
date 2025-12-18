// src/pages/LengthConversion.js
import React, { useState } from "react";
import Input from "../components/Input";
import Output from "../components/Output";

const LengthConversion = () => {
  const units = [
    { value: "mm", label: "Millimeters", rate: 1 },
    { value: "cm", label: "Centimeters", rate: 10 },
    { value: "m", label: "Meters", rate: 1000 },
    { value: "km", label: "Kilometers", rate: 1e6 },
    { value: "inch", label: "Inches", rate: 25.4 },
    { value: "feet", label: "Feet", rate: 304.8 },
    { value: "feet+inches", label: "Foot + Inch", rate: 304.8, multi: true },
    { value: "yard", label: "Yards", rate: 914.4 },
    { value: "mile", label: "Miles", rate: 1609344 },
  ];

  const [from, setFrom] = useState(units[1]); // cm
  const [to, setTo] = useState(units[2]); // m
  const [inputs, setInputs] = useState([""]);
  const [output, setOutput] = useState({ type: "single", value: "" });
  const [calculation, setCalculation] = useState("");

  const isMulti = (u) => u.value === "feet+inches";
  const inputCount = isMulti(from) ? 2 : 1;

  const handleUnitChange = (e, isFrom) => {
    const selected = units.find((u) => u.value === e.target.value);
    if (isFrom) {
      setFrom(selected);
      setInputs(isMulti(selected) ? ["", ""] : [""]);
    } else {
      setTo(selected);
    }
    setOutput({ type: "single", value: "" });
    setCalculation("");
  };

  const convert = (e) => {
    e.preventDefault();
    if (!inputs.some((v) => v.trim() !== "")) return;

    let totalMM = 0;
    let steps = [];

    // 輸入 → mm
    if (isMulti(from)) {
      const [ft, inc] = inputs.map((v) => parseFloat(v) || 0);
      totalMM = ft * 304.8 + inc * 25.4;
      steps.push(
        `${ft} ft + ${inc} in = ${ft}×304.8 + ${inc}×25.4 = ${totalMM.toFixed(
          2
        )} mm`
      );
    } else {
      const val = parseFloat(inputs[0]) || 0;
      totalMM = val * from.rate;
      steps.push(
        `${val} ${from.value} × ${from.rate} = ${totalMM.toFixed(2)} mm`
      );
    }

    // mm → 輸出
    if (isMulti(to)) {
      const totalInches = totalMM / 25.4;
      const feet = Math.floor(totalInches / 12);
      //console.log(totalInches % 12); result:10
      //console.log((totalInches % 12).toFixed(8)); result:10.00000000
      //remove trailing zeros
      const inches = (totalInches % 12).toFixed(8).replace(/\.?0+$/, "") || "0";
      setOutput({ type: "multi", value: [feet, inches] });
      steps.push(
        `${totalMM.toFixed(2)} mm ÷ 25.4 = ${totalInches.toFixed(6)} in`
      );
      steps.push(`→ ${feet} ft + ${inches} in`);
    } else {
      const result = totalMM / to.rate;
      const clean = result.toFixed(10).replace(/\.?0+$/, "") || "0";
      setOutput({ type: "single", value: clean });
      steps.push(
        `${totalMM.toFixed(2)} mm ÷ ${to.rate} = ${clean} ${to.value}`
      );
    }

    setCalculation(steps.join("\n"));
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setInputs(isMulti(to) ? ["", ""] : [""]);
    setOutput({ type: "single", value: "" });
    setCalculation("");
  };
  return (
    <div className="conversion">
      <h3>Length Converter</h3>
      <form onSubmit={convert}>
        <div className="first_row">
          <label className="first_col">&nbsp;</label>
          <div className="col">
            <label>From</label>
            <select
              value={from.value}
              onChange={(e) => handleUnitChange(e, true)}
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>To</label>
            <select
              value={to.value}
              onChange={(e) => handleUnitChange(e, false)}
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <label>{from.label}</label>
          <div className="input_group">
            {Array.from({ length: inputCount }).map((_, i) => (
              <Input
                key={i}
                index={i}
                value={inputs[i] || ""}
                onChange={(val) => {
                  const newInputs = [...inputs];
                  newInputs[i] = val;
                  setInputs(newInputs);
                }}
                unit={from}
              />
            ))}
          </div>
        </div>

        <div className="row toRight">
          <div className="buttons">
            <button className="convert" type="submit">
              <span>=</span> Convert
            </button>
            <button
              type="button" // 關鍵：不要用 reset
              onClick={() => {
                // 只清空輸入欄位
                setInputs(isMulti(from) ? ["", ""] : [""]);
                // 清空結果和計算過程
                setOutput({ type: "single", value: "" });
                setCalculation("");
              }}
            >
              <span>×</span> Reset
            </button>
            <button type="button" onClick={swap}>
              <span>⇅</span> Swap
            </button>
          </div>
        </div>

        <div className="row">
          <label>{to.label}</label>
          {isMulti(to) ? (
            <div className="input_group">
              <Output
                value={output.value[0] || "0"}
                unit={to.value}
                index={0}
              />
              <Output
                value={output.value[1] || "0"}
                unit={to.value}
                index={1}
              />
            </div>
          ) : (
            <div className="input_group">
              <Output value={output.value} unit={to.value} />
            </div>
          )}
        </div>

        <div className="row">
          <label>Calculation</label>
          <textarea
            value={calculation}
            readOnly
            rows="5"
            style={{ width: "100%" }}
          />
        </div>
      </form>
    </div>
  );
};

export default LengthConversion;
