const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');

// Get all suggestions
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get suggestion by ID
router.get('/:id', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new suggestion
router.post('/', async (req, res) => {
  try {
    const newSuggestion = new Suggestion({
      customerName: req.body.customerName,
      content: req.body.content
    });
    
    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update suggestion status
router.patch('/:id/status', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    suggestion.status = req.body.status;
    
    const updatedSuggestion = await suggestion.save();
    res.json(updatedSuggestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete suggestion
router.delete('/:id', async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
