import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/notes";

export function TimeAgo({ timestamp }: { timestamp: number }) {
  const [label, setLabel] = useState("agora");

  useEffect(() => {
    const update = () => setLabel(timeAgo(timestamp));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [timestamp]);

  return <span className="tabular-nums">{label}</span>;
}
