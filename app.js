const express = require('express');
const fs = require('fs');
const { importSPKI, exportJWK } = require('jose');

const app = express();

// Use the PORT environment variable provided by Heroku, or default to a local port (e.g., 3000)
const PORT = process.env.PORT || 3000;

// 1. Load the public key from a PEM file
// (Assuming you have a 'public.pem' file in a 'keys' directory)
const publicKeyPem = fs.readFileSync('./public_key.pem', 'utf8');

let publicJwk;

async function initializeKey() {
  try {
    // 2. Convert the PEM (SPKI format) to a KeyLike object, then to JWK format
    const keyLike = await importSPKI(publicKeyPem, 'RS256'); // Specify the algorithm (e.g., 'RS256')
    publicJwk = await exportJWK(keyLike);
    
    // Optional: Add a Key ID (kid) to help clients select the correct key
    publicJwk.kid = 'YOUR-KEY-ID'; // Replace with your actual key ID
    
    console.log('Public key converted to JWK format successfully.');

  } catch (error) {
    console.error('Failed to process key:', error);
    process.exit(1); // Exit if the key cannot be loaded
  }
}

// 3. Create the JWKS endpoint
app.get('/.well-known/jwks.json', (req, res) => {
  if (!publicJwk) {
    return res.status(503).send('Key not available yet');
  }
  // The response should be a JSON object with a 'keys' array
  res.json({
    keys: [publicJwk],
  });
});

// Start the server after initializing the key
initializeKey().then(() => {
  app.listen(PORT, () => {
    console.log(`JWKS endpoint listening at .../.well-known/jwks.json on port ${PORT}`);
  });
});