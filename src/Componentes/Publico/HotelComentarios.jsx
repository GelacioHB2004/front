import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Agregamos useLocation para obtener el estado de redirección
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_BASE_URL = "http://localhost:3000";

function HotelComentarios({ hotelId, showOnlyForm = false }) {
  const [idUsuario] = useState(localStorage.getItem('id_usuario') || null);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Para obtener el estado de redirección

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idUsuario) {
      MySwal.fire({
        icon: 'warning',
        title: 'Inicia Sesión',
        text: 'Debes iniciar sesión para comentar.',
      }).then(() => {
        // Redirigir al login y pasar la ruta a la que debe volver
        navigate('/login', { state: { from: location.pathname } });
      });
      return;
    }

    if (!comentario || calificacion === 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor, escribe un comentario y selecciona una calificación.',
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/comentarios`, {
        id_usuario: idUsuario,
        id_hotel: hotelId,
        comentario,
        calificacion,
      });

      MySwal.fire({
        icon: 'success',
        title: 'Éxito',
        text: response.data.message,
      });

      // Resetear formulario
      setComentario('');
      setCalificacion(0);
      setHoveredRating(0);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el comentario.',
      });
    }
  };

  const renderStars = (rating, isInteractive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: isInteractive ? 'pointer' : 'default',
            color: i <= (isInteractive ? hoveredRating || calificacion : rating) ? '#FFD700' : '#ccc',
            fontSize: '24px',
          }}
          onClick={isInteractive ? () => setCalificacion(i) : null}
          onMouseEnter={isInteractive ? () => setHoveredRating(i) : null}
          onMouseLeave={isInteractive ? () => setHoveredRating(0) : null}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const estilos = {
    contenedor: {
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: 'none',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      resize: 'vertical',
      fontSize: '14px',
    },
    boton: {
      backgroundColor: '#1E3A5F',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
  };

  return (
    <div style={estilos.contenedor}>
      {idUsuario ? (
        <form onSubmit={handleSubmit} style={estilos.form}>
          <textarea
            style={estilos.textarea}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows="4"
          />
          <div>
            <span style={{ fontSize: '14px', marginRight: '10px' }}>Calificación: </span>
            {renderStars(calificacion, true)}
          </div>
          <button type="submit" style={estilos.boton}>
            Enviar Comentario
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '14px', color: '#666' }}>Por favor, inicia sesión para comentar.</p>
      )}
    </div>
  );
}

export default HotelComentarios;