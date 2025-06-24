import logo from "./logo.svg";
import "./App.css";
import ButtonAppBar from "./components/AppBar";
import Entries from './components/Entries';

function App() {
  return (
    <div className="App">
      <ButtonAppBar></ButtonAppBar>      
      <Entries></Entries>
    </div>
  );
}

export default App;
