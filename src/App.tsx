import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* More routes will be added in FE-002 */}
    </Routes>
  );
}

export default App;
