import React, { useState, useEffect } from "react";
// Filters.js

export default function Filters({ onApplyFilters, onClear, categories }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    subcategory: "All",
    tier: "All",
    enchantment: "All",
  });

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (filters.category === "All") {
      setSubcategories([]); // Reset subcategories when 'All' is selected
    } else {
      setSubcategories([...categories[filters.category]]); // Populate subcategories based on selected category
    }
  }, [filters.category, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onApplyFilters(filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setFilters({
      search: "",
      category: "All",
      subcategory: "All",
      tier: "All",
      enchantment: "All",
    });
    setSubcategories([]); // Reset subcategories
    onClear(); // Trigger clearing behavior in the parent
  };

  return (
    <div className="filters">
      {/* First row: search input and dropdowns */}
      <div className="filter-inputs">
        <input
          type="text"
          placeholder="Search by name..."
          name="search"
          value={filters.search}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="All">All Categories</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          name="subcategory"
          value={filters.subcategory}
          onChange={handleChange}
          disabled={filters.category === "All"}
        >
          <option value="All">All Subcategories</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>

        <select name="tier" value={filters.tier} onChange={handleChange}>
          <option value="All">All Tiers</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
          <option value="4">Tier 4</option>
          <option value="5">Tier 5</option>
          <option value="6">Tier 6</option>
          <option value="7">Tier 7</option>
          <option value="8">Tier 8</option>
        </select>

        <select
          name="enchantment"
          value={filters.enchantment}
          onChange={handleChange}
        >
          <option value="All">All Enchantments</option>
          <option value="1">Enchantment 1</option>
          <option value="2">Enchantment 2</option>
          <option value="3">Enchantment 3</option>
          <option value="4">Enchantment 4</option>
        </select>
      </div>

      {/* Second row: Search and Clear buttons */}
      <div className="filter-buttons">
        <button onClick={handleSearch}>Search</button>

        <button onClick={handleClear} id="clearButton">
          Clear Filters
        </button>
      </div>
    </div>
  );
}
