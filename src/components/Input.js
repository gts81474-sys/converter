// src/components/Input.js
const Input = ({ value = "", onChange, unit, index }) => {
  const getLabel = () => {
    if (unit?.value === "feet+inches") {
      return index === 0 ? "ft" : "in";
    }
    return unit?.value || unit || "";
  };
  return (
    <div>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getLabel()}
      />

      <div className="backUnit">
        <span>{getLabel()}</span>
      </div>
    </div>
  );
};

export default Input;
