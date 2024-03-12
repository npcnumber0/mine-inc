document.addEventListener('DOMContentLoaded', function() {
  const resources = {
      copper: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
      iron: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
      gold: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
      platinum: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
      silicon: { ore: 0, ingot: 0, minerDrones: 0, autoSmelters: 0 },
  };

  const upgradeCosts = {
    minerDrones: 10, // Cost of miner drones in ingots
    autoSmelters: 10, // Cost of auto smelters in ingots
};

  function updateUI(resourceType) {
      if (resourceType) {
          document.getElementById(resourceType).textContent = resources[resourceType].ore;
          document.getElementById('ingots' + resourceType).textContent = resources[resourceType].ingot;
          document.getElementById('minerDrones' + resourceType.charAt(0).toUpperCase() + resourceType.slice(1)).textContent = resources[resourceType].minerDrones;
          document.getElementById('autoSmelters' + resourceType.charAt(0).toUpperCase() + resourceType.slice(1)).textContent = resources[resourceType].autoSmelters;
      } else {
          Object.keys(resources).forEach(type => {
              document.getElementById(type).textContent = resources[type].ore;
              document.getElementById('ingots' + type).textContent = resources[type].ingot;
              document.getElementById('minerDrones' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].minerDrones;
              document.getElementById('autoSmelters' + type.charAt(0).toUpperCase() + type.slice(1)).textContent = resources[type].autoSmelters;
          });
      }
  }

  function mineOre(resourceType) {
      resources[resourceType].ore++;
      updateUI(resourceType);
  }

  function smeltOre(resourceType) {
      if (resources[resourceType].ore > 0) {
          resources[resourceType].ore--;
          resources[resourceType].ingot++;
          updateUI(resourceType);
      }
  }

  function sellIngots(resourceType) {
      if (resources[resourceType].ingot > 0) {
          resources[resourceType].ingot--;
          updateUI(resourceType);
      }
  }

  function purchaseUpgrade(resourceType, upgradeType) {
    if (resources[resourceType].ingot >= upgradeCosts[upgradeType]) {
        resources[resourceType].ingot -= upgradeCosts[upgradeType]; // Deduct the cost
        resources[resourceType][upgradeType]++;
        updateUI(resourceType);
    } else {
        console.log("Not enough ingots to purchase " + upgradeType);
        // Optionally, update the UI to show an error message or alert the player
    }
}
  function incrementResources() {
      Object.keys(resources).forEach((type) => {
          resources[type].ore += resources[type].minerDrones * 5;
          if (resources[type].ore >= resources[type].autoSmelters * 5) {
              resources[type].ingot += resources[type].autoSmelters * 5;
              resources[type].ore -= resources[type].autoSmelters * 5;
          }
          updateUI(null);
      });
  }

  Object.keys(resources).forEach(resourceType => {
      document.getElementById('mine' + resourceType).addEventListener('click', () => mineOre(resourceType));
      document.getElementById('smelt' + resourceType).addEventListener('click', () => smeltOre(resourceType));
      document.getElementById('sell' + resourceType).addEventListener('click', () => sellIngots(resourceType));
      document.getElementById('purchaseMinerDrone' + resourceType.charAt(0).toUpperCase() + resourceType.slice(1)).addEventListener('click', () => purchaseUpgrade(resourceType, 'minerDrones'));
      document.getElementById('purchaseAutoSmelter' + resourceType.charAt(0).toUpperCase() + resourceType.slice(1)).addEventListener('click', () => purchaseUpgrade(resourceType, 'autoSmelters'));
  });

  // Run incrementResources every 12 seconds to simulate per minute activity
  setInterval(incrementResources, 1000); // 12 seconds

  updateUI(null); // Initial UI update for all resources
});
