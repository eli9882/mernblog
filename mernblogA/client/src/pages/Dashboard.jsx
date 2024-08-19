import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Dashboard = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // Redirect to login page if no token is present
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    }, [id, token]);

    // Remove post
    const removePost = async (postId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${postId}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.filter(post => post._id !== postId)); // Remove post from state
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="dashboard">
            {posts.length ? (
                <div className="container dashboard__container">
                    {posts.map(post => (
                        <article key={post._id} className="dashboard__post">
                            <div className='dashboard__post-info'>
                                <div className="dashboard__post-thumbnail">
                                    <img src={`${process.env.REACT_APP_ASSET_URL}/uploads/${post.thumbnail}`} alt={post.title} />
                                </div>
                                <h3>{post.title}</h3>
                            </div>
                            <div className="dashboard__post-actions">
                                <Link to={`/posts/${post._id}`} className='btn view sm'>Ver</Link>
                                <Link to={`/posts/${post._id}/edit`} className='btn primary sm'>Editar</Link>
                                <button onClick={() => removePost(post._id)} className='btn danger sm'>Eliminar</button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <h2 className='center'>No tienes ninguna publicación todavía.</h2>
            )}
        </section>
    );
};

export default Dashboard;
