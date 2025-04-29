import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContatosCrud from './ContatosCrud';
import PublicContacts from './PublicContacts';
import FormSec from './conponents/Formsec';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#eee' }}>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <Link to="/">Admin</Link>
          </li>
          <li>
            <Link to="/public">Público</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ContatosCrud />} />
        <Route path="/public" element={<PublicContacts />} />
        <Route path="/secretaria" element={<FormSec />} />
      </Routes>
    </Router>
  );
}

export default App;
