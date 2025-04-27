import express from 'express';
import Message from '../../models/message.js';
import User from '../../models/User.js';
import Message from '../../models/message.js'; // Adjust the path based on your project structure

const router = express.Router();

// Route لإرسال الرسالة
router.post('/sendMessage', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Check if sender and receiver are valid users
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // Log sender, receiver, and message content for debugging
    console.log('Sender:', sender);
    console.log('Receiver:', receiver);
    console.log('Message content:', content);

    if (!sender) {
      return res.status(404).json({ message: '❌ Sender not found' });
    }
    if (!receiver) {
      return res.status(404).json({ message: '❌ Receiver not found' });
    }

    // Create a new message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    // Log the message object before saving it to debug
    console.log('Message object:', message);

    await message.save();

    // Respond with the saved message
    res.status(200).json({
      message: '✅ Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      message: '❌ Something went wrong!',
      error: error.message,
    });
  }
});





export default router;
