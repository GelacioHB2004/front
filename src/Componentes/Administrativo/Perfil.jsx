import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        NombreEmpresa: '', // Ajustado a mayúsculas iniciales
        Eslogan: '',
        logo: null,
        Direccion: '',
        Correo: '',
        Telefono: ''
    });
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/perfil');
                console.log('Datos recibidos del backend:', response.data); // Depuración
                setPerfiles(response.data);
            } catch (error) {
                console.error('Error al obtener perfiles:', error.message);
            }
        };
        fetchPerfiles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Telefono') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else if (name === 'NombreEmpresa' || name === 'Eslogan') {
            const regex = /^[a-zA-Z0-9 ]*$/;
            if (regex.test(value) && value.length <= 50) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else {
            setPerfil({
                ...perfil,
                [name]: value,
            });
        }
    };

    const handleLogoChange = (e) => {
        setPerfil({
            ...perfil,
            logo: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['Eslogan', 'Direccion', 'Correo', 'Telefono'];
        const allFieldsFilled = requiredFields.every(field => perfil[field]);
        const isPhoneValid = /^\d{10}$/.test(perfil.Telefono);

        if (!allFieldsFilled || !isPhoneValid) {
            let message = "Por favor, llena todos los campos";
            if (!isPhoneValid) {
                message = "El teléfono debe tener exactamente 10 dígitos numéricos.";
            }
            MySwal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombreEmpresa', perfil.NombreEmpresa);
        formData.append('eslogan', perfil.Eslogan);
        formData.append('direccion', perfil.Direccion);
        formData.append('correo', perfil.Correo);
        formData.append('telefono', perfil.Telefono);
        if (perfil.logo) {
            formData.append('logo', perfil.logo);
        }

        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/api/perfil/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('http://localhost:3000/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido creado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPerfil({
                NombreEmpresa: '',
                Eslogan: '',
                logo: null,
                Direccion: '',
                Correo: '',
                Telefono: ''
            });
            setEditingId(null);
            const response = await axios.get('http://localhost:3000/api/perfil');
            setPerfiles(response.data);
        } catch (error) {
            console.error('Error al guardar perfil:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar el perfil.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/api/perfil/${id}`);
                setPerfiles(perfiles.filter(p => p.id !== id));
                Swal.fire(
                    'Eliminado!',
                    'El perfil ha sido eliminado.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar perfil:', error.message);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar el perfil.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (perfil) => {
        setPerfil({
            NombreEmpresa: perfil.NombreEmpresa,
            Eslogan: perfil.Eslogan,
            logo: null,
            Direccion: perfil.Direccion,
            Correo: perfil.Correo,
            Telefono: perfil.Telefono
        });
        setEditingId(perfil.id);
    };

    const handleCancel = () => {
        setPerfil({
            NombreEmpresa: '',
            Eslogan: '',
            logo: null,
            Direccion: '',
            Correo: '',
            Telefono: ''
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Perfil</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Empresa</label>
                        <input
                            type="text"
                            name="NombreEmpresa"
                            placeholder="Nombre de la Empresa"
                            value={perfil.NombreEmpresa}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Eslogan</label>
                        <input
                            type="text"
                            name="Eslogan"
                            placeholder="Eslogan"
                            value={perfil.Eslogan}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Logo</label>
                        <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Dirección</label>
                        <input
                            type="text"
                            name="Direccion"
                            placeholder="Dirección"
                            value={perfil.Direccion}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Correo</label>
                        <input
                            type="email"
                            name="Correo"
                            placeholder="Correo"
                            value={perfil.Correo}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Teléfono (10 dígitos)</label>
                        <input
                            type="text"
                            name="Telefono"
                            placeholder="Teléfono"
                            value={perfil.Telefono}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.editButton}>
                        {editingId ? "Actualizar Perfil" : "Crear Perfil"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            <div style={styles.profileList}>
                <h2>Perfiles Guardados</h2>
                {perfiles.map((perfil) => (
                    <div key={perfil.id} style={styles.profileItem}>
                        {perfil.Logo && (
                            <img
                                src={`data:image/jpeg;base64,${perfil.Logo}`}
                                alt="Logo de la empresa"
                                style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                            />
                        )}
                        <p><strong>Nombre de la Empresa:</strong> {perfil.NombreEmpresa || 'No disponible'}</p>
                        <p><strong>Eslogan:</strong> {perfil.Eslogan || 'No disponible'}</p>
                        <p><strong>Dirección:</strong> {perfil.Direccion || 'No disponible'}</p>
                        <p><strong>Correo de la empresa:</strong> {perfil.Correo || 'No disponible'}</p>
                        <p><strong>Teléfono:</strong> {perfil.Telefono || 'No disponible'}</p>
                        <button onClick={() => handleEdit(perfil)} style={styles.editButton}>Editar</button>
                        <button onClick={() => handleDelete(perfil.id)} style={styles.cancelButton}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        padding: '20px',
        maxWidth: '800px',
        borderRadius: '8px',
        backgroundColor: '#f4f4f9',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    profileList: {
        marginTop: '30px',
    },
    profileItem: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
        borderRadius: '5px',
        marginTop: '10px',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 16px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    '@media screen and (max-width: 1200px)': {
        container: {
            maxWidth: '90%',
            padding: '15px',
        },
        formGrid: {
            gridTemplateColumns: '1fr 1fr',
        },
        title: {
            fontSize: '22px',
        },
    },
    '@media screen and (max-width: 900px)': {
        container: {
            maxWidth: '100%',
            padding: '10px',
        },
        formGrid: {
            gridTemplateColumns: '1fr',
        },
        label: {
            fontSize: '14px',
        },
        input: {
            fontSize: '14px',
        },
        title: {
            fontSize: '20px',
        },
        profileItem: {
            padding: '15px',
        },
        editButton: {
            padding: '8px 12px',
        },
        cancelButton: {
            padding: '8px 12px',
        },
    },
    '@media screen and (max-width: 600px)': {
        container: {
            maxWidth: '100%',
            padding: '5px',
        },
        formGrid: {
            gridTemplateColumns: '1fr',
        },
        label: {
            fontSize: '12px',
        },
        input: {
            fontSize: '12px',
        },
        title: {
            fontSize: '18px',
        },
        profileItem: {
            padding: '10px',
        },
        editButton: {
            padding: '8px 10px',
        },
        cancelButton: {
            padding: '8px 10px',
        },
    },
};

export default Perfil;