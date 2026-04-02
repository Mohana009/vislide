import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateSession from "./pages/CreateSession";
import JoinSession from "./pages/JoinSession";
import Welcome from "./pages/Welcome";
import SessionManage from "./pages/SessionManage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute role="teacher">
            <CreateSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join"
        element={
          <ProtectedRoute role="student">
            <JoinSession />
          </ProtectedRoute>
        }
      />
      <Route path="/welcome" element={<Welcome />} />
      <Route
        path="/manage/:code"
        element={
          <ProtectedRoute role="teacher">
            <SessionManage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
