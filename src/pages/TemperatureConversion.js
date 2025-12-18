import React, { useState } from "react";
import Input from "../components/Input";
import Output from "../components/Output";

const TemperatureConversion = () => {
  const units = [
    { value: "°C", label: "Celsius (°C)" },
    { value: "°F", label: "Fahrenheit (°F)" },
    { value: "K", label: "Kelvin (K)" },
    { value: "°R", label: "Rankine (°R)" },
  ];

  const [from, setFrom] = useState(units[0]); // Celsius
  const [to, setTo] = useState(units[1]); // Fahrenheit
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [calculation, setCalculation] = useState("");

  const convert = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const value = parseFloat(input);
    let celsius;
    let steps = [];

    // Convert input to Celsius first
    switch (from.value) {
      case "°C":
        celsius = value;
        steps.push(`Input: ${value}°C`);
        break;
      case "°F":
        celsius = (value - 32) * 5 / 9;
        steps.push(`${value}°F to Celsius: (${value} - 32) × 5/9 = ${celsius.toFixed(6)}°C`);
        break;
      case "K":
        celsius = value - 273.15;
        steps.push(`${value}K to Celsius: ${value} - 273.15 = ${celsius.toFixed(6)}°C`);
        break;
      case "°R":
        celsius = (value - 491.67) * 5 / 9;
        steps.push(`${value}°R to Celsius: (${value} - 491.67) × 5/9 = ${celsius.toFixed(6)}°C`);
        break;
      default:
        celsius = value;
    }

    // Convert Celsius to target unit
    let result;
    switch (to.value) {
      case "°C":
        result = celsius;
        steps.push(`Result: ${result.toFixed(6)}°C`);
        break;
      case "°F":
        result = celsius * 9 / 5 + 32;
        steps.push(`Celsius to Fahrenheit: ${celsius.toFixed(6)} × 9/5 + 32 = ${result.toFixed(6)}°F`);
        break;
      case "K":
        result = celsius + 273.15;
        steps.push(`Celsius to Kelvin: ${celsius.toFixed(6)} + 273.15 = ${result.toFixed(6)}K`);
        break;
      case "°R":
        result = celsius * 9 / 5 + 491.67;
        steps.push(`Celsius to Rankine: ${celsius.toFixed(6)} × 9/5 + 491.67 = ${result.toFixed(6)}°R`);
        break;
      default:
        result = celsius;
    }

    const clean = result.toFixed(10).replace(/\.?0+$/, "") || "0";
    setOutput(clean);
    setCalculation(steps.join("\n"));
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
      <h3>Temperature Converter</h3>
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
              type="button"
              onClick={() => {
                setInput("");
                setOutput("");
                setCalculation("");
              }}
            >
              <span>×</span> Reset
            </button>
            <button type="button" onClick={swap}>
              <span>⇄</span> Swap
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

export default TemperatureConversion;
