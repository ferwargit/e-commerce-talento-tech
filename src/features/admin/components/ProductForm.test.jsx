// src/features/admin/components/ProductForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProductForm from './ProductForm';

// Mock de datos iniciales válidos
const mockProductData = {
  name: 'Producto de Prueba',
  image: '/images/products/test-product.jpg', // Ruta relativa
  price: 199.99,
  stock: 50,
  category: 'Pruebas',
  description: 'Esta es una descripción de prueba para el producto.',
};

describe('ProductForm', () => {
  it('debería enviar el formulario con datos válidos sin mostrar errores', async () => {
    const handleSubmit = vi.fn();

    render(
      <ProductForm
        onSubmit={handleSubmit}
        initialData={mockProductData}
        submitButtonText="Actualizar Producto"
      />
    );

    // El botón de envío debería estar presente
    const submitButton = screen.getByRole('button', { name: /actualizar producto/i });
    expect(submitButton).toBeInTheDocument();

    // Simular clic en el botón de envío
    fireEvent.click(submitButton);

    // Esperar a que el manejador de envío sea llamado
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    // Asegurarse de que se llamó con los datos correctos
    expect(handleSubmit).toHaveBeenCalledWith(mockProductData, expect.anything());

    // Lo más importante: asegurarse de que no hay mensajes de error visibles
    const errorMessage = screen.queryByText(/debe ser una url válida/i);
    expect(errorMessage).not.toBeInTheDocument();
  });
});
