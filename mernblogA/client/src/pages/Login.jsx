import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

import { UserContext } from '../context/userContext'

const Login = () => {
    const [userData, setUserData] = useState({email: "", password: ""})
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const {setCurrentUser} = useContext(UserContext)

    const changeHandler = (e) => {
        setUserData(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        })
    }

    const loginUser = async (e) => {
        e.preventDefault();
        setError('')
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
            const user = await response.data;
            if(!user) {
                setError("Please check your credentials.")
            }
            
            setCurrentUser(user)
            navigate("/")
        } catch (err) {
            setError(err?.response?.data.message);
        }
    }


    return (
        <section className="login">
            <div className="container">
            <div className="cta-login">
            <div className="cta-text-box">
            <h2 className="heading-secondary centertitle">Iniciar sesión</h2>
                <form onSubmit={loginUser} className='form login__form cta-form'>
                    {error && <p className="form__error-message">{error}</p>}
                    <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeHandler} autoFocus />
                    <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeHandler} />
                    <button type="submit" className='btn general btn--form'>Ingresar</button>
                  
                </form>
              
            </div>
            </div>
            </div>
        </section>
    )
}

export default Login;