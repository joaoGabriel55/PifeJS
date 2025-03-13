import { TCard, CardDisplay } from "./CardDisplay";

type CardProps = {
  card: TCard;
};

export function Card({ card }: CardProps) {
  return (
    <div>
      <CardDisplay {...card} />
    </div>
  );
}
