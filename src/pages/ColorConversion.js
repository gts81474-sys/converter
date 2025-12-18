import React, { useState, useEffect } from "react";

const ColorConversion = () => {
  const formats = [
    { value: "hex", label: "HEX" },
    { value: "rgb", label: "RGB" },
    { value: "hsl", label: "HSL" },
    { value: "cmyk", label: "CMYK" },
  ];

  const [fromFormat, setFromFormat] = useState(formats[0]);
  const [inputValue, setInputValue] = useState("#FF5733");
  const [results, setResults] = useState({
    hex: "",
    rgb: "",
    hsl: "",
    cmyk: "",
  });
  const [calculation, setCalculation] = useState("");
  const [colorPreview, setColorPreview] = useState("#FF5733");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
        default:
          h = 0;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h, s, l) => {
    h = Math.max(0, Math.min(360, h)) / 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const rgbToCmyk = (r, g, b) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);

    c = k === 1 ? 0 : (c - k) / (1 - k);
    m = k === 1 ? 0 : (m - k) / (1 - k);
    y = k === 1 ? 0 : (y - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  const cmykToRgb = (c, m, y, k) => {
    c = Math.max(0, Math.min(100, c)) / 100;
    m = Math.max(0, Math.min(100, m)) / 100;
    y = Math.max(0, Math.min(100, y)) / 100;
    k = Math.max(0, Math.min(100, k)) / 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    };
  };

  // 即時預覽顏色
  useEffect(() => {
    try {
      let rgb;
      switch (fromFormat.value) {
        case "hex":
          rgb = hexToRgb(inputValue);
          if (rgb) {
            setColorPreview(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        case "rgb":
          const rgbMatch = inputValue.match(/(\d+),?\s*(\d+)?,?\s*(\d+)?/);
          if (rgbMatch && rgbMatch[1]) {
            const r = parseInt(rgbMatch[1]) || 0;
            const g = parseInt(rgbMatch[2]) || 0;
            const b = parseInt(rgbMatch[3]) || 0;
            rgb = { r, g, b };
            setColorPreview(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        case "hsl":
          const hslMatch = inputValue.match(/(\d+),?\s*(\d+)?%?,?\s*(\d+)?%?/);
          if (hslMatch && hslMatch[1]) {
            const h = parseInt(hslMatch[1]) || 0;
            const s = parseInt(hslMatch[2]) || 0;
            const l = parseInt(hslMatch[3]) || 0;
            rgb = hslToRgb(h, s, l);
            setColorPreview(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        case "cmyk":
          const cmykMatch = inputValue.match(
            /(\d+)%?,?\s*(\d+)?%?,?\s*(\d+)?%?,?\s*(\d+)?%?/
          );
          if (cmykMatch && cmykMatch[1]) {
            const c = parseInt(cmykMatch[1]) || 0;
            const m = parseInt(cmykMatch[2]) || 0;
            const y = parseInt(cmykMatch[3]) || 0;
            const k = parseInt(cmykMatch[4]) || 0;
            rgb = cmykToRgb(c, m, y, k);
            setColorPreview(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        default:
          break;
      }
    } catch (error) {
      // 忽略預覽錯誤
    }
  }, [inputValue, fromFormat]);

  const convert = (e) => {
    e.preventDefault();
    let rgb;
    let steps = [];

    try {
      switch (fromFormat.value) {
        case "hex":
          rgb = hexToRgb(inputValue);
          if (!rgb) throw new Error("Invalid HEX format");
          steps.push(`HEX: ${inputValue}`);
          steps.push(`RGB: R=${rgb.r}, G=${rgb.g}, B=${rgb.b}`);
          break;

        case "rgb":
          const rgbMatch = inputValue.match(/(\d+),\s*(\d+),\s*(\d+)/);
          if (!rgbMatch)
            throw new Error("Invalid RGB format. Use: 255, 87, 51");
          rgb = {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3]),
          };
          steps.push(`RGB Input: R=${rgb.r}, G=${rgb.g}, B=${rgb.b}`);
          break;

        case "hsl":
          const hslMatch = inputValue.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
          if (!hslMatch) throw new Error("Invalid HSL format. Use: 9, 100, 65");
          const h = parseInt(hslMatch[1]);
          const s = parseInt(hslMatch[2]);
          const l = parseInt(hslMatch[3]);
          rgb = hslToRgb(h, s, l);
          steps.push(`HSL Input: H=${h}°, S=${s}%, L=${l}%`);
          steps.push(`Converted to RGB: R=${rgb.r}, G=${rgb.g}, B=${rgb.b}`);
          break;

        case "cmyk":
          const cmykMatch = inputValue.match(
            /(\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?/
          );
          if (!cmykMatch)
            throw new Error("Invalid CMYK format. Use: 0, 66, 80, 0");
          const c = parseInt(cmykMatch[1]);
          const m = parseInt(cmykMatch[2]);
          const y = parseInt(cmykMatch[3]);
          const k = parseInt(cmykMatch[4]);
          rgb = cmykToRgb(c, m, y, k);
          steps.push(`CMYK Input: C=${c}%, M=${m}%, Y=${y}%, K=${k}%`);
          steps.push(`Converted to RGB: R=${rgb.r}, G=${rgb.g}, B=${rgb.b}`);
          break;

        default:
          throw new Error("Unknown format");
      }

      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      setResults({
        hex: hex.toUpperCase(),
        rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
        hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`,
        cmyk: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`,
      });

      steps.push(`\nAll formats:`);
      steps.push(`HEX: ${hex.toUpperCase()}`);
      steps.push(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);
      steps.push(`HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`);
      steps.push(`CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`);

      setCalculation(steps.join("\n"));
    } catch (error) {
      setCalculation(`Error: ${error.message}`);
    }
  };

  const getPlaceholder = () => {
    switch (fromFormat.value) {
      case "hex":
        return "#FF5733";
      case "rgb":
        return "255, 87, 51";
      case "hsl":
        return "9, 100, 65";
      case "cmyk":
        return "0, 66, 80, 0";
      default:
        return "";
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${label} copied!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  return (
    <div className="conversion">
      <h3>Color Converter</h3>
      <form onSubmit={convert}>
        <div className="first_row">
          <label className="first_col">&nbsp;</label>
          <div className="col">
            <label>Input Format</label>
            <select
              value={fromFormat.value}
              onChange={(e) => {
                setFromFormat(formats.find((f) => f.value === e.target.value));
                setInputValue("");
              }}
            >
              {formats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Preview</label>
            <div
              style={{
                width: "100%",
                height: "42px",
                backgroundColor: colorPreview,
                border: "1px solid #ced4da",
                borderRadius: "6px",
                transition: "background-color 0.2s ease",
              }}
            ></div>
          </div>
        </div>

        <div className="radix_row">
          <label>Enter {fromFormat.label} value</label>
          <div className="radixInput_group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
            />
            <div>
              <span>{fromFormat.value.toUpperCase()}</span>
            </div>
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
                setInputValue("");
                setResults({ hex: "", rgb: "", hsl: "", cmyk: "" });
                setCalculation("");
                setColorPreview("#FFFFFF");
              }}
            >
              <span>×</span> Reset
            </button>
          </div>
        </div>

        <div className="radix_row">
          <label>HEX</label>
          <div className="radixInput_group">
            <input value={results.hex} type="text" readOnly />
            <div>
              <span>HEX</span>
            </div>
            <div style={{ marginLeft: "1px", position: "relative" }}>
              <img
                src="/icons/copy.png"
                alt="copy button"
                onClick={() => copyToClipboard(results.hex, "HEX")}
                style={{
                  cursor: results.hex ? "pointer" : "default",
                  opacity: results.hex ? 1 : 0.5,
                }}
              />
              {showToast && toastMessage === "HEX copied!" && (
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
                  {toastMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="radix_row">
          <label>RGB</label>
          <div className="radixInput_group">
            <input value={results.rgb} type="text" readOnly />
            <div>
              <span>RGB</span>
            </div>
            <div style={{ marginLeft: "1px", position: "relative" }}>
              <img
                src="/icons/copy.png"
                alt="copy button"
                onClick={() => copyToClipboard(results.rgb, "RGB")}
                style={{
                  cursor: results.rgb ? "pointer" : "default",
                  opacity: results.rgb ? 1 : 0.5,
                }}
              />
              {showToast && toastMessage === "RGB copied!" && (
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
                  {toastMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="radix_row">
          <label>HSL</label>
          <div className="radixInput_group">
            <input value={results.hsl} type="text" readOnly />
            <div>
              <span>HSL</span>
            </div>
            <div style={{ marginLeft: "1px", position: "relative" }}>
              <img
                src="/icons/copy.png"
                alt="copy button"
                onClick={() => copyToClipboard(results.hsl, "HSL")}
                style={{
                  cursor: results.hsl ? "pointer" : "default",
                  opacity: results.hsl ? 1 : 0.5,
                }}
              />
              {showToast && toastMessage === "HSL copied!" && (
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
                  {toastMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="radix_row">
          <label>CMYK</label>
          <div className="radixInput_group">
            <input value={results.cmyk} type="text" readOnly />
            <div>
              <span>CMYK</span>
            </div>
            <div style={{ marginLeft: "1px", position: "relative" }}>
              <img
                src="/icons/copy.png"
                alt="copy button"
                onClick={() => copyToClipboard(results.cmyk, "CMYK")}
                style={{
                  cursor: results.cmyk ? "pointer" : "default",
                  opacity: results.cmyk ? 1 : 0.5,
                }}
              />
              {showToast && toastMessage === "CMYK copied!" && (
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
                  {toastMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "1.25rem", lineHeight: "2" }}>
            Conversion Steps
          </label>
          <textarea
            value={calculation}
            readOnly
            rows="10"
            style={{ width: "100%" }}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default ColorConversion;
