// src/utils/helpers.js
export const appendEnchantmentToMaterial = (uniquename, enchantmentLevel) => {
  const isArtifact = uniquename.includes("ARTEFACT");
  if (enchantmentLevel > 0 && !isArtifact) {
    return `${uniquename}_LEVEL${enchantmentLevel}@${enchantmentLevel}`;
  }
  return uniquename;
};

export const appendEnchantmentToItem = (uniquename, enchantmentLevel) => {
  if (enchantmentLevel > 0) {
    return `${uniquename}@${enchantmentLevel}`;
  }
  return uniquename;
};

export const groupPricesByLocation = (data) => {
  const priceMapByLocation = {};

  data.forEach((priceInfo) => {
    const { item_id, city, sell_price_min } = priceInfo;

    if (!priceMapByLocation[city]) {
      priceMapByLocation[city] = {};
    }

    if (!priceMapByLocation[city][item_id]) {
      priceMapByLocation[city][item_id] = sell_price_min || 0;
    } else {
      if (
        sell_price_min > 0 &&
        (sell_price_min < priceMapByLocation[city][item_id] ||
          priceMapByLocation[city][item_id] === 0)
      ) {
        priceMapByLocation[city][item_id] = sell_price_min;
      }
    }
  });

  return priceMapByLocation;
};

export const processCraftResource = (craftresourceArray) => {
  let materials = [];
  if (Array.isArray(craftresourceArray)) {
    craftresourceArray.forEach((material) => {
      if (material.craftresource) {
        materials = materials.concat(
          processCraftResource(material.craftresource)
        );
      } else {
        if (material && material.uniquename && material.count) {
          materials.push(material);
        }
      }
    });
  }
  return materials;
};
