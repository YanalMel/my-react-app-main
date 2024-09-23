// src/hooks/usePriceData.js
import { useState, useEffect, useCallback } from "react";
import {
  groupPricesByLocation,
  appendEnchantmentToItem,
  appendEnchantmentToMaterial,
} from "../utils/helpers";

export const usePriceData = (
  itemData,
  enchantmentLevel,
  fetchTriggered,
  resetFetchTrigger,
  location,
  recipes
) => {
  const [itemDisplayNames, setItemDisplayNames] = useState({});
  const [materialPrices, setMaterialPrices] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch item display names from items.txt
  useEffect(() => {
    const fetchItemDisplayNames = async () => {
      try {
        const response = await fetch("/items.txt");
        const text = await response.text();

        const items = text.split("\n").map((line) => {
          const [, uniqueNameWithSpaces, displayName] = line.split(":");
          return uniqueNameWithSpaces && displayName
            ? {
                uniqueName: uniqueNameWithSpaces.trim(),
                displayName: displayName.trim(),
              }
            : null;
        });

        const displayNameMap = items.reduce((acc, item) => {
          if (item && item.uniqueName && item.displayName) {
            acc[item.uniqueName] = item.displayName;
          }
          return acc;
        }, {});

        setItemDisplayNames(displayNameMap);
      } catch (error) {
        console.error("Error fetching items.txt:", error);
      }
    };

    fetchItemDisplayNames();
  }, []);

  // Fetch material prices from API
  const fetchApiPrices = useCallback(async () => {
    if (!fetchTriggered) return;
    setLoading(true);

    try {
      const materialNames = recipes
        .flatMap((recipe) =>
          recipe.materials.map((material) =>
            appendEnchantmentToMaterial(material.uniquename, enchantmentLevel)
          )
        )
        .join(",");

      const apiUrl = `https://west.albion-online-data.com/api/v2/stats/prices/${appendEnchantmentToItem(
        itemData.uniquename,
        enchantmentLevel
      )},${materialNames}?locations=${location}`;

      console.log("Fetching prices from API:", apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("API Response:", data);
      const groupedPrices = groupPricesByLocation(data);
      setMaterialPrices(groupedPrices[location] || {});
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
      resetFetchTrigger();
    }
  }, [
    recipes,
    itemData,
    location,
    enchantmentLevel,
    fetchTriggered,
    resetFetchTrigger,
  ]);

  useEffect(() => {
    if (fetchTriggered) {
      fetchApiPrices();
    }
  }, [fetchTriggered, fetchApiPrices]);

  return { itemDisplayNames, materialPrices, loading };
};
