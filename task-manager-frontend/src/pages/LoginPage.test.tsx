// src/pages/LoginPage.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../app/store';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should render the login form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
});