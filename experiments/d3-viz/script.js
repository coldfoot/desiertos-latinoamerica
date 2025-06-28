// D3 Experiment - Main Application Controller
// Handles data loading, UI management, and user interactions

// ============================================================================
// GLOBAL STATE
// ============================================================================

let data;
let selectedUnit = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application when the page loads
 */
document.addEventListener('DOMContentLoaded', loadData);

/**
 * Load and initialize the application data
 */
function loadData() {
    console.log("Loading data.json with D3...");
    
    d3.json('../../data.json')
        .then(handleDataLoadSuccess)
        .catch(handleDataLoadError);
}

/**
 * Handle successful data loading
 * @param {Object} jsonData - The loaded JSON data
 */
function handleDataLoadSuccess(jsonData) {
    data = jsonData;
    console.log("Data loaded successfully with D3!");
    console.log("Available countries:", Object.keys(data));
    
    preprocessAllData(data);
    initializeUI();
}

/**
 * Handle data loading errors
 * @param {Error} error - The error object
 */
function handleDataLoadError(error) {
    console.error("Error loading data with D3:", error);
}

/**
 * Initialize the user interface
 */
function initializeUI() {
    populateCountrySelector(Object.keys(data));
    populateLevelSelector();
    setupEventListeners();
    disableInitialControls();
}

/**
 * Disable controls that should be disabled initially
 */
function disableInitialControls() {
    const controls = ['#level-select', '#unit-search', '#draw-button'];
    controls.forEach(selector => {
        d3.select(selector).property('disabled', true);
    });
}

// ============================================================================
// DATA PREPROCESSING
// ============================================================================

/**
 * Preprocess all data for all country/level combinations once
 * @param {Object} data - The entire data object
 */
function preprocessAllData(data) {
    console.log("Preprocessing all data...");
    
    Object.keys(data).forEach(country => {
        Object.keys(data[country]).forEach(level => {
            if (isValidLevel(level)) {
                preprocessLevelData(data[country][level]);
            }
        });
    });
    
    console.log("Data preprocessing completed!");
    console.log(data);
}

/**
 * Check if a level is valid for preprocessing
 * @param {string} level - The level to check
 * @returns {boolean} True if valid, false otherwise
 */
function isValidLevel(level) {
    return level === 'small_units' || level === 'large_units';
}

/**
 * Preprocess data for a specific level
 * @param {Array} levelData - The level data to preprocess
 */
function preprocessLevelData(levelData) {
    if (!Array.isArray(levelData)) return;
    
    levelData.forEach(unitData => {
        preprocessUnitData(unitData);
    });
}

/**
 * Preprocess data for a specific unit
 * @param {Object} unitData - The unit data to preprocess
 */
function preprocessUnitData(unitData) {
    const excludedCategories = ['BASIC_INFO', 'BBOX', 'CENTROID'];
    
    Object.keys(unitData).forEach(category => {
        if (!excludedCategories.includes(category)) {
            preprocessCategoryData(unitData[category], unitData.BASIC_INFO.NEWS_ORG_COUNT);
        }
    });
}

/**
 * Preprocess data for a specific category
 * @param {Object} categoryData - The category data to preprocess
 * @param {number} newsOrgCount - The news organization count for percentage calculation
 */
function preprocessCategoryData(categoryData, newsOrgCount) {
    Object.keys(categoryData).forEach(key => {
        if (shouldCreatePercentage(key, categoryData[key])) {
            const pctKey = `${key}_PCT`;
            if (!(pctKey in categoryData)) {
                categoryData[pctKey] = categoryData[key] / newsOrgCount;
            }
        }
    });
}

/**
 * Check if a percentage variable should be created for a key-value pair
 * @param {string} key - The data key
 * @param {*} value - The data value
 * @returns {boolean} True if percentage should be created, false otherwise
 */
function shouldCreatePercentage(key, value) {
    return !key.endsWith('_PCT') && 
           value !== null && 
           value !== undefined && 
           !isNaN(value);
}

// ============================================================================
// UI POPULATION
// ============================================================================

/**
 * Populate the country selector dropdown
 * @param {Array} countries - Array of country names
 */
function populateCountrySelector(countries) {
    const countrySelect = d3.select('#country-select');
    clearAndAddDefaultOption(countrySelect, 'Seleccione un país');
    
    countrySelect.selectAll('option.country-option')
        .data(countries)
        .enter()
        .append('option')
        .attr('class', 'country-option')
        .attr('value', d => d)
        .text(capitalizeFirstLetter);
}

/**
 * Populate the level selector dropdown
 */
