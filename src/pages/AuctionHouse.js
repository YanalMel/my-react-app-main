// src/pages/AuctionHouse.js

import React, { useState, useEffect } from "react";
import Filters from "../components/Filters";
import ItemList from "../components/ItemList";
import Pagination from "../components/Pagination";
import useFavorites from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";

export default function AuctionHouse() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { favorites, toggleFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsText = await fetch("/items.txt").then((res) => res.text());
      const outputJson = await fetch("/Output.json").then((res) => res.json());

      const displayNames = {};
      const lines = itemsText.split("\n");
      lines.forEach((line) => {
        const parts = line.split(":");
        if (parts.length >= 3) {
          const uniqueName = parts[1].trim();
          const displayName = parts[2].trim();
          displayNames[uniqueName] = displayName;
        }
      });

      const itemsData = outputJson.equipmentitem.concat(outputJson.weapon);
      const enrichedItems = itemsData.map((item) => ({
        ...item,
        displayName: displayNames[item.uniquename] || item.uniquename,
        displayTier: `${item.tier}.0`,
      }));

      const extractedCategories = {};
      enrichedItems.forEach((item) => {
        if (!extractedCategories[item.shopcategory]) {
          extractedCategories[item.shopcategory] = new Set();
        }
        if (item.shopsubcategory1) {
          extractedCategories[item.shopcategory].add(item.shopsubcategory1);
        }
      });

      setItems(enrichedItems);
      setFilteredItems(enrichedItems);
      setCategories(extractedCategories);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const applyFilters = (newFilters) => {
    let filtered = items;

    if (newFilters.search) {
      filtered = filtered.filter((item) =>
        item.displayName.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    if (newFilters.category !== "All") {
      filtered = filtered.filter(
        (item) => item.shopcategory === newFilters.category
      );
    }

    if (newFilters.subcategory !== "All") {
      filtered = filtered.filter(
        (item) => item.shopsubcategory1 === newFilters.subcategory
      );
    }

    if (newFilters.tier !== "All") {
      filtered = filtered.filter((item) => item.tier === newFilters.tier);
    }

    if (newFilters.enchantment !== "All") {
      const enchantmentSuffix = `@${newFilters.enchantment}`;
      filtered = filtered.map((item) => ({
        ...item,
        uniquename: `${item.uniquename}${enchantmentSuffix}`,
        image: `${item.image.replace(".png", "")}${enchantmentSuffix}.png`,
        displayTier: `${item.tier}.${newFilters.enchantment}`,
      }));
    } else {
      filtered = filtered.map((item) => ({
        ...item,
        displayTier: `${item.tier}.0`,
      }));
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleClearFilters = () => {
    setFilteredItems(items);
    setCurrentPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item.uniquename}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowFavorites = () => {
    if (showFavorites) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => favorites.includes(item.uniquename))
      );
    }
    setShowFavorites(!showFavorites);
    setCurrentPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <Filters
        onApplyFilters={applyFilters}
        onClear={handleClearFilters}
        categories={categories}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          Showing{" "}
          {
            filteredItems.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            ).length
          }{" "}
          out of {filteredItems.length} results
        </h2>
        <button onClick={handleShowFavorites} className="show-favorites-btn">
          {showFavorites ? "Show All Items" : "Show Favorites"}
        </button>
      </div>

      <ItemList
        key={refreshKey}
        items={filteredItems.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )}
        onItemSelect={handleItemClick}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
