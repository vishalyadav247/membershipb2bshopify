import AppHeader from './components/AppHeader';
import Login from './components/authentication/Login';
import PasswordChange from './components/authentication/PasswordChangeForm';
import Member from './components/Member';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthGuard from './components/authentication/userProtected';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
    ].join(','),
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppHeader />
        <Member />
      </AuthGuard>
    )
  },
  {
    path: "/change-password",
    element: (
      <AuthGuard>
        <AppHeader />
        <PasswordChange />
      </AuthGuard>
    )
  },
  {
    path: "/login",
    element: (
      <Login />
    )
  }
])

function App() {

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App;
