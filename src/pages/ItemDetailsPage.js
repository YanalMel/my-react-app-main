// src/pages/ItemDetailsPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationPriceDisplay from "../components/LocationPriceDisplay";
import { useItemData } from "../hooks/useItemData";
import EnchantmentSelector from "../components/EnchantmentSelector";
import LocationCheckboxes from "../components/LocationCheckboxes";

const locations = [
  "Thetford",
  "Fort Sterling",
  "Lymhurst",
  "Bridgewatch",
  "Martlock",
  "Caerleon",
  "Brecilien",
];

const ItemDetailsPage = () => {
  const { uniqueName } = useParams();
  const { itemData, displayName, enchantmentLevel, setEnchantmentLevel } =
    useItemData(uniqueName);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const navigate = useNavigate();

  const handleFetchPrices = () => setFetchTriggered(true);

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleEnchantmentChange = (level) => {
    setEnchantmentLevel(parseInt(level));
    const newUrl = `/item/${uniqueName.split("@")[0]}@${level}`;
    navigate(newUrl);
  };

  if (!itemData) return <div>Loading item data...</div>;

  return (
    <div className="item-details-container">
      <div className="item-details-box">
        <div className="item-details-left">
          <img
            src={`https://render.albiononline.com/v1/item/${
              itemData.uniquename
            }${enchantmentLevel ? `@${enchantmentLevel}` : ""}.png`}
            alt={displayName}
            className="item-image"
          />
        </div>
        <div className="item-details-right">
          <h1 className="item-name">{displayName}</h1>
          <p>
            <strong>Tier:</strong> {itemData.tier}
          </p>
          <p>
            <strong>Category:</strong> {itemData.shopcategory || "Unknown"}
          </p>
          <p>
            <strong>Subcategory:</strong>{" "}
            {itemData.shopsubcategory1 || "Unknown"}
          </p>

          <EnchantmentSelector
            enchantmentLevel={enchantmentLevel}
            handleEnchantmentChange={handleEnchantmentChange}
          />

          <LocationCheckboxes
            locations={locations}
            selectedLocations={selectedLocations}
            handleLocationChange={handleLocationChange}
          />

          <button className="fetch-prices-btn" onClick={handleFetchPrices}>
            Fetch Prices
          </button>
        </div>
      </div>

      <div className="location-prices-section">
        {selectedLocations.length > 0 &&
          selectedLocations.map((location) => (
            <LocationPriceDisplay
              key={location}
              location={location}
              itemData={itemData}
              enchantmentLevel={enchantmentLevel}
              fetchTriggered={fetchTriggered}
              resetFetchTrigger={() => setFetchTriggered(false)}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemDetailsPage;
