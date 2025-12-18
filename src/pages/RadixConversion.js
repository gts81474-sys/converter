import React, { useState } from "react";

const RadixConversion = () => {
  let bases = [
    { value: 2, label: "Binary", sub: "₂" },
    { value: 3, label: "Ternary", sub: "₃" },
    { value: 4, label: "Quaternary", sub: "₄" },
    { value: 5, label: "Quinary", sub: "₅" },
    { value: 6, label: "Senary", sub: "₆" },
    { value: 7, label: "Septenary", sub: "₇" },
    { value: 8, label: "Octal", sub: "₈" },
    { value: 9, label: "Nonary", sub: "₉" },
    { value: 10, label: "Decimal", sub: "₁₀" },
    { value: 11, label: "Undecimal", sub: "₁₁" },
    { value: 12, label: "Duodecimal", sub: "₁₂" },
    { value: 13, label: "Tridecimal", sub: "₁₃" },
    { value: 14, label: "Tetradecimal", sub: "₁₄" },
    { value: 15, label: "Pentadecimal", sub: "₁₅" },
    { value: 16, label: "Hexadecimal", sub: "₁₆" },
  ];
  let [fromBase, setFromBase] = useState(bases[8]);
  let [toBase, setToBase] = useState(bases[0]);
  let [inputValue, setInputValue] = useState("");
  let [outputValue, setOutputValue] = useState("");
  let [calculationSteps, setCalculationSteps] = useState("");
  let [showToast, setShowToast] = useState(false);
  const handleBaseChange = (e, isFrom) => {
    let selected = bases.find((base) => base.value === Number(e.target.value));
    if (isFrom) {
      setFromBase(selected);
    } else {
      setToBase(selected);
    }
  };
  const convert = (e) => {
    e.preventDefault();
    const validChars = "0123456789ABCDEF".slice(0, fromBase.value) + ".";

    if (
      inputValue
        .toUpperCase()
        .split("")
        .some((char) => !validChars.includes(char))
    ) {
      setOutputValue("Invalid input");
      setCalculationSteps(
        "Error: Contains invalid digits for base " + fromBase.value
      );
      return;
    }
    // ⬇ 分離整數與小數
    const [intPart, fracPart = ""] = inputValue.toUpperCase().split(".");

    // ---------- 1️⃣ 整數部分：任意進位 → 十進位 ----------
    let decimalInt = parseInt(intPart, fromBase.value);

    // ---------- 2️⃣ 小數部分：任意進位 → 十進位 ----------
    let decimalFrac = 0;
    for (let i = 0; i < fracPart.length; i++) {
      const digit = parseInt(fracPart[i], fromBase.value);
      decimalFrac += digit / Math.pow(fromBase.value, i + 1);
    }

    // 變成十進位總值
    const decimalValue = decimalInt + decimalFrac;

    let calcText = `Convert ${inputValue} (base ${fromBase.value}) to base ${
      toBase.value
    }\n\nconversion to decimal:\nInteger part: ${decimalInt}\nFractional part: ${decimalFrac.toFixed(
      10
    )}\n\nTotal decimal value: ${decimalValue.toFixed(
      10
    )}\n\nconversion to base ${toBase.value}:\n`;

    // ---------- 3️⃣ 十進位 → 目標進位（整數） ----------
    let tempInt = Math.floor(decimalValue);
    let intResult = "";

    if (tempInt === 0) {
      intResult = "0";
    } else {
      while (tempInt > 0) {
        let remainder = tempInt % toBase.value;
        let digit =
          remainder < 10
            ? remainder.toString()
            : String.fromCharCode("A".charCodeAt(0) + (remainder - 10));

        intResult = digit + intResult;
        calcText += `${tempInt} ÷ ${toBase.value} = ${Math.floor(
          tempInt / toBase.value
        )} ... ${digit}\n`;

        tempInt = Math.floor(tempInt / toBase.value);
      }
    }

    // ---------- 4️⃣ 十進位小數 → 目標進位（小數） ----------
    let tempFrac = decimalValue - Math.floor(decimalValue);
    let fracResult = "";
    let limit = 12; // 最多生成 12 位，避免無限小數

    if (fracPart.length > 0) {
      calcText += `\nFraction part conversion:\nMultiply the fractional part of the decimal number by ${toBase.value} and take the integer part as the next digit.\nRepeat with the new fractional part.\n\n`;

      for (let i = 0; i < limit && tempFrac > 0; i++) {
        tempFrac *= toBase.value;
        let digit = Math.floor(tempFrac);

        let char =
          digit < 10
            ? digit.toString()
            : String.fromCharCode("A".charCodeAt(0) + (digit - 10));

        fracResult += char;

        calcText += `${tempFrac.toFixed(10)} → digit ${char}\n`;

        tempFrac -= digit;
      }
    }

    // ---------- 5️⃣ 組合結果 ----------
    let finalResult = fracResult ? `${intResult}.${fracResult}` : intResult;

    setOutputValue(finalResult);
    setCalculationSteps(calcText);
  };

  const swap = () => {
    let tempBase = fromBase;
    setFromBase(toBase);
    setToBase(tempBase);
    setInputValue("");
    setOutputValue("");
    setCalculationSteps("");
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputValue);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };
  return (
    <div className="conversion">
      <h3>Radix Converter</h3>
      <form onSubmit={convert}>
        <div className="first_row">
          <label className="first_col">&nbsp;</label>
          <div className="col">
            <label>From</label>
            <select
              value={fromBase.value}
              onChange={(e) => handleBaseChange(e, true)}
            >
              {bases.map((base) => (
                <option key={base.value} value={base.value}>
                  {base.value} ({base.label})
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>To</label>
            <select
              value={toBase.value}
              onChange={(e) => handleBaseChange(e, false)}
            >
              {bases.map((base) => (
                <option key={base.value} value={base.value}>
                  {base.value} ({base.label})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="radix_row">
          <label>{`Enter ${fromBase.label} number`}</label>
          <div className="radixInput_group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div>
              <span>{fromBase.value}</span>
            </div>
          </div>
        </div>
        <div className="row toRight">
          <div className="buttons">
            <button className="convert" onClick={convert}>
              <span>=</span> Convert
            </button>
            <button
              type="button"
              onClick={() => {
                // 只清空輸入欄位
                setInputValue("");
                // 清空結果和計算過程
                setOutputValue("");
                setCalculationSteps("");
              }}
            >
              <span>×</span> Reset
            </button>
            <button type="button" onClick={swap}>
              <span>⇅</span> Swap
            </button>
          </div>
        </div>
        <div className="radix_row">
          <label>{toBase.label} number</label>
          <div className="radixInput_group">
            <input value={outputValue} type="text" readOnly />

            <div>
              <span>{toBase.value}</span>
            </div>
            <div style={{ marginLeft: "1px", position: "relative" }}>
              <img
                src="/icons/copy.png"
                alt="copy button"
                onClick={copyToClipboard}
              />
              {showToast && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "6px",
                    backgroundColor: "#333",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    animation: "fadeIn 0.2s ease-in",
                  }}
                >
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "1.25rem", lineHeight: "2" }}>
            {toBase.label} calculation steps
          </label>
          <textarea
            value={calculationSteps}
            readOnly
            rows="10"
            style={{ width: "100%" }}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default RadixConversion;
