import { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Función de envío para Netlify
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', e.target.name.value);
      formData.append('email', e.target.email.value);
      formData.append('message', e.target.message.value);

      const response = await fetch("/", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success('¡Gracias por tu mensaje! Te contactaremos pronto.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al enviar tu mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="row g-5 justify-content-center align-items-stretch">
          
          {/* Columna del Formulario */}
          <div className="col-lg-7">
            <div className="card h-100" style={{ backgroundColor: 'var(--color-background-light)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <div className="card-body p-4 d-flex flex-column">
                <h3 className="h4 mb-4 text-center" style={{ color: "var(--color-text-primary)" }}>Formulario de Contacto</h3>
                
                {/* Formulario que envía a Netlify */}
                <form 
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit} 
                  className="d-flex flex-column flex-grow-1"
                >
                  {/* Campo honeypot oculto */}
                  <input type="hidden" name="form-name" value="contact" />
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tu Nombre</label>
                    <StyledInput 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Tu Email</label>
                    <StyledInput 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="john.doe@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="mb-3 flex-grow-1 d-flex flex-column">
                    <label htmlFor="message" className="form-label">Tu Mensaje</label>
                    <StyledTextarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows="6" 
                      required 
                      placeholder="Escribe tu consulta aquí..." 
                      className="flex-grow-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="d-grid">
                    <StyledButton 
                      type="submit" 
                      $variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </StyledButton>
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
