import React from "react";
import { useLocation, Link } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  let crumbs = location.pathname.split("/").filter((crumb) => crumb !== "");
  const breadcrumbNameMap = {
    lengthConversion: "Length conversion",
    temperatureConversion: "Temperature conversion",
    weightConversion: "Weight conversion",
    frequencyConversion: "Frequency conversion",
    colorConversion: "Color conversion",
    radixConversion: "Radix conversion",
  };
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {crumbs.map((crumb, index) => {
            const path = "/" + (crumbs.slice(0, index + 1).join("/") || "");
            return path !== "/" ? (
              <li key={index}>
                <Link to={path}>{breadcrumbNameMap[crumb]}</Link>
              </li>
            ) : null;
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
