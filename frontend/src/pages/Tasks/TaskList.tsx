import React, { useEffect, useState } from 'react';
import { taskAPI } from '../../api/taskApi';
import { fileAPI } from '../../api/fileApi';
import { Task, CreateTaskData } from '../../types/task';
import '../../styles/Tasks.css';
import CommentSection from '../../components/CommentSection';

interface FileData {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ [taskId: string]: boolean }>({});
  const [taskFiles, setTaskFiles] = useState<{ [taskId: string]: FileData[] }>({});

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesForTask = async (taskId: string) => {
    try {
      const files = await fileAPI.getByTask(taskId);
      setTaskFiles(prev => ({
        ...prev,
        [taskId]: files
      }));
    } catch (err: any) {
      console.error('Failed to load files for task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleFileUpload = async (taskId: string, files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingFiles(prev => ({ ...prev, [taskId]: true }));
      await fileAPI.upload(taskId, files);
      
      
      await fetchFilesForTask(taskId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload files');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [taskId]: false }));
    }
  };

 const handleFileDownload = async (fileId: string, filename: string) => {
  try {
    const response = await fileAPI.download(fileId);
   
    console.log('Downloaded file response:', response);
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to download file');
  }
};

  const handleFileDelete = async (fileId: string, taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await fileAPI.delete(fileId);
      
  
      setTaskFiles(prev => ({
        ...prev,
        [taskId]: prev[taskId]?.filter(file => file._id !== fileId) || []
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const handleFileInputChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(taskId, e.target.files);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const updated = await taskAPI.update(editingTask._id, formData);
        setTasks(prev =>
          prev.map(t => (t._id === updated._id ? updated : t))
        );
      } else {
        const newTask = await taskAPI.create(formData);
        setTasks(prev => [...prev, newTask]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const toggleComments = async (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      
      await fetchFilesForTask(taskId);
    }
  };

  if (loading) return <div className="tasks-loading">Loading tasks...</div>;
  if (error) return <div className="tasks-error">{error}</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Your Tasks</h2>
        <button className="add-task-btn" onClick={() => openModal()}>
          + Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Create one!</p>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority ${task.priority}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>

              <div className="task-body">
                <p>{task.description}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>

              {/* File Upload Section */}
              <div className="file-upload-section">
                <input
                  type="file"
                  id={`file-upload-${task._id}`}
                  multiple
                  onChange={(e) => handleFileInputChange(task._id, e)}
                  disabled={uploadingFiles[task._id]}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor={`file-upload-${task._id}`} 
                  className="upload-btn"
                >
                  {uploadingFiles[task._id] ? 'Uploading...' : 'Upload Files'}
                </label>

                {/* File List */}
                {taskFiles[task._id] && taskFiles[task._id].length > 0 && (
                  <div className="file-list">
                    <h4>Attached Files:</h4>
                    {taskFiles[task._id].map(file => (
                      <div key={file._id} className="file-item">
                        <span className="file-name">{file.originalName}</span>
                        <div className="file-actions">
                          <button 
                            onClick={() => handleFileDownload(file._id, file.originalName)}
                            className="download-btn"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleFileDelete(file._id, task._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="task-actions">
                <button onClick={() => openModal(task)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(task._id)} className="delete-btn">
                  Delete
                </button>
                <button
                  onClick={() => toggleComments(task._id)}
                  className="comment-btn"
                >
                  {expandedTaskId === task._id ? 'Hide Comments' : 'Show Comments'}
                </button>
              </div>

              {expandedTaskId === task._id && (
                <div className="comments-section-wrapper">
                  <CommentSection taskId={task._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>

            <form onSubmit={handleFormSubmit} className="task-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="auth-button">
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;