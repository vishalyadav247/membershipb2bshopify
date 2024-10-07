import AppHeader from './components/AppHeader';
import Login from './components/authentication/Login';
import Protected from './components/authentication/Protected';
import AuthProtected from './components/authentication/PublicProtectedRoute';
import Member from './components/Member';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <>
          <AppHeader />
          <Member />
        </>
      </Protected>
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
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
