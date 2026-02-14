import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.signin({ email, password });
            login(response.jwt);

            // Check role for redirect
            const user = await authApi.getUserProfile();
            if (user.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login to Beauty Fashion</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                        <div style={{ textAlign: 'right', marginTop: '5px' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>

                <div className="google-login-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            console.log('Frontend: Google Login Success:', credentialResponse);
                            if (credentialResponse.credential) {
                                setLoading(true);
                                try {
                                    console.log('Frontend: Sending token to backend...');
                                    const response = await authApi.googleLogin(credentialResponse.credential);
                                    console.log('Frontend: Backend response:', response);
                                    login(response.jwt);
                                    const user = await authApi.getUserProfile();
                                    if (user.role === 'ROLE_ADMIN') {
                                        navigate('/admin');
                                    } else {
                                        navigate('/');
                                    }
                                } catch (err: any) {
                                    console.error('Frontend: Google Login Backend Error:', err);
                                    setError('Google Login Failed: ' + (err.response?.data?.message || err.message || 'Unknown Error'));
                                } finally {
                                    setLoading(false);
                                }
                            } else {
                                console.error('Frontend: No credential received from Google');
                                setError('Google Login Failed: No credential received');
                            }
                        }}
                        onError={() => {
                            console.error('Frontend: Google Login Component Error');
                            setError('Google Login Failed (Component Error). Check console.');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
