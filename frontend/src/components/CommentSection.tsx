import React, { useState, useEffect } from 'react';
import { commentAPI } from '../api/commentApi';
import { Comment } from '../types/comment';
import { useAuth } from '../context/AuthContext';
import '../styles/Comments.css';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const data = await commentAPI.getByTask(taskId);
      setComments(data);
    };
    fetchComments();
  }, [taskId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const added = await commentAPI.create({ taskId, text: newComment });
    setComments(prev => [...prev, added]);
    setNewComment('');
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (id: string) => {
    const updated = await commentAPI.update(id, editText);
    setComments(prev => prev.map(c => (c._id === id ? updated : c)));
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return;
    await commentAPI.delete(id);
    setComments(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="comments-container">
      <h3>Comments</h3>

      <ul className="comment-list">
        {comments.map(c => (
          <li key={c._id} className="comment-item">
            <div className="comment-header">
              <strong>{c.user?.name || 'User'}</strong>
              {/* <span>{new Date(c.createdAt).toLocaleString()}</span> */}
            </div>

            {editingId === c._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <div className="comment-actions">
                  <button onClick={() => handleUpdate(c._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <p>{c.text}</p>
            )}

            {c.createdBy === user?.id && editingId !== c._id && (
              <div className="comment-actions">
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default CommentSection;
