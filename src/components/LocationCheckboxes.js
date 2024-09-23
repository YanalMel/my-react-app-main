// src/components/LocationCheckboxes.js
import React from "react";

const LocationCheckboxes = ({
  locations,
  selectedLocations,
  handleLocationChange,
}) => {
  return (
    <div>
      <h3>Select Location(s):</h3>
      <div className="locations">
        {locations.map((location) => (
          <label key={location}>
            <input
              type="checkbox"
              value={location}
              checked={selectedLocations.includes(location)}
              onChange={() => handleLocationChange(location)}
            />
            {location}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LocationCheckboxes;
