const db = require('../config/db');

exports.getHolidays = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM holidays ORDER BY date ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get holidays error:', error);
    res.status(500).json({ message: 'Server error retrieving holidays', error: error.message });
  }
};

exports.createHoliday = async (req, res) => {
  const { name, date } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: 'Name and date are required' });
  }

  try {
    const [result] = await db.query('INSERT INTO holidays (name, date) VALUES (?, ?)', [name, date]);
    res.status(201).json({ id: result.insertId, message: 'Holiday created successfully' });
  } catch (error) {
    console.error('Create holiday error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A holiday already exists on this date' });
    }
    res.status(500).json({ message: 'Server error creating holiday', error: error.message });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const [original] = await db.query('SELECT id FROM holidays WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    await db.query('DELETE FROM holidays WHERE id = ?', [req.params.id]);
    res.json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    console.error('Delete holiday error:', error);
    res.status(500).json({ message: 'Server error deleting holiday', error: error.message });
  }
};
