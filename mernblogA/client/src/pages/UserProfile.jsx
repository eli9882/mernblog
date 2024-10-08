import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'
import { BiCheck } from 'react-icons/bi'
import { UserContext } from '../context/userContext'

const UserProfile = () => {
    const [avatarTouched, setAvatarTouched] = useState(false)
    const [avatar, setAvatar] = useState('')
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext)
    const token = currentUser?.token;

    const { id } = useParams()

    // redirect to login page for any user who lands on this page without token
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [navigate, token]) // Include navigate and token

    useEffect(() => {
        // Fetching current user details from db
        const getUser = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })
            const { name, email, avatar } = response.data
            setName(name)
            setEmail(email)
            setAvatar(avatar)
        }
        getUser()
    }, [id, token]) // Include id and token
    
    // Function to change user avatar 
    const changeAvatarHandler = async () => {
        setAvatarTouched(false);
        try {
            const postData = new FormData()
            postData.set('avatar', avatar);
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })
            setAvatar(response?.data.avatar)
        } catch (error) {
            setError(error.response.data.message)
            console.log(error)
        }
    }

    // Function to update user details
    const updateUserDetail = async (e) => {
        try {
            e.preventDefault()
            const userData = new FormData()
            userData.set('name', name)
            userData.set('email', email)
            userData.set('currentPassword', currentPassword)
            userData.set('newPassword', newPassword)
            userData.set('confirmNewPassword', confirmNewPassword)

            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 200) {
                // log user out if it worked
                navigate('/logout')
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <section className="profile">
            <div className="container">
            <div className="cta-profile">
            <div className="cta-text-box">
            <div className="container profile__container">
                <Link to={`/myposts/${currentUser?.id}`} className='btn'>Mis Publicaciones</Link>

                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile__avatar">
                        <img src={avatar} alt="Avatar" />
                        </div>
                        {/* Form to update avatar */}
                        <form className='avatar__form'>
                            <input type="file" id='avatar' name='avatar' onChange={e => setAvatar(e.target.files[0])} accept="png, jpg, jpeg" />
                            <label htmlFor="avatar" value={avatarTouched} onClick={() => setAvatarTouched(!avatarTouched)}><FiEdit /></label>
                        </form>
                        {avatarTouched && <button type="submit" className='profile__avatar-btn' onClick={changeAvatarHandler}><BiCheck /></button>}
                    </div>

                    <h1>{name}</h1>

                    {/* Form to update user details */}
               
                    <form className='form profile__form cta-form' onSubmit={updateUserDetail}>
                        {error && <p className='form__error-message'>{error}</p>}
                        <input type="text" placeholder='Nombre completo' value={name} onChange={e => setName(e.target.value)} />
                        <input type="email" placeholder='correo' value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder='Contraseña actual' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder='Nueva contraseña' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder='Confirmar nueva contraseña' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                        <button type="submit" className=' btn profile btn--form'>Actualizar</button>
                    </form>
                </div>
            </div>
            </div>
            </div>
            </div>
        </section>
    )
}

export default UserProfile;