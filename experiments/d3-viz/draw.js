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

    // Create a container for all stripplot content
    const stripplotContainer = menu.vizArea.append('div')
        .attr('class', 'stripplot-container')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('width', '100%');

    // Create legend above all stripplots
    const legendContainer = stripplotContainer.append('div')
        .attr('class', 'stripplot-legend')
        .style('display', 'flex')
        .style('gap', '20px')
        .style('margin-bottom', '15px')
        .style('align-items', 'center');
    
    // Selected unit legend item
    const selectedLegend = legendContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px');
    
    selectedLegend.append('div')
        .style('width', '3px')
        .style('height', '12px')
        .style('background-color', 'var(--color-accent)');
    
    selectedLegend.append('p')
        .style('margin', '0')
        .style('font-size', '16px')
        .style('font-weight', '500')
        .style('color', 'var(--color-accent)')
        .text(selectedUnit.BASIC_INFO.NAME);
    
    // Average legend item
    const averageLegend = legendContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px');
    
    averageLegend.append('div')
        .style('width', '3px')
        .style('height', '12px')
        .style('background-color', 'var(--color-accent-secondary)');
    
    averageLegend.append('p')
        .style('margin', '0')
        .style('font-size', '16px')
        .style('font-weight', '500')
        .style('color', 'var(--color-accent-secondary)')
        .text('Promedio en la región');

    // Create a flex container for the stripplots
    const stripplotsFlexContainer = stripplotContainer.append('div')
        .style('display', 'flex')
        .style('flex-wrap', 'wrap')
        .style('justify-content', 'center')
        .style('align-items', 'flex-start')
        .style('gap', '15px');

    // Find all percentage variables in this category
    const percentageVariables = Object.keys(categoryData).filter(key => key.endsWith('_PCT'));

    // Create stripplot for each percentage variable
    percentageVariables.forEach(variable => {
        createStripplot(stripplotsFlexContainer, variable, selectedUnit, peerUnits, menu.key);
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
        .attr('height', 140);
    
    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([0, 1]) // 0 to 100% (as decimal)
        .range([20, 380]); // Extended range for more chart space
    
    // Add x-axis with only 0% and 100% ticks
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('.0%'))
        .tickValues([0, 1]) // Only show 0% and 100%
        .tickSize(0) // Remove tick lines
        .tickPadding(8); // Add some padding
    
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, 105)')
        .call(xAxis)
        .call(g => g.select('.domain').remove()); // Remove the axis line
    
    // Add peer unit strips (vertical lines)
    peerUnits.forEach(unit => {
        const value = unit[categoryKey][variable];
        if (value !== undefined && !isNaN(value)) {
            svg.append('line')
                .attr('class', 'peer-strip')
                .attr('x1', xScale(value))
                .attr('y1', 25)
                .attr('x2', xScale(value))
                .attr('y2', 75)
                .attr('stroke', 'var(--color-peer-lines)')
                .attr('stroke-width', 2);
        }
    });
    
    // Add selected unit strip (highlighted vertical line)
    const selectedValue = selectedUnit[categoryKey][variable];
    if (selectedValue !== undefined && !isNaN(selectedValue)) {
        svg.append('line')
            .attr('class', 'selected-strip')
            .attr('x1', xScale(selectedValue))
            .attr('y1', 25)
            .attr('x2', xScale(selectedValue))
            .attr('y2', 75)
            .attr('stroke', 'var(--color-accent)')
            .attr('stroke-width', 2);
        
        // Add text annotation for selected value (on top)
        svg.append('text')
            .attr('class', 'reference-annotation')
            .attr('x', xScale(selectedValue))
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--color-accent)')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .text(d3.format('.0%')(selectedValue));
    }

    // Add an average strip
    svg.append('line')
        .attr('class', 'average-strip')
        .attr('x1', xScale(average))
        .attr('y1', 25)
        .attr('x2', xScale(average))
        .attr('y2', 75)
        .attr('stroke', 'var(--color-accent-secondary)')
        .attr('stroke-width', 2);
    
    // Add text annotation for average (on top)
    svg.append('text')
        .attr('class', 'reference-annotation')
        .attr('x', xScale(average))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--color-accent-secondary)')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text(d3.format('.0%')(average));

    // Prevent text collisions by shifting annotations
    if (selectedValue !== undefined && !isNaN(selectedValue)) {
        const selectedX = xScale(selectedValue);
        const averageX = xScale(average);
        
        // Find the text elements
        const selectedText = svg.selectAll('.reference-annotation').filter((d, i, nodes) => {
            return d3.select(nodes[i]).attr('fill') === 'var(--color-accent)';
        });
        
        const averageText = svg.selectAll('.reference-annotation').filter((d, i, nodes) => {
            return d3.select(nodes[i]).attr('fill') === 'var(--color-accent-secondary)';
        });
        
        // Use text anchor points to prevent collisions
        if (selectedX < averageX) {
            // Selected is to the left, right-align it
            selectedText.attr('text-anchor', 'end');
            // Average is to the right, left-align it
            averageText.attr('text-anchor', 'start');
        } else if (selectedX > averageX) {
            // Selected is to the right, left-align it
            selectedText.attr('text-anchor', 'start');
            // Average is to the left, right-align it
            averageText.attr('text-anchor', 'end');
        }
        // If they're exactly the same, keep center alignment
    }
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createDataVisualization };
}
