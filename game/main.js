document.addEventListener('DOMContentLoaded', function() {
    const resources = {
        copper: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
        iron: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
        gold: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
        platinum: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
        silicon: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
    };

    const dollars = { amount: 0 };
    const power = { capacity: 100, generation: 10, consumed: 0, solarPanels: 0, solarOutput: 5 };

    const costs = {
        ingotPrices: { copper: 5, iron: 10, gold: 20, platinum: 50, silicon: 15 },
        upgradeCosts: {
            minerDrones: { cost: 10, increaseRate: 1.1 },
            autoSmelters: { cost: 15, increaseRate: 1.1 },
            generator: { cost: 50, increaseRate: 1.2 },
            solarPanels: { cost: 30, increaseRate: 1.15 }
        }
    };

    // Ensure buttons have correct IDs and are present in your HTML
    document.getElementById('mineX10copper').addEventListener('click', () => mineOreX10('copper'));
    document.getElementById('sellAllcopper').addEventListener('click', () => sellAllIngots('copper'));

    const costs = {
        ingotPrices: {
            copper: 5,   // Example price per copper ingot
            iron: 10,    // Example price per iron ingot
            gold: 20,    // Example price per gold ingot
            platinum: 50, // Example price per platinum ingot
            silicon: 15  // Example price per silicon ingot
        },
        upgradeCosts: {
            minerDrones: { cost: 10, increaseRate: 1.1 },
            autoSmelters: { cost: 15, increaseRate: 1.1 },
            generator: { cost: 50, increaseRate: 1.2 },
            solarPanels: { cost: 30, increaseRate: 1.15 }
        }
    };

    function updateUI() {
        Object.keys(resources).forEach(type => {
            document.getElementById(type).textContent = resources[type].ore;
            document.getElementById('ingots' + type).textContent = resources[type].ingot;
            document.getElementById('minerDrones' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].minerDrones;
            document.getElementById('autoSmelters' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].autoSmelters;
        });
        document.getElementById('dollars').textContent = dollars.amount.toFixed(2); // Ensure this line is correct
        document.getElementById('power').textContent = `Generated: ${power.generation + power.solarPanels * power.solarOutput}, Consumed: ${power.consumed}`;
    };    

    function purchaseSolarPanel() {
        if (dollars.amount >= costs.upgradeCosts.solarPanels.cost) {
            dollars.amount -= costs.upgradeCosts.solarPanels.cost;
            power.solarPanels++;
            costs.upgradeCosts.solarPanels.cost *= costs.upgradeCosts.solarPanels.increaseRate;
            updateUI();
        } else {
            console.log("Not enough dollars to purchase solar panels.");
        }
    };

    function updatePowerUsage() {
        let dronePowerUse = 1; // power used by one miner drone per cycle
        let smelterPowerUse = 2; // power used by one auto-smelter per cycle
    
        let totalDronePower = 0;
        let totalSmelterPower = 0;
        
        Object.keys(resources).forEach(type => {
            totalDronePower += resources[type].minerDrones * dronePowerUse;
            totalSmelterPower += resources[type].autoSmelters * smelterPowerUse;
        });
        
        power.consumed = totalDronePower + totalSmelterPower;
        
        if (power.consumed > (power.generation + power.solarPanels * power.solarOutput)) {
            console.warn('Power shortage! Reduce consumption or upgrade power sources.');
        }
    };
    
    function performMiningAndSmelting() {
        if (power.consumed <= (power.generation + power.solarPanels * power.solarOutput)) {
            Object.keys(resources).forEach(type => {
                // Mining operation
                resources[type].ore += resources[type].minerDrones * 5; // example mining yield
                // Smelting operation
                if (resources[type].ore >= resources[type].autoSmelters * 5) {
                    resources[type].ingot += resources[type].autoSmelters; // example smelting yield
                    resources[type].ore -= resources[type].autoSmelters * 5;
                }
            });
        } else {
            console.warn('Insufficient power to operate all devices.');
        }
        updateUI();
    };

    function sellIngots(resourceType) {
        if (resources[resourceType].ingot > 0) {
            resources[resourceType].ingot--; // Decrement the number of ingots
            dollars.amount += costs.ingotPrices[resourceType]; // Add the value of one ingot to the dollar balance
            updateUI(); // Update the user interface to reflect changes
        } else {
            console.log("No ingots available to sell."); // Log or alert the user if no ingots are available to sell
        }
    };

    function mineOreX10(resourceType) {
        for (let i = 0; i < 10; i++) {
            resources[resourceType].ore += (resources[resourceType].minerDrones ? resources[resourceType].minerDrones * 5 : 5); // Ensure operation even without drones
        }
        updateUI();
    };

    function sellAllIngots(resourceType) {
        if (resources[resourceType].ingot > 0) {
            const totalSale = resources[resourceType].ingot * costs.ingotPrices[resourceType];
            dollars.amount += totalSale; // Update the dollar amount
            resources[resourceType].ingot = 0;
            updateUI(); // Immediately update the UI
        } else {
            console.log("No ingots to sell.");
        }
    }    

    setInterval(() => {
        updatePowerUsage(); // First, update the power usage to reflect current consumption
    
        // Check if there is sufficient power for the operations
        if (power.consumed <= (power.generation + power.solarPanels * power.solarOutput)) {
            Object.keys(resources).forEach(type => {
                // Perform mining operations
                resources[type].ore += resources[type].minerDrones * 5; // Each drone mines 5 units of ore
    
                // Perform smelting operations
                const possibleSmelts = Math.floor(resources[type].ore / 5); // Calculate how many smelting operations can be done
                const smeltsToPerform = Math.min(possibleSmelts, resources[type].autoSmelters); // Limit smelting by the number of auto-smelters
                resources[type].ingot += smeltsToPerform; // Increase ingots by the number of smelts performed
                resources[type].ore -= smeltsToPerform * 5; // Decrease ores by the ore used in smelting
            });
        } else {
            console.warn('Insufficient power to operate all devices.'); // Warn if not enough power
        }
        
        updateUI(); // Update the user interface with the latest data
    }, 500); // Run the main game loop every 500 milliseconds

    updateUI(); // Initial UI update for all resources
});
