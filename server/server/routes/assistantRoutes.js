const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { optionalProtect } = require('../middleware/authMiddleware');

let totalTreatsCount = 0;

// @route POST /api/assistant/guidance
router.post('/guidance', optionalProtect, async (req, res) => {
  try {
    const { targetRole, step1Headline, targetPath } = req.body;

    let userEmail = 'student@smartcareer.com';
    let userName = 'Student Candidate';

    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.targetRole = targetRole || user.targetRole;
        await user.save();
        userEmail = user.email;
        userName = user.name;
      }
    } else {
      const user = await User.findOne({ email: 'student@smartcareer.com' });
      if (user) {
        user.targetRole = targetRole || user.targetRole;
        await user.save();
      }
    }

    console.log(`\n========================================================================`);
    console.log(`[BARKLEY AI] 🐶 BARKLEY CAREER PUP GUIDANCE TRIGGERED:`);
    console.log(`  👤 Student: ${userName} <${userEmail}>`);
    console.log(`  🎯 Target Career Role: "${targetRole}"`);
    console.log(`  🐾 Sniffed Step 1 Priority: "${step1Headline}"`);
    console.log(`  🚀 Destination Page: "${targetPath}"`);
    console.log(`  💾 Updated Student Target Role in MongoDB!`);
    console.log(`  🦴 Barkley is barking for a treat!`);
    console.log(`========================================================================\n`);

    res.json({
      success: true,
      message: 'Guidance logged and target role saved to database.',
      targetRole,
      step1Headline
    });
  } catch (err) {
    console.error('[BARKLEY AI] Guidance log error:', err);
    res.status(500).json({ error: 'Failed to record guidance' });
  }
});

// @route POST /api/assistant/treat
router.post('/treat', optionalProtect, (req, res) => {
  totalTreatsCount++;
  console.log(`\n[BARKLEY AI] 🦴 TREAT RECEIVED! Barkley barks happily! (Total treats: ${totalTreatsCount})\n`);
  res.json({ success: true, totalTreats: totalTreatsCount });
});

module.exports = router;
