document.addEventListener('DOMContentLoaded', function() {

// Event listener for purchasing solar panels
document.getElementById('purchaseSolarPanel').addEventListener('click', purchaseSolarPanel);

// Event listeners for purchasing miner drones and auto-smelters
document.getElementById('purchaseMinerDroneCopper').addEventListener('click', () => purchaseMinerDrone('copper'));
document.getElementById('purchaseMinerDroneIron').addEventListener('click', () => purchaseMinerDrone('iron'));
document.getElementById('purchaseMinerDroneGold').addEventListener('click', () => purchaseMinerDrone('gold'));
document.getElementById('purchaseMinerDronePlatinum').addEventListener('click', () => purchaseMinerDrone('platinum'));
document.getElementById('purchaseMinerDroneSilicon').addEventListener('click', () => purchaseMinerDrone('silicon'));
document.getElementById('purchaseAutoSmelterCopper').addEventListener('click', () => purchaseAutoSmelter('copper'));
document.getElementById('purchaseAutoSmelterIron').addEventListener('click', () => purchaseAutoSmelter('iron'));
document.getElementById('purchaseAutoSmelterGold').addEventListener('click', () => purchaseAutoSmelter('gold'));
document.getElementById('purchaseAutoSmelterPlatinum').addEventListener('click', () => purchaseAutoSmelter('platinum'));
document.getElementById('purchaseAutoSmelterSilicon').addEventListener('click', () => purchaseAutoSmelter('silicon'));

// Event listeners for smelting ores into ingots
document.getElementById('smeltcopper').addEventListener('click', () => smeltOre('copper'));
document.getElementById('smeltiron').addEventListener('click', () => smeltOre('iron'));
document.getElementById('smeltgold').addEventListener('click', () => smeltOre('gold'));
document.getElementById('smeltplatinum').addEventListener('click', () => smeltOre('platinum'));
document.getElementById('smeltsilicon').addEventListener('click', () => smeltOre('silicon'));

// Event listeners for mining individual ores
document.getElementById('minecopper').addEventListener('click', () => mineOre('copper'));
document.getElementById('mineiron').addEventListener('click', () => mineOre('iron'));
document.getElementById('minegold').addEventListener('click', () => mineOre('gold'));
document.getElementById('mineplatinum').addEventListener('click', () => mineOre('platinum'));
document.getElementById('minesilicon').addEventListener('click', () => mineOre('silicon'));

// Event listeners for selling ores
document.getElementById('sellcopper').addEventListener('click', () => sellOre('copper'));
document.getElementById('selliron').addEventListener('click', () => sellOre('iron'));
document.getElementById('sellgold').addEventListener('click', () => sellOre('gold'));
document.getElementById('sellplatinum').addEventListener('click', () => sellOre('platinum'));
document.getElementById('sellsilicon').addEventListener('click', () => sellOre('silicon'));

// Event listeners for selling all ingots
document.getElementById('sellAllcopper').addEventListener('click', () => sellAllIngots('copper'));
document.getElementById('sellAlliron').addEventListener('click', () => sellAllIngots('iron'));
document.getElementById('sellAllgold').addEventListener('click', () => sellAllIngots('gold'));
document.getElementById('sellAllplatinum').addEventListener('click', () => sellAllIngots('platinum'));
document.getElementById('sellAllsilicon').addEventListener('click', () => sellAllIngots('silicon'));

// Event listeners for mining x10 ores
document.getElementById('mineX10copper').addEventListener('click', () => mineOreX10('copper'));
document.getElementById('mineX10iron').addEventListener('click', () => mineOreX10('iron'));
document.getElementById('mineX10gold').addEventListener('click', () => mineOreX10('gold'));
document.getElementById('mineX10platinum').addEventListener('click', () => mineOreX10('platinum'));
document.getElementById('mineX10silicon').addEventListener('click', () => mineOreX10('silicon'));

const resources = {
    copper: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
    iron: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
    gold: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
    platinum: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
    silicon: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
};

let dollars = { amount: 0 };
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
            mineOre(type);
            smeltOre(type);
        });
    } else {
        console.warn('Insufficient power to operate all devices.');
    }
    updateUI();
};

function mineOre(resourceType) {
    const oreMined = resources[resourceType].minerDrones * 5;
    resources[resourceType].ore += oreMined;
    console.log(`${oreMined} units of ${resourceType} ore mined.`);
};

function smeltOre(resourceType) {
    if (resources[resourceType].ore >= resources[resourceType].autoSmelters * 5) {
        const ingotsProduced = resources[resourceType].autoSmelters;
        resources[resourceType].ingot += ingotsProduced;
        resources[resourceType].ore -= ingotsProduced * 5;
        console.log(`${ingotsProduced} ingots of ${resourceType} produced.`);
    }
};

function sellIngots(resourceType) {
    if (resources[resourceType].ingot > 0) {
        resources[resourceType].ingot--;
        dollars += costs.ingotPrices[resourceType];
        updateUI();
    } else {
        console.log("No ingots available to sell.");
    }
};

function mineOreX10(resourceType) {
    for (let i = 0; i < 10; i++) {
        resources[resourceType].ore += (resources[resourceType].minerDrones ? resources[resourceType].minerDrones * 5 : 5);
    }
    updateUI();
    console.log("10x ores mined");
};

function sellAllIngots(resourceType) {
    if (resources[resourceType].ingot > 0) {
        const totalSale = resources[resourceType].ingot * costs.ingotPrices[resourceType];
        dollars.amount += totalSale;
        resources[resourceType].ingot = 0;
        updateUI();
    } else {
        console.log("No ingots to sell.");
    }
};   

setInterval(() => {
    updatePowerUsage();
    if (power.consumed <= (power.generation + power.solarPanels * power.solarOutput)) {
        Object.keys(resources).forEach(type => {
            resources[type].ore += resources[type].minerDrones * 5;
            updatePowerUsage();
            performMiningAndSmelting();
            const possibleSmelts = Math.floor(resources[type].ore / 5); 
            const smeltsToPerform = Math.min(possibleSmelts, resources[type].autoSmelters);
            resources[type].ingot += smeltsToPerform;
            resources[type].ore -= smeltsToPerform * 5;
        });
    } else {
        console.warn('Insufficient power to operate all devices.');
    }
    
    updateUI(); 
}, 500); // Run the main game loop every 500 milliseconds

updateUI();
});
