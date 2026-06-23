import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

/* ─────────────────────────────────────────
   Smoke test — verifies the app mounts
   without crashing.

   • Mocks axios so no real HTTP calls fire in CI.
   • Wraps with MemoryRouter + AuthProvider.
   • Checks the Login button is present on /login.
───────────────────────────────────────── */

// Silence axios entirely — no real network in CI
jest.mock('./api/axiosConfig', () => ({
  __esModule: true,
  default: {
    get:          jest.fn(() => Promise.resolve({ data: { content: [], totalPages: 0, totalElements: 0 } })),
    post:         jest.fn(() => Promise.resolve({ data: {} })),
    put:          jest.fn(() => Promise.resolve({ data: {} })),
    delete:       jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
}));

// Also silence axios bare import used in Navbar search
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { content: [] } })),
}));

test('renders login page without crashing', () => {
  const App = require('./App').default;

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );

  // Login submit button must be present
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
