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
  Paper, 
  TableContainer,
  Card,
  CardContent,
  Fade,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Grid,
  Skeleton,
  useTheme,
  alpha,
  CardHeader,
  Divider,
  Badge
} from '@mui/material';
import { 
  ToggleOn, 
  ToggleOff, 
  Delete, 
  Person, 
  Business, 
  Email, 
  Phone,
  AccountCircle,
  Visibility,
  VisibilityOff,
  Settings,
  Dashboard,
  Group
} from '@mui/icons-material';

const GestionUsuarios = () => {
  const [clientes, setClientes] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({});
  const theme = useTheme();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const [clientesResp, propietariosResp] = await Promise.all([
        fetch('https://backendd-q0zc.onrender.com/api/gestionusuarios/list/Cliente').then(res => res.json()),
        fetch('https://backendd-q0zc.onrender.com/api/gestionusuarios/list/Propietario').then(res => res.json())
      ]);
      setClientes(clientesResp);
      setPropietarios(propietariosResp);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id, tipo, currentEstado) => {
    const newEstado = currentEstado === 1 ? 'inactivo' : 'activo'; // Enviar cadena al backend
    try {
      const response = await fetch(`https://backendd-q0zc.onrender.com/api/gestionusuarios/toggle/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newEstado })
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      // Actualizar estado local inmediatamente
      const updateUsers = (users) => users.map(user =>
        user.id === id ? { ...user, is_verified: newEstado === 'activo' ? 1 : 0 } : user
      );
      if (tipo === 'Clientes') setClientes(updateUsers(clientes));
      else setPropietarios(updateUsers(propietarios));

      setSuccess(`Usuario ${id} ${newEstado} exitosamente`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar estado del usuario');
      console.error(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteUsuario = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el usuario con ID ${id}? Esta acción no se puede deshacer.`)) {
      try {
        await fetch(`https://backendd-q0zc.onrender.com/api/gestionusuarios/delete/${id}`, { method: 'DELETE' });
        setClientes(clientes.filter(user => user.id !== id));
        setPropietarios(propietarios.filter(user => user.id !== id));
        setSuccess(`Usuario ${id} eliminado exitosamente`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error al eliminar usuario');
        console.error(err);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getInitials = (nombre, apellidoP) => {
    return `${nombre?.charAt(0) || ''}${apellidoP?.charAt(0) || ''}`.toUpperCase();
  };

  const getAvatarColor = (userType) => {
    return userType === 'Clientes' ? '#6366f1' : '#8b5cf6';
  };

  const renderUserTable = (users, userType, icon) => {
    const activeUsers = users.filter(user => user.is_verified).length;
    const iconColor = userType === 'Clientes' ? '#6366f1' : '#8b5cf6';
    
    if (loading) {
      return (
        <Card sx={styles.card}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: iconColor, width: 50, height: 50 }}>
                {icon}
              </Avatar>
            }
            title={
              <Skeleton variant="text" width={150} height={30} />
            }
            subheader={
              <Skeleton variant="text" width={100} height={20} />
            }
          />
          <Divider />
          <CardContent>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={styles.card}>
        <CardHeader
          avatar={
            <Badge badgeContent={activeUsers} color="success" sx={styles.badge}>
              <Avatar sx={{ bgcolor: iconColor, width: 50, height: 50 }}>
                {icon}
              </Avatar>
            </Badge>
          }
          title={
            <Typography variant="h5" sx={styles.cardTitle}>
              {userType}
            </Typography>
          }
          subheader={
            <Box display="flex" gap={1} mt={1}>
              <Chip 
                label={`${users.length} usuarios`} 
                size="small" 
                sx={{ ...styles.totalChip, bgcolor: alpha(iconColor, 0.1), color: iconColor }}
              />
              <Chip 
                label={`${activeUsers} activos`} 
                size="small" 
                sx={styles.activeChip}
              />
            </Box>
          }
          action={
            <IconButton sx={{ color: iconColor }}>
              <Settings />
            </IconButton>
          }
          sx={styles.cardHeader}
        />
        <Divider />
        
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeaderCell}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" />
                      Usuario
                    </Box>
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" />
                      Contacto
                    </Box>
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccountCircle fontSize="small" />
                      Credenciales
                    </Box>
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell} align="center">Estado</TableCell>
                  <TableCell sx={styles.tableHeaderCell} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} sx={styles.tableRow}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ 
                          ...styles.userAvatar, 
                          bgcolor: getAvatarColor(userType),
                          background: `linear-gradient(135deg, ${getAvatarColor(userType)} 0%, ${alpha(getAvatarColor(userType), 0.8)} 100%)`
                        }}>
                          {getInitials(user.Nombre, user.ApellidoP)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={styles.userName}>
                            {`${user.Nombre} ${user.ApellidoP} ${user.ApellidoM || ''}`.trim()}
                          </Typography>
                          <Typography variant="caption" sx={styles.userId}>
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={styles.contactInfo}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Email sx={styles.contactIcon} />
                          <Typography variant="body2" sx={styles.contactText}>
                            {user.Correo}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Phone sx={styles.contactIcon} />
                          <Typography variant="body2" sx={styles.contactText}>
                            {user.Telefono}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={styles.credentialsBox}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AccountCircle sx={styles.contactIcon} />
                          <Typography variant="body2" sx={styles.username}>
                            {user.Usuario}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} sx={styles.passwordContainer}>
                          <Typography variant="body2" sx={styles.passwordText}>
                            {showPasswords[user.id] ? user.Password : '••••••••'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => togglePasswordVisibility(user.id)}
                            sx={styles.passwordToggle}
                          >
                            {showPasswords[user.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip
                        label={user.is_verified ? 'Activo' : 'Inactivo'}
                        size="small"
                        sx={{
                          ...styles.statusChip,
                          ...(user.is_verified ? styles.activeStatusChip : styles.inactiveStatusChip)
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title={user.is_verified ? 'Desactivar usuario' : 'Activar usuario'} arrow>
                          <IconButton
                            size="small"
                            onClick={() => toggleEstado(user.id, userType, user.is_verified)}
                            sx={{
                              ...styles.actionButton,
                              ...styles.toggleButton,
                              color: user.is_verified ? '#f59e0b' : '#10b981',
                            }}
                          >
                            {user.is_verified ? <ToggleOff /> : <ToggleOn />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario" arrow>
                          <IconButton
                            size="small"
                            onClick={() => deleteUsuario(user.id)}
                            sx={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const styles = {
    container: {
      py: 4,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 4,
      p: 4,
      mb: 4,
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
    },
    mainTitle: {
      fontWeight: 800,
      fontSize: '3rem',
      mb: 1,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      position: 'relative',
      zIndex: 1,
    },
    subtitle: {
      opacity: 0.95,
      fontSize: '1.2rem',
      position: 'relative',
      zIndex: 1,
    },
    card: {
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      backgroundColor: '#ffffff',
      mb: 4,
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(0,0,0,0.04)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      },
    },
    cardHeader: {
      bgcolor: '#fafafa',
      py: 3,
    },
    cardTitle: {
      fontWeight: 700,
      color: '#1e293b',
      fontSize: '1.5rem',
    },
    badge: {
      '& .MuiBadge-badge': {
        bgcolor: '#10b981',
        color: 'white',
        fontWeight: 600,
      },
    },
    totalChip: {
      fontWeight: 600,
      border: '1px solid',
      borderColor: 'currentColor',
    },
    activeChip: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      fontWeight: 600,
      border: '1px solid #bbf7d0',
    },
    tableContainer: {
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
        transform: 'scale(1.01)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
    userAvatar: {
      width: 48,
      height: 48,
      fontWeight: 700,
      fontSize: '1.1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    userName: {
      fontWeight: 600,
      color: '#1e293b',
      fontSize: '1rem',
    },
    userId: {
      color: '#64748b',
      fontWeight: 500,
      backgroundColor: '#f1f5f9',
      px: 1,
      py: 0.5,
      borderRadius: 1,
    },
    contactInfo: {
      minWidth: 200,
    },
    contactIcon: {
      fontSize: 16,
      color: '#64748b',
    },
    contactText: {
      color: '#374151',
      fontSize: '0.9rem',
    },
    credentialsBox: {
      minWidth: 180,
    },
    username: {
      fontWeight: 600,
      color: '#1e293b',
      fontSize: '0.9rem',
    },
    passwordContainer: {
      backgroundColor: '#f8fafc',
      borderRadius: 2,
      px: 1,
      py: 0.5,
      border: '1px solid #e2e8f0',
    },
    passwordText: {
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '0.85rem',
      color: '#4b5563',
      letterSpacing: '0.05em',
    },
    passwordToggle: {
      p: 0.5,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#e5e7eb',
        color: '#374151',
      },
    },
    statusChip: {
      fontWeight: 600,
      borderRadius: 3,
      fontSize: '0.8rem',
      px: 2,
      minWidth: 80,
    },
    activeStatusChip: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
    inactiveStatusChip: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
    },
    actionButton: {
      borderRadius: 2,
      p: 1.5,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid transparent',
      '&:hover': {
        transform: 'scale(1.1)',
        borderColor: 'currentColor',
      },
    },
    toggleButton: {
      '&:hover': {
        backgroundColor: alpha('#10b981', 0.1),
      },
    },
    deleteButton: {
      color: '#ef4444',
      '&:hover': {
        backgroundColor: alpha('#ef4444', 0.1),
      },
    },
    alertContainer: {
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 1300,
      minWidth: 400,
    },
  };

  return (
    <>
      <Container maxWidth="xl" sx={styles.container}>
        {/* Header Principal */}
        <Paper sx={styles.header}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            <Dashboard sx={{ fontSize: 40 }} />
            <Typography variant="h2" sx={styles.mainTitle}>
              Gestión de Usuarios
            </Typography>
          </Box>
          <Typography variant="h6" sx={styles.subtitle}>
            Administra y supervisa todos los usuarios del sistema
          </Typography>
        </Paper>

        {/* Estadísticas Rápidas */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ ...styles.card, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#6366f1', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <Group fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  {clientes.length + propietarios.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Usuarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ ...styles.card, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#10b981', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <Person fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  {clientes.filter(c => c.is_verified).length + propietarios.filter(p => p.is_verified).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ ...styles.card, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#6366f1', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <Person fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  {clientes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ ...styles.card, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#8b5cf6', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <Business fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  {propietarios.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Propietarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tablas */}
        {renderUserTable(clientes, 'Clientes', <Person />)}
        {renderUserTable(propietarios, 'Propietarios', <Business />)}
      </Container>

      {/* Alertas flotantes */}
      <Box sx={styles.alertContainer}>
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              onClose={() => setError('')} 
              sx={{ 
                mb: 2, 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
                border: '1px solid #fecaca'
              }}
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
              sx={{ 
                mb: 2, 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                border: '1px solid #bbf7d0'
              }}
            >
              {success}
            </Alert>
          </Fade>
        )}
      </Box>
    </>
  );
};

export default GestionUsuarios;