import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Header from './components/Header.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="App">
            <Header />
      <h1>Welcome to BO Offroaders</h1>
    </div>
  );
}

export default App;
