import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        <Link to='/' className='btn btn--form'>Regresar al inicio </Link>
        <h2>Pagina no encontrada</h2>
      </div>
    </section>
  )
}

export default ErrorPage;