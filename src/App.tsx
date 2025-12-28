import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Leads from './pages/Leads';
import Inventory from './pages/Inventory';
import Quotes from './pages/Quotes';
import QuoteBuilder from './pages/QuoteBuilder';
import CreditApps from './pages/CreditApps';
import Inbox from './pages/Inbox';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="quotes/new" element={<QuoteBuilder />} />
        <Route path="credit-apps" element={<CreditApps />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
