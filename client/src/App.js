import AppHeader from './components/AppHeader';
import Login from './components/authentication/Login';
import Member from './components/Member';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
    path:"/login",
    element:( <Login/>)
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
