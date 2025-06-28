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
 * @param {Object} countryData - The entire country data object (already preprocessed)
 * @param {string} level - The level key
 * @param {string} unitKey - The specific unit key
 */
function drawVisualization(vizContainer, countryData, level, unitKey) {
    // Step A: Access the correct level key in the entire data
    const levelData = accessLevelData(countryData, level);
    
    // Find and log the selected unit object
    const selectedUnit = levelData.find(unit => unit.BASIC_INFO.KEY === unitKey);
    console.log('=== SELECTED UNIT OBJECT ===');
    console.log('Unit Key:', unitKey);
    console.log('Selected Unit:', selectedUnit);
    console.log('===========================');
    
    // Step B: Dynamically create menu triggers based on keys in the first element
    const menuContainers = createMenuTriggers(vizContainer, levelData);
    
    // Step C: Add data structure preview to the dynamically created divs
   //  populateMenuData(menuContainers, levelData, unitKey);
    
    // Step D: calls the small multiple drawing function at each one of the menu triggers
    menuContainers.forEach(menu => {
        addSmallMultiplesToMenu(menu, levelData, unitKey);
    });
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
 * Utility to create the popup overlay and content
 * @param {string} title - The title of the popup
 * @param {Node} contentNode - The content node to be displayed in the popup
 */
function showMenuPopup(title, contentNode) {
    // Remove any existing popup
    d3.selectAll('.menu-popup-overlay').remove();

    // Create overlay
    const overlay = d3.select('body').append('div')
        .attr('class', 'menu-popup-overlay');

    // Create popup
    const popup = overlay.append('div')
        .attr('class', 'menu-popup');

    // Close button
    popup.append('button')
        .attr('class', 'menu-popup-close')
        .attr('aria-label', 'Cerrar')
        .html('&times;')
        .on('click', () => overlay.remove());

    // Title
    popup.append('h4')
        .attr('style', 'margin-top:0;margin-bottom:24px;')
        .text(title);

    // Content
    popup.node().appendChild(contentNode);
}

/**
 * Step B: Dynamically create menu triggers based on keys in the first element
 * @param {Object} vizContainer - D3 selection of the visualization container
 * @param {Array} levelData - Array of units for the level (already preprocessed)
 * @returns {Array} Array of menu container objects with references to their elements
 */
function createMenuTriggers(vizContainer, levelData) {
    if (!levelData || levelData.length === 0) {
        console.error('No level data available');
        return [];
    }

    // Get keys from the first element (excluding BASIC_INFO, BBOX, CENTROID)
    const firstUnit = levelData[0];
    const menuKeys = Object.keys(firstUnit).filter(key => 
        key !== 'BASIC_INFO' && key !== 'BBOX' && key !== 'CENTROID'
    );

    const menuContainers = [];

    menuKeys.forEach(key => {
        const menu = vizContainer.append('div')
            .attr('class', 'menu-trigger')
            .attr('data-key', key);

        // Menu header acts as trigger
        const header = menu.append('h4').text(key);
        // The viz area is created but not shown in the menu
        const vizArea = document.createElement('div');
        vizArea.className = 'viz-area';

        // Add click event listener for popup functionality
        header.on('click', function() {
            // Move the vizArea node into the popup
            showMenuPopup(key, vizArea);
        });

        menuContainers.push({
            key: key,
            menu: menu,
            vizArea: d3.select(vizArea)
        });
    });

    return menuContainers;
}

/**
 * Step C: Add data structure preview to the dynamically created divs
 * @param {Array} menuContainers - Array of menu container objects
 * @param {Array} levelData - Array of units for the level (already preprocessed)
 * @param {string} unitKey - The specific unit key to focus on
 */
function populateMenuData(menuContainers, levelData, unitKey) {
    if (!menuContainers || menuContainers.length === 0) {
        console.error('No menu containers available');
        return;
    }
    
    // Find the specific unit data
    const unitData = levelData.find(unit => unit.BASIC_INFO.KEY === unitKey);
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
                const row = container.vizArea.append('div')
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
            container.vizArea.append('div')
                .attr('class', 'data-value')
                .text(typeof keyData === 'number' ? keyData.toFixed(2) : keyData);
        }
    });
}