function populateLevelSelector() {
    const levels = [
        { value: 'small_units', label: 'Unidades pequeñas' },
        { value: 'large_units', label: 'Unidades grandes' }
    ];
    
    const levelSelect = d3.select('#level-select');
    clearAndAddDefaultOption(levelSelect, 'Seleccione un nivel');
    
    levelSelect.selectAll('option.level-option')
        .data(levels)
        .enter()
        .append('option')
        .attr('class', 'level-option')
        .attr('value', d => d.value)
        .text(d => d.label);
}

/**
 * Clear selector and add default option
 * @param {Object} selector - D3 selection of the selector
 * @param {string} defaultText - Text for the default option
 */
function clearAndAddDefaultOption(selector, defaultText) {
    selector.selectAll('option').remove();
    selector.append('option').attr('value', '').text(defaultText);
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Populate the unit datalist for autocomplete
 * @param {Array} units - Array of unit objects
 * @param {string} level - The current level
 */
function populateUnitDatalist(units, level) {
    const datalist = d3.select('#unit-options');
    datalist.selectAll('option').remove();
    
    // Store units data for later lookup
    window.currentUnits = units;
    
    datalist.selectAll('option')
        .data(units)
        .enter()
        .append('option')
        .attr('value', d => getUnitDisplayName(d, level))
        .attr('data-key', d => d.BASIC_INFO.KEY);
}

/**
 * Get the display name for a unit based on level
 * @param {Object} unit - The unit object
 * @param {string} level - The current level
 * @returns {string} The display name
 */
function getUnitDisplayName(unit, level) {
    return level === 'large_units' 
        ? unit.BASIC_INFO.NAME 
        : `${unit.BASIC_INFO.NAME} - ${unit.BASIC_INFO.PARENT}`;
}

// ============================================================================
// EVENT HANDLING
// ============================================================================

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    setupSelectorListeners();
    setupFormListeners();
    setupInputListeners();
    setupButtonListeners();
}

/**
 * Set up selector change listeners
 */
function setupSelectorListeners() {
    d3.select('#country-select').on('change', updateLevelSelector);
    d3.select('#level-select').on('change', updateUnitSelector);
}

/**
 * Set up form submission listeners
 */
function setupFormListeners() {
    d3.select('#unit-form').on('submit', function(e) {
        e.preventDefault();
        const searchContent = d3.select('#unit-search').property('value');
        if (searchContent) {
            handleUnitSelection();
        }
    });
}

/**
 * Set up input change listeners
 */
function setupInputListeners() {
    d3.select('#unit-search').on('change', handleUnitSelection);
}

/**
 * Set up button click listeners
 */
function setupButtonListeners() {
    d3.select('#draw-button').on('click', handleDrawButton);
}

// ============================================================================
// SELECTOR UPDATES
// ============================================================================

/**
 * Update level selector based on country selection
 */
function updateLevelSelector() {
    const selectedCountry = getSelectedCountry();
    
    if (!selectedCountry) {
        disableLevelSelector();
        return;
    }
    
    enableLevelSelector();
}

/**
 * Update unit selector based on level selection
 */
function updateUnitSelector() {
    const { selectedCountry, selectedLevel } = getSelectedValues();
    
    if (!selectedCountry || !selectedLevel) {
        disableUnitSelector();
        return;
    }
    
    const countryData = data[selectedCountry];
    if (!isValidCountryData(countryData, selectedLevel)) {
        disableUnitSelector();
        return;
    }
    
    enableUnitSelector(countryData[selectedLevel], selectedLevel);
}

/**
 * Check if country data is valid for the selected level
 * @param {Object} countryData - The country data
 * @param {string} selectedLevel - The selected level
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCountryData(countryData, selectedLevel) {
    return countryData && countryData[selectedLevel];
}

/**
 * Disable level selector and clear unit selector
 */
function disableLevelSelector() {
    d3.select('#level-select').property('disabled', true);
    clearUnitSelector();
}

/**
 * Enable level selector and reset selection
 */
function enableLevelSelector() {
    d3.select('#level-select').property('disabled', false);
    d3.select('#level-select').property('value', '');
    clearUnitSelector();
}

/**
 * Disable unit selector
 */
function disableUnitSelector() {
    d3.select('#unit-search').property('disabled', true);
    clearUnitSelector();
}

/**
 * Enable unit selector and populate datalist
 * @param {Array} units - Array of units
 * @param {string} level - The current level
 */
function enableUnitSelector(units, level) {
    d3.select('#unit-search').property('disabled', false);
    populateUnitDatalist(units, level);
}

// ============================================================================
// UNIT SELECTION
// ============================================================================

/**
 * Handle unit selection from search input
 */
function handleUnitSelection() {
    const searchValue = getSearchValue();
    const { selectedLevel } = getSelectedValues();
    
    if (!isValidSearch(searchValue)) {
        clearSelectedUnit();
        return;
    }
    
    const foundUnit = findMatchingUnit(searchValue, selectedLevel);
    updateSelectedUnit(foundUnit);
}

