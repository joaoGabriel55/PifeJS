import { Route, Routes } from "react-router";
import RoomsPage from "./pages/Rooms";
import RoomPage from "./pages/Room";
import MatchPage from "./pages/Match";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="rooms">
        <Route index element={<RoomsPage />} />
        <Route path=":id" element={<RoomPage />} />
      </Route>
      <Route path="rooms/:id/matches/:matchId" element={<MatchPage />} />
    </Routes>
  );
}
