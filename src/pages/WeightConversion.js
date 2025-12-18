// src/pages/WeightConversion.js
import React, { useState } from "react";
import Input from "../components/Input";
import Output from "../components/Output";

const WeightConversion = () => {
  const units = [
    { value: "μg", label: "Microgram (μg)", rate: 0.000001 },
    { value: "mg", label: "Milligram (mg)", rate: 0.001 },
    { value: "g", label: "Gram (g)", rate: 1 },
    { value: "kg", label: "Kilogram (kg)", rate: 1000 },
    { value: "t", label: "Metric Ton (t)", rate: 1000000 },
    { value: "oz", label: "Ounce (oz)", rate: 28.349523125 },
    { value: "lb", label: "Pound (lb)", rate: 453.59237 },
    { value: "st", label: "Stone (st)", rate: 6350.29318 },
    { value: "ton", label: "Ton (US)", rate: 907184.74 },
  ];

  const [from, setFrom] = useState(units[3]); // kg
  const [to, setTo] = useState(units[6]); // lb
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [calculation, setCalculation] = useState("");

  const convert = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const value = parseFloat(input);
    const grams = value * from.rate;
    const result = grams / to.rate;
    const clean = result.toFixed(10).replace(/\.?0+$/, "") || "0";

    setOutput(clean);
    setCalculation(
      [
        `${value} ${from.value} × ${from.rate} = ${grams.toFixed(6)} g`,
        `${grams.toFixed(6)} g ÷ ${to.rate} = ${clean} ${to.value}`,
      ].join("\n")
    );
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setInput("");
    setOutput("");
    setCalculation("");
  };

  return (
    <div className="conversion">
      <h3>Weight Converter</h3>
      <form onSubmit={convert}>
        <div className="first_row">
          <label className="first_col">&nbsp;</label>
          <div className="col">
            <label>From</label>
            <select
              value={from.value}
              onChange={(e) =>
                setFrom(units.find((u) => u.value === e.target.value))
              }
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
              onChange={(e) =>
                setTo(units.find((u) => u.value === e.target.value))
              }
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
            <Input value={input} onChange={setInput} unit={from} />
          </div>
        </div>

        <div className="row toRight">
          <div className="buttons">
            <button className="convert" type="submit">
              <span>=</span> Convert
            </button>
            <button
              type="reset"
              onClick={() => {
                setInput("");
                setOutput("");
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
          <div className="input_group">
            <Output value={output} unit={to.value} />
          </div>
        </div>

        <div className="row">
          <label>Calculation</label>
          <textarea
            value={calculation}
            readOnly
            rows="4"
            style={{ width: "100%" }}
          />
        </div>
      </form>
    </div>
  );
};

export default WeightConversion;
