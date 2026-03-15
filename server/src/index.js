import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8080;

// Fix for __dirname when using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Serve static files from the 'public' folder (where Vite builds to)
app.use(express.static(path.join(__dirname, '../public')));

// 2. API Route (Specific)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'BFF is alive' });
});

// Use braces and an asterisk with a name (e.g., 'path') to match everything
app.get('{/*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BFF Server ready at http://localhost:${PORT}`);
});
