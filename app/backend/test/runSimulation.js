require('dotenv').config();
const { simulateDesigner } = require('./simulateDesigner');
const { simulateBuyer } = require('./simulateBuyer');
const { simulatePurchase } = require('./simulatePurchase');
const fs = require('fs').promises;
const path = require('path');

async function runFullSimulation() {
    try {
        console.log('🚀 Starting Full Simulation\n');
        console.log('=========================\n');

        // Clean up any existing test data
        try {
            await fs.unlink(path.join(__dirname, 'testData.json'));
        } catch (error) {
            // File might not exist, that's okay
        }

        // Run designer simulation
        await simulateDesigner();
        console.log('\n=========================\n');
        
        // Wait a bit before running buyer simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Run buyer simulation
        await simulateBuyer();
        console.log('\n=========================\n');

        // Wait a bit before running purchase simulation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Run purchase simulation
        await simulatePurchase();
        console.log('\n=========================\n');

        // Display final test data
        const testData = JSON.parse(
            await fs.readFile(path.join(__dirname, 'testData.json'))
        );
        console.log('📝 Final Test Data:', testData);

        console.log('\n=========================\n');
        console.log('✨ Full simulation completed successfully!');

    } catch (error) {
        console.error('❌ Simulation failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runFullSimulation();
}