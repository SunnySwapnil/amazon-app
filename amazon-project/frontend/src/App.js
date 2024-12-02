import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import ReturnForm from './components/ReturnForm';
import DisputeCaseList from './components/DisputeCaseList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="home">
                  <h1>Welcome to Amazon App</h1>
                  <nav className="navbar">
                    <ul className="nav-list">
                      <li className="nav-item">
                        <Link to="/" className="nav-link">
                          Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/orders" className="nav-link">
                          Add Order
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/returns" className="nav-link">
                          Add Return
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/disputes" className="nav-link">
                          View Disputes
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              }
            />
            <Route path="/orders" element={<OrderForm />} />
            <Route path="/returns" element={<ReturnForm />} />
            <Route path="/disputes" element={<DisputeCaseList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
