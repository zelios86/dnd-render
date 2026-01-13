import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CharacterListPage from './pages/CharacterListPage';
import CharacterSheetPage from './pages/CharacterSheetPage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import RulesBrowserPage from './pages/RulesBrowserPage';
import NotFound from './pages/NotFound';

/**
 * Application routes
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'characters',
        element: <CharacterListPage />,
      },
      {
        path: 'characters/new',
        element: <CharacterCreationPage />,
      },
      {
        path: 'characters/:id',
        element: <CharacterSheetPage />,
      },
      {
        path: 'rules',
        element: <RulesBrowserPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
