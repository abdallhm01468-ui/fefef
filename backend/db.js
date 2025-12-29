import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Security: Require MONGODB_URI in environment
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

const dbName = process.env.DB_NAME || 'eduflow';

let client;
let db;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      retryWrites: true,
      w: "majority",
    });

    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    db = client.db(dbName);

    // Create collections if they don't exist
    const collections = ['exams', 'summaries', 'videos', 'lives'];
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        // Collection already exists
      }
    }

    return db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}
