import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
            
            
            {/* Rutas para la administración */}



            <Route path="/admin" element={<PaginaPrincipalAdministrativa />} />
            <Route path="/admin/perfil" element={<Perfil />} />
            





            <Route path="/cliente" element={<PaginaPrincipalCliente />} />
            
          </Routes>
        </LayoutConEncabezado>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;