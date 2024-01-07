// @ts-ignore

import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import Summary from './routes/Summary.tsx'
import ErrorPage from './routes/ErrorPage.tsx'
import Layout from "./routes/Layout.tsx"
import About from './routes/About.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "/summary",
        element: <Summary />
      },
      {
        path: "/about",
        element: <About />
      }, {
        path: "*",
        element: <ErrorPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
