import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { MainLayout } from '../components/layout/MainLayout';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};