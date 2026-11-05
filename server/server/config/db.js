const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Windows DLL helper: ensure vcruntime140_1.dll exists next to mongod binary if missing
const ensureWindowsDlls = () => {
  if (process.platform !== 'win32') return;
  try {
    const cacheDir = path.resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
    const targetDll = path.join(cacheDir, 'vcruntime140_1.dll');
    if (!fs.existsSync(targetDll)) {
      const possibleSources = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\156.0.4314.58\\vcruntime140_1.dll',
        'C:\\Program Files (x86)\\Microsoft\\EdgeCore\\156.0.4314.58\\vcruntime140_1.dll',
        'C:\\Windows\\System32\\vcruntime140_1.dll'
      ];
      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
          fs.copyFileSync(src, targetDll);
          break;
        }
      }
    }
  } catch (err) {
    // Ignore DLL copy note
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // 1. Check if user configured external MongoDB (e.g. Atlas or local daemon)
  const defaultNativeUri = 'mongodb://127.0.0.1:27017/smart_career_coach';
  const mongoUri = process.env.MONGODB_URI || defaultNativeUri;

  if (process.env.MONGODB_URI) {
    try {
      console.log(`[DATABASE] 🔄 Connecting to external MongoDB at: ${mongoUri}`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
      console.log(`[DATABASE] ✅ Connected successfully to external MongoDB!`);
      return;
    } catch (err) {
      console.warn(`[DATABASE] ⚠️ External MongoDB failed (${err.message}). Falling back...`);
    }
  } else {
    // Try local native MongoDB first with quick 1.2s timeout
    try {
      await mongoose.connect(defaultNativeUri, { serverSelectionTimeoutMS: 1200 });
      console.log(`[DATABASE] ✅ Connected successfully to local MongoDB at: ${defaultNativeUri}`);
      return;
    } catch (nativeErr) {
      // Not running natively, switch to instant embedded engine
    }
  }

  // 2. Instant Embedded MongoDB Engine (No downloading required)
  try {
    ensureWindowsDlls();

    const localBin = path.resolve(__dirname, '../node_modules/.cache/mongodb-memory-server/mongod-x64-win32-6.0.14.exe');
    const serverOpts = {};

    if (fs.existsSync(localBin)) {
      serverOpts.binary = { systemBinary: localBin };
      process.env.MONGOMS_SYSTEM_BINARY = localBin;
    }

    console.log(`[DATABASE] 🚀 Initializing Embedded MongoDB Engine...`);
    mongoServer = await MongoMemoryServer.create(serverOpts);
    const inMemoryUri = mongoServer.getUri();
    
    await mongoose.connect(inMemoryUri);
    console.log(`[DATABASE] ✅ Database Online & Ready! (URI: ${inMemoryUri})`);
  } catch (memErr) {
    console.error('[DATABASE] ❌ Embedded Mongo error:', memErr.message);
    throw memErr;
  }
};

module.exports = connectDB;
