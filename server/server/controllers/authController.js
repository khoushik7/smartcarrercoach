const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'smart_career_coach_secret_key_2026';

const createEmailTransporter = () => {
  const auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  };

  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true',
      auth
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth
  });
};

// Helper to create JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, college, degree, graduationYear, targetRole } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'student',
      college: college || 'Engineering Institute',
      degree: degree || 'B.Tech CS',
      graduationYear: graduationYear || 2026,
      targetRole: targetRole || 'Software Engineer',
      skills: ['Java', 'Python', 'React', 'Problem Solving'],
      placementReadinessScore: 70
    });

    const token = generateToken(newUser._id, newUser.role);
    
    console.log(`========================================================================`);
    console.log(`[AUTH] 🆕 NEW USER REGISTERED & SAVED TO DATABASE:`);
    console.log(`   👤 Name: ${newUser.name} | Role: ${newUser.role}`);
    console.log(`   📧 Email: ${newUser.email}`);
    console.log(`   🎯 Target Role: ${newUser.targetRole} | College: ${newUser.college}`);
    console.log(`   💾 Document ID: ${newUser._id}`);
    console.log(`========================================================================`);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        college: newUser.college,
        degree: newUser.degree,
        graduationYear: newUser.graduationYear,
        targetRole: newUser.targetRole,
        placementReadinessScore: newUser.placementReadinessScore
      }
    });
  } catch (err) {
    console.error('[AUTH] ❌ Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Standard credential validation (Demo auto-creation removed)
    if (!user) {
      console.warn(`[AUTH] ⚠️ Login attempt failed: No user found for ${cleanEmail}`);
      return res.status(400).json({ error: 'Invalid credentials. Please check your email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH] ⚠️ Login password mismatch for: ${cleanEmail}`);
      return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    // Update streak / last active
    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    console.log(`========================================================================`);
    console.log(`[AUTH] 👤 USER LOGGED IN SUCCESSFULLY:`);
    console.log(`   👤 Name: ${user.name} | Role: ${user.role}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🎯 Target Role: ${user.targetRole}`);
    console.log(`   📈 Placement Readiness Score: ${user.placementReadinessScore}%`);
    console.log(`========================================================================`);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        placementReadinessScore: user.placementReadinessScore,
        totalInterviews: user.totalInterviews,
        avgHrScore: user.avgHrScore,
        avgTechScore: user.avgTechScore,
        avgAptitudeScore: user.avgAptitudeScore,
        avgCommunicationScore: user.avgCommunicationScore,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (err) {
    console.error('[AUTH] ❌ Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'No user registered with this email address.' });
    }

    // Generate unhashed random token and save SHA-256 hash to database
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour validity

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${rawResetToken}&email=${encodeURIComponent(cleanEmail)}`;

    const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    if (!emailConfigured) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({
          error: 'Email delivery is not configured. Set EMAIL_USER and EMAIL_PASS on the server.'
        });
      }

      console.warn(`[AUTH] ⚠️ Email credentials not configured. Reset link generated in development mode: ${resetUrl}`);
      return res.json({
        message: 'Password reset link generated in development mode. Use the link below to continue.',
        resetUrl,
        emailSent: false
      });
    }

    const mailOptions = {
      from: `"Smart Career Coach" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Smart Career Coach</h2>
          <p style="color: #334155; font-size: 15px;">Hello ${user.name || 'there'},</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">You recently requested to reset the password for your account. Click the button below to proceed:</p>
          <div style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.4;">If you did not request this, please disregard this email. This link will expire in 1 hour.</p>
        </div>
      `
    };

    await createEmailTransporter().sendMail(mailOptions);
    console.log(`[AUTH] 📧 Password reset email dispatched to: ${user.email}`);

    res.json({ message: 'Password reset link sent to your email.', emailSent: true });
  } catch (err) {
    console.error('[AUTH] ❌ Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send password reset email.' });
  }
};

// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, password } = req.body;
    const finalNewPassword = newPassword || password;

    if (!token || !finalNewPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(finalNewPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    console.log(`[AUTH] 🔑 Password reset successfully completed for: ${user.email}`);

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    console.error('[AUTH] ❌ Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('[AUTH] Get me error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, targetRole, college, degree, graduationYear, skills, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (name) user.name = name;
    if (targetRole) user.targetRole = targetRole;
    if (college) user.college = college;
    if (degree) user.degree = degree;
    if (graduationYear) user.graduationYear = graduationYear;
    if (skills) user.skills = skills;
    if (bio) user.bio = bio;

    await user.save();
    console.log(`[AUTH] 💾 Updated profile for ${user.email} -> Target Role: ${user.targetRole}`);

    res.json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    console.error('[AUTH] Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
};