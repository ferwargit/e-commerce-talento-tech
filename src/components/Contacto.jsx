// src/components/Contacto.jsx
import React, { useState } from 'react';
import SEO from './SEO';
import { StyledInput, StyledTextarea } from './StyledFormElements';
import { StyledButton } from './Button';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Sub-componente para cada item de información
const InfoItem = ({ icon, title, children }) => (
  <div className="text-center mb-4">
    <div className="fs-1 mb-2" style={{ color: 'var(--color-primary)' }}>
      {icon}
    </div>
    <h4 style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
    <p className="mb-0" style={{ color: 'var(--color-text-muted)' }}>{children}</p>
  </div>
);

function Contacto() {
  // Estado para el formulario (necesario para Netlify con React)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Función de envío para Netlify
  const handleSubmit = (e) => {
    e.preventDefault();
    const formUrlEncoded = new URLSearchParams({
        'form-name': 'contact', // Coincide con el 'name' del formulario
        ...formData
    }).toString();

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formUrlEncoded
    })
    .then(() => {
      toast.success('¡Gracias por tu mensaje! Te contactaremos pronto.');
      setFormData({ name: '', email: '', message: '' }); // Limpia el formulario
    })
    .catch((error) => {
      toast.error('Hubo un error al enviar tu mensaje.');
    });
  };

  return (
    <>
      <SEO 
        title="Contacto" 
        description="Ponte en contacto con el equipo de TechStore. Estamos aquí para ayudarte con cualquier consulta."
      />
      <div className="container my-5 py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: 'var(--color-text-primary)' }}>Contáctanos</h1>
          <p className="lead" style={{ color: "var(--color-text-muted)" }}>
            ¿Tienes alguna pregunta? No dudes en escribirnos
          </p>
        </div>

        {/* Restauramos el layout de dos columnas con alineación de altura */}
        <div className="row g-5 justify-content-center align-items-stretch">
          
          {/* Columna del Formulario */}
          <div className="col-lg-7">
            <div className="card h-100" style={{ backgroundColor: 'var(--color-background-light)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <div className="card-body p-4 d-flex flex-column">
                <h3 className="h4 mb-4 text-center" style={{ color: "var(--color-text-primary)" }}>Formulario de Contacto</h3>
                
                {/* Formulario de React que envía los datos */}
                <form 
                  name="contact"
                  onSubmit={handleSubmit} 
                  className="d-flex flex-column flex-grow-1"
                >
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tu Nombre</label>
                    <StyledInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Tu Email</label>
                    <StyledInput type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john.doe@example.com" />
                  </div>
                  <div className="mb-3 flex-grow-1 d-flex flex-column">
                    <label htmlFor="message" className="form-label">Tu Mensaje</label>
                    <StyledTextarea id="message" name="message" value={formData.message} onChange={handleChange} rows="6" required placeholder="Escribe tu consulta aquí..." className="flex-grow-1"></StyledTextarea>
                  </div>
                  <div className="d-grid">
                    <StyledButton type="submit" $variant="primary">Enviar Mensaje</StyledButton>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Columna de Información Directa */}
          <div className="col-lg-5">
            <div className="card h-100" style={{ backgroundColor: 'var(--color-background-light)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <h3 className="h4 mb-4 text-center" style={{ color: "var(--color-text-primary)" }}>Información Directa</h3>
                <InfoItem icon={<FaMapMarkerAlt />} title="Dirección">
                  Av. Siempreviva 742, Springfield
                </InfoItem>
                <InfoItem icon={<FaPhone />} title="Teléfono">
                  (+54) 11 1234-5678
                </InfoItem>
                <InfoItem icon={<FaEnvelope />} title="Email">
                  soporte@techstore.com
                </InfoItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contacto;