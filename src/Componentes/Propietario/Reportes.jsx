import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reportes = () => {
  const [reportes, setReportes] = useState({ porDia: [], porMes: [], porAnio: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setIsLoading(false);
      return;
    }

    const fetchReportes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://backendd-q0zc.onrender.com/api/gestionreservas/reportes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportes(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los reportes.");
        console.error("Error al obtener reportes:", err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportes();
  }, []);

  const formatDate = (dateString) => {
    return moment.tz(dateString, "America/Mexico_City").format("DD/MM/YYYY");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const tableTop = 20;

    // Título y fecha
    doc.setFontSize(18);
    doc.text("Reporte de Reservas", pageWidth / 2, 10, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generado el: ${moment.tz("America/Mexico_City").format("DD/MM/YYYY HH:mm:ss")}`, pageWidth / 2, 15, { align: "center" });

    // Sección por Día
    if (reportes.porDia.length > 0) {
      doc.setFontSize(14);
      doc.text("Total por Día", margin, tableTop);
      autoTable(doc, {
        startY: tableTop + 5,
        head: [["Fecha", "Total ($)"]],
        body: reportes.porDia.map(row => [formatDate(row.fecha), `$${Number(row.total).toFixed(2)}`]),
        theme: "grid",
        styles: { font: "times", fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
      });
    }

    // Sección por Mes
    if (reportes.porMes.length > 0) {
      const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : tableTop;
      doc.setFontSize(14);
      doc.text("Total por Mes", margin, lastY + 10);
      autoTable(doc, {
        startY: lastY + 15,
        head: [["Mes", "Total ($)"]],
        body: reportes.porMes.map(row => [moment(row.mes, "YYYY-MM").format("MMMM YYYY"), `$${Number(row.total).toFixed(2)}`]),
        theme: "grid",
        styles: { font: "times", fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
      });
    }

    // Sección por Año
    if (reportes.porAnio.length > 0) {
      const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : (reportes.porMes.length > 0 ? doc.lastAutoTable.finalY + 10 : tableTop);
      doc.setFontSize(14);
      doc.text("Total por Año", margin, lastY + 10);
      autoTable(doc, {
        startY: lastY + 15,
        head: [["Año", "Total ($)"]],
        body: reportes.porAnio.map(row => [row.anio, `$${Number(row.total).toFixed(2)}`]),
        theme: "grid",
        styles: { font: "times", fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
      });
    }

    // Descargar el PDF
    doc.save(`reporte_reservas_${moment.tz("America/Mexico_City").format("YYYYMMDD_HHmmss")}.pdf`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "1rem", md: "2rem" },
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textTransform: "uppercase" }}
        >
          Reportes de Reservas
        </Typography>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#1976d2" }} />
            <Typography variant="body2" sx={{ color: "#1976d2", mt: 2 }}>
              Cargando reportes...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                onClick={generatePDF}
                sx={{ backgroundColor: "#2e7d32", color: "white", "&:hover": { backgroundColor: "#1b5e20" }, mb: 2 }}
              >
                Generar PDF
              </Button>
            </Box>

            {/* Tabla por Día */}
            {reportes.porDia.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#2e7d32", mb: 2, fontWeight: 600 }}>
                  Total por Día
                </Typography>
                <Paper sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Total ($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportes.porDia.map((row) => (
                        <TableRow key={row.fecha}>
                          <TableCell>{formatDate(row.fecha)}</TableCell>
                          <TableCell>${Number(row.total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}

            {/* Tabla por Mes */}
            {reportes.porMes.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#2e7d32", mb: 2, fontWeight: 600 }}>
                  Total por Mes
                </Typography>
                <Paper sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Mes</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Total ($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportes.porMes.map((row) => (
                        <TableRow key={row.mes}>
                          <TableCell>{moment(row.mes, "YYYY-MM").format("MMMM YYYY")}</TableCell>
                          <TableCell>${Number(row.total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}

            {/* Tabla por Año */}
            {reportes.porAnio.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ color: "#2e7d32", mb: 2, fontWeight: 600 }}>
                  Total por Año
                </Typography>
                <Paper sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Año</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Total ($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportes.porAnio.map((row) => (
                        <TableRow key={row.anio}>
                          <TableCell>{row.anio}</TableCell>
                          <TableCell>${Number(row.total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}

            {(reportes.porDia.length === 0 && reportes.porMes.length === 0 && reportes.porAnio.length === 0) && (
              <Typography variant="body1" align="center" sx={{ color: "#666", mt: 4 }}>
                No hay reportes para mostrar en este momento.
              </Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Reportes;