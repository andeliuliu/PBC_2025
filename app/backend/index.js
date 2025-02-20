// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/db");

// import routes
const designerRoutes = require("./routes/designerRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const nftRoutes = require("./routes/nftRoutes");
const smartWalletRoutes = require('./smartWallet/smartWalletRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use("/api/designer", designerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/nfts", nftRoutes);
app.use('/api/wallet', smartWalletRoutes);
app.use('/api/marketplace', marketplaceRoutes);
// Error handling middleware
console.log('Routes registered:', app._router.stack.map(r => r.route?.path).filter(Boolean));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});