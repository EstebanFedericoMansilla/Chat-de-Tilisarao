import express from "express";
import path from "path";
import User from "./models/User.js";
import crypto from "crypto";

const app = express();

// Configurar CORS para permitir peticiones desde cualquier origen
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// static files
app.use(express.static(path.join(import.meta.dirname, "../public")));

// Almacén temporal de tokens de sesión (en producción usar Redis o base de datos)
const sessionTokens = new Map();
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of sessionTokens.entries()) {
    if (now > data.expiresAt) {
      sessionTokens.delete(token);
    }
  }
}
setInterval(cleanExpiredTokens, 60 * 60 * 1000);

// Ruta de registro
app.post('/register', async (req, res) => {
  const { nick, password } = req.body;
  if (!nick || !password) return res.json({ success: false, message: 'Datos incompletos.' });
  try {
    const exists = await User.findByNick(nick);
    if (exists) return res.json({ success: false, message: 'El apodo ya existe.' });
    await User.create({ nick, password });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Error en el registro.' });
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  console.log('Intento de login:', { nick: req.body.nick, hasPassword: !!req.body.password });
  const { nick, password } = req.body;
  if (!nick || !password) {
    console.log('Login fallido: datos incompletos');
    return res.json({ success: false, message: 'Datos incompletos.' });
  }
  try {
    const user = await User.validatePassword(nick, password);
    if (!user) {
      console.log('Login fallido: credenciales incorrectas para', nick);
      return res.json({ success: false, message: 'Credenciales incorrectas.' });
    }
    // Generar token de sesión
    const token = generateSessionToken();
    const expiresAt = Date.now() + SESSION_DURATION;
    sessionTokens.set(token, { nick, expiresAt, createdAt: Date.now() });
    console.log('Login exitoso para:', nick);
    res.json({ success: true, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.json({ success: false, message: 'Error en el login.' });
  }
});

// Ruta para verificar sesión
app.post('/verify-session', async (req, res) => {
  const { nick, token } = req.body;
  if (!nick || !token) return res.json({ success: false, message: 'Datos incompletos.' });
  const sessionData = sessionTokens.get(token);
  if (!sessionData) return res.json({ success: false, message: 'Token inválido.' });
  if (Date.now() > sessionData.expiresAt) {
    sessionTokens.delete(token);
    return res.json({ success: false, message: 'Sesión expirada.' });
  }
  if (sessionData.nick !== nick) return res.json({ success: false, message: 'Token no corresponde al usuario.' });
  try {
    const user = await User.findByNick(nick);
    if (!user) {
      sessionTokens.delete(token);
      return res.json({ success: false, message: 'Usuario no encontrado.' });
    }
    // Renovar expiración del token
    sessionData.expiresAt = Date.now() + SESSION_DURATION;
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Error verificando sesión.' });
  }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token && sessionTokens.has(token)) {
    sessionTokens.delete(token);
  }
  res.json({ success: true });
});

// starting the server
export default app;
