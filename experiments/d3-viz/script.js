console.log("D3 Experiment - Ready to start!");

let data;
let selectedUnit = null;

// Load the data.json file from the base directory using D3
function loadData() {
    console.log("Loading data.json with D3...");
    
    d3.json('../../data.json')
        .then(function(jsonData) {
            data = jsonData;
            console.log("Data loaded successfully with D3!");
            console.log("Available countries:", Object.keys(data));
            
            populateCountrySelector(Object.keys(data));
            populateLevelSelector();
            setupEventListeners();
            // Initially disable level and unit selectors
            d3.select('#level-select').property('disabled', true);
            d3.select('#unit-search').property('disabled', true);
            d3.select('#draw-button').property('disabled', true);
        })
        .catch(function(error) {
            console.error("Error loading data with D3:", error);
        });
}

function populateCountrySelector(countries) {
    const countrySelect = d3.select('#country-select');
    countrySelect.selectAll('option').remove();
    countrySelect.append('option').attr('value', '').text('Seleccione un país');
    countrySelect.selectAll('option.country-option')
        .data(countries)
        .enter()
        .append('option')
        .attr('class', 'country-option')
        .attr('value', d => d)
        .text(d => d.charAt(0).toUpperCase() + d.slice(1));
}

function populateLevelSelector() {
    const levels = [
        { value: 'small_units', label: 'Unidades pequeñas' },
        { value: 'large_units', label: 'Unidades grandes' }
    ];
    const levelSelect = d3.select('#level-select');
    levelSelect.selectAll('option').remove();
    levelSelect.append('option').attr('value', '').text('Seleccione un nivel');
    levelSelect.selectAll('option.level-option')
        .data(levels)
        .enter()
        .append('option')
        .attr('class', 'level-option')
        .attr('value', d => d.value)
        .text(d => d.label);
}

function setupEventListeners() {
    d3.select('#country-select').on('change', updateLevelSelector);
    d3.select('#level-select').on('change', updateUnitSelector);
    
    // Form submission handling
    d3.select('#unit-form').on('submit', function(e) {
        e.preventDefault();
        const searchContent = d3.select('#unit-search').property('value');
        if (searchContent) {
            handleUnitSelection();
        }
    });
    
    // Input change handling
    d3.select('#unit-search').on('change', handleUnitSelection);
    
    // Draw button handling
    d3.select('#draw-button').on('click', handleDrawButton);
}

function updateLevelSelector() {
    const selectedCountry = d3.select('#country-select').property('value');
    
    if (!selectedCountry) {
        d3.select('#level-select').property('disabled', true);
        clearUnitSelector();
        return;
    }
    
    // Enable level selector when country is selected
    d3.select('#level-select').property('disabled', false);
    // Reset level selection
    d3.select('#level-select').property('value', '');
    clearUnitSelector();
}

function updateUnitSelector() {
    const selectedCountry = d3.select('#country-select').property('value');
    const selectedLevel = d3.select('#level-select').property('value');
    
    if (!selectedCountry || !selectedLevel) {
        d3.select('#unit-search').property('disabled', true);
        clearUnitSelector();
        return;
    }
    
    const countryData = data[selectedCountry];
    if (!countryData || !countryData[selectedLevel]) {
        d3.select('#unit-search').property('disabled', true);
        clearUnitSelector();
        return;
    }
    
    // Enable unit selector when both country and level are selected
    d3.select('#unit-search').property('disabled', false);
    const units = countryData[selectedLevel];
    populateUnitDatalist(units, selectedLevel);
}

function populateUnitDatalist(units, level) {
    const datalist = d3.select('#unit-options');
    datalist.selectAll('option').remove();
    
    // Store units data for later lookup
    window.currentUnits = units;
    
    datalist.selectAll('option')
        .data(units)
        .enter()
        .append('option')
        .attr('value', d => {
            if (level === 'large_units') {
                return d.BASIC_INFO.NAME;
            } else {
                return `${d.BASIC_INFO.NAME} - ${d.BASIC_INFO.PARENT}`;
            }
        })
        .attr('data-key', d => d.BASIC_INFO.KEY);
}

function handleUnitSelection() {
    const searchValue = d3.select('#unit-search').property('value');
    const selectedCountry = d3.select('#country-select').property('value');
    const selectedLevel = d3.select('#level-select').property('value');
    
    if (!searchValue || !window.currentUnits) {
        selectedUnit = null;
        d3.select('#draw-button').property('disabled', true);
        return;
    }
    
    // Find the matching unit
    const foundUnit = window.currentUnits.find(unit => {
        const displayName = selectedLevel === 'large_units' 
            ? unit.BASIC_INFO.NAME 
            : `${unit.BASIC_INFO.NAME} - ${unit.BASIC_INFO.PARENT}`;
        return displayName === searchValue;
    });
    
    if (foundUnit) {
        selectedUnit = foundUnit;
        console.log('Selected unit:', selectedUnit);
        console.log('Unit key:', selectedUnit.BASIC_INFO.KEY);
        // Enable draw button when unit is selected
        d3.select('#draw-button').property('disabled', false);
    } else {
        selectedUnit = null;
        d3.select('#draw-button').property('disabled', true);
        console.log('No matching unit found for:', searchValue);
    }
}

function handleDrawButton() {
    const selectedCountry = d3.select('#country-select').property('value');
    const selectedLevel = d3.select('#level-select').property('value');
    const searchValue = d3.select('#unit-search').property('value');
    
    console.log('=== SELECTED VALUES ===');
    console.log('Country:', selectedCountry);
    console.log('Level:', selectedLevel);
    console.log('Unit Search Value:', searchValue);
    console.log('Selected Unit Object:', selectedUnit);
    
    if (selectedUnit) {
        console.log('Unit Key:', selectedUnit.BASIC_INFO.KEY);
        console.log('Unit Name:', selectedUnit.BASIC_INFO.NAME);
        console.log('Unit Parent:', selectedUnit.BASIC_INFO.PARENT);
        console.log('Unit Classification:', selectedUnit.BASIC_INFO.classification);
        console.log('Unit Population:', selectedUnit.BASIC_INFO.population);
        console.log('Unit Area:', selectedUnit.BASIC_INFO.area);
        console.log('Unit News Org Count:', selectedUnit.BASIC_INFO.news_org_count);
        console.log('Unit Journalist Count:', selectedUnit.BASIC_INFO.journalist_count);
    }
    
    console.log('=== READY FOR DATA VIZ ===');
    console.log('Calling createDataVisualization function...');
    
    // Get the country data and pass the entire data object
    const countryData = data[selectedCountry];
    const unitKey = selectedUnit ? selectedUnit.BASIC_INFO.KEY : null;
    
    // Call the data visualization function with the new parameters
    createDataVisualization(countryData, selectedLevel, unitKey);
}

function clearUnitSelector() {
    const unitSearch = d3.select('#unit-search');
    unitSearch.property('value', '');
    unitSearch.property('disabled', true);
    
    const datalist = d3.select('#unit-options');
    datalist.selectAll('option').remove();
    
    window.currentUnits = null;
    selectedUnit = null;
    d3.select('#draw-button').property('disabled', true);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadData); 