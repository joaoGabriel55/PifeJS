import { useNavigate } from "react-router";
import { useMatch } from "../hooks/useMatch";
import { useRoom } from "../hooks/useRoom";

type RoomProps = {
  id: string;
};

export function Room({ id }: RoomProps) {
  const { room, isLoading, isError } = useRoom(id);
  const { createMatch } = useMatch();
  const navigate = useNavigate();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  const handleStartMatch = () => {
    const { id: matchId } = createMatch();

    navigate(`/rooms/${id}/matches/${matchId}`);
  };

  return (
    <>
      <h1>{room?.name}</h1>
      <p>ID: {room?.id}</p>

      <button onClick={handleStartMatch}>Start match</button>
    </>
  );
}
