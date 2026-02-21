import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.username || !formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (image) {
            data.append('profilePicture', image);
        }

        try {
            await signup(data);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.msg || err.message || 'Signup failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <CheckSquare size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join TaskFlow today to get organized</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-upload-container">
                        <div className="profile-preview-wrapper">
                            <div className="profile-preview-circle">
                                {preview ? (
                                    <img src={preview} alt="Profile Preview" className="profile-preview-img" />
                                ) : (
                                    <User size={40} style={{ color: '#cbd5e1' }} />
                                )}
                            </div>
                            <label className="profile-upload-btn">
                                <Plus size={16} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                        <span className="profile-upload-label">Upload Profile Photo</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="johndoe"
                                style={{ paddingLeft: '2.5rem' }}
                                disabled={loading}
                            />
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="john@example.com"
                                style={{ paddingLeft: '2.5rem' }}
                                disabled={loading}
                            />
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                style={{ paddingLeft: '2.5rem' }}
                                disabled={loading}
                            />
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '1rem' }}
                    >
                        {loading ? <div className="loader" style={{ width: '20px', height: '20px', borderTopColor: 'white' }}></div> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
