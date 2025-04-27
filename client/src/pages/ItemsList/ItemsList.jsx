import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Modal,
  Alert,
  Dropdown,
  ListGroup,
  Tabs,
  Tab,
  Spinner,
  Container,
  Navbar,
  Nav,
  Badge,
  Tooltip,
  OverlayTrigger,
  Card,
} from 'react-bootstrap';

import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEdit,
  FaComments,
  FaExchangeAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import axios from 'axios';

import './ItemsList.css';

const ItemsList = () => {
  // State for items and loading
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    location: '',
    isFound: false,
    isLost: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showPhotoUpdateModal, setShowPhotoUpdateModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

  // Item states
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    isLost: true,
    isFound: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Authentication states
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [categories, setCategories] = useState([]);

  // Get user ID from local storage
  const userId = localStorage.getItem('userId') || '507f1f77bcf86cd799439011'; // Placeholder for valid MongoDB ObjectId

  // Axios instance with authorization header
  const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
  });

  // Add request interceptor to add token to every request and log for debugging
  authAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Log request details for debugging
      console.log(
        `📤 Making ${config.method.toUpperCase()} request to ${config.url}`
      );
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  authAxios.interceptors.response.use(
    (response) => {
      console.log(`📥 Response from ${response.config.url}:`, response.status);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (error.response?.data?.error === 'Token has expired.') {
          console.log('🔐 Token expired, showing login modal');
          setShowLoginModal(true); // Assuming `setShowLoginModal` is defined elsewhere
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  // Helper function for logging API errors
  const logApiError = (error, operation) => {
    console.error(`❌ Error during ${operation}:`, error);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request made but no response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  };

  // AUTHENTICATION HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      console.log('🔑 Attempting login with:', loginCredentials.email);

      const response = await axios.post(
        'http://localhost:3000/api/user/login',
        {
          email: loginCredentials.email,
          password: loginCredentials.password,
        },
        { withCredentials: true } // Include credentials in request if needed
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        if (response.data.userId) {
          localStorage.setItem('userId', response.data.userId);
          console.log('👤 User ID stored:', response.data.userId);
        }

        setShowLoginModal(false); // Assuming `setShowLoginModal` is defined elsewhere
        fetchItems(); // Assuming `fetchItems` is defined elsewhere
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // DATA FETCHING
  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching items...');
      const { data } = await authAxios.get('/user/getItems');
      console.log('📋 Fetched data:', data);

      setItems(data.data || []);

      // Extract unique categories for filter dropdown
      if (data.data && data.data.length > 0) {
        const uniqueCategories = [
          ...new Set(data.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching items:', error);

      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setShowLoginModal(true);
      } else {
        setError('Failed to load items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // FILTER HANDLERS
  const handleSearch = (e) => {
    e.preventDefault();
    // Just using client-side filtering for now
    console.log('🔍 Searching for:', search);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleStatusFilter = (status) => {
    if (status === 'lost') {
      setFilter({ ...filter, isLost: true, isFound: false });
    } else if (status === 'found') {
      setFilter({ ...filter, isLost: false, isFound: true });
    } else {
      setFilter({ ...filter, isLost: false, isFound: false });
    }
    setActiveTab(status);
  };

  const handleCategorySelect = (category) => {
    setFilter({ ...filter, category });
  };

  const resetFilters = () => {
    setFilter({
      category: '',
      location: '',
      isFound: false,
      isLost: false,
    });
    setSearch('');
    setActiveTab('all');
  };

  // ITEM MANAGEMENT HANDLERS
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddItemFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Ensure mutual exclusivity between isLost and isFound
      if (name === 'isLost' && checked) {
        setNewItem({ ...newItem, isLost: true, isFound: false });
      } else if (name === 'isFound' && checked) {
        setNewItem({ ...newItem, isLost: false, isFound: true });
      } else {
        setNewItem({ ...newItem, [name]: checked });
      }
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Parse the user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = storedUser?._id; // Rely solely on localStorage

    // Validate user ID
    if (!currentUserId || !/^[0-9a-fA-F]{24}$/.test(currentUserId)) {
      setSubmitError('Invalid user ID. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    console.log('✅ currentUserId:', currentUserId);

    // Basic validations
    if (!newItem.title?.trim()) {
      setSubmitError('Title is required');
      setIsSubmitting(false);
      return;
    }
    if (!newItem.description?.trim()) {
      setSubmitError('Description is required');
      setIsSubmitting(false);
      return;
    }
    if (!newItem.address?.trim()) {
      setSubmitError('Location is required');
      setIsSubmitting(false);
      return;
    }
    if (!newItem.isLost && !newItem.isFound) {
      setSubmitError('Please select whether the item is Lost or Found');
      setIsSubmitting(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('description', newItem.description);
    formData.append('category', newItem.category || 'Uncategorized');
    formData.append('address', newItem.address);
    formData.append('isLost', newItem.isLost.toString()); // Ensure boolean is sent as string
    formData.append('isFound', newItem.isFound.toString());
    if (selectedFile) {
      // Optional: Validate file
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setSubmitError('Only JPEG or PNG images are allowed');
        setIsSubmitting(false);
        return;
      }
      formData.append('img', selectedFile);
    }

    try {
      console.log('➕ Adding item for userId:', currentUserId);
      console.log(
        '📦 Form data contents:',
        Object.fromEntries(formData.entries())
      );

      const response = await authAxios.post(
        `/user/addItem/${currentUserId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Item added:', response.data);

      // Fetch updated items first
      await fetchItems(); // Ensure this succeeds before resetting

      // Reset form state
      setNewItem({
        title: '',
        description: '',
        category: '',
        address: '',
        isLost: true,
        isFound: false,
      });
      setSelectedFile(null);
      setShowModal(false);

      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error); // Replace logApiError if undefined
      const msg =
        error.response?.data?.message ||
        (error.message === 'Network Error'
          ? 'Network error. Please check your connection.'
          : 'An error occurred. Please try again.');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      title: item.title,
      description: item.description,
      category: item.category,
      address: item.address,
      isLost: item.isLost,
      isFound: item.isFound,
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const currentUserId = localStorage.getItem('userId') || userId;

      console.log('✏️ Updating item:', selectedItem._id);
      console.log('Update data:', newItem);

      // Make sure we're sending the right data format
      const updateData = {
        title: newItem.title,
        description: newItem.description,
        category: newItem.category || 'Uncategorized',
        address: newItem.address,
        isLost: newItem.isLost,
        isFound: newItem.isFound,
      };

      const response = await authAxios.put(
        `/user/updateOwnItem?id=${selectedItem._id}&userId=${currentUserId}`,
        updateData
      );

      console.log('✅ Update response:', response.data);

      setShowEditModal(false);
      setSelectedItem(null);
      setNewItem({
        title: '',
        description: '',
        category: '',
        address: '',
        isLost: true,
        isFound: false,
      });

      fetchItems();
      alert('Item updated successfully!');
    } catch (error) {
      logApiError(error, 'updating item');

      if (error.response) {
        if (error.response.status === 401) {
          setSubmitError('Your session has expired. Please log in again.');
          setShowLoginModal(true);
        } else if (error.response.status === 403) {
          setSubmitError('You are not authorized to update this item.');
        } else if (error.response.status === 404) {
          setSubmitError('Item not found.');
        } else {
          setSubmitError(
            error.response.data.message ||
              'Failed to update item. Please try again.'
          );
        }
      } else if (error.request) {
        setSubmitError(
          'No response from server. Please check your connection.'
        );
      } else {
        setSubmitError('Error in request setup: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (!selectedFile) {
      setSubmitError('Please select an image file');
      setIsSubmitting(false);
      return;
    }

    const currentUserId = localStorage.getItem('userId') || userId;
    const formData = new FormData();
    formData.append('img', selectedFile);

    try {
      console.log('📷 Updating photo for item:', selectedItem._id);

      const response = await authAxios.put(
        `/user/updateItemPhoto?id=${selectedItem._id}&userId=${currentUserId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('✅ Update photo response:', response.data);

      setShowPhotoUpdateModal(false);
      setSelectedItem(null);
      setSelectedFile(null);

      fetchItems();
      alert('Photo updated successfully!');
    } catch (error) {
      logApiError(error, 'updating photo');

      if (error.response) {
        setSubmitError(
          error.response.data.message ||
            'Failed to update photo. Please try again.'
        );
      } else {
        setSubmitError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (
      !window.confirm('Are you sure you want to permanently delete this item?')
    ) {
      return;
    }

    try {
      const response = await authAxios.delete('/user/deleteOwnItems', {
        params: { id },
        validateStatus: (status) => status < 500, // Don't throw for 403/404
      });

      if (response.status === 204) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        alert('Item successfully deleted');
      } else if (response.status === 403) {
        alert("You don't have permission to delete this item");
        console.log('Ownership details:', response.data.debug);
      } else if (response.status === 404) {
        alert('Item not found');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setShowLoginModal(true);
        alert('Your session has expired. Please log in again.');
      } else {
        alert(`Delete failed: ${error.message}`);
        console.error('Delete error:', error);
      }
    }
  };

  // STATUS CHANGE HANDLERS
  const handleChangeItemStatus = (item) => {
    setSelectedItem(item);
    setNewItem({
      ...item,
      isLost: item.isLost,
      isFound: item.isFound,
    });
    setShowStatusChangeModal(true);
  };

  const handleStatusChange = async () => {
    // Toggle the status: if it was lost, make it found and vice versa
    const updatedStatus = {
      isLost: !selectedItem.isLost,
      isFound: !selectedItem.isFound,
    };

    try {
      const currentUserId = localStorage.getItem('userId') || userId;
      console.log(`🔄 Changing status for item ${selectedItem._id}`);
      console.log('New status:', updatedStatus);

      const response = await authAxios.put(
        `/user/updateOwnItem?id=${selectedItem._id}&userId=${currentUserId}`,
        updatedStatus
      );

      console.log('✅ Status update response:', response.data);

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === selectedItem._id ? { ...item, ...updatedStatus } : item
        )
      );

      setShowStatusChangeModal(false);
      setSelectedItem(null);

      alert(
        `Item status changed to ${updatedStatus.isFound ? 'Found' : 'Lost'}!`
      );
    } catch (error) {
      logApiError(error, 'changing item status');
      alert('Failed to update item status. Please try again.');
    }
  };

  // COMMENT HANDLERS
  // Simplified comment handlers
  // Add this utility function
  const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Comment handling functions
  const handleAddComment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (!checkTokenValidity()) {
      setIsSubmitting(false);
      return;
    }

    if (!newComment.trim()) {
      setSubmitError('Please enter a comment');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log(`Adding comment to item ${selectedItem._id}`);

      // Make sure we're sending what the backend expects
      const payload = {
        itemId: selectedItem._id,
        comment: newComment,
      };
      console.log('Comment payload:', payload);

      const response = await authAxios.post('/user/addComment', payload);

      console.log('Comment response:', response.data);

      // Refresh data to get updated comments
      fetchItems();

      setNewComment('');
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Error details:', error.response.data);

        if (error.response.status === 401) {
          setShowLoginModal(true);
        }
      }

      setSubmitError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (itemId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?'))
      return;

    if (!checkTokenValidity()) {
      return;
    }

    try {
      console.log(`Deleting comment ${commentId} from item ${itemId}`);

      // Using post since that's what your original backend code was expecting
   const response = await authAxios.delete('/user/deleteComment', {
     data: {
       itemId,
       commentId,
     },
   });

      console.log('Delete response:', response.data);

      // Refresh data
      fetchItems();

      alert('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Error details:', error.response.data);

        if (error.response.status === 401) {
          setShowLoginModal(true);
        }
      }

      alert('Failed to delete comment. Please try again.');
    }
  };

  // Handle View Comments
  const handleViewComments = (item) => {
    if (!item || !item.comments) {
      alert('❌ This item has no comments');
      return;
    }

    setSelectedItem(item);
    setShowCommentModal(true);
  };

  // Apply filters to items
  const filteredItems = items.filter((item) => {
    return (
      (search === '' ||
        [item.title, item.description].some((field) =>
          field?.toLowerCase().includes(search.toLowerCase())
        )) &&
      (filter.category === '' || item.category === filter.category) &&
      (filter.location === '' ||
        item.address?.toLowerCase().includes(filter.location.toLowerCase())) &&
      (activeTab === 'all' ||
        (activeTab === 'lost' && item.isLost) ||
        (activeTab === 'found' && item.isFound))
    );
  });

  // Render tooltip for buttons
  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );
  // For editing comments
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const handleEditCommentClick = (comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.comment);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();

    if (!editCommentText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      console.log(`✏️ Updating comment ${editingComment._id}`);

      // You'll need to add a route for updating comments in your backend
      // For now, we'll simulate by deleting the old comment and adding a new one

      // First delete the old comment
      await authAxios.delete('/user/deleteComment', {
        data: {
          itemId: selectedItem._id,
          commentId: editingComment._id,
        },
      });

      // Then add the new comment
      const response = await authAxios.post('/user/addComment', {
        itemId: selectedItem._id,
        comment: editCommentText,
      });

      // Update local state with the new comments
      const updatedItems = items.map((item) => {
        if (item._id === selectedItem._id) {
          return {
            ...item,
            comments: response.data.comments,
          };
        }
        return item;
      });

      setItems(updatedItems);
      setEditingComment(null);
      setEditCommentText('');

      alert('Comment updated successfully!');
    } catch (error) {
      logApiError(error, 'updating comment');
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  // For sending messages to item owners
  const [messageText, setMessageText] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);

  const handleSendMessageClick = (item) => {
    setMessageRecipient(item.userId);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      alert('Message cannot be empty');
      return;
    }

    try {
      console.log(`📨 Sending message to user ${messageRecipient._id}`);

      // This would connect to your sendMessage endpoint
      const response = await authAxios.post('/user/sendMessage', {
        receiverId: messageRecipient._id,
        content: messageText,
      });

      console.log('✅ Message sent:', response.data);

      setMessageText('');
      setShowMessageModal(false);
      setMessageRecipient(null);

      alert('Message sent successfully!');
    } catch (error) {
      logApiError(error, 'sending message');
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <Container className="container py-4">
      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Session Expired - Please Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={loginCredentials.email}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    email: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginCredentials.password}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    password: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        className="AddItemModal"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton className="AddItemModal__Header CloseBtn">
          <Modal.Title className="AddItemModal__Title">
            Add New Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="AddItemModal__Body">
          {submitError && (
            <Alert variant="danger" className="AddItemModal__Alert">
              {submitError}
            </Alert>
          )}
          <Form onSubmit={handleAddItem} className="AddItemModal__Form">
            <Form.Group
              controlId="formTitle"
              className="AddItemModal__FormGroup"
            >
              <Form.Label className="AddItemModal__Label">Status</Form.Label>
              <div className="AddItemModal__RadioGroup">
                <Form.Check
                  inline
                  label="Lost"
                  name="itemStatus"
                  type="radio"
                  id="isLost"
                  className="AddItemModal__Radio"
                  checked={newItem.isLost}
                  onChange={() =>
                    setNewItem({ ...newItem, isLost: true, isFound: false })
                  }
                />
                <Form.Check
                  inline
                  label="Found"
                  name="itemStatus"
                  type="radio"
                  id="isFound"
                  className="AddItemModal__Radio"
                  checked={newItem.isFound}
                  onChange={() =>
                    setNewItem({ ...newItem, isLost: false, isFound: true })
                  }
                />
              </div>
              <Form.Label className="AddItemModal__Label">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                className="AddItemModal__Input"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formDescription"
              className="AddItemModal__FormGroup mb-3"
            >
              <Form.Label className="AddItemModal__Label">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                className="AddItemModal__Input"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formCategory"
              className="AddItemModal__FormGroup mb-3"
            >
              <Form.Label className="AddItemModal__Label">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                className="AddItemModal__Input"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formAddress"
              className="AddItemModal__FormGroup mb-3"
            >
              <Form.Label className="AddItemModal__Label">Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                className="AddItemModal__Input"
                value={newItem.address}
                onChange={(e) =>
                  setNewItem({ ...newItem, address: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formImage"
              className="AddItemModal__FormGroup mb-3"
            >
              <Form.Label className="AddItemModal__Label">Image</Form.Label>
              <Form.Control
                type="file"
                className="AddItemModal__FileInput"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="AddItemModal__Button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="custom-edit-modal"
      >
        <Modal.Header
          onHide={() => setShowEditModal(false)}
          className="custom-close-section"
        >
          <button
            className="custom-close-btn"
            onClick={() => setShowEditModal(false)}
          >
            &times;
          </button>
          <Modal.Title className="custom-modal-title">Edit Item</Modal.Title>
        </Modal.Header>

        <Modal.Body className="custom-modal-body">
          {submitError && (
            <Alert variant="danger" className="custom-alert">
              {submitError}
            </Alert>
          )}
          <Form onSubmit={handleUpdateItem} className="custom-form">
            <Form.Group controlId="editTitle" className="custom-form-group">
              <Form.Label className="custom-label">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                className="custom-input"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="editDescription"
              className="custom-form-group"
            >
              <Form.Label className="custom-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                className="custom-textarea"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="editCategory" className="custom-form-group">
              <Form.Label className="custom-label">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                className="custom-input"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="editAddress" className="custom-form-group">
              <Form.Label className="custom-label">Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                className="custom-input"
                value={newItem.address}
                onChange={(e) =>
                  setNewItem({ ...newItem, address: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="custom-form-group">
              <Form.Check
                type="checkbox"
                label="Lost"
                className="custom-checkbox"
                checked={newItem.isLost}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    isLost: e.target.checked,
                    isFound: !e.target.checked,
                  })
                }
              />
              <Form.Check
                type="checkbox"
                label="Found"
                className="custom-checkbox"
                checked={newItem.isFound}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    isFound: e.target.checked,
                    isLost: !e.target.checked,
                  })
                }
              />
            </Form.Group>

            <div className="custom-button-group">
              <Button
                variant="outline-secondary"
                className="custom-cancel-button"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                type="submit"
                className="custom-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Item'}
              </Button>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="custom-footer">
          <Button
            variant="outline-primary"
            className="custom-photo-button"
            onClick={() => {
              setShowEditModal(false);
              setShowPhotoUpdateModal(true);
            }}
          >
            Update Photo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Photo Modal */}
      <Modal
        show={showPhotoUpdateModal}
        onHide={() => setShowPhotoUpdateModal(false)}
        className="photo-update-modal"
      >
        <Modal.Header closeButton className="photo-update-header">
          <Modal.Title className="photo-update-title">
            Update Item Photo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="photo-update-body">
          {submitError && (
            <Alert variant="danger" className="photo-update-alert">
              {submitError}
            </Alert>
          )}
          <Form onSubmit={handleUpdatePhoto} className="photo-update-form">
            <Form.Group
              controlId="updatePhoto"
              className="photo-update-form-group"
            >
              <Form.Label className="photo-update-label">New Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                required
                className="photo-update-input"
              />
            </Form.Group>
            <div className="photo-update-actions">
              <Button
                variant="outline-secondary"
                onClick={() => setShowPhotoUpdateModal(false)}
                className="photo-update-cancel"
              >
                Cancel
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={isSubmitting}
                className="photo-update-submit"
              >
                {isSubmitting ? 'Uploading...' : 'Update Photo'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Comments Modal */}
      <Modal
        show={showCommentModal}
        onHide={() => {
          setShowCommentModal(false);
          setNewComment('');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          {selectedItem && (
            <>
              <h6 className="mb-3">Item: {selectedItem.title}</h6>

              {selectedItem.comments && selectedItem.comments.length > 0 ? (
                <ListGroup className="mb-3">
                  {selectedItem.comments.map((comment) => (
                    <ListGroup.Item
                      key={comment._id}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <div className="fw-bold">
                          {comment.userName || 'Anonymous'}
                        </div>
                        <p className="mb-1">{comment.comment}</p>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteComment(selectedItem._id, comment._id)
                        }
                      >
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No comments yet.</p>
              )}

              <Form onSubmit={handleAddComment}>
                <Form.Group controlId="newComment" className="mb-3">
                  <Form.Label className="AddComment">Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messageRecipient && (
            <Form onSubmit={handleSendMessage}>
              <Form.Group className="mb-3">
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="text"
                  value={messageRecipient.fullName || 'Item Owner'}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Message
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Page Header */}
      <div className="page-header">
        <div class="particles"></div>
        <h1 class="header-title">
          <span>Lost & Found Items</span>
        </h1>
        <Button
          className="AddItembtn"
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
        </Button>
        {/* Filter Bar */}
        <div className="filter-bar p-3 bg-transparent rounded mb-4">
          <Row className="filter-bar-row">
            <div className="filter-row">
              <div className="floating-search-container mb-3">
                <div className="floating-search-group">
                  <input
                    type="text"
                    className="floating-search-input"
                    placeholder=" "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <label className="floating-search-label">
                    <FaSearch className="me-2 search-icon" />
                    Search items...
                  </label>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="floating-Category-container">
                <div className="floating-filter-group">
                  <label
                    htmlFor="categorySelect"
                    className="floating-filter-label-Category"
                  >
                    <FaFilter className="category-icon" />
                    Category
                  </label>
                  <select
                    id="categorySelect"
                    className="floating-filter-select"
                    value={filter.category || ''}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    aria-label="Filter by category"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="floating-filter-arrow" />
                </div>
              </div>

              {/* Location Input */}
              <div className="floating-Location-container">
                <div className="floating-filter-group">
                  <input
                    type="text"
                    className="floating-filter-input"
                    placeholder=" "
                    name="location"
                    value={filter.location}
                    onChange={handleFilterChange}
                  />
                  <label className="floating-filter-label-Location">
                    <FaMapMarkerAlt className="me-2 location-icon" />
                    Location
                  </label>
                </div>
              </div>

              {/* Reset Button */}
              <div className="floating-Resetbtn-container">
                <button
                  onClick={resetFilters}
                  className="floating-filter-button"
                >
                  <FaTimes className="me-2 reset-icon" />
                  Reset Filters
                </button>
              </div>
            </div>
          </Row>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => handleStatusFilter(k)}
        className="mb-4 status-tabs"
      >
        <Tab
          eventKey="all"
          title="All Items"
          className="tab-all"
          tabClassName="nav-link tab-all-link"
        />
        <Tab
          eventKey="lost"
          title="Lost Items"
          className="tab-lost"
          tabClassName="nav-link tab-lost-link"
        />
        <Tab
          eventKey="found"
          title="Found Items"
          className="tab-found"
          tabClassName="nav-link tab-found-link"
        />
      </Tabs>

      {/* Items Display */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading items...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="items-list">
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Col key={item._id}>
                  {/* Dynamic class name for unique styling */}
                  <Card className={`item-card-${item._id}`}>
                    <Card.Img
                      variant="top"
                      src={
                        item.img ||
                        'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      alt={item.title}
                      className="item-card-img-top"
                    />
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="d-flex mb-3">
                        <Badge bg="secondary" className="bgsecondary">
                          {item.category}
                        </Badge>
                        <Badge bg="info" className="bginfo">
                          {item.address}
                        </Badge>
                      </div>

                      <div className="card-buttons">
                        {/* Status button */}
                        <Button
                          className="Cardbtn"
                          variant={item.isLost ? 'danger' : 'success'}
                        >
                          {item.isLost ? 'Lost' : 'Found'}
                        </Button>

                        {/* Action buttons */}
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={(props) => renderTooltip(props, 'Edit')}
                        >
                          <Button
                            className="EditItemCardbtn"
                            variant="primary"
                            onClick={() => handleEditItem(item)}
                          >
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={(props) => renderTooltip(props, 'Comments')}
                        >
                          <Button
                            className="ViewCommentsCardbtn"
                            variant="info"
                            onClick={() => handleViewComments(item)}
                          >
                            <FaComments />
                            {item.comments?.length > 0 && (
                              <Badge
                                bg="light"
                                text="dark"
                                pill
                                className="ms-1"
                              >
                                {item.comments.length}
                              </Badge>
                            )}
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={(props) => renderTooltip(props, 'Delete')}
                        >
                          <Button
                            className="DeleteItemCardbtn"
                            variant="danger"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <FaTrash />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      <small>
                        {item.userId && item.userId.fullName
                          ? `Posted by: ${item.userId.fullName}`
                          : 'Posted by: Unknown User'}
                      </small>
                      <br />
                      <small>
                        {new Date(
                          item.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="info" className="text-center">
                  <p className="mb-0">No items found matching your criteria.</p>
                  {(filter.category !== '' ||
                    filter.location !== '' ||
                    search !== '') && (
                    <Button
                      variant="link"
                      onClick={resetFilters}
                      className="p-0 mt-2"
                    >
                      Clear all filters
                    </Button>
                  )}
                </Alert>
              </Col>
            )}
          </Row>
        </div>
      )}

      {/* Empty state call to action */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-5">
          <h3>No items yet</h3>
          <p>
            Start by adding lost or found items to help reunite people with
            their belongings
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="me-2" /> Add Your First Item
          </Button>
        </div>
      )}

      {/* Pagination (for future implementation) */}
      {/* <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div> */}
    </Container>
  );
};

export default ItemsList;
