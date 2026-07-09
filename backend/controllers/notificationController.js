const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, message, is_read as isRead, created_at as createdAt 
       FROM notifications 
       WHERE employee_id = ? 
       ORDER BY is_read ASC, created_at DESC 
       LIMIT 20`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error retrieving notifications', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const [original] = await db.query('SELECT employee_id FROM notifications WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (original[0].employee_id !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied: Cannot mark other user notifications' });
    }

    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error updating notification', error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE employee_id = ?', [req.user.id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error updating notifications', error: error.message });
  }
};
