// routes/memberAuthRoutes.js
const express = require('express');
const { loginMember, getMemberProfile, updateMemberProfile, deleteMemberProfile ,registerMember} = require('../controllers/member');
const  {protect}  = require('../middlewares/user_middleware');

const router = express.Router();
router.post('/register', registerMember);

router.post('/login', loginMember);          // Member login
router.get('/profile', protect, getMemberProfile);  // Get logged-in member's profile
router.put('/profile', protect, updateMemberProfile);  // Update logged-in member's profile
router.delete('/profile', protect, deleteMemberProfile);  // Delete logged-in member's profile

module.exports = router;