/**
 * Step D: Add small multiples (stripplots) to each menu trigger
 * @param {Object} menu - Menu container object with key, menu, and placeholder properties
 * @param {Array} levelData - Array of units for the level (already preprocessed)
 * @param {string} unitKey - The specific unit key to highlight
 */
function addSmallMultiplesToMenu(menu, levelData, unitKey) {
    // Select the correct unit based on the unit key
    const selectedUnit = levelData.find(unit => unit.BASIC_INFO.KEY === unitKey);
    if (!selectedUnit) {
        console.error('Selected unit not found:', unitKey);
        return;
    }

    // Select all units of the same level that have the same parent BUT exclude the selected unit
    const peerUnits = levelData.filter(unit => 
        unit.BASIC_INFO.PARENT === selectedUnit.BASIC_INFO.PARENT && 
        unit.BASIC_INFO.KEY !== unitKey
    );

    // Get the data for the current menu category
    const categoryData = selectedUnit[menu.key];
    if (!categoryData || typeof categoryData !== 'object') {
        console.error('No category data found for:', menu.key);
        return;
    }


    // Find all percentage variables in this category
    const percentageVariables = Object.keys(categoryData).filter(key => key.endsWith('_PCT'));

    // Create stripplot for each percentage variable
    percentageVariables.forEach(variable => {
        createStripplot(menu.vizArea, variable, selectedUnit, peerUnits, menu.key);
    });
}

/**
 * Create a single stripplot visualization
 * @param {Object} container - D3 selection of the container to add the plot to
 * @param {string} variable - The percentage variable name (e.g., 'TRABAJO_INDEPENDIENTE_PCT')
 * @param {Object} selectedUnit - The selected unit data
 * @param {Array} peerUnits - Array of peer units for comparison
 * @param {string} categoryKey - The category key (e.g., 'HIRING')
 */
function createStripplot(container, variable, selectedUnit, peerUnits, categoryKey) {
    // Extract variable name without _PCT suffix for display
    const variableName = variable.replace('_PCT', '');

    // Compute the average of the percentage variables for the peer units
    let sum = 0;
    let validCount = 0;
    
    peerUnits.forEach(unit => {
        const value = unit[categoryKey][variable];
        if (value !== undefined && value !== null && !isNaN(value)) {
            sum += value;
            validCount++;
        }
    });
    
    const average = validCount > 0 ? sum / validCount : 0;

    // Create individual stripplot container for flexbox layout
    const plotContainer = container.append('div')
        .attr('class', 'stripplot-item');
    
    // Add title
    plotContainer.append('h5')
        .attr('class', 'stripplot-title')
        .text(variableName);
    
    // Create SVG for the stripplot
    const svg = plotContainer.append('svg')
        .attr('class', 'stripplot-svg')
        .attr('width', 400)
        .attr('height', 60);
    
    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([0, 1]) // 0 to 100% (as decimal)
        .range([40, 360]); // Leave margin for axis
    
    // Add x-axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('.0%'))
        .ticks(5);
    
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, 55)')
        .call(xAxis);
    
    // Add axis label
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', 200)
        .attr('y', 75)
        .attr('text-anchor', 'middle')
        .text('Percentage');
    
    // Add peer unit strips (vertical lines)
    peerUnits.forEach(unit => {
        const value = unit[categoryKey][variable];
        if (value !== undefined && !isNaN(value)) {
            svg.append('line')
                .attr('class', 'peer-strip')
                .attr('x1', xScale(value))
                .attr('y1', 5)
                .attr('x2', xScale(value))
                .attr('y2', 55)
                .attr('stroke', 'var(--peer-strip-color)')
                .attr('stroke-width', 2);
        }
    });
    
    // Add selected unit strip (highlighted vertical line)
    const selectedValue = selectedUnit[categoryKey][variable];
    if (selectedValue !== undefined && !isNaN(selectedValue)) {
        svg.append('line')
            .attr('class', 'selected-strip')
            .attr('x1', xScale(selectedValue))
            .attr('y1', 5)
            .attr('x2', xScale(selectedValue))
            .attr('y2', 55)
            .attr('stroke', 'var(--selected-strip-color)')
            .attr('stroke-width', 3);
    }
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createDataVisualization };
}
