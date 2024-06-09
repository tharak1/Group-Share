import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen/>}/>
          <Route path="/SignUp" element={<SignUpScreen/>}/>
          <Route path="/home" element={<HomeScreen/>}/>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
