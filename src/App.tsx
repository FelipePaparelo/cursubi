
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/login';
import Todos from '@/components/todo'


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
    <RouterProvider router={router} />
  )
}

