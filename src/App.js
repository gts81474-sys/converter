import React from "react";
import LengthConversion from "./pages/LengthConversion";
import WeightConversion from "./pages/WeightConversion";
import RadixConversion from "./pages/RadixConversion";
import TemperatureConversion from "./pages/TemperatureConversion";
import FrequencyConversion from "./pages/FrequencyConversion";
import ColorConversion from "./pages/ColorConversion";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Nav from "./pages/Nav";
import { Routes, Route } from "react-router-dom";
import "./styles/style.css";

function App() {
  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lengthConversion" element={<LengthConversion />} />
        <Route path="/weightConversion" element={<WeightConversion />} />
        <Route
          path="/temperatureConversion"
          element={<TemperatureConversion />}
        />
        <Route path="/frequencyConversion" element={<FrequencyConversion />} />
        <Route path="/colorConversion" element={<ColorConversion />} />
        <Route path="/radixConversion" element={<RadixConversion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
