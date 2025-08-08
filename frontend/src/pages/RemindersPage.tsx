import React, { useEffect, useState } from 'react';

/**
 * RemindersPage - Displays user's upcoming reminders and allows creation/deletion
 */
const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await import('../utils/api').then(api => api.fetchReminders());
      setReminders(Array.isArray(res) ? res : []);
    } catch {
      setError('Failed to fetch reminders');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await import('../utils/api').then(api => api.createReminder(title, description, remindAt));
      if (res._id) {
        setTitle(''); setDescription(''); setRemindAt('');
        fetchData();
      } else {
        setError(res.message || 'Failed to create reminder');
      }
    } catch {
      setError('Failed to create reminder');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await import('../utils/api').then(api => api.deleteReminder(id));
      fetchData();
    } catch {
      setError('Failed to delete reminder');
    }
  };

  return (
    <div>
      <h2>My Reminders</h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="datetime-local" value={remindAt} onChange={e => setRemindAt(e.target.value)} required />
        <button type="submit">Add Reminder</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {reminders.map(reminder => {
          const sent = reminder.status === 'sent' || reminder.notified;
          const badgeColor = reminder.status === 'failed' ? 'crimson' : reminder.status === 'sending' ? 'darkorange' : reminder.status === 'sent' ? 'seagreen' : 'gray';
          return (
            <li key={reminder._id}>
              {sent ? (
                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                  <strong>{reminder.title}</strong> ({new Date(reminder.remindAt).toLocaleString()})
                </span>
              ) : (
                <>
                  <strong>{reminder.title}</strong> ({new Date(reminder.remindAt).toLocaleString()})
                </>
              )}
              {reminder.description && <div style={{ color: sent ? 'gray' : 'inherit' }}>{reminder.description}</div>}
              <div style={{ margin: '4px 0' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  background: badgeColor,
                  color: 'white',
                  fontSize: 12,
                  marginRight: 8
                }}>
                  {reminder.status || (reminder.notified ? 'sent' : 'queued')}
                </span>
                {reminder.status === 'failed' && reminder.lastError && (
                  <span title={reminder.lastError} style={{ color: 'crimson', fontSize: 12 }}>Delivery failed</span>
                )}
                {reminder.status === 'sent' && reminder.sentAt && (
                  <span style={{ color: 'seagreen', fontSize: 12 }}>Sent at {new Date(reminder.sentAt).toLocaleString()}</span>
                )}
              </div>
              <button onClick={() => handleDelete(reminder._id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RemindersPage;
