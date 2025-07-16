import { useMatch } from "../hooks/useMatch";
import { useRoom } from "../hooks/useRoom";

type RoomProps = {
  id: string;
};

export function Room({ id }: RoomProps) {
  const { room, isLoading, isError } = useRoom(id);
  const { matchesQuery } = useMatch(id);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  return (
    <>
      <h1>Room {room?.id}</h1>
      <p>ID: {room?.id}</p>

      {matchesQuery.isLoading && <p>Loading matches...</p>}
      {matchesQuery.isError && <p>Error loading matches</p>}
      {matchesQuery.data && matchesQuery.data.length > 0 ? (
        <ul>
          {matchesQuery.data.map((match: any) => (
            <li key={match.id}>
              <a href={`/rooms/${id}/matches/${match.id}`}>
                Match ID: {match.id}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </>
  );
}
