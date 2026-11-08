const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable JSON parsing and CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Directory Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});
const upload = multer({ storage });

// Database Persistence (JSON file storage)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFilePath = path.join(dataDir, 'db.json');

function getInitialData() {
  const users = [
    {
      id: 1,
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      studentId: 'ADM-001',
      phone: '+1-555-0100',
      password: 'admin123',
      role: 'ROLE_ADMIN',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      email: 'rahul@campus.edu',
      studentId: 'CS2024-042',
      phone: '+1-555-0142',
      password: 'password123',
      role: 'ROLE_STUDENT',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 3,
      name: 'Priya Patel',
      email: 'priya@campus.edu',
      studentId: 'EE2023-018',
      phone: '+1-555-0118',
      password: 'password123',
      role: 'ROLE_STUDENT',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 4,
      name: 'Arjun Verma',
      email: 'arjun@campus.edu',
      studentId: 'ME2024-089',
      phone: '+1-555-0189',
      password: 'password123',
      role: 'ROLE_STUDENT',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ];

  const items = [
    {
      id: 1,
      itemName: 'Black Boat Rockerz Earphones',
      type: 'FOUND',
      category: 'Electronics',
      description: 'Found on table 4 in the 2nd-floor reading area. Kept securely at the library desk.',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      time: '03:30 PM',
      location: 'Central Library 2nd Floor',
      color: 'Black',
      brand: 'Boat',
      identifyingDetails: 'Slight scratch on the left earpiece button.',
      currentLocation: 'Library Main Reception Desk',
      contactInfo: 'librarian@campus.edu',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 3,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 2,
      itemName: 'Black Boat Earphones',
      type: 'LOST',
      category: 'Electronics',
      description: 'Lost during group study session near library window desks. Has sentimental value.',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      time: '03:00 PM',
      location: 'Central Library',
      color: 'Black',
      brand: 'Boat',
      identifyingDetails: 'Black neckband with silver logo.',
      currentLocation: 'Campus Area',
      contactInfo: '+1-555-0142',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 2,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 3,
      itemName: 'Campus Student ID Card',
      type: 'FOUND',
      category: 'ID Cards',
      description: 'Student identity card found near cafeteria checkout counter.',
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      time: '01:15 PM',
      location: 'Campus Cafeteria Food Court',
      color: 'Blue',
      brand: 'College Issued',
      identifyingDetails: 'Department of Mechanical Engineering, ID ending in 089.',
      currentLocation: 'Campus Security Post Gate 1',
      contactInfo: 'security@campus.edu',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 2,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 4,
      itemName: 'Casio Vintage Digital Watch',
      type: 'FOUND',
      category: 'Accessories',
      description: 'Found on the bench beside the outdoor basketball court after evening match.',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      time: '05:45 PM',
      location: 'Sports Complex Basketball Court',
      color: 'Silver',
      brand: 'Casio',
      identifyingDetails: 'Stainless steel band, minor scuff on top bezel.',
      currentLocation: 'Sports Department In-charge Room 102',
      contactInfo: '+1-555-0189',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 4,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 5,
      itemName: 'HP 65W Laptop Charger',
      type: 'LOST',
      category: 'Electronics',
      description: 'Left behind after CS lab practical session. Urgent needed for semester exam preparation.',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      time: '11:30 AM',
      location: 'Computer Lab 3 Block C',
      color: 'Black',
      brand: 'HP',
      identifyingDetails: 'Blue tip barrel connector with yellow sticker label.',
      currentLocation: 'Computer Science Lab',
      contactInfo: '+1-555-0118',
      imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 3,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 6,
      itemName: 'Blue Skybags Laptop Backpack',
      type: 'FOUND',
      category: 'Bags',
      description: 'Found left on the back row seat after the guest lecture in Seminar Hall 2.',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      time: '04:00 PM',
      location: 'Seminar Hall 2 Admin Block',
      color: 'Blue',
      brand: 'Skybags',
      identifyingDetails: 'Has a NASA keychain attached to the front pocket zip.',
      currentLocation: 'Admin Office Enquiry Counter',
      contactInfo: 'admin@campus.edu',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      status: 'RETURNED',
      userId: 1,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 7,
      itemName: 'Chemistry Lab Record Notebook',
      type: 'LOST',
      category: 'Books',
      description: 'Spiral-bound chemistry lab record book with blue hard cover.',
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      time: '02:00 PM',
      location: 'Chemistry Block Room 204',
      color: 'Blue',
      brand: 'College Stationery',
      identifyingDetails: 'Roll Number CS2024-042 written on the index page.',
      currentLocation: 'Chemistry Lab',
      contactInfo: '+1-555-0142',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 2,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 8,
      itemName: 'Brown Leather Fossil Wallet',
      type: 'FOUND',
      category: 'Accessories',
      description: 'Found under the bench in the campus garden pathway.',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      time: '12:45 PM',
      location: 'Campus Main Garden',
      color: 'Brown',
      brand: 'Fossil',
      identifyingDetails: 'Contains campus transit card and coins. Kept safely.',
      currentLocation: 'Student Affairs Office Room 12',
      contactInfo: 'affairs@campus.edu',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: 4,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const claims = [
    {
      id: 1,
      itemId: 4,
      claimantId: 3,
      claimantName: 'Priya Patel',
      claimantStudentId: 'EE2023-018',
      claimantPhone: '+1-555-0118',
      reason: 'I lost my silver Casio vintage watch during practice on Tuesday evening.',
      additionalDetails: 'The watch display has a 24-hour mode enabled, and there is a small scratch near the top right button.',
      status: 'PENDING',
      adminNotes: null,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  return { users, items, claims, nextUserId: 5, nextItemId: 9, nextClaimId: 2 };
}

function loadDb() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json, recreating initial data:', err.message);
  }
  const init = getInitialData();
  saveDb(init);
  return init;
}

function saveDb(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err.message);
  }
}

// -------------------------------------------------------------
// Authentication Routes
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const db = loadDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = 'token-' + Buffer.from(`${user.id}:${user.email}`).toString('base64');
  return res.json({
    success: true,
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId,
    phone: user.phone,
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, studentId, phone, password, role } = req.body;
  if (!name || !email || !studentId || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const db = loadDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.studentId === studentId);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User with this email or student ID already exists' });
  }

  const newUser = {
    id: db.nextUserId++,
    name,
    email,
    studentId,
    phone,
    password,
    role: role || 'ROLE_STUDENT',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const token = 'token-' + Buffer.from(`${newUser.id}:${newUser.email}`).toString('base64');
  return res.status(201).json({
    success: true,
    token,
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    studentId: newUser.studentId,
    phone: newUser.phone,
    message: 'Registration successful'
  });
});

// -------------------------------------------------------------
// File Upload Route
// -------------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select a file to upload' });
  }
  return res.json({ url: `/uploads/${req.file.filename}` });
});

// -------------------------------------------------------------
// Items Routes
// -------------------------------------------------------------
app.get('/api/items', (req, res) => {
  const { type } = req.query;
  const db = loadDb();
  let results = db.items;
  if (type) {
    results = results.filter(i => i.type.toUpperCase() === type.toUpperCase());
  }
  return res.json(results);
});

app.get('/api/items/recent-found', (req, res) => {
  const db = loadDb();
  const recent = db.items
    .filter(i => i.type === 'FOUND' && i.status !== 'CLOSED')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
  return res.json(recent);
});

app.get('/api/items/search', (req, res) => {
  const { type, category, status, location, keyword } = req.query;
  const db = loadDb();
  let results = db.items;

  if (type) {
    results = results.filter(i => i.type.toLowerCase() === type.toLowerCase());
  }
  if (category) {
    results = results.filter(i => (i.category || '').toLowerCase() === category.toLowerCase());
  }
  if (status) {
    results = results.filter(i => (i.status || '').toLowerCase() === status.toLowerCase());
  }
  if (location) {
    const locLower = location.toLowerCase();
    results = results.filter(i => (i.location || '').toLowerCase().includes(locLower));
  }
  if (keyword) {
    const k = keyword.toLowerCase();
    results = results.filter(i =>
      (i.itemName || '').toLowerCase().includes(k) ||
      (i.description || '').toLowerCase().includes(k) ||
      (i.brand || '').toLowerCase().includes(k) ||
      (i.location || '').toLowerCase().includes(k) ||
      (i.color || '').toLowerCase().includes(k)
    );
  }

  return res.json(results);
});

app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const item = db.items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Populate user data
  const user = db.users.find(u => u.id === item.userId);
  const enrichedItem = {
    ...item,
    user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone, studentId: user.studentId } : null
  };
  return res.json(enrichedItem);
});

// Smart Matching Algorithm
app.get('/api/items/:id/matches', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const targetItem = db.items.find(i => i.id === id);
  if (!targetItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const oppositeType = targetItem.type === 'LOST' ? 'FOUND' : 'LOST';
  const candidates = db.items.filter(i => i.type === oppositeType && i.status !== 'CLOSED');

  const matches = [];

  for (const candidate of candidates) {
    let score = 0;
    const reasons = [];

    // 1. Category Check (+35 pts)
    if (targetItem.category && candidate.category &&
        targetItem.category.toLowerCase() === candidate.category.toLowerCase()) {
      score += 35;
      reasons.add = reasons.push(`Same Category (${candidate.category})`);
    }

    // 2. Name keywords (+25 pts)
    if (targetItem.itemName && candidate.itemName) {
      const nameA = targetItem.itemName.toLowerCase();
      const nameB = candidate.itemName.toLowerCase();
      if (nameA.includes(nameB) || nameB.includes(nameA)) {
        score += 25;
        reasons.push('Item name matches closely');
      } else {
        const wordsA = nameA.split(/\s+/);
        let wordMatched = false;
        for (const w of wordsA) {
          if (w.length > 2 && nameB.includes(w)) {
            wordMatched = true;
            break;
          }
        }
        if (wordMatched) {
          score += 15;
          reasons.push('Item keywords match');
        }
      }
    }

    // 3. Location match (+20 pts)
    if (targetItem.location && candidate.location) {
      const locA = targetItem.location.toLowerCase();
      const locB = candidate.location.toLowerCase();
      if (locA.includes(locB) || locB.includes(locA)) {
        score += 20;
        reasons.push('Same or nearby campus location');
      }
    }

    // 4. Color match (+10 pts)
    if (targetItem.color && candidate.color &&
        targetItem.color.toLowerCase() === candidate.color.toLowerCase()) {
      score += 10;
      reasons.push(`Matching color (${candidate.color})`);
    }

    // 5. Brand match (+10 pts)
    if (targetItem.brand && candidate.brand &&
        targetItem.brand.toLowerCase() === candidate.brand.toLowerCase()) {
      score += 10;
      reasons.push(`Matching brand (${candidate.brand})`);
    }

    if (score >= 35) {
      matches.push({
        item: candidate,
        matchScore: Math.min(score, 100),
        matchReasons: reasons
      });
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore);
  return res.json(matches);
});

app.get('/api/items/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { type } = req.query;
  const db = loadDb();
  let results = db.items.filter(i => i.userId === userId);
  if (type) {
    results = results.filter(i => i.type.toLowerCase() === type.toLowerCase());
  }
  return res.json(results);
});

function handleCreateItem(req, res, forceType) {
  const db = loadDb();
  const {
    itemName,
    type,
    category,
    description,
    date,
    time,
    location,
    color,
    brand,
    identifyingDetails,
    currentLocation,
    contactInfo,
    imageUrl,
    userId
  } = req.body;

  if (!itemName || !category || !location || !userId) {
    return res.status(400).json({ error: 'Item name, category, location, and user ID are required' });
  }

  const newItem = {
    id: db.nextItemId++,
    itemName,
    type: forceType || type || 'LOST',
    category,
    description: description || '',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '',
    location,
    color: color || '',
    brand: brand || '',
    identifyingDetails: identifyingDetails || '',
    currentLocation: currentLocation || location,
    contactInfo: contactInfo || '',
    imageUrl: imageUrl || '',
    status: 'ACTIVE',
    userId: parseInt(userId, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.items.unshift(newItem);
  saveDb(db);
  return res.status(201).json(newItem);
}

app.post('/api/items', (req, res) => handleCreateItem(req, res));
app.post('/api/items/lost', (req, res) => handleCreateItem(req, res, 'LOST'));
app.post('/api/items/found', (req, res) => handleCreateItem(req, res, 'FOUND'));

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const idx = db.items.findIndex(i => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const existing = db.items[idx];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    userId: existing.userId,
    updatedAt: new Date().toISOString()
  };

  db.items[idx] = updated;
  saveDb(db);
  return res.json(updated);
});

app.put('/api/items/:id/status', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const db = loadDb();
  const item = db.items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.status = status;
  item.updatedAt = new Date().toISOString();
  saveDb(db);
  return res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const idx = db.items.findIndex(i => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  db.items.splice(idx, 1);
  // Also clean up claims
  db.claims = db.claims.filter(c => c.itemId !== id);
  saveDb(db);
  return res.json({ message: 'Item deleted successfully' });
});

// -------------------------------------------------------------
// Claims Routes
// -------------------------------------------------------------
app.post('/api/claims', (req, res) => {
  const {
    itemId,
    claimantId,
    claimantName,
    claimantStudentId,
    claimantPhone,
    reason,
    additionalDetails
  } = req.body;

  if (!itemId || !claimantId || !reason) {
    return res.status(400).json({ error: 'Item ID, claimant ID, and reason are required' });
  }

  const db = loadDb();
  const item = db.items.find(i => i.id === parseInt(itemId, 10));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const newClaim = {
    id: db.nextClaimId++,
    itemId: item.id,
    claimantId: parseInt(claimantId, 10),
    claimantName: claimantName || 'Anonymous Student',
    claimantStudentId: claimantStudentId || '',
    claimantPhone: claimantPhone || '',
    reason,
    additionalDetails: additionalDetails || '',
    status: 'PENDING',
    adminNotes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.claims.unshift(newClaim);
  saveDb(db);
  return res.status(201).json(newClaim);
});

app.get('/api/claims', (req, res) => {
  const db = loadDb();
  const enrichedClaims = db.claims.map(c => {
    const item = db.items.find(i => i.id === c.itemId);
    const claimant = db.users.find(u => u.id === c.claimantId);
    return {
      ...c,
      item,
      claimant: claimant ? { id: claimant.id, name: claimant.name, email: claimant.email, phone: claimant.phone } : null
    };
  });
  return res.json(enrichedClaims);
});

app.get('/api/claims/item/:itemId', (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const db = loadDb();
  const claims = db.claims.filter(c => c.itemId === itemId);
  return res.json(claims);
});

app.get('/api/claims/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const db = loadDb();
  const enriched = db.claims
    .filter(c => c.claimantId === userId)
    .map(c => ({
      ...c,
      item: db.items.find(i => i.id === c.itemId)
    }));
  return res.json(enriched);
});

app.get('/api/claims/owner/:ownerId', (req, res) => {
  const ownerId = parseInt(req.params.ownerId, 10);
  const db = loadDb();
  const ownerItemIds = db.items.filter(i => i.userId === ownerId).map(i => i.id);
  const claims = db.claims
    .filter(c => ownerItemIds.includes(c.itemId))
    .map(c => ({
      ...c,
      item: db.items.find(i => i.id === c.itemId),
      claimant: db.users.find(u => u.id === c.claimantId)
    }));
  return res.json(claims);
});

app.put('/api/claims/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const db = loadDb();
  const claim = db.claims.find(c => c.id === id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  claim.status = status;
  if (notes !== undefined) claim.adminNotes = notes;
  claim.updatedAt = new Date().toISOString();

  // If approved, update item status to CLAIMED
  if (status.toUpperCase() === 'APPROVED') {
    const item = db.items.find(i => i.id === claim.itemId);
    if (item) {
      item.status = 'CLAIMED';
      item.updatedAt = new Date().toISOString();
    }
  }

  saveDb(db);
  return res.json(claim);
});

// -------------------------------------------------------------
// Admin & Dashboard Routes
// -------------------------------------------------------------
app.get('/api/admin/dashboard', (req, res) => {
  const { userId } = req.query;
  const db = loadDb();

  const totalUsers = db.users.length;
  const totalLostItems = db.items.filter(i => i.type === 'LOST').length;
  const totalFoundItems = db.items.filter(i => i.type === 'FOUND').length;
  const totalClaims = db.claims.length;
  const itemsReturned = db.items.filter(i => i.status === 'RETURNED' || i.status === 'CLAIMED').length;
  const activeReports = db.items.filter(i => i.status === 'ACTIVE').length;

  let myLostItems = 0;
  let myFoundItems = 0;
  let myActiveClaims = 0;
  let myResolvedItems = 0;

  if (userId) {
    const uid = parseInt(userId, 10);
    myLostItems = db.items.filter(i => i.userId === uid && i.type === 'LOST').length;
    myFoundItems = db.items.filter(i => i.userId === uid && i.type === 'FOUND').length;
    myActiveClaims = db.claims.filter(c => c.claimantId === uid && c.status === 'PENDING').length;
    myResolvedItems = db.items.filter(i => i.userId === uid && (i.status === 'RETURNED' || i.status === 'CLAIMED')).length;
  }

  return res.json({
    totalUsers,
    totalLostItems,
    totalFoundItems,
    totalClaims,
    itemsReturned,
    activeReports,
    myLostItems,
    myFoundItems,
    myActiveClaims,
    myResolvedItems
  });
});

app.get('/api/admin/users', (req, res) => {
  const db = loadDb();
  const safeUsers = db.users.map(({ password, ...rest }) => rest);
  return res.json(safeUsers);
});

app.get('/api/admin/items', (req, res) => {
  const db = loadDb();
  return res.json(db.items);
});

app.delete('/api/admin/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users.splice(idx, 1);
  saveDb(db);
  return res.json({ message: 'User deleted successfully' });
});

app.delete('/api/admin/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = loadDb();
  const idx = db.items.findIndex(i => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  db.items.splice(idx, 1);
  db.claims = db.claims.filter(c => c.itemId !== id);
  saveDb(db);
  return res.json({ message: 'Item deleted successfully' });
});

// -------------------------------------------------------------
// Serve Frontend Static Files
// -------------------------------------------------------------
const frontendDir = path.join(__dirname, 'frontend');
app.use(express.static(frontendDir));

// Fallback to index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🎓 CAMPUS LOST & FOUND PORTAL (NODE.JS + EXPRESS)`);
  console.log(`  🌐 Server running at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
