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
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'failed' | 'sent'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRemindAt, setEditRemindAt] = useState('');

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

  const toLocalInputValue = (d: string | Date) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

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

  const handleRetry = async (id: string) => {
    try {
      await import('../utils/api').then(api => api.patchReminder(id, { status: 'queued' }));
      fetchData();
    } catch {
      setError('Failed to retry reminder');
    }
  };

  const startEdit = (r: any) => {
    setEditingId(r._id);
    setEditTitle(r.title || '');
    setEditDescription(r.description || '');
    setEditRemindAt(toLocalInputValue(r.remindAt));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditRemindAt('');
  };

  const saveEdit = async (id: string) => {
    try {
      const patch: any = { title: editTitle, description: editDescription, remindAt: new Date(editRemindAt).toISOString() };
      const res = await import('../utils/api').then(api => api.patchReminder(id, patch));
      if (res && !res.message) {
        cancelEdit();
        fetchData();
      } else {
        setError(res?.message || 'Failed to save changes');
      }
    } catch {
      setError('Failed to save changes');
    }
  };

  const filtered = reminders.filter((r: any) => {
    const isSent = r.status === 'sent' || r.notified;
    const isFailed = r.status === 'failed';
    const isUpcoming = (r.status === 'queued' || r.status === 'sending' || (!r.status && !r.notified));
    if (filter === 'sent') return isSent;
    if (filter === 'failed') return isFailed;
    if (filter === 'upcoming') return isUpcoming;
    return true;
  });

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
      <div style={{ margin: '8px 0' }}>
        <span style={{ marginRight: 8 }}>Filter:</span>
        {(['all','upcoming','failed','sent'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: 6,
              padding: '4px 8px',
              borderRadius: 6,
              border: filter === f ? '2px solid #333' : '1px solid #aaa',
              background: filter === f ? '#eee' : 'white'
            }}
          >{f}</button>
        ))}
      </div>
      <ul>
        {filtered.map(reminder => {
          const sent = reminder.status === 'sent' || reminder.notified;
          const badgeColor = reminder.status === 'failed' ? 'crimson' : reminder.status === 'sending' ? 'darkorange' : reminder.status === 'sent' ? 'seagreen' : 'gray';
          return (
            <li key={reminder._id}>
              {editingId === reminder._id ? (
                <div>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ marginRight: 8 }} />
                  <input type="datetime-local" value={editRemindAt} onChange={e => setEditRemindAt(e.target.value)} style={{ marginRight: 8 }} />
                  <input type="text" placeholder="Description" value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{ marginRight: 8, minWidth: 200 }} />
                  <button onClick={() => saveEdit(reminder._id)} style={{ marginRight: 6 }}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
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
                </>
              )}
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
              {reminder.status === 'failed' && editingId !== reminder._id && (
                <button onClick={() => handleRetry(reminder._id)} style={{ marginRight: 8 }}>Retry</button>
              )}
              {!sent && editingId !== reminder._id && (
                <button onClick={() => startEdit(reminder)} style={{ marginRight: 8 }}>Edit</button>
              )}
              <button onClick={() => handleDelete(reminder._id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RemindersPage;
