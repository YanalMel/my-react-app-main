// src/components/LocationPriceDisplay.js
import React, { useState, useEffect } from "react";
import { usePriceData } from "../hooks/usePriceData";
import {
  processCraftResource,
  appendEnchantmentToMaterial,
} from "../utils/helpers"; // Add appendEnchantmentToMaterial

const LocationPriceDisplay = ({
  location,
  itemData,
  enchantmentLevel,
  fetchTriggered,
  resetFetchTrigger,
}) => {
  const [recipes, setRecipes] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [potentialProfits, setPotentialProfits] = useState({});
  const { itemDisplayNames, materialPrices, loading } = usePriceData(
    itemData,
    enchantmentLevel,
    fetchTriggered,
    resetFetchTrigger,
    location,
    recipes
  );

  useEffect(() => {
    if (itemData && Array.isArray(itemData.craftresource)) {
      const processedRecipes = itemData.craftresource.map((resourceGroup) => {
        if (Array.isArray(resourceGroup.craftresource)) {
          return {
            type: resourceGroup.type,
            materials: processCraftResource(resourceGroup.craftresource),
          };
        }
        return null;
      });

      setRecipes(processedRecipes.filter(Boolean));
    } else {
      setRecipes([]);
    }
  }, [itemData]);

  const calculateTotalCost = (resources) => {
    console.log("Calculating total cost for resources:", resources); // Log resources to see what is passed
    console.log("Current materialPrices:", materialPrices); // Log material prices

    const totalCost = resources.reduce((total, resource) => {
      const materialKey = resource.uniquename.includes("ARTEFACT")
        ? resource.uniquename
        : `${resource.uniquename}${
            enchantmentLevel > 0
              ? `_LEVEL${enchantmentLevel}@${enchantmentLevel}`
              : ""
          }`;

      const resourcePrice = materialPrices[materialKey] || 192; // Fallback price if no price found
      const resourceTotalCost = resource.count * resourcePrice;

      console.log(
        `Resource: ${resource.uniquename}, Key: ${materialKey}, Count: ${resource.count}, Price per unit: ${resourcePrice}, Total for resource: ${resourceTotalCost}`
      ); // Log each material's cost with the calculated key

      return total + resourceTotalCost;
    }, 0);

    console.log("Total cost for all resources:", totalCost); // Log the final total cost
    return totalCost;
  };

  const handlePriceChange = (recipeIndex, price) => {
    const newItemPrices = { ...itemPrices, [recipeIndex]: price };
    setItemPrices(newItemPrices);

    const craftCost = calculateTotalCost(recipes[recipeIndex].materials);
    const potentialProfit = price - craftCost;
    setPotentialProfits({
      ...potentialProfits,
      [recipeIndex]: potentialProfit,
    });
  };

  if (loading) {
    return <p>Loading prices...</p>;
  }

  return (
    <div className="location-price-display">
      <h3>Location: {location}</h3>

      {recipes.length > 0 ? (
        recipes.map((recipe, recipeIndex) => (
          <div key={`recipe-${recipeIndex}`} className="recipe-block">
            <h4>
              Recipe {recipeIndex + 1} ({recipe.type})
            </h4>

            <div className="materials-section">
              {recipe.materials.map((material, materialIndex) => {
                const displayName =
                  itemDisplayNames[material.uniquename] || material.uniquename;
                const imageUrl = `https://render.albiononline.com/v1/item/${appendEnchantmentToMaterial(
                  material.uniquename,
                  enchantmentLevel
                )}.png`;

                return (
                  <div
                    key={`${material.uniquename}-${recipeIndex}-${materialIndex}`}
                    className="craft-material"
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={imageUrl}
                        alt={material.uniquename}
                        className="material-image"
                      />
                      <div>
                        <p>
                          {displayName} (x{material.count})
                        </p>
                      </div>
                    </div>
                    <div>
                      <p>
                        Total:{" "}
                        {material.count *
                          (materialPrices[
                            // If it's an artifact, do not append enchantment level
                            material.uniquename.includes("ARTEFACT")
                              ? material.uniquename
                              : // For non-artifacts, append _LEVELx@x if enchantment level is greater than 0
                                `${material.uniquename}${
                                  enchantmentLevel > 0
                                    ? `_LEVEL${enchantmentLevel}@${enchantmentLevel}`
                                    : ""
                                }`
                          ] || 0)}{" "}
                        (Price per unit:{" "}
                        {materialPrices[
                          material.uniquename.includes("ARTEFACT")
                            ? material.uniquename
                            : `${material.uniquename}${
                                enchantmentLevel > 0
                                  ? `_LEVEL${enchantmentLevel}@${enchantmentLevel}`
                                  : ""
                              }`
                        ] || "N/A"}
                        )
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="total-craft-cost-section">
              <p>
                <strong>Total Craft Cost for Recipe:</strong>{" "}
                {calculateTotalCost(recipe.materials)}
              </p>
            </div>

            <div className="item-price-section">
              <label>
                <strong>
                  Item Price for {location} (Recipe {recipeIndex + 1}):
                </strong>
              </label>
              <input
                type="number"
                value={itemPrices[recipeIndex] || 0}
                onChange={(e) =>
                  handlePriceChange(
                    recipeIndex,
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="potential-profit-section">
              <p>
                <strong>Potential Profit (Recipe {recipeIndex + 1}):</strong>{" "}
                {potentialProfits[recipeIndex] || 0}
              </p>
            </div>

            <hr style={{ margin: "20px 0", border: "1px solid #444" }} />
          </div>
        ))
      ) : (
        <p>No recipes available for this item.</p>
      )}
    </div>
  );
};

export default LocationPriceDisplay;
