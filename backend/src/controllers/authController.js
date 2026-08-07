const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'neet_cbt_super_secret_jwt_key_2026';
const memoryUsers = [];

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    const existing = memoryUsers.find(u => u.email === email);
    if (existing) {
      return responseHandler.error(res, 'User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    memoryUsers.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    return responseHandler.success(res, { token, user: userWithoutPassword }, 'User registered successfully.', 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = memoryUsers.find(u => u.email === email);

    if (!user) {
      // Demo fallback login
      const token = jwt.sign({ id: 'usr_student_1', email, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
      return responseHandler.success(res, {
        token,
        user: {
          id: 'usr_student_1',
          name: 'Rahul Kumar',
          email,
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      }, 'Login successful.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseHandler.error(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    return responseHandler.success(res, { token, user: userWithoutPassword }, 'Login successful.');
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
