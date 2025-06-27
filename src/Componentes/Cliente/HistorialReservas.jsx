import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Paper,
  Zoom,
  Typography,
} from "@mui/material";
import { Hotel } from "@mui/icons-material";

const HistorialReservas = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [id_usuario, setIdUsuario] = useState(null);
  const [error, setError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState("");

  const colors = {
    primary: "#4c94bc",
    secondary: "#549c94",
    accent: "#0b7583",
    success: "#549c94",
    neutral: "#b3c9ca",
  };

  const styles = {
    container: {
      backgroundColor: "#fafbfc",
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    detailsCard: {
      borderRadius: "16px",
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e6ed",
      height: "100%",
    },
    sectionTitle: {
      color: colors.accent,
      fontWeight: "600",
      marginBottom: "1.5rem",
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#dc3545",
      color: "white",
      "&:hover": {
        backgroundColor: "#c82333",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(220, 53, 69, 0.4)",
      },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setIsLoadingReservations(false);
      return;
    }

    const setupAxiosInterceptors = () => {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
            localStorage.removeItem("token");
            localStorage.removeItem("id_usuario");
            // Limpiar reservas canceladas al cerrar sesión
            localStorage.removeItem("cancelledReservations");
          }
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptors();

    const decodeToken = () => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setIdUsuario(decoded.id);
      } catch (error) {
        console.error("Error al decodificar token:", error);
        setError("Token inválido. Por favor, inicia sesión de nuevo.");
        setIsLoadingReservations(false);
      }
    };

    if (!id_usuario) {
      decodeToken();
    }

    if (id_usuario) {
      fetchUserReservations();
    }
  }, [id_usuario]);

  const fetchUserReservations = async () => {
    try {
      setIsLoadingReservations(true);
      if (!id_usuario) return;
      const response = await axios.get(
        `https://backendd-q0zc.onrender.com/api/reservas/usuario/${id_usuario}`
      );
      // Obtener reservas canceladas desde localStorage
      const cancelledReservations = JSON.parse(localStorage.getItem("cancelledReservations") || "[]");
      // Filtrar reservas que no estén en la lista de canceladas
      const filteredReservations = response.data.filter(
        (res) => !cancelledReservations.includes(res.id_reserva)
      );
      setUserReservations(filteredReservations);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al cargar las reservas del usuario."
      );
      console.error("Error al obtener reservas:", err.response?.data || err.message);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleCancelReservation = async (id_reserva) => {
    try {
      // Cancelar en el servidor primero
      let serverCancelled = false;
      try {
        // Endpoint específico de cancelación
        const response = await axios.put(
          `https://backendd-q0zc.onrender.com/api/reservas/${id_reserva}/cancelar`
        );
        serverCancelled = response.status === 200;
      } catch (serverError) {
        console.warn("No se pudo cancelar en el servidor:", serverError.message);
        serverCancelled = false;
      }

      // Aplicar cancelación en localStorage (mantener lógica original)
      const cancelledReservations = JSON.parse(localStorage.getItem("cancelledReservations") || "[]");
      if (!cancelledReservations.includes(id_reserva)) {
        cancelledReservations.push(id_reserva);
        localStorage.setItem("cancelledReservations", JSON.stringify(cancelledReservations));
      }
      
      // Actualizar el estado local para eliminar la reserva
      setUserReservations((prev) =>
        prev.filter((res) => res.id_reserva !== id_reserva)
      );
      
      // Mostrar mensaje apropiado
      if (serverCancelled) {
        setReservationSuccess("Reserva cancelada exitosamente en el sistema.");
      } else {
        setReservationSuccess("Reserva cancelada localmente. Por favor, contacta al administrador para confirmar la cancelación en el sistema.");
      }
      setError("");
      
    } catch (err) {
      // Si hay error crítico, mantener la lógica original como respaldo
      try {
        console.warn("Error crítico, aplicando cancelación local como respaldo:", err.message);
        const cancelledReservations = JSON.parse(localStorage.getItem("cancelledReservations") || "[]");
        if (!cancelledReservations.includes(id_reserva)) {
          cancelledReservations.push(id_reserva);
          localStorage.setItem("cancelledReservations", JSON.stringify(cancelledReservations));
        }
        setUserReservations((prev) =>
          prev.filter((res) => res.id_reserva !== id_reserva)
        );
        setReservationSuccess("Reserva cancelada localmente. Contacta al administrador para confirmar.");
        setError("");
      } catch (localErr) {
        setError("Error al cancelar la reserva. Por favor, intenta de nuevo.");
        console.error("Error crítico al cancelar:", localErr.message);
      }
    }
  };

  if (error && !isLoadingReservations) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={true}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "12px", fontSize: "1.1rem" }}
            >
              {error}
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg">
        {reservationSuccess && (
          <Zoom in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="success"
                onClose={() => setReservationSuccess("")}
                sx={{ borderRadius: "12px", fontSize: "1.1rem" }}
              >
                {reservationSuccess}
              </Alert>
            </Box>
          </Zoom>
        )}

        <Fade in={true} timeout={600}>
          <Card sx={styles.detailsCard}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                <Hotel sx={{ mr: 1, fontSize: "1.5rem" }} />
                Mis Reservas
              </Typography>
              {isLoadingReservations ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={30} sx={{ color: colors.primary }} />
                  <Typography variant="body1" sx={{ color: colors.primary, mt: 2 }}>
                    Cargando reservas...
                  </Typography>
                </Box>
              ) : userReservations.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Hotel</TableCell>
                        <TableCell>Número de Habitación</TableCell>
                        <TableCell>Fecha de Entrada</TableCell>
                        <TableCell>Fecha de Salida</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userReservations.map((res) => (
                        <TableRow key={res.id_reserva}>
                          <TableCell>{res.nombrehotel || "No especificado"}</TableCell>
                          <TableCell>{res.cuarto || "No especificado"}</TableCell>
                          <TableCell>
                            {new Date(res.fechainicio).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
                          </TableCell>
                          <TableCell>
                            {new Date(res.fechafin).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
                          </TableCell>
                          <TableCell>${res.totalpagar}</TableCell>
                          <TableCell>
                            {res.estado !== "Cancelado" && (
                              <Button
                                variant="contained"
                                sx={styles.cancelButton}
                                onClick={() => handleCancelReservation(res.id_reserva)}
                              >
                                Cancelar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No hay reservas registradas.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default HistorialReservas;