import React from 'react';
import { Routes, Route , useParams} from 'react-router-dom';
import LayoutConEncabezado from './Componentes/Layout/LayoutConEncabezado';
import PaginaPrincipal from './Paginas/PaginaPrincipal';
import PaginaPrincipalAdministrativa from './Paginas/PaginaPrincipalAdministrativa';
import PaginaPrincipalCliente from './Paginas/PaginaPrincipalCliente';
import { ThemeProvider } from './Componentes/Temas/ThemeContext';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import Login from './Componentes/Autenticacion/Login';
import Registro from './Componentes/Autenticacion/Registro';
import VerificarCorreo from './Componentes/Autenticacion/VerificarCorreo';
import ValidarCodigo from './Componentes/Autenticacion/ValidarCodigo';
import SolicitarCodigo from './Componentes/Autenticacion/SolicitarCodigo';
import Perfil from './Componentes/Administrativo/Perfil';
import HotelesR from './Componentes/Administrativo/Hoteles';
import HotelesP from './Componentes/Publico/HotelesP';
import Politicas from './Componentes/Administrativo/Politicas';
import Cuartos from './Componentes/Administrativo/Cuartos';
import CuartosP from './Componentes/Publico/CuartosP';
import DetallesHabitacion from './Componentes/Publico/DetalleHabitacion';
import CambiarPassword from './Componentes/Autenticacion/CambiarPassword';

const CuartosPWrapper = () => {
  const { idHotel } = useParams(); // Extrae idHotel de la URL
  return <CuartosP idHotel={idHotel} />;
};


const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutConEncabezado>
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-correo" element={<VerificarCorreo />} />
            <Route path="/validar-codigo" element={<ValidarCodigo />} />
            <Route path="/verificar_correo" element={<SolicitarCodigo />} />
            <Route path="/hotelesp" element={<HotelesP />} />
            <Route path="/cuartosp/:idHotel" element={<CuartosPWrapper />} />
            <Route path="/detalles-habitacion/:idHabitacion" element={<DetallesHabitacion />} />
            <Route path="/cambiar_password" element={<CambiarPassword />} />
            

            

            
            
            
            
            {/* Rutas para la administración */}



            <Route path="/admin" element={<PaginaPrincipalAdministrativa />} />
            <Route path="/admin/perfil" element={<Perfil />} />
            <Route path="/admin/hoteles" element={<HotelesR />} />
            <Route path="/admin/politicas" element={<Politicas />} />
            <Route path="/admin/cuartos" element={<Cuartos />} />

            





            <Route path="/cliente" element={<PaginaPrincipalCliente />} />
            
          </Routes>
        </LayoutConEncabezado>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;