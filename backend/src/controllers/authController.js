const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const responseHandler = require('../utils/responseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'neet_cbt_super_secret_jwt_key_2026';

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', phone = '' } = req.body;

    if (!email || !password || !name) {
      return responseHandler.error(res, 'Name, Email, and Password are required', 400);
    }

    const checkRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (checkRes.rows.length > 0) {
      return responseHandler.error(res, 'User account with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const avatar = role === 'teacher'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, phone, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, name.trim(), email.trim().toLowerCase(), hashedPassword, role, phone, avatar]
    );

    const userObj = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone,
      avatar
    };

    const token = jwt.sign({ id: userObj.id, email: userObj.email, role: userObj.role }, JWT_SECRET, { expiresIn: '30d' });

    return responseHandler.success(res, { token, user: userObj }, 'User account registered successfully in PostgreSQL.', 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return responseHandler.error(res, 'Email and Password are required', 400);
    }

    const checkRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);

    if (checkRes.rows.length === 0) {
      // If db doesn't have the user yet, auto-register standard accounts for seamless experience
      const isTeacher = email.includes('teacher') || email.includes('hod');
      const role = isTeacher ? 'teacher' : 'student';
      const name = isTeacher ? 'Dr. S. K. Roy (HOD Physics)' : 'Rahul Kumar';
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = `usr_${Date.now()}`;
      const avatar = isTeacher 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, phone, avatar)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO NOTHING`,
        [userId, name, email.trim().toLowerCase(), hashedPassword, role, '', avatar]
      );

      const token = jwt.sign({ id: userId, email: email.trim().toLowerCase(), role }, JWT_SECRET, { expiresIn: '30d' });

      return responseHandler.success(res, {
        token,
        user: { id: userId, name, email: email.trim().toLowerCase(), role, avatar }
      }, 'Login successful (PostgreSQL Account Provisioned).');
    }

    const dbUser = checkRes.rows[0];
    const isMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!isMatch) {
      return responseHandler.error(res, 'Invalid password or email address', 401);
    }

    const userObj = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      phone: dbUser.phone,
      avatar: dbUser.avatar
    };

    const token = jwt.sign({ id: userObj.id, email: userObj.email, role: userObj.role }, JWT_SECRET, { expiresIn: '30d' });

    return responseHandler.success(res, { token, user: userObj }, 'PostgreSQL Login Successful.');
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return responseHandler.success(res, req.user, 'Current user profile retrieved.');
  } catch (err) {
    next(err);
  }
};
