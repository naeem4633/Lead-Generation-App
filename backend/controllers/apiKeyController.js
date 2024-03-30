// apiKeyController.js

const getApiKey = (req, res) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not found' });
    }
    return res.status(200).json({ apiKey });
};

module.exports = { getApiKey };
