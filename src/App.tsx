import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout';
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

function App() {
  return (
    <Router>
      <Layout>
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
          <Route path="/agendamentos/:id" element={<AgendamentoDetalhes />} />
          <Route path="/agendamentos/:id/editar" element={<EditarAgendamento />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/novo" element={<NovoCliente />} />
          <Route path="/clientes/:id" element={<ClienteDetalhes />} />
          <Route path="/clientes/:id/editar" element={<EditarCliente />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
