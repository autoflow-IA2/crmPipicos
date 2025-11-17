import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Calendario from './pages/Calendario';
import Clientes from './pages/Clientes';
import Estoque from './pages/Estoque';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
