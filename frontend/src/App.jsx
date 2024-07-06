import {
  createBrowserRouter,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Chats from "./components/Chats";


// function App() {
//   return (
//    <><Outlet /></>
//   )
// }

const router = createBrowserRouter([
  {
    path: '/',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/chats',
    element: <Chats/>
  }
])

export default router;