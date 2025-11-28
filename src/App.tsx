import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth';
import { Layout } from './components/layout';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsqueciSenha from './pages/EsqueciSenha';
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
      <AuthProvider>
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
          {/* Rotas públicas - sem autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />

          {/* Rotas protegidas - requerem autenticação */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <PrivateRoute>
                <Layout><Agendamentos /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos/novo"
            element={
              <PrivateRoute>
                <Layout><NovoAgendamento /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos/:id"
            element={
              <PrivateRoute>
                <Layout><AgendamentoDetalhes /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos/:id/editar"
            element={
              <PrivateRoute>
                <Layout><EditarAgendamento /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/calendario"
            element={
              <PrivateRoute>
                <Layout><Calendario /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Layout><Clientes /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes/novo"
            element={
              <PrivateRoute>
                <Layout><NovoCliente /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes/:id"
            element={
              <PrivateRoute>
                <Layout><ClienteDetalhes /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes/:id/editar"
            element={
              <PrivateRoute>
                <Layout><EditarCliente /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/estoque"
            element={
              <PrivateRoute>
                <Layout><Estoque /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Layout><Relatorios /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/api-docs"
            element={
              <PrivateRoute>
                <Layout><ApiDocs /></Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
