import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h2>Units Conversion</h2>
      <ul>
        <li>
          <Link to="/lengthConversion">Length Conversion</Link>
        </li>
        <li>
          <Link to="/weightConversion">Weight Conversion</Link>
        </li>
        <li>
          <Link to="/temperatureConversion">Temperature Conversion</Link>
        </li>
        <li>
          <Link to="/frequencyConversion">Frequency Conversion</Link>
        </li>
        <li>
          <Link to="/colorConversion">Color Conversion</Link>
        </li>
        <li>
          <Link to="/radixConversion">Radix Conversion</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
