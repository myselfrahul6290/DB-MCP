import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import { getDatabaseSchema, schemaToPrompt } from './db.js';

// Initialize the embedding model
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'fp32' });

const schema = getDatabaseSchema();
const rawSchema = schemaToPrompt(schema);
const THRESHOLD = 0.25;

function dotProduct(vecA, vecB) {
  return vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
}

export async function indexDatabaseSchema() {
  const lines = rawSchema.trim().split('\n').filter(l => l.trim().length > 0);
  const vectorDB = [];

  for (const line of lines) {
    const output = await extractor(line, { pooling: 'mean', normalize: true });
    vectorDB.push({
      definition: line,
      embedding: Array.from(output.data)
    });
  }

  fs.writeFileSync('schema_vectors.json', JSON.stringify(vectorDB, null, 2));
  console.log(`Indexed ${vectorDB.length} tables to schema_vectors.json`);
  return vectorDB;
}

// Load or generate vector DB
let vectorDB = null;
if (fs.existsSync('schema_vectors.json')) {
  try {
    vectorDB = JSON.parse(fs.readFileSync('schema_vectors.json', 'utf8'));
  } catch {
    vectorDB = await indexDatabaseSchema();
  }
} else {
  vectorDB = await indexDatabaseSchema();
}

export const getReleventShema = async (userQuery) => {
  if (!vectorDB || vectorDB.length === 0) {
    vectorDB = await indexDatabaseSchema();
  }

  const output = await extractor(userQuery, { pooling: 'mean', normalize: true });
  const queryVector = Array.from(output.data);

  const result = vectorDB
    .map(table => ({
      definition: table.definition,
      score: dotProduct(queryVector, table.embedding)
    }))
    .filter(table => table.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (result.length === 0) {
    return null;
  }

  return result.map(t => t.definition).join('\n');
};

