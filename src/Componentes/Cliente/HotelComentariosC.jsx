import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_BASE_URL = 'http://localhost:3000';

function HotelComentariosC({ hotelId, showOnlyForm = false }) {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const idUsuario = localStorage.getItem('id_usuario');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones adicionales
    if (!idUsuario) {
      MySwal.fire({
        icon: 'warning',
        title: 'Inicia Sesión',
        text: 'Debes iniciar sesión para comentar.',
      });
      return;
    }

    if (!comentario.trim() || calificacion === 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor, escribe un comentario y selecciona una calificación.',
      });
      return;
    }

    const numericIdUsuario = Number(idUsuario);
    const numericHotelId = Number(hotelId);
    console.log('Valores antes de la validación:', { idUsuario, hotelId, numericIdUsuario, numericHotelId }); // Depuración

    if (isNaN(numericIdUsuario) || isNaN(numericHotelId)) {
      const errorMessage = isNaN(numericIdUsuario)
        ? 'El ID de usuario no es válido. Inicia sesión nuevamente.'
        : 'El ID del hotel no es válido. Intenta de nuevo.';
      MySwal.fire({
        icon: 'error',
        title: 'Error de Datos',
        text: errorMessage,
      });
      return;
    }

    const commentData = {
      id_usuario: numericIdUsuario,
      id_hotel: numericHotelId,
      comentario,
      calificacion,
    };
    console.log('Datos enviados al backend:', commentData); // Depuración

    try {
      const response = await axios.post(`${API_BASE_URL}/api/comentarios`, commentData);
      console.log('Respuesta del servidor:', response.data); // Depuración

      MySwal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Comentario creado exitosamente',
      });

      setComentario('');
      setCalificacion(0);
      setHoveredRating(0);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      console.log('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }); // Depuración detallada
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || error.response?.data?.details || 'No se pudo enviar el comentario.',
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
            required
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

export default HotelComentariosC;