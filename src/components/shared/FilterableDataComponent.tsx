import { useState } from "react";

// Recursive function to build filters dynamically
const buildFilters = (data) => {
  const filters = {};

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const value = item[key];

      // Handle nested keys (e.g., "plant:method")
      if (key.includes(":")) {
        const [parentKey, childKey] = key.split(":");
        if (!filters[parentKey]) filters[parentKey] = {};
        if (!filters[parentKey][childKey]) filters[parentKey][childKey] = new Set();
        filters[parentKey][childKey].add(value);
      } else {
        // Handle flat keys
        if (!filters[key]) filters[key] = new Set();
        filters[key].add(value);
      }
    });
  });

  return filters;
};

// Filter the data based on the selected filters
const applyFilters = (data, selectedFilters) => {
  return data.filter((item) => {
    return Object.keys(selectedFilters).every((filterKey) => {
      if (typeof selectedFilters[filterKey] === "object") {
        // Handle nested filters
        return Object.keys(selectedFilters[filterKey]).every((nestedKey) => {
          return (
            item[`${filterKey}:${nestedKey}`] === selectedFilters[filterKey][nestedKey]
          );
        });
      } else {
        // Handle flat filters
        return item[filterKey] === selectedFilters[filterKey];
      }
    });
  });
};

// React component to display filters and filtered items
export const DynamicFilterComponent = ({ data }) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const filters = buildFilters(data);

  const handleFilterChange = (key, value, isNested = false, parentKey = null) => {
    const updatedFilters = { ...selectedFilters };

    if (isNested) {
      if (!updatedFilters[parentKey]) updatedFilters[parentKey] = {};
      updatedFilters[parentKey][key] = value;
    } else {
      updatedFilters[key] = value;
    }

    setSelectedFilters(updatedFilters);
  };

  // Render the filters dynamically
  const renderFilters = (filters) => {
    return Object.keys(filters).map((key) => {
      const filterValues = filters[key];

      if (typeof filterValues === "object" && !Array.isArray(filterValues)) {
        // Nested filters case
        return (
          <div key={key}>
            <h3>{key}</h3>
            {renderFilters(filterValues)}
          </div>
        );
      } else {
        // Flat filters case
        return (
          <div key={key}>
            <label>{key}</label>
            <select onChange={(e) => handleFilterChange(key, e.target.value)}>
              <option value="">Select {key}</option>
              {[...filterValues].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        );
      }
    });
  };

  const filteredData = applyFilters(data, selectedFilters);

  return (
    <div>
      <h2>Dynamic Filters</h2>
      {renderFilters(filters)}

      <div>
        <h3>Filtered Items:</h3>
        <pre>{JSON.stringify(filteredData?.tags, null, 2)}</pre>
      </div>

      <div>
        <h3>Selected Filters:</h3>
        <pre>{JSON.stringify(selectedFilters, null, 2)}</pre>
      </div>
    </div>
  );
};
