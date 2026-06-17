const express = require('express');
const axios = require('axios');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('vendor'), async (req, res) => {
  const { imageUrl } = req.body;
  try {
    if (!imageUrl) return res.status(400).json({ message: 'Image URL required' });
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, null, {
      params: { image: imageUrl },
    });
    if (!response.data || !response.data.data) return res.status(500).json({ message: 'Upload failed' });
    res.json({ url: response.data.data.url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
