import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import NovoAgendamento from './pages/NovoAgendamento';
import AgendamentoDetalhes from './pages/AgendamentoDetalhes';
import EditarAgendamento from './pages/EditarAgendamento';
import Calendario from './pages/Calendario';
import Clientes from './pages/Clientes';
import NovoCliente from './pages/NovoCliente';
import ClienteDetalhes from './pages/ClienteDetalhes';
import EditarCliente from './pages/EditarCliente';
import Estoque from './pages/Estoque';
import Relatorios from './pages/Relatorios';
import ApiDocs from './pages/ApiDocs';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Login route - sem Layout (sem sidebar/header) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas autenticadas - com Layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/agendamentos" element={<Layout><Agendamentos /></Layout>} />
        <Route path="/agendamentos/novo" element={<Layout><NovoAgendamento /></Layout>} />
        <Route path="/agendamentos/:id" element={<Layout><AgendamentoDetalhes /></Layout>} />
        <Route path="/agendamentos/:id/editar" element={<Layout><EditarAgendamento /></Layout>} />
        <Route path="/calendario" element={<Layout><Calendario /></Layout>} />
        <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
        <Route path="/clientes/novo" element={<Layout><NovoCliente /></Layout>} />
        <Route path="/clientes/:id" element={<Layout><ClienteDetalhes /></Layout>} />
        <Route path="/clientes/:id/editar" element={<Layout><EditarCliente /></Layout>} />
        <Route path="/estoque" element={<Layout><Estoque /></Layout>} />
        <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
        <Route path="/api-docs" element={<Layout><ApiDocs /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
