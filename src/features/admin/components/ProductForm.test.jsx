// src/features/admin/components/ProductForm.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from './ProductForm';

describe('ProductForm', () => {
  // Mock de props básicas para cada test
  const defaultProps = {
    onSubmit: vi.fn(e => e.preventDefault()),
    register: vi.fn(name => ({ name })), // Mock simple de register
    errors: {},
    isSubmitting: false,
    title: 'Formulario de Prueba',
    buttonText: 'Enviar',
  };

  it('debería renderizar el título, los campos y llamar a onSubmit', () => {
    render(<ProductForm {...defaultProps} />);

    // El título y el botón deberían estar presentes
    expect(screen.getByRole('heading', { name: /formulario de prueba/i })).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();

    // Simular clic en el botón de envío
    fireEvent.click(submitButton);

    // Esperar a que el manejador de envío sea llamado
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);

    // Asegurarse de que `register` fue llamado para cada campo
    expect(defaultProps.register).toHaveBeenCalledWith("name");
    expect(defaultProps.register).toHaveBeenCalledWith("price", expect.any(Object));
    expect(defaultProps.register).toHaveBeenCalledWith("stock", expect.any(Object));
    // ... y así para los demás campos
  });

  it('debería mostrar mensajes de error cuando se le pasan', () => {
    const errorProps = {
      ...defaultProps,
      errors: {
        name: { message: 'El nombre es requerido' },
        price: { message: 'El precio debe ser un número positivo' },
      },
    };

    render(
      <ProductForm {...errorProps} />
    );

    // Los mensajes de error deberían estar visibles
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('El precio debe ser un número positivo')).toBeInTheDocument();
  });

  it('debería deshabilitar los campos y el botón cuando isSubmitting es true', () => {
    const submittingProps = {
      ...defaultProps,
      isSubmitting: true,
    };

    render(<ProductForm {...submittingProps} />);

    // El botón debería estar deshabilitado y mostrar el texto de carga
    const submitButton = screen.getByRole('button', { name: /guardando.../i });
    expect(submitButton).toBeDisabled();

    // Un campo, por ejemplo el de nombre, debería estar deshabilitado
    const nameInput = screen.getByLabelText(/nombre del producto/i);
    expect(nameInput).toBeDisabled();
  });
});
