// server.js
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

// ¡PRIORIDAD AL API! Define tu ruta API de Firebase aquí, ANTES de servir estáticos.
app.get('/firebase-config', (req, res) => {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_API_KEY")) { // Verifica placeholders
        console.error("Firebase config is incomplete or still using placeholder values. Check your .env file.");
        return res.status(500).json({ error: "Server configuration error. Firebase API Key is missing or invalid." });
    }
    res.json(firebaseConfig);
});

// Sirve tus archivos estáticos desde la carpeta 'public'.
// Esta es la línea crucial después de mover server.js a la raíz.
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.log('Firebase config loaded (for verification):', {
        apiKey: firebaseConfig.apiKey ? '************' : 'N/A',
        authDomain: firebaseConfig.authDomain || 'N/A',
        projectId: firebaseConfig.projectId || 'N/A',
        appId: firebaseConfig.appId || 'N/A'
    });
});