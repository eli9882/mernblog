import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';


const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // Redirect to login page for any user who lands on this page without a token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]); // Añadir navigate y token como dependencias

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

   
   
    const createPost = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.set('title', title);
        postData.set('description', description);
        postData.set('thumbnail', thumbnail);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {
                withCredentials: true, headers: {Authorization: `Bearer ${token}`}
            })
            if(response.status ===  201) {
              
                return navigate('/')
            }
        } catch (err) {
            if(err.response.data.message === "TypeError: Cannot read properties of null (reading 'thumbnail')") {
                setError("Elija una imagen")
            } else {
                setError(err.response.data.message);
            }
        }
    };

    return (
        <section className="create-post">
            <div className="container">
                <h2 className="section-heading spost">Create Post</h2>
                {error && <p className="form__error-message">{error}</p>}
                <form onSubmit={createPost} className='form create-post__form' encType="multipart/form-data">
                    <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} className="react-quill-editor"></ReactQuill>
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                    <button type="submit" className='btn btn--formcpost' style={{ width: '200px', maxWidth: '100%' }} >Create</button>  
                </form>
                
              
            </div>
           
        </section>
    );
};

export default CreatePost;
