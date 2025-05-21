"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  Fade,
  Slide,
} from "@mui/material";
import {
  Place as MapPin,
  CalendarToday as Calendar,
  People as Users,
  Star as StarIcon,
  Hotel as Bed,
  Public as Globe,
  ArrowForward as ArrowRight,
  ChevronRight,
  CheckCircle as CheckCircle2,
  ExpandMore as ChevronDown,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

/**
 * Nuevo esquema de colores inspirado en Material Design 3
 * - Paleta principal: Azul indigo → #3f51b5
 * - Secundaria: Rosa coral → #ff4081
 * - Fondo predeterminado: #f5f5f5 (gris claro)
 * - Fondo de tarjetas/paper: #ffffff (blanco)
 */

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4081",
      light: "#ff79b0",
      dark: "#c60055",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          boxShadow: "none",
          transition: "all .2s",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(63,81,181,.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const PaginaPrincipal = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", { destination, checkIn, checkOut, guests });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
  sx={{
    minHeight: "100vh",
    position: "relative",
    color: "#1e1e1e",
    overflow: "hidden",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.8), rgba(255, 255, 255, 0)),
      url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

        {/* Fondo decorativo */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top center, rgba(63,81,181,0.12), transparent 70%)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 4 }}>
          {/* Hero */}
          <Fade in timeout={800}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: 36, md: 56 } }}>
                Reserva tu hotel ideal
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
                Encuentra los mejores hoteles y alojamientos en todo el mundo con facilidad y confianza.
              </Typography>

              {/* Formulario de búsqueda */}
              <Slide in timeout={800} direction="up">
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    maxWidth: 900,
                    mx: "auto",
                    p: 3,
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        placeholder="¿A dónde vas?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        label="Destino"
                        InputProps={{ startAdornment: <MapPin sx={{ mr: 1 }} /> }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2.5}>
                      <TextField
                        fullWidth
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        label="Entrada"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2.5}>
                      <TextField
                        fullWidth
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        label="Salida"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        inputProps={{ min: 1 }}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        label="Huéspedes"
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        endIcon={<ArrowRight />}
                        sx={{ py: 1.2 }}
                      >
                        Buscar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Slide>
            </Box>
          </Fade>

          {/* Tabs */}
          <Box sx={{ py: 6 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              centered
              textColor="primary"
              indicatorColor="secondary"
              sx={{ mb: 3 }}
            >
              <Tab label="Hoteles" />
              <Tab label="Apartamentos" />
              <Tab label="Resorts" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>Contenido hoteles</TabPanel>
            <TabPanel value={activeTab} index={1}>Contenido apartamentos</TabPanel>
            <TabPanel value={activeTab} index={2}>Contenido resorts</TabPanel>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PaginaPrincipal;