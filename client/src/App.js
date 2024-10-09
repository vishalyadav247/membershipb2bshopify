import AppHeader from './components/AppHeader';
import Login from './components/authentication/Login';
import PasswordChange from './components/authentication/PasswordChangeForm';
import Protected from './components/authentication/Protected';
import AuthProtected from './components/authentication/PublicProtectedRoute';
import Member from './components/Member';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
      <>
        <AppHeader />
        <Member />
      </>
    )
  },
  {
    path: "/change-password",
    element: (
      <>
        <AppHeader />
        <PasswordChange />
      </>
    )
  },
  {
    path: "/login",
    element: (
      <AuthProtected>
      <Login />
      </AuthProtected>
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
