import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SystemLinks from './pages/SystemLinks';
import SystemInfo from './pages/SystemInfo';
import DockerManager from './pages/DockerManager';
import Settings from './pages/Settings';

function App() {
  const { darkMode } = useStore();

  useEffect(() => {
    // Initialize dark mode
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/links" element={<SystemLinks />} />
            <Route path="/system" element={<SystemInfo />} />
            <Route path="/docker" element={<DockerManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;