// src/hooks/useItemData.js
import { useState, useEffect } from "react";

export const useItemData = (uniqueName) => {
  const [itemData, setItemData] = useState(null);
  const [displayName, setDisplayName] = useState(uniqueName);
  const [enchantmentLevel, setEnchantmentLevel] = useState(0);

  const getBaseItemName = (uniqueName) => uniqueName.split("@")[0];

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const response = await fetch("/items.txt");
        const text = await response.text();

        const items = text
          .split("\n")
          .map((line) => {
            const [, uniqueNameWithSpaces, displayName] = line.split(":");
            return uniqueNameWithSpaces && displayName
              ? {
                  uniqueName: uniqueNameWithSpaces.trim(),
                  displayName: displayName.trim(),
                }
              : null;
          })
          .filter(Boolean);

        const baseName = getBaseItemName(uniqueName);
        const matchedItem = items.find((item) => item.uniqueName === baseName);

        setDisplayName(matchedItem ? matchedItem.displayName : uniqueName);
      } catch (error) {
        console.error("Error fetching items.txt:", error);
        setDisplayName(uniqueName);
      }
    };

    fetchDisplayName();
  }, [uniqueName]);

  useEffect(() => {
    const [itemBaseId, enchant] = uniqueName.split("@");
    const enchantment = parseInt(enchant) || 0;
    setEnchantmentLevel(enchantment);

    const fetchItemData = async () => {
      try {
        const response = await fetch("/Output.json");
        const data = await response.json();
        const item =
          data.equipmentitem.find((itm) => itm.uniquename === itemBaseId) ||
          data.weapon.find((itm) => itm.uniquename === itemBaseId);

        setItemData(item || null);
      } catch (error) {
        console.error("Error fetching Output.json:", error);
      }
    };

    fetchItemData();
  }, [uniqueName]);

  return { itemData, displayName, enchantmentLevel, setEnchantmentLevel };
};
