import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from '../pages/Login';
import theme from '../theme';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ChakraProvider theme={theme}>{component}</ChakraProvider>
    </BrowserRouter>
  );
};

describe('Login', () => {
  it('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('allows input values to be entered', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});