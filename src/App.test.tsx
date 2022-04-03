import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders this is the top layer link', () => {
  render(<App />);
  const linkElement = screen.getByText(/this is the top layer/i);
  expect(linkElement).toBeInTheDocument();
});
