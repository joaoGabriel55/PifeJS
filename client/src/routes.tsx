import { Route, Routes } from "react-router";
import RoomsPage from "./pages/Rooms";
import RoomPage from "./pages/Room";
import MatchPage from "./pages/Match";
import { ProtectedRoute } from "./context/auth/ProtectedRoute";
import LoginPage from "./pages/auth/Login";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="rooms">
        <Route
          index
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="rooms/:id/matches/:matchId"
        element={
          <ProtectedRoute>
            <MatchPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
