import { useRef, useState, type ReactNode } from "react";
import { Archive, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { FILTER_ALL, FILTER_ARCHIVED, useNotes } from "@/lib/notes";

export function NotebookBar() {
  const notebooks = useNotes((state) => state.notebooks);
  const filter = useNotes((state) => state.notebookFilter);
  const setFilter = useNotes((state) => state.setNotebookFilter);
  const createNotebook = useNotes((state) => state.createNotebook);
  const renameNotebook = useNotes((state) => state.renameNotebook);
  const deleteNotebook = useNotes((state) => state.deleteNotebook);
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [armedId, setArmedId] = useState<string | null>(null);

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      <Chip active={filter === FILTER_ALL} onClick={() => setFilter(FILTER_ALL)}>
        Todos
      </Chip>
      <Chip active={filter === FILTER_ARCHIVED} onClick={() => setFilter(FILTER_ARCHIVED)}>
        <Archive className="size-4" strokeWidth={1.75} />
        Arquivo
      </Chip>
      {notebooks.map((notebook) =>
        renamingId === notebook.id ? (
          <NameField
            key={notebook.id}
            initial={notebook.name}
            label="Renomear caderno"
            onCancel={() => setRenamingId(null)}
            onCommit={(name) => {
              renameNotebook(notebook.id, name);
              setRenamingId(null);
            }}
          />
        ) : (
          <span
            key={notebook.id}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-full",
              filter === notebook.id ? "bg-ink text-page" : "bg-page text-muted",
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (filter === notebook.id && notebook.id !== "geral") {
                  setRenamingId(notebook.id);
                  setArmedId(null);
                  return;
                }
                setFilter(notebook.id);
                setArmedId(null);
              }}
              className="h-11 px-4 text-sm font-medium"
              title={
                filter === notebook.id && notebook.id !== "geral"
                  ? "Toque de novo para renomear"
                  : undefined
              }
            >
              {notebook.name}
            </button>
            {filter === notebook.id && notebook.id !== "geral" ? (
              <button
                type="button"
                className={cn(
                  "tap inline-flex h-11 items-center pr-3 text-sm font-medium",
                  armedId === notebook.id ? "text-accent" : "text-page",
                )}
                aria-label={
                  armedId === notebook.id
                    ? `Confirmar exclusão de ${notebook.name}`
                    : `Excluir caderno ${notebook.name}`
                }
                onClick={() => {
                  if (armedId === notebook.id) {
                    deleteNotebook(notebook.id);
                    setArmedId(null);
                    return;
                  }
                  setArmedId(notebook.id);
                }}
              >
                {armedId === notebook.id ? "Excluir" : <X className="size-4" strokeWidth={1.75} />}
              </button>
            ) : null}
          </span>
        ),
      )}
      {creating ? (
        <NameField
          initial=""
          placeholder="Novo caderno"
          label="Nome do caderno"
          onCancel={() => setCreating(false)}
          onCommit={(name) => {
            if (name.trim()) createNotebook(name);
            setCreating(false);
          }}
        />
      ) : (
        <Chip onClick={() => setCreating(true)} label="Novo caderno">
          <Plus className="size-4" strokeWidth={1.75} />
        </Chip>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "tap inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium",
        active ? "bg-ink text-page" : "bg-page text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function NameField({
  initial,
  placeholder,
  label,
  onCommit,
  onCancel,
}: {
  initial: string;
  placeholder?: string;
  label: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}) {
  const cancel = useRef(false);
  return (
    <input
      autoFocus
      defaultValue={initial}
      placeholder={placeholder}
      maxLength={28}
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          cancel.current = true;
          onCancel();
        }
        if (event.key === "Enter") event.currentTarget.blur();
      }}
      onBlur={(event) => {
        if (cancel.current) return;
        onCommit(event.target.value);
      }}
      className="h-11 w-40 shrink-0 rounded-full bg-ink px-4 text-base text-page outline-none placeholder:text-faint"
    />
  );
}
