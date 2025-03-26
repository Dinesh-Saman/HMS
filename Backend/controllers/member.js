const jwt = require('jsonwebtoken');
const Member = require('../models/member');

// Generate JWT token (used during login and update response)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
};



// Member Registration
const registerMember = async (req, res) => {
  const { username, email, password, profilePic, bio } = req.body;

  try {
    // Check if the member already exists
    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      return res.status(400).json({ message: 'Member already exists with this email' });
    }

    // Create a new member
    const member = new Member({
      username,
      email,
      password,
      profilePic,
      bio,
    });

    // Save the new member to the database
    const createdMember = await member.save();

    // Send response with created member info and token
    res.status(201).json({
      _id: createdMember._id,
      username: createdMember.username,
      email: createdMember.email,
      profilePic: createdMember.profilePic,
      bio: createdMember.bio,
      token: generateToken(createdMember._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Member login (unchanged)
const loginMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({ email });

    if (member && (await member.matchPassword(password))) {
      res.json({
        _id: member._id,
        username: member.username,
        email: member.email,
        profilePic: member.profilePic,
        token: generateToken(member._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get member profile by req.user (unchanged)
const getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id);
    console.log(member);

    if (member) {
      res.json({
        _id: member._id,
        username: member.username,
        email: member.email,
        profilePic: member.profilePic,
        bio: member.bio,
      });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update member profile
const updateMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id);

    if (member) {
      // Allow updating username, email, bio, and profilePic
      member.username = req.body.username || member.username;
      member.email = req.body.email || member.email;
      member.bio = req.body.bio || member.bio;
      member.profilePic = req.body.profilePic || member.profilePic;

      // Handle password update (if sent)
      if (req.body.password) {
        member.password = req.body.password;
      }

      const updatedMember = await member.save();

      res.json({
        _id: updatedMember._id,
        username: updatedMember.username,
        email: updatedMember.email,
        profilePic: updatedMember.profilePic,
        bio: updatedMember.bio,
        token: generateToken(updatedMember._id),
      });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete member profile
const deleteMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id);

    if (member) {
      await member.deleteOne(); // Updated line
      res.json({ message: 'Member account deleted successfully' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { loginMember, getMemberProfile, updateMemberProfile, deleteMemberProfile , registerMember};
