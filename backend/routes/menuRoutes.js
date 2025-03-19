const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get menus by week
router.get('/week/:week', async (req, res) => {
  try {
    const menus = await Menu.find({ week: req.params.week });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get menu by day and week
router.get('/:day/:week', async (req, res) => {
  try {
    const menu = await Menu.findOne({ 
      day: req.params.day, 
      week: req.params.week 
    });
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update menu
router.post('/', async (req, res) => {
  try {
    // Check if menu already exists for this day and week
    const existingMenu = await Menu.findOne({ 
      day: req.body.day, 
      week: req.body.week 
    });
    
    if (existingMenu) {
      // Update existing menu
      existingMenu.items = req.body.items;
      existingMenu.updatedAt = Date.now();
      
      const updatedMenu = await existingMenu.save();
      return res.status(200).json(updatedMenu);
    }
    
    // Create new menu
    const newMenu = new Menu({
      day: req.body.day,
      week: req.body.week,
      items: req.body.items
    });
    
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete menu
router.delete('/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
