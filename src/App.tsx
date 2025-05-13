import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/login';
import Todos from '@/components/todo'
import { AuthProvider } from '@/contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,  
  },
  {
    path: '/todo',
    element: <Todos />
  }
]);

export default function App(){
  return(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

