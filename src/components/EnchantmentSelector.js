// src/components/EnchantmentSelector.js
import React from "react";

const EnchantmentSelector = ({ enchantmentLevel, handleEnchantmentChange }) => {
  return (
    <div>
      <strong>Enchantment Level:</strong>
      <select
        value={enchantmentLevel}
        onChange={(e) => handleEnchantmentChange(e.target.value)}
        className="enchantment-select"
      >
        {[0, 1, 2, 3, 4].map((level) => (
          <option key={level} value={level}>
            Level {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EnchantmentSelector;
