import TableView from "./TableView";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import './App.css'
import Homepage from "./Homepage"
import Navigation from "./Navigation"

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams
} from "react-router-dom";

function App() {
  return (
    <div className="app">
    <div className="bg-[url('coolbackground.png')] min-h-screen text-gray-900 bg-cover">
        <Navigation/>
        <main className="min-w-screen mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div>
                <Router>
                <div>
                <Routes>
                    <Route path="/about" element={<Homepage/>} />
                    <Route path="/" element={<TableView/>} />
                    {/* <Route path="/temp" element={<Temp />} /> */}
                </Routes>
                </div>
            </Router>
            </div>
        </main>
    </div>
    </div>

  );
}

export default App;