import React, { useEffect, useState } from 'react';
import { User } from '../../types/auth';
import { authAPI } from '../../api/auth';
import '../../styles/Profile.css';

const Profile: React.FC = () => {
        const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            authAPI.getProfile()
                .then((data: User) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((err: unknown) => {
                    setError('Failed to load profile');
                    setLoading(false);
                });
        }, []);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No profile data found.</div>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">Profile</h2>
            <div className="profile-field"><strong>Name:</strong> {user.name}</div>
            <div className="profile-field"><strong>Email:</strong> {user.email}</div>
            <div className="profile-field"><strong>Role:</strong> {user.role ?? 'N/A'}</div>
        </div>
    );
};

export default Profile;