import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Alert, 
  Fade,
  Skeleton,
  TableContainer,
  Paper,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  TextField
} from '@mui/material';
import { 
  Hotel, 
  Person, 
  Bed, 
  VisibilityOff,
  Visibility
} from '@mui/icons-material';

const GestionHoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchHoteles();
  }, []);

  const fetchHoteles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backendd-q0zc.onrender.com/api/gestionhoteles/list');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setHoteles(data);
      setSuccess('Hoteles cargados exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Error al cargar hoteles: ${err.message}`);
      console.error(err);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id_hotel, isVisible) => {
    try {
      const endpoint = isVisible 
        ? `https://backendd-q0zc.onrender.com/api/gestionhoteles/hide/${id_hotel}`
        : `https://backendd-q0zc.onrender.com/api/gestionhoteles/unhide/${id_hotel}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // Update the hotel's visible status in the state
      setHoteles(hoteles.map(hotel => 
        hotel.id_hotel === id_hotel ? { ...hotel, visible: isVisible ? 0 : 1 } : hotel
      ));
      
      setSuccess(isVisible ? 'Hotel ocultado exitosamente' : 'Hotel restaurado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Error al cambiar visibilidad del hotel: ${err.message}`);
      console.error(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const styles = {
    container: {
      py: 4,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
    },
    header: {
      backgroundColor: '#3b82f6',
      borderRadius: 4,
      p: 4,
      mb: 4,
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    },
    mainTitle: {
      fontWeight: 700,
      fontSize: '2.5rem',
      mb: 1,
    },
    filterContainer: {
      mb: 3,
      display: 'flex',
      justifyContent: 'flex-start',
      padding: 2,
    },
    styledTextField: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#a3bffa',
          borderRadius: 12,
        },
        '&:hover fieldset': {
          borderColor: '#7b96ec',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#3b82f6',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        },
      },
      '& .MuiInputBase-input': {
        color: '#1e293b',
        padding: '8px 12px',
        background: 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 100%)',
        borderRadius: 12,
      },
      '& .MuiInputLabel-root': {
        color: '#64748b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
      width: '300px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.01)',
      },
    },
    tableContainer: {
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: '#ffffff',
      maxHeight: 600,
      '&::-webkit-scrollbar': {
        width: 8,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f5f9',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#cbd5e1',
        borderRadius: 4,
      },
    },
    tableHeaderCell: {
      backgroundColor: '#1e293b',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.95rem',
      py: 2.5,
      borderBottom: 'none',
    },
    tableRow: {
      transition: 'all 0.2s ease',
      '&:nth-of-type(even)': {
        backgroundColor: '#f8fafc',
      },
      '&:hover': {
        backgroundColor: '#e0f2fe',
      },
    },
    statusChip: {
      fontWeight: 600,
      borderRadius: 3,
      fontSize: '0.8rem',
      minWidth: 90,
    },
    visibleChip: {
      backgroundColor: '#e0f2fe',
      color: '#0284c7',
      border: '1px solid #bae6fd',
    },
    hiddenChip: {
      backgroundColor: '#f1f5f9',
      color: '#6b7280',
      border: '1px solid #e2e8f0',
    },
    alertContainer: {
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 1300,
      minWidth: 400,
    },
    loadingCard: {
      borderRadius: 4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      backgroundColor: '#ffffff',
      p: 3,
    },
    noHotelsCard: {
      borderRadius: 4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      py: 6,
    },
  };

  return (
    <Container maxWidth="xl" sx={styles.container}>
      {/* Header Principal */}
      <Paper sx={styles.header}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Hotel sx={{ fontSize: 36 }} />
          <Typography variant="h2" sx={styles.mainTitle}>
            Gestión de Hoteles
          </Typography>
        </Box>
      </Paper>

      {/* Filtro por nombre del propietario */}
      <Box sx={styles.filterContainer}>
        <TextField
          label="Filtrar por propietario"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          sx={styles.styledTextField}
        />
      </Box>

      {/* Tabla de Hoteles */}
      {loading ? (
        <Box sx={styles.loadingCard}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      ) : hoteles.length > 0 ? (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeaderCell}>Propietario</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Nombre Hotel</TableCell>
                <TableCell sx={styles.tableHeaderCell} align="center">Habitaciones</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Tipo de Habitación</TableCell>
                <TableCell sx={styles.tableHeaderCell} align="center">Visibilidad</TableCell>
                <TableCell sx={styles.tableHeaderCell} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hoteles
                .filter(hotel => 
                  hotel.propietario_nombre &&
                  hotel.propietario_nombre.toLowerCase().includes(filterText.toLowerCase())
                )
                .map((hotel) => {
                  const availableRooms = hotel.cuartos.filter(cuarto => cuarto.estado === 'disponible').length;
                  const roomTypes = [...new Set(hotel.cuartos.map(cuarto => cuarto.tipohabitacion.tipohabitacion))].join(', ');
                  const isVisible = hotel.visible === 1;
                  
                  return (
                    <TableRow key={hotel.id_hotel} sx={styles.tableRow}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#3b82f6' }}>
                            <Person />
                          </Avatar>
                          <Typography variant="body2">
                            {hotel.propietario_nombre || 'No asignado'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {hotel.nombrehotel}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${availableRooms}/${hotel.numhabitacion}`}
                          size="small"
                          sx={{
                            bgcolor: '#e0f2fe',
                            color: '#0277bd',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {roomTypes || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isVisible ? 'Visible' : 'Oculto'}
                          size="small"
                          sx={{
                            ...(isVisible ? styles.visibleChip : styles.hiddenChip),
                            ...styles.statusChip,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={isVisible ? 'Ocultar Hotel' : 'Mostrar Hotel'} arrow>
                          <IconButton
                            onClick={() => handleToggleVisibility(hotel.id_hotel, isVisible)}
                            sx={{ color: isVisible ? '#dc2626' : '#16a34a' }}
                          >
                            {isVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={styles.noHotelsCard}>
          <Hotel sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" fontWeight="600" mb={1}>
            No hay hoteles registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuando se registren hoteles, aparecerán aquí.
          </Typography>
        </Paper>
      )}

      {/* Alertas flotantes */}
      <Box sx={styles.alertContainer}>
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              onClose={() => setError('')} 
              sx={{ mb: 2, borderRadius: 3, boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)' }}
            >
              {error}
            </Alert>
          </Fade>
        )}
        {success && (
          <Fade in={!!success}>
            <Alert 
              severity="success" 
              onClose={() => setSuccess('')} 
              sx={{ mb: 2, borderRadius: 3, boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}
            >
              {success}
            </Alert>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default GestionHoteles;