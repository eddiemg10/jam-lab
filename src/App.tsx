import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/login";
import NotFound from "./pages/404";
import Home from "./pages/home";
import ProtectedRoutes from "./components/utils/protectedRoutes";
import Authenticate from "./components/utils/authenticate";

function App() {
  return (
    <div className="lg:px-20 md:px-10 px-5">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