/**
 * Get the current search value
 * @returns {string} The search value
 */
function getSearchValue() {
    return d3.select('#unit-search').property('value');
}

/**
 * Check if search value is valid
 * @param {string} searchValue - The search value to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidSearch(searchValue) {
    return searchValue && window.currentUnits;
}

/**
 * Find a matching unit based on search value and level
 * @param {string} searchValue - The search value
 * @param {string} selectedLevel - The selected level
 * @returns {Object|null} The found unit or null
 */
function findMatchingUnit(searchValue, selectedLevel) {
    return window.currentUnits.find(unit => {
        const displayName = getUnitDisplayName(unit, selectedLevel);
        return displayName === searchValue;
    });
}

/**
 * Update the selected unit and button state
 * @param {Object|null} foundUnit - The found unit or null
 */
function updateSelectedUnit(foundUnit) {
    if (foundUnit) {
        selectedUnit = foundUnit;
        logSelectedUnit(foundUnit);
        enableDrawButton();
    } else {
        clearSelectedUnit();
        console.log('No matching unit found for:', getSearchValue());
    }
}

/**
 * Clear the selected unit and disable draw button
 */
function clearSelectedUnit() {
    selectedUnit = null;
    disableDrawButton();
}

/**
 * Log selected unit information
 * @param {Object} unit - The selected unit
 */
function logSelectedUnit(unit) {
    console.log('Selected unit:', unit);
    console.log('Unit key:', unit.BASIC_INFO.KEY);
}

/**
 * Enable the draw button
 */
function enableDrawButton() {
    d3.select('#draw-button').property('disabled', false);
}

/**
 * Disable the draw button
 */
function disableDrawButton() {
    d3.select('#draw-button').property('disabled', true);
}

// ============================================================================
// DRAW BUTTON HANDLING
// ============================================================================

/**
 * Handle draw button click
 */
function handleDrawButton() {
    const { selectedCountry, selectedLevel } = getSelectedValues();
    const searchValue = getSearchValue();
    
    logSelectedValues(selectedCountry, selectedLevel, searchValue);
    logSelectedUnitDetails();
    
    if (selectedUnit) {
        executeDataVisualization(selectedCountry, selectedLevel);
    }
}

/**
 * Log all selected values for debugging
 * @param {string} selectedCountry - The selected country
 * @param {string} selectedLevel - The selected level
 * @param {string} searchValue - The search value
 */
function logSelectedValues(selectedCountry, selectedLevel, searchValue) {
    console.log('=== SELECTED VALUES ===');
    console.log('Country:', selectedCountry);
    console.log('Level:', selectedLevel);
    console.log('Unit Search Value:', searchValue);
    console.log('Selected Unit Object:', selectedUnit);
}

/**
 * Log detailed information about the selected unit
 */
function logSelectedUnitDetails() {
    if (!selectedUnit) return;
    
    const info = selectedUnit.BASIC_INFO;
    console.log('Unit Key:', info.KEY);
    console.log('Unit Name:', info.NAME);
    console.log('Unit Parent:', info.PARENT);
    console.log('Unit Classification:', info.classification);
    console.log('Unit Population:', info.population);
    console.log('Unit Area:', info.area);
    console.log('Unit News Org Count:', info.news_org_count);
    console.log('Unit Journalist Count:', info.journalist_count);
}

/**
 * Execute the data visualization
 * @param {string} selectedCountry - The selected country
 * @param {string} selectedLevel - The selected level
 */
function executeDataVisualization(selectedCountry, selectedLevel) {
    console.log('=== READY FOR DATA VIZ ===');
    console.log('Calling createDataVisualization function...');
    
    const countryData = data[selectedCountry];
    const unitKey = selectedUnit.BASIC_INFO.KEY;
    
    createDataVisualization(countryData, selectedLevel, unitKey);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get selected values from form controls
 * @returns {Object} Object containing selected country and level
 */
function getSelectedValues() {
    return {
        selectedCountry: getSelectedCountry(),
        selectedLevel: getSelectedLevel()
    };
}

/**
 * Get the selected country
 * @returns {string} The selected country
 */
function getSelectedCountry() {
    return d3.select('#country-select').property('value');
}

/**
 * Get the selected level
 * @returns {string} The selected level
 */
function getSelectedLevel() {
    return d3.select('#level-select').property('value');
}

/**
 * Clear the unit selector
 */
function clearUnitSelector() {
    const unitSearch = d3.select('#unit-search');
    unitSearch.property('value', '');
    unitSearch.property('disabled', true);
    
    const datalist = d3.select('#unit-options');
    datalist.selectAll('option').remove();
    
    window.currentUnits = null;
    selectedUnit = null;
    disableDrawButton();
} 