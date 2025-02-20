module.exports = {
    FACTORY_ADDRESS: process.env.SMART_WALLET_FACTORY_ADDRESS,
    PAYMASTER_ADDRESS: process.env.PAYMASTER_ADDRESS,
    GAS_LIMIT: 300000,
    SPONSORED_METHODS: ['mintNFT', 'transferFrom']
};