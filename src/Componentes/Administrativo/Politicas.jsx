import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Container,
  Box,
  IconButton,
  Tooltip,
  CssBaseline,
  Fade,
  LinearProgress,
  styled,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    primary: { main: '#ffffff' }, // White for main backgrounds
    secondary: { main: '#ff4081' }, // Pink for cancel/delete
    success: { main: '#00c853' }, // Green for add
    info: { main: '#3f51b5' }, // Blue for edit
    background: { default: '#ffffff', paper: '#ffffff' }, // Pure white backgrounds
    text: { primary: '#212121', secondary: '#757575' }, // Dark text for contrast
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: { fontWeight: 700, color: '#212121' },
    h6: { fontWeight: 500, color: '#212121' },
    body1: { color: '#424242' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
          color: '#212121',
        },
        body: {
          color: '#424242',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Styled card for each table row
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: '12px',
  borderRadius: 12,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  },
}));

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [formData, setFormData] = useState({ id: '', titulo: '', contenido: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch policies on component mount
  useEffect(() => {
    fetchPoliticas();
  }, []);

  const fetchPoliticas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/politicas');
      setPoliticas(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
      alert('Error al cargar las políticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update a policy
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await axios.put(`https://backendd-q0zc.onrender.com/api/politicas/${formData.id}`, {
          titulo: formData.titulo,
          contenido: formData.contenido,
        });
        alert('Política actualizada correctamente');
      } else {
        await axios.post('https://backendd-q0zc.onrender.com/api/politicas', {
          titulo: formData.titulo,
          contenido: formData.contenido,
        });
        alert('Política creada correctamente');
      }
      fetchPoliticas();
      closeModal();
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Error al guardar la política');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a policy
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta política?')) {
      setIsLoading(true);
      try {
        await axios.delete(`https://backendd-q0zc.onrender.com/api/politicas/${id}`);
        alert('Política eliminada correctamente');
        fetchPoliticas();
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Error al eliminar la política');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Open modal for editing
  const handleEdit = (politica) => {
    setFormData({
      id: politica.id,
      titulo: politica.titulo || '',
      contenido: politica.contenido || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Open modal for creating
  const openModalForCreate = () => {
    setFormData({ id: '', titulo: '', contenido: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setFormData({ id: '', titulo: '', contenido: '' });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 1.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Agregar nueva política">
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={openModalForCreate}
              >
                Nueva Política
              </Button>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Fade in={!isLoading} timeout={600}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Políticas Registradas
              </Typography>
              {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 4 }} />}
              {politicas.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No hay políticas registradas.
                </Typography>
              ) : (
                <Box>
                  {politicas.map((politica) => (
                    <StyledCard key={politica.id}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {politica.titulo || 'Sin título'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {politica.contenido || 'Sin contenido'}
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Editar política">
                            <IconButton color="info" onClick={() => handleEdit(politica)} sx={{ mr: 1 }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar política">
                            <IconButton color="secondary" onClick={() => handleDelete(politica.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  ))}
                </Box>
              )}
            </Paper>
          </Fade>
        </Container>

        {/* Modal for Create/Update */}
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Fade}
          transitionDuration={400}
        >
          <DialogTitle sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 2 }}>
            {isEditing ? 'Editar Política' : 'Nueva Política'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, bgcolor: 'background.paper' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                name="titulo"
                label="Título"
                type="text"
                fullWidth
                value={formData.titulo}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Escribe el título"
                sx={{ mb: 2, bgcolor: '#ffffff' }}
              />
              <TextField
                margin="dense"
                name="contenido"
                label="Contenido"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={formData.contenido}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Escribe el contenido"
                sx={{ bgcolor: '#ffffff' }}
              />
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Button
              onClick={closeModal}
              color="secondary"
              variant="outlined"
              sx={{ borderRadius: 12 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              color="info"
              variant="contained"
              sx={{ borderRadius: 12 }}
              disabled={isLoading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Politicas;