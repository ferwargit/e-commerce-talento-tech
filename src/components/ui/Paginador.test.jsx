// src/components/ui/Paginador.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Paginador from './Paginador';

describe('Paginador Component', () => {
  const onPageChangeMock = vi.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('no debería renderizarse si solo hay una página o menos', () => {
    const { container } = render(
      <Paginador currentPage={1} totalPages={1} onPageChange={onPageChangeMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('debería renderizar el número correcto de páginas', () => {
    render(<Paginador currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    const pageButtons = screen.getAllByRole('button');
    // 5 botones de página + 1 Anterior + 1 Siguiente = 7
    expect(pageButtons).toHaveLength(7);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('debería tener el botón "Anterior" deshabilitado en la primera página', () => {
    render(<Paginador currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    const anteriorButton = screen.getByRole('button', { name: /anterior/i });
    expect(anteriorButton).toBeDisabled();
  });

  it('debería tener el botón "Siguiente" deshabilitado en la última página', () => {
    render(<Paginador currentPage={5} totalPages={5} onPageChange={onPageChangeMock} />);
    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });
    expect(siguienteButton).toBeDisabled();
  });

  it('debería llamar a onPageChange con el número de página correcto al hacer clic', async () => {
    const user = userEvent.setup();
    render(<Paginador currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />);

    const page3Button = screen.getByRole('button', { name: '3' });
    await user.click(page3Button);
    expect(onPageChangeMock).toHaveBeenCalledWith(3);

    const page5Button = screen.getByRole('button', { name: '5' });
    await user.click(page5Button);
    expect(onPageChangeMock).toHaveBeenCalledWith(5);
  });

  it('debería llamar a onPageChange al hacer clic en "Siguiente" y "Anterior"', async () => {
    const user = userEvent.setup();
    render(<Paginador currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />);

    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });
    await user.click(siguienteButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(4);

    const anteriorButton = screen.getByRole('button', { name: /anterior/i });
    await user.click(anteriorButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it('debería tener la clase "active" en el botón de la página actual', () => {
    render(<Paginador currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />);
    const page3Button = screen.getByRole('button', { name: '3' });
    // La clase `active` se añade al elemento `li` padre del botón
    expect(page3Button.closest('li')).toHaveClass('active');
  });
});
