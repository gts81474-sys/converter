// src/components/Output.js
const Output = ({ value = "", unit, index }) => {
  const getLabel = () => {
    if (unit === "feet+inches") {
      return index === 0 ? "ft" : "in";
    }
    return unit || "";
  };

  return (
    <div>
      <input type="text" value={value} readOnly />
      <div className="backUnit">
        <span>{getLabel()}</span>
      </div>
    </div>
  );
};

export default Output;
