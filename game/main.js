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

    function updateUI() {
        Object.keys(resources).forEach(type => {
            document.getElementById(type).textContent = resources[type].ore;
            document.getElementById('ingots' + type).textContent = resources[type].ingot;
            document.getElementById('minerDrones' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].minerDrones;
            document.getElementById('autoSmelters' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].autoSmelters;
        });
        document.getElementById('dollars').textContent = dollars.amount.toFixed(2);
        document.getElementById('power').textContent = `Generated: ${power.generation + power.solarPanels * power.solarOutput}, Consumed: ${power.consumed}`;
    }

    function purchaseSolarPanel() {
        if (dollars.amount >= costs.upgradeCosts.solarPanels.cost) {
            dollars.amount -= costs.upgradeCosts.solarPanels.cost;
            power.solarPanels++;
            costs.upgradeCosts.solarPanels.cost *= costs.upgradeCosts.solarPanels.increaseRate;
            updateUI();
        } else {
            console.log("Not enough dollars to purchase solar panels.");
        }
    }

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
    }
    
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
