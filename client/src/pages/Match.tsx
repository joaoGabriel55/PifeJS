import { useParams } from "react-router";
import { Match } from "../components/match/Match";

export default function MatchPage() {
  const { id, matchId } = useParams();

  return <Match id={matchId as string} roomId={id as string} />;
}
