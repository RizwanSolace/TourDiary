const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const DEFAULT_DESTINATION_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80';

// Middleware
app.use(cors());
app.use(express.json({ limit: '6mb' }));

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'diary.json');

// Helper function to read diary data
const readDiaryData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading diary data:', error);
    return { entries: [], destinations: [] };
  }
};

const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  try {
    const parsedUrl = new URL(imageUrl);
    return (
      parsedUrl.searchParams.get('mediaurl') ||
      parsedUrl.searchParams.get('imgurl') ||
      parsedUrl.searchParams.get('image_url') ||
      imageUrl
    );
  } catch (error) {
    return imageUrl;
  }
};

// Helper function to write diary data
const writeDiaryData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing diary data:', error);
    return false;
  }
};

// Routes

// GET all entries
app.get('/api/entries', (req, res) => {
  const data = readDiaryData();
  res.json(data.entries);
});

// GET all destinations
app.get('/api/destinations', (req, res) => {
  const data = readDiaryData();
  res.json(data.destinations);
});

// GET single entry
app.get('/api/entries/:id', (req, res) => {
  const data = readDiaryData();
  const entry = data.entries.find(e => e.id === req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json(entry);
});

// GET entries by destination
app.get('/api/destinations/:destId/entries', (req, res) => {
  const data = readDiaryData();
  const entries = data.entries.filter(e => e.destinationId === req.params.destId);
  res.json(entries);
});

// POST new entry
app.post('/api/entries', (req, res) => {
  const data = readDiaryData();
  const { title, content, destinationId, date, rating, photos } = req.body;

  if (!title || !content || !destinationId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEntry = {
    id: Date.now().toString(),
    title,
    content,
    destinationId,
    date: date || new Date().toISOString().split('T')[0],
    rating: rating || 5,
    photos: photos || [],
    createdAt: new Date().toISOString()
  };

  data.entries.push(newEntry);
  writeDiaryData(data);
  res.status(201).json(newEntry);
});

// PUT update entry
app.put('/api/entries/:id', (req, res) => {
  const data = readDiaryData();
  const index = data.entries.findIndex(e => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  const { title, content, rating } = req.body;
  data.entries[index] = {
    ...data.entries[index],
    title: title || data.entries[index].title,
    content: content || data.entries[index].content,
    rating: rating !== undefined ? rating : data.entries[index].rating,
    updatedAt: new Date().toISOString()
  };

  writeDiaryData(data);
  res.json(data.entries[index]);
});

// DELETE entry
app.delete('/api/entries/:id', (req, res) => {
  const data = readDiaryData();
  const index = data.entries.findIndex(e => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  const deletedEntry = data.entries.splice(index, 1)[0];
  writeDiaryData(data);
  res.json(deletedEntry);
});

// POST new destination
app.post('/api/destinations', (req, res) => {
  const data = readDiaryData();
  const { name, country, description, coordinates, image } = req.body;

  if (!name || !country) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newDestination = {
    id: Date.now().toString(),
    name,
    country,
    description: description || '',
    coordinates: coordinates || {},
    image: normalizeImageUrl(image) || DEFAULT_DESTINATION_IMAGE,
    createdAt: new Date().toISOString()
  };

  data.destinations.push(newDestination);
  writeDiaryData(data);
  res.status(201).json(newDestination);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Tourism Diary API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Tourism Diary API running on http://localhost:${PORT}`);
});
