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
    
    // Step B: Dynamically create collapsible menus based on first element keys
    const menuContainers = createCollapsibleMenus(vizContainer, levelData);
    
    // Step C: Add data structure preview to the dynamically created divs
   //  populateMenuData(menuContainers, levelData, unitKey);
    
    // Step D: calls the small multiple drawing function at each one of the collapsible menus
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
 * Step B: Dynamically create collapsible menus based on keys in the first element
 * @param {Object} vizContainer - D3 selection of the visualization container
 * @param {Array} levelData - Array of units for the level (already preprocessed)
 * @returns {Array} Array of menu container objects with references to their elements
 */
function createCollapsibleMenus(vizContainer, levelData) {
    if (!levelData || levelData.length === 0) {
        console.error('No level data available');
        return [];
    }
    
    // Get keys from the first element (excluding BASIC_INFO, BBOX, CENTROID)
    const firstUnit = levelData[0];
    const collapsibleKeys = Object.keys(firstUnit).filter(key => 
        key !== 'BASIC_INFO' && key !== 'BBOX' && key !== 'CENTROID'
    );
    
    const menuContainers = [];
    
    collapsibleKeys.forEach(key => {
        const menu = vizContainer.append('div')
            .attr('class', 'collapsible-menu')
            .attr('data-key', key);
        
        menu.append('h4').text(key);
        const vizArea = menu.append('div').attr('class', 'viz-area');
        
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
            vizArea: vizArea
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
 * Step D: Add small multiples (stripplots) to each collapsible menu
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
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([10, 50]); // Small height for stripplot
    
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
    
    // Add peer unit markers
    peerUnits.forEach(unit => {
        const value = unit[categoryKey][variable];
        if (value !== undefined && !isNaN(value)) {
            svg.append('circle')
                .attr('class', 'peer-marker')
                .attr('cx', xScale(value))
                .attr('cy', yScale(0.5))
                .attr('r', 3)
                .attr('fill', 'var(--peer-marker-fill)')
                .attr('stroke', 'var(--peer-marker-stroke)')
                .attr('stroke-width', 1);
        }
    });
    
    // Add selected unit marker (highlighted)
    const selectedValue = selectedUnit[categoryKey][variable];
    if (selectedValue !== undefined && !isNaN(selectedValue)) {
        svg.append('circle')
            .attr('class', 'selected-marker')
            .attr('cx', xScale(selectedValue))
            .attr('cy', yScale(0.5))
            .attr('r', 4)
            .attr('fill', 'var(--selected-marker-fill)')
            .attr('stroke', 'var(--selected-marker-stroke)')
            .attr('stroke-width', 2);
    }

    // Add reference line at selected unit's position
    if (selectedValue !== undefined && !isNaN(selectedValue)) {
        svg.append('line')
            .attr('class', 'selected-reference-line')
            .attr('x1', xScale(selectedValue))
            .attr('y1', 5)
            .attr('x2', xScale(selectedValue))
            .attr('y2', 55)
            .attr('stroke', 'var(--selected-line-color)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '3,3');
    }

    // Add a reference line at the average of the peer units
    if (average > 0) {
        svg.append('line')
            .attr('class', 'peers-reference-line')
            .attr('x1', xScale(average))
            .attr('y1', 5)
            .attr('x2', xScale(average))
            .attr('y2', 55)
            .attr('stroke', 'var(--average-line-color)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5');
    }
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createDataVisualization };
}
