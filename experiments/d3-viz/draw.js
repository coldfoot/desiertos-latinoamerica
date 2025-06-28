// Data visualization functions for D3 experiment

/**
 * Main function to create data visualization
 * @param {Object} countryData - The entire country data object
 * @param {string} level - The level key (small_units or large_units)
 * @param {string} unitKey - The specific unit key to focus on
 */
function createDataVisualization(countryData, level, unitKey) {
    console.log('Creating data visualization with:');
    console.log('- Country Data:', countryData);
    console.log('- Level:', level);
    console.log('- Unit Key:', unitKey);
    
    // Clear previous content
    const chartContainer = d3.select('#chart');
    chartContainer.html('');
    
    // Create visualization container
    const vizContainer = chartContainer.append('div')
        .attr('class', 'viz-container');
    
    // Draw the actual visualization
    drawVisualization(vizContainer, countryData, level, unitKey);
}

/**
 * Main visualization function
 * @param {Object} vizContainer - D3 selection of the visualization container
 * @param {Object} countryData - The entire country data object
 * @param {string} level - The level key
 * @param {string} unitKey - The specific unit key
 */
function drawVisualization(vizContainer, countryData, level, unitKey) {
    // Step A: Access the correct level key in the entire data
    const levelData = accessLevelData(countryData, level);
    
    // Step B: Preprocess all units in that level
    const processedLevelData = preprocessLevelData(levelData);
    
    // Step C: Dynamically create collapsible menus based on first element keys
    const menuContainers = createCollapsibleMenus(vizContainer, processedLevelData);
    
    // Step D: Add data structure preview to the dynamically created divs
    populateMenuData(menuContainers, processedLevelData, unitKey);
    
    // Create SVG canvas for future visualization
    createSVGCanvas(vizContainer);
}

/**
 * Step A: Access the correct level key in the entire data
 * @param {Object} countryData - The entire country data object
 * @param {string} level - The level key
 * @returns {Array} Array of units for the specified level
 */
function accessLevelData(countryData, level) {
    if (!countryData || !level || !countryData[level]) {
        console.error('Invalid country data or level:', { countryData, level });
        return [];
    }
    return countryData[level];
}

/**
 * Step B: Preprocess all units in that level, adding percentage variables
 * @param {Array} levelData - Array of units for the level
 * @returns {Array} Processed array of units with percentage fields added
 */
function preprocessLevelData(levelData) {
    if (!Array.isArray(levelData) || levelData.length === 0) {
        console.error('Invalid level data:', levelData);
        return [];
    }
    
    // Pre-process the data: in each dictionary (but for BASIC_INFO, BBOX, and CENTROID), 
    // iterate through the keys inside and create a new object ['{key}_PCT'] that divides 
    // the value of the given key by what's in unitData['BASIC_INFO']['NEWS_ORG_COUNT']
    // Ignore any keys that are not numeric.
    levelData.forEach(unitData => {
        for (const category in unitData) {
            if (category !== 'BASIC_INFO' && category !== 'BBOX' && category !== 'CENTROID') {
                for (const key in unitData[category]) {
                    if (!isNaN(unitData[category][key])) {
                        unitData[category][`${key}_PCT`] = unitData[category][key] / unitData['BASIC_INFO']['NEWS_ORG_COUNT'];
                    }
                }
            }
        }
    });
    
    return levelData;
}

/**
 * Step C: Dynamically create collapsible menus based on keys in the first element
 * @param {Object} vizContainer - D3 selection of the visualization container
 * @param {Array} processedLevelData - Processed array of units
 * @returns {Array} Array of menu container objects with references to their elements
 */
function createCollapsibleMenus(vizContainer, processedLevelData) {
    if (!processedLevelData || processedLevelData.length === 0) {
        console.error('No processed level data available');
        return [];
    }
    
    // Get keys from the first element (excluding BASIC_INFO, BBOX, CENTROID)
    const firstUnit = processedLevelData[0];
    const collapsibleKeys = Object.keys(firstUnit).filter(key => 
        key !== 'BASIC_INFO' && key !== 'BBOX' && key !== 'CENTROID'
    );
    
    const menuContainers = [];
    
    collapsibleKeys.forEach(key => {
        const menu = vizContainer.append('div')
            .attr('class', 'collapsible-menu')
            .attr('data-key', key);
        
        menu.append('h4').text(key);
        const placeholder = menu.append('div').attr('class', 'placeholder');
        
        // Add click event listener for collapsible functionality
        menu.select('h4').on('click', function() {
            const isExpanded = menu.classed('expanded');
            if (isExpanded) {
                menu.classed('expanded', false);
            } else {
                menu.classed('expanded', true);
            }
        });
        
        menuContainers.push({
            key: key,
            menu: menu,
            placeholder: placeholder
        });
    });
    
    return menuContainers;
}

/**
 * Step D: Add data structure preview to the dynamically created divs
 * @param {Array} menuContainers - Array of menu container objects
 * @param {Array} processedLevelData - Processed array of units
 * @param {string} unitKey - The specific unit key to focus on
 */
function populateMenuData(menuContainers, processedLevelData, unitKey) {
    if (!menuContainers || menuContainers.length === 0) {
        console.error('No menu containers available');
        return;
    }
    
    // Find the specific unit data
    const unitData = processedLevelData.find(unit => unit.BASIC_INFO.KEY === unitKey);
    if (!unitData) {
        console.error('Unit data not found for key:', unitKey);
        return;
    }
    
    // Populate each menu with its relevant data
    menuContainers.forEach(container => {
        const keyData = unitData[container.key];
        
        if (typeof keyData === 'object' && keyData !== null) {
            // Display object data as key-value pairs
            Object.entries(keyData).forEach(([dataKey, value]) => {
                const row = container.placeholder.append('div')
                    .attr('class', 'data-row');
                row.append('span')
                    .attr('class', 'data-key')
                    .text(dataKey + ': ');
                row.append('span')
                    .attr('class', 'data-value')
                    .text(typeof value === 'number' ? value.toFixed(2) : value);
            });
        } else {
            // Display simple value
            container.placeholder.append('div')
                .attr('class', 'data-value')
                .text(typeof keyData === 'number' ? keyData.toFixed(2) : keyData);
        }
    });
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createDataVisualization };
}
