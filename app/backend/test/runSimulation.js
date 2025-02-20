require('dotenv').config();
const { simulateDesigner } = require('./simulateDesigner');
const { simulateBuyer } = require('./simulateBuyer');
const { simulatePurchase } = require('./simulatePurchase');

async function runSimulation() {
    try {
        console.log('🚀 Starting Full Simulation...\n');

        // 1. Run designer simulation
        console.log('Step 1: Designer Simulation');
        console.log('------------------------');
        await simulateDesigner();
        console.log('\n');

        // 2. Run buyer simulation
        console.log('Step 2: Buyer Simulation');
        console.log('---------------------');
        await simulateBuyer();
        console.log('\n');

        // 3. Run purchase simulation (now includes marketplace)
        console.log('Step 3: Purchase & Marketplace Simulation');
        console.log('-------------------------------------');
        await simulatePurchase();
        console.log('\n');

        console.log('\n✨ Full simulation completed successfully!');

    } catch (error) {
        console.error('❌ Error in simulation:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    runSimulation();
}

module.exports = { runSimulation };