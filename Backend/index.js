const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MindMapGPT backend is running!' });
});

// Helper: Create OAuth object
function getOAuth() {
  return OAuth({
    consumer: {
      key: process.env.TRELLO_KEY,
      secret: process.env.TRELLO_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });
}

// Step 1: Redirect to Trello for authorization
app.get('/auth/trello', async (req, res) => {
  const oauth = getOAuth();
  const request_data = {
    url: 'https://trello.com/1/OAuthGetRequestToken',
    method: 'POST',
    data: { oauth_callback: process.env.TRELLO_CALLBACK_URL },
  };
  try {
    const response = await axios.post(request_data.url, null, {
      params: request_data.data,
      headers: oauth.toHeader(oauth.authorize(request_data)),
    });
    const params = new URLSearchParams(response.data);
    const oauth_token = params.get('oauth_token');
    // Redirect user to Trello authorization page
    res.redirect(`https://trello.com/1/OAuthAuthorizeToken?oauth_token=${oauth_token}&name=MindMapGPT`);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start Trello OAuth', details: err.message });
  }
});

// Step 2: Handle Trello callback and exchange for access token
app.get('/auth/trello/callback', async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const oauth = getOAuth();
  const request_data = {
    url: 'https://trello.com/1/OAuthGetAccessToken',
    method: 'POST',
    data: { oauth_token, oauth_verifier },
  };
  try {
    const response = await axios.post(request_data.url, null, {
      params: request_data.data,
      headers: oauth.toHeader(oauth.authorize(request_data)),
    });
    // In production, store these tokens in DB associated with the user
    res.send(`Trello access granted! Save these tokens: ${response.data}`);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete Trello OAuth', details: err.message });
  }
});

// Get Trello boards for the authenticated user
app.get('/trello/boards', (req, res) => {
  // TODO: Use stored Trello token to fetch boards
  res.send('Trello boards fetch logic will be implemented here.');
});

// Get lists for a Trello board
app.get('/trello/lists', (req, res) => {
  // TODO: Use stored Trello token to fetch lists for a board
  res.send('Trello lists fetch logic will be implemented here.');
});

// Create cards (tasks) in a Trello list
app.post('/trello/cards', (req, res) => {
  // TODO: Use stored Trello token to create cards in a list
  res.send('Trello card creation logic will be implemented here.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 