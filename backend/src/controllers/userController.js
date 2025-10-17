import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { dni, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ dni, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ message: "Error en el login" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};
