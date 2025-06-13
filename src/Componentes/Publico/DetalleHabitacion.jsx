"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
  Chip,
  Paper,
  Divider,
  Avatar,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Hotel,
  AccessTime,
  AttachMoney,
  RoomService,
  CheckCircle,
  Cancel,
  Schedule,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  Spa,
} from "@mui/icons-material";

const DetallesHabitacion = () => {
  const { idHabitacion } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservationTime, setReservationTime] = useState("");
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
    headerCard: {
      backgroundColor: colors.primary,
      color: "white",
      borderRadius: "16px",
      marginBottom: "2rem",
      boxShadow: "0 8px 32px rgba(76, 148, 188, 0.2)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    imageCard: {
      borderRadius: "12px",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      height: "100%",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      },
    },
    detailsCard: {
      borderRadius: "16px",
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e6ed",
      height: "100%",
    },
    priceCard: {
      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 4px 16px rgba(84, 156, 148, 0.25)",
      color: "white",
    },
    reservationCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: `2px solid ${colors.neutral}`,
      height: "fit-content",
    },
    statusChip: {
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      borderRadius: "25px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    iconBox: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      transition: "all 0.2s ease",
      height: "100%",
      "&:hover": {
        backgroundColor: "#e9ecef",
        transform: "translateY(-1px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
    serviceIcon: {
      marginRight: "0.75rem",
      color: colors.accent,
      fontSize: "1.5rem",
      flexShrink: 0,
    },
    sectionTitle: {
      color: colors.accent,
      fontWeight: "600",
      marginBottom: "1.5rem",
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
    },
    originalPrice: {
      textDecoration: "line-through",
      color: "rgba(255,255,255,0.7)",
      marginRight: "0.5rem",
      fontSize: "0.9rem",
    },
    discountedPrice: {
      color: "#ffeb3b",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      padding: "0.5rem 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      "&:last-child": {
        borderBottom: "none",
        marginBottom: 0,
      },
    },
  };

  useEffect(() => {
    if (!idHabitacion || isNaN(idHabitacion)) {
      setError("ID de habitación no válido.");
      setLoading(false);
      return;
    }
    fetchHabitacion();
  }, [idHabitacion]);

  const fetchHabitacion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backendd-q0zc.onrender.com/api/detallesHabitacion/detalles/${idHabitacion}`
      );
      console.log('Datos recibidos del backend:', response.data);
      setHabitacion(response.data);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Habitación no encontrada en la base de datos."
          : err.response?.data?.error ||
            "Error al cargar los detalles de la habitación. Intente de nuevo.";
      setError(errorMessage);
      console.error("Error fetching habitacion:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationTimeChange = (e) => {
    setReservationTime(e.target.value);
  };

  const handleReservation = async () => {
    if (!reservationTime) {
      setError("Por favor, seleccione una hora de reserva.");
      return;
    }

    if (habitacion.estado?.toLowerCase() !== "disponible") {
      setError("Esta habitación no está disponible para reservar.");
      return;
    }

    try {
      const updatedCuarto = {
        estado: "Ocupado",
        horario: reservationTime,
      };

      const response = await axios.put(
        `https://backendd-q0zc.onrender.com/api/detallesHabitacion/${idHabitacion}`,
        updatedCuarto
      );
      setHabitacion(response.data);
      setReservationSuccess("¡Habitación reservada con éxito!");
      setError("");
      setReservationTime("");
    } catch (err) {
      setError("Error al realizar la reserva. Intente de nuevo.");
      console.error("Error al reservar:", err.response?.data || err.message);
    }
  };

  const getServiceIcons = (servicios) => {
    const serviceMap = {
      wifi: <Wifi sx={styles.serviceIcon} />,
      parking: <LocalParking sx={styles.serviceIcon} />,
      restaurant: <Restaurant sx={styles.serviceIcon} />,
      gym: <FitnessCenter sx={styles.serviceIcon} />,
      pool: <Pool sx={styles.serviceIcon} />,
      spa: <Spa sx={styles.serviceIcon} />,
      internet: <Wifi sx={styles.serviceIcon} />,
      baño: <RoomService sx={styles.serviceIcon} />,
    };

    const serviceList = Array.isArray(servicios) ? servicios : [];
    return serviceList.length > 0 ? (
      serviceList.map((service, index) => {
        const trimmedService = service.trim().toLowerCase();
        return (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Box sx={styles.iconBox}>
              {serviceMap[trimmedService] || <RoomService sx={styles.serviceIcon} />}
              <Typography
                variant="body1"
                sx={{ 
                  textTransform: "capitalize", 
                  fontWeight: "600",
                  color: colors.accent,
                  lineHeight: 1.2
                }}
              >
                {service.trim()}
              </Typography>
            </Box>
          </Grid>
        );
      })
    ) : (
      <Grid item xs={12}>
        <Box sx={{
          ...styles.iconBox,
          justifyContent: "center",
          textAlign: "center",
          py: 3
        }}>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontStyle: "italic" }}
          >
            No hay servicios especificados
          </Typography>
        </Box>
      </Grid>
    );
  };

  // Verificar si hay una promoción activa basada en la fecha actual
  const currentDate = new Date('2025-06-10T09:33:00-06:00');
  const hasActivePromotion = habitacion?.promocion &&
    new Date(habitacion.promocion.fechainicio) <= currentDate &&
    new Date(habitacion.promocion.fechafin) >= currentDate;

  // Calcular precio con descuento
  const getDiscountedPrice = (originalPrice, discountPrice) => {
    console.log('Calculando precio:', { originalPrice, discountPrice, hasActivePromotion });
    return hasActivePromotion && discountPrice !== null && !isNaN(discountPrice)
      ? Number(discountPrice).toFixed(2)
      : originalPrice !== null && !isNaN(originalPrice)
      ? Number(originalPrice).toFixed(2)
      : "No definido";
  };

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: colors.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.primary }}>
              Cargando detalles de la habitación...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
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

  if (!habitacion) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ color: colors.primary, fontWeight: "600" }}
          >
            Habitación no encontrada
          </Typography>
        </Container>
      </Box>
    );
  }

  const images = habitacion.imagenes && Array.isArray(habitacion.imagenes) && habitacion.imagenes.length > 0
    ? habitacion.imagenes.map(img => 
        img.data && img.mimeType
          ? `data:${img.mimeType};base64,${img.data}`
          : null
      ).filter(img => img)
    : null;
  const normalizedEstado =
    habitacion.estado?.charAt(0).toUpperCase() + habitacion.estado?.slice(1).toLowerCase();
  const isAvailable = normalizedEstado?.toLowerCase() === "disponible";

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg">
        {/* Header Card */}
        <Fade in={true} timeout={800}>
          <Card sx={styles.headerCard}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  width: 60,
                  height: 60,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Hotel sx={{ fontSize: 30, color: "white" }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "600", mb: 1 }}>
                Habitación {habitacion.cuarto}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                Tipo: {habitacion.tipo_habitacion || "No especificado"}
              </Typography>
              <Chip
                icon={isAvailable ? <CheckCircle /> : <Cancel />}
                label={normalizedEstado || "Sin estado"}
                sx={{
                  ...styles.statusChip,
                  bgcolor: isAvailable ? colors.success : "#dc3545",
                  color: "white",
                }}
              />
            </CardContent>
          </Card>
        </Fade>

        {/* Success Alert */}
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

        {/* Image Gallery - Modificado para mostrar 4 columnas */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ ...styles.sectionTitle, textAlign: "center", mb: 2 }}
            >
              <Hotel sx={{ mr: 1, fontSize: "1.5rem" }} />
              Galería de Imágenes
            </Typography>
            <Grid container spacing={2}>
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={3} xl={3} key={index}>
                    <Card sx={styles.imageCard}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={image}
                        alt={`Imagen ${index + 1} de ${habitacion.cuarto}`}
                        sx={{ objectFit: "cover" }}
                        loading="lazy"
                      />
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      ...styles.imageCard,
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No hay imágenes disponibles
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Room Details */}
          <Grid item xs={12} lg={8}>
            <Fade in={true} timeout={1200}>
              <Card sx={styles.detailsCard}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={styles.sectionTitle}
                  >
                    <RoomService sx={{ mr: 1, fontSize: "1.5rem" }} />
                    Detalles de la Habitación
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={styles.iconBox}>
                        <AccessTime sx={styles.serviceIcon} />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                          >
                            Horario
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6c757d", lineHeight: 1.4 }}>
                            {habitacion.horario
                              ? new Date(habitacion.horario).toLocaleString()
                              : "No especificado"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={styles.iconBox}>
                        <Schedule sx={styles.serviceIcon} />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                          >
                            Estado
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isAvailable ? colors.success : "#dc3545",
                              fontWeight: "600",
                              lineHeight: 1.4
                            }}
                          >
                            {normalizedEstado || "Sin estado"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={styles.iconBox}>
                        <Hotel sx={styles.serviceIcon} />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                          >
                            Tipo de Habitación
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6c757d", lineHeight: 1.4 }}>
                            {habitacion.tipo_habitacion || "No especificado"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4, borderColor: colors.neutral }} />

                  <Typography variant="h6" sx={styles.sectionTitle}>
                    <Spa sx={{ mr: 1, fontSize: "1.3rem" }} />
                    Servicios del Hotel
                  </Typography>
                  <Grid container spacing={3}>
                    {getServiceIcons(habitacion.servicios)}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Pricing and Reservation */}
          <Grid item xs={12} lg={4}>
            <Fade in={true} timeout={1400}>
              <Box sx={{ position: "sticky", top: "2rem" }}>
                {/* Pricing Card */}
                <Paper sx={styles.priceCard}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <AttachMoney sx={{ mr: 1, fontSize: "1.3rem" }} />
                    Tarifas
                  </Typography>

                  {[
                    { label: "Por Hora", price: habitacion.preciohora, discount: habitacion.promocion?.preciohora_promocion },
                    { label: "Por Día", price: habitacion.preciodia, discount: habitacion.promocion?.preciodia_promocion },
                    { label: "Por Noche", price: habitacion.precionoche, discount: habitacion.promocion?.precionoche_promocion },
                    { label: "Por Semana", price: habitacion.preciosemana, discount: habitacion.promocion?.preciosemana_promocion },
                  ].map((item, index) => {
                    const originalPrice = item.price !== null && item.price !== undefined && !isNaN(item.price)
                      ? Number(item.price).toFixed(2)
                      : "No definido";
                    const discountPrice = item.discount !== null && item.discount !== undefined && !isNaN(item.discount)
                      ? Number(item.discount).toFixed(2)
                      : null;

                    return (
                      <Box key={index} sx={styles.priceRow}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "600", color: "rgba(255,255,255,0.9)" }}
                        >
                          {item.label}:
                        </Typography>
                        <Box sx={{ textAlign: "right" }}>
                          {hasActivePromotion && discountPrice ? (
                            <>
                              <Typography component="span" sx={styles.originalPrice}>
                                ${originalPrice}
                              </Typography>
                              <Typography component="span" sx={styles.discountedPrice}>
                                ${discountPrice}
                              </Typography>
                            </>
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "700", color: "white", fontSize: "1.1rem" }}
                            >
                              ${originalPrice}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}

                  {hasActivePromotion && habitacion.promocion && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      backgroundColor: "rgba(255,235,59,0.2)", 
                      borderRadius: "8px",
                      border: "1px solid rgba(255,235,59,0.3)"
                    }}>
                      <Typography variant="body2" sx={{ color: "#ffeb3b", fontWeight: "600" }}>
                        🎉 Promoción activa: {habitacion.promocion.descuento}% de descuento
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        Válida del {new Date(habitacion.promocion.fechainicio).toLocaleDateString()} al {new Date(habitacion.promocion.fechafin).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {/* Reservation Card */}
                <Card sx={styles.reservationCard}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.accent,
                      fontWeight: "600",
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    Reservar Habitación
                  </Typography>

                  <TextField
                    label="Fecha y Hora de Reserva"
                    type="datetime-local"
                    value={reservationTime}
                    onChange={handleReservationTimeChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: colors.primary,
                      },
                    }}
                    disabled={!isAvailable}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleReservation}
                    disabled={!isAvailable}
                    sx={{
                      borderRadius: "8px",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      backgroundColor: isAvailable ? colors.primary : "#6c757d",
                      boxShadow: "0 2px 8px rgba(76, 148, 188, 0.3)",
                      "&:hover": {
                        backgroundColor: isAvailable ? colors.accent : "#6c757d",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(76, 148, 188, 0.4)",
                      },
                      "&:disabled": {
                        backgroundColor: "#6c757d",
                        color: "rgba(255,255,255,0.7)",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isAvailable ? "Reservar Ahora" : "No Disponible"}
                  </Button>
                </Card>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DetallesHabitacion;