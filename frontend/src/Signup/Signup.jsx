import styles from './Signup.module.css';
import { useState } from 'react';
import * as yup from 'yup';
import { Navigate, Link,useNavigate } from 'react-router-dom';

export default function Signup({ user }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

     const signupSchema = yup.object({
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
        name: yup
            .string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    async function handleSignup(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signupSchema.validate({ email, password, name }, { abortEarly: false });
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            navigate('/login');
        }
        catch (err) {
            if (err.name === 'ValidationError') {
                setError(err.errors.join(', '));
            } else {
                setError(err.message);
            }
        }
    }
     return (
        <>
            {user ? (
                <Navigate to="/login" replace />
            ) : (
                <form className={styles.container} onSubmit={handleSignup}>
                    <h1>Signup</h1>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">{loading ? 'Signing Up...' : 'Sign Up'}</button>
                    
                    <Link to="/login" className={styles.loginLink}>
                        Already have an account? Login
                    </Link>
                </form>
            )}
        </>
    );
}