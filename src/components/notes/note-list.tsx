import { Pin } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  FILTER_ARCHIVED,
  notebookName,
  noteMeta,
  notePreview,
  type Note,
  type Notebook,
} from "@/lib/notes";
import { TimeAgo } from "@/components/notes/time-ago";

export function NoteList({
  notes,
  notebooks,
  selectedId,
  query,
  filter,
  onSelect,
  onCreate,
}: {
  notes: Note[];
  notebooks: Notebook[];
  selectedId: string | null;
  query: string;
  filter: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  if (notes.length === 0) {
    const message = query.trim()
      ? `Nada para “${query.trim()}”.`
      : filter === FILTER_ARCHIVED
        ? "O arquivo está vazio."
        : "Nenhuma nota neste caderno.";
    return (
      <div className="px-5 py-12">
        <p className="font-serif text-2xl text-balance text-ink">{message}</p>
        {!query.trim() && filter !== FILTER_ARCHIVED ? (
          <button
            type="button"
            onClick={onCreate}
            className="tap mt-5 inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-on-accent"
          >
            Nova nota
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {notes.map((note) => {
        const selected = note.id === selectedId;
        const title = note.title.trim() || "Sem título";
        return (
          <button
            key={note.id}
            type="button"
            onClick={() => onSelect(note.id)}
            aria-label={`${title}${note.pinned ? ", fixada" : ""}`}
            className={cn(
              "note-rise relative w-full border-b border-line px-4 py-4 text-left",
              selected ? "bg-page" : "hover:bg-raised",
              selected && "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent",
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "font-serif text-xl leading-tight text-balance",
                  note.title.trim() ? "text-ink" : "text-faint italic",
                )}
              >
                {title}
              </span>
              {note.pinned ? (
                <Pin className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              ) : null}
            </span>
            <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-pretty text-muted">
              {notePreview(note)}
            </span>
            <span className="mt-2 flex items-center justify-between gap-3 text-xs text-faint">
              <span>{noteMeta(note, notebookName(notebooks, note.notebookId))}</span>
              <span className="shrink-0">
                <TimeAgo timestamp={note.updatedAt} />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
