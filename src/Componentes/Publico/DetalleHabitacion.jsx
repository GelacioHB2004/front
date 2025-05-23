import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';

const DetallesHabitacion = () => {
  const { idHabitacion } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState('');

  useEffect(() => {
    console.log('ID de la habitación:', idHabitacion);
    fetchHabitacion();
  }, [idHabitacion]);

  const fetchHabitacion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://backendd-q0zc.onrender.com/api/cuartos/${idHabitacion}`);
      console.log('Respuesta de la API:', response.data);
      setHabitacion(response.data); // La API devuelve un objeto, no un array
      setError('');
    } catch (err) {
      const errorMessage = err.response?.status === 404
        ? 'Habitación no encontrada en la base de datos.'
        : err.response?.data?.message || 'Error al cargar los detalles de la habitación. Intente de nuevo.';
      setError(errorMessage);
      console.error('Error fetching habitacion:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseImagesSafely = (imagenes) => {
    try {
      if (!imagenes) return [];
      return JSON.parse(imagenes);
    } catch (error) {
      console.error('Error al parsear imágenes:', error.message);
      return [];
    }
  };

  const handleReservationTimeChange = (e) => {
    setReservationTime(e.target.value);
  };

  const handleReservation = async () => {
    if (!reservationTime) {
      setError('Por favor, seleccione una hora de reserva.');
      return;
    }

    if (habitacion.estado !== 'Disponible') {
      setError('Esta habitación no está disponible para reservar.');
      return;
    }

    try {
      // Actualizar el estado y horario de la habitación
      const updatedCuarto = {
        estado: 'Ocupado',
        horario: reservationTime,
      };

      const response = await axios.put(`https://backendd-q0zc.onrender.com/api/cuartos/${idHabitacion}`, updatedCuarto);
      setHabitacion(response.data);
      setReservationSuccess('¡Habitación reservada con éxito!');
      setError('');
      setReservationTime(''); // Limpiar el campo de hora
    } catch (err) {
      setError('Error al realizar la reserva. Intente de nuevo.');
      console.error('Error al reservar:', err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!habitacion) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
        <Typography variant="h6" align="center" color="textSecondary">
          Habitación no encontrada.
        </Typography>
      </Container>
    );
  }

  const images = parseImagesSafely(habitacion.imagenes);
  const normalizedEstado = habitacion.estado.charAt(0).toUpperCase() + habitacion.estado.slice(1).toLowerCase();
  const stateColor = normalizedEstado === 'Disponible' ? '#2e7d32' : normalizedEstado === 'Ocupado' ? '#d32f2f' : '#f57c00';

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Detalles de la Habitación
      </Typography>

      {reservationSuccess && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="success" onClose={() => setReservationSuccess('')}>
            {reservationSuccess}
          </Alert>
        </Box>
      )}

      {/* Galería de Imágenes */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {images.length > 0 ? (
          images.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`data:image/jpeg;base64,${img}`}
                  alt={`Imagen ${index + 1} de ${habitacion.cuarto}`}
                  sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  loading="lazy"
                />
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                No hay imágenes disponibles
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Detalles de la Habitación */}
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
            Habitación: {habitacion.cuarto}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Estado:</strong> <span style={{ color: stateColor }}>{normalizedEstado}</span>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Horario:</strong> {habitacion.horario ? new Date(habitacion.horario).toLocaleString() : 'No especificado'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Precio por Hora:</strong> {habitacion.preciohora ? `$${habitacion.preciohora.toFixed(2)}` : 'No definido'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Precio por Día:</strong> {habitacion.preciodia ? `$${habitacion.preciodia.toFixed(2)}` : 'No definido'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Precio por Noche:</strong> {habitacion.precionoche ? `$${habitacion.precionoche.toFixed(2)}` : 'No definido'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Precio por Semana:</strong> {habitacion.preciosemana ? `$${habitacion.preciosemana.toFixed(2)}` : 'No definido'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Servicios:</strong> {habitacion.servicios || 'No especificados'}
          </Typography>
        </CardContent>
      </Card>

      {/* Formulario de Reserva */}
      <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
          Reservar Habitación
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Hora de Reserva"
            type="datetime-local"
            value={reservationTime}
            onChange={handleReservationTimeChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            disabled={normalizedEstado !== 'Disponible'}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleReservation}
            disabled={normalizedEstado !== 'Disponible'}
          >
            Reservar
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default DetallesHabitacion;