const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', 'data');
const storePath = path.join(dataDir, 'store.json');

function readData() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(storePath)) {
      const initial = {
        users: [],
        writings: [],
        voiceSessions: [],
        videoSessions: [],
        progress: []
      };
      fs.writeFileSync(storePath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(storePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading embedded store:', err);
    return {
      users: [],
      writings: [],
      voiceSessions: [],
      videoSessions: [],
      progress: []
    };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to embedded store:', err);
  }
}

function matchesFilter(item, filter = {}) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    const val = filter[key];
    if (key === '_id' || key === 'id') {
      if (item._id !== val && item.id !== val) return false;
    } else if (typeof val === 'object' && val !== null) {
      if (val.$gte !== undefined && item[key] < val.$gte) return false;
      if (val.$lte !== undefined && item[key] > val.$lte) return false;
      if (val.$gt !== undefined && item[key] <= val.$gt) return false;
      if (val.$lt !== undefined && item[key] >= val.$lt) return false;
      if (val.$ne !== undefined && item[key] === val.$ne) return false;
      if (val.$in !== undefined && Array.isArray(val.$in) && !val.$in.includes(item[key])) return false;
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

const EmbeddedStore = {
  create(collection, doc) {
    const data = readData();
    if (!data[collection]) data[collection] = [];
    const newDoc = {
      _id: uuidv4().replace(/-/g, '').substring(0, 24),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data[collection].push(newDoc);
    writeData(data);
    return JSON.parse(JSON.stringify(newDoc));
  },

  find(collection, filter = {}, options = {}) {
    const data = readData();
    const items = (data[collection] || []).filter(item => matchesFilter(item, filter));
    
    // sorting
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortDir = options.sort[sortKey]; // -1 or 1
      items.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortDir === -1 ? 1 : -1;
        if (valA > valB) return sortDir === -1 ? -1 : 1;
        return 0;
      });
    }

    if (options.limit && typeof options.limit === 'number') {
      return items.slice(0, options.limit);
    }
    return JSON.parse(JSON.stringify(items));
  },

  findOne(collection, filter = {}) {
    const items = this.find(collection, filter);
    return items.length > 0 ? items[0] : null;
  },

  findById(collection, id) {
    return this.findOne(collection, { _id: id });
  },

  findByIdAndUpdate(collection, id, updates) {
    const data = readData();
    const list = data[collection] || [];
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return JSON.parse(JSON.stringify(list[index]));
  },

  countDocuments(collection, filter = {}) {
    return this.find(collection, filter).length;
  }
};

module.exports = EmbeddedStore;
