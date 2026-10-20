import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Check,
  FileText,
  ListTodo,
  Pin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { TimeAgo } from "@/components/notes/time-ago";
import {
  listProgress,
  useNotes,
  wordCount,
  wordsLabel,
  type Note,
  type NoteKind,
} from "@/lib/notes";

export function NoteEditor({
  note,
  onBack,
  onCreate,
}: {
  note: Note | null;
  onBack: () => void;
  onCreate: (kind: NoteKind) => void;
}) {
  if (!note) {
    return <EmptyEditor onCreate={onCreate} />;
  }
  return <Editor note={note} onBack={onBack} />;
}

function EmptyEditor({ onCreate }: { onCreate: (kind: NoteKind) => void }) {
  return (
    <div className="flex h-full flex-col justify-center px-6">
      <div className="editor-in relative mx-auto w-full max-w-lg pl-6">
        <span className="absolute inset-y-0 left-0 w-px bg-accent" aria-hidden />
        <p className="text-sm font-medium text-accent">Margem</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-balance italic">
          A página em branco
        </h2>
        <p className="mt-3 max-w-sm text-pretty text-muted">
          Escolha uma nota na lista ou comece outra. Tudo fica neste aparelho.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCreate("text")}
            className="tap inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent"
          >
            <FileText className="size-4" strokeWidth={1.75} />
            Nova nota
          </button>
          <button
            type="button"
            onClick={() => onCreate("list")}
            className="tap inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink"
          >
            <ListTodo className="size-4" strokeWidth={1.75} />
            Nova lista
          </button>
        </div>
      </div>
    </div>
  );
}

function Editor({ note, onBack }: { note: Note; onBack: () => void }) {
  const notebooks = useNotes((state) => state.notebooks);
  const updateNote = useNotes((state) => state.updateNote);
  const deleteNote = useNotes((state) => state.deleteNote);
  const convertNote = useNotes((state) => state.convertNote);
  const addItem = useNotes((state) => state.addItem);
  const updateItem = useNotes((state) => state.updateItem);
  const toggleItem = useNotes((state) => state.toggleItem);
  const removeItem = useNotes((state) => state.removeItem);
  const [armed, setArmed] = useState(false);
  const titleRef = useAutosize(note.title);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const focusRef = useRef<string | null>(null);

  const openedId = useRef<string | null>(null);

  useEffect(() => {
    setArmed(false);
  }, [note.id]);

  useEffect(() => {
    if (!armed) return;
    const id = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(id);
  }, [armed]);

  useEffect(() => {
    if (openedId.current === note.id) return;
    openedId.current = note.id;
    const fresh =
      note.title === "" && note.body === "" && note.items.every((item) => item.text === "");
    if (fresh) titleRef.current?.focus();
  }, [note]);

  useLayoutEffect(() => {
    const id = focusRef.current;
    if (!id) return;
    const node = document.getElementById(`chk-${id}`);
    if (node instanceof HTMLInputElement) {
      node.focus();
      focusRef.current = null;
    }
  });

  const progress = listProgress(note);

  return (
    <div className="editor-in flex h-full min-h-0 flex-1 flex-col">
      <header className="safe-top flex items-center gap-1 px-2">
        <IconButton label="Voltar às notas" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="size-5" strokeWidth={1.75} />
        </IconButton>
        <div className="flex-1" />
        <IconButton
          label={note.pinned ? "Desafixar" : "Fixar"}
          active={note.pinned}
          onClick={() => {
            setArmed(false);
            updateNote(note.id, { pinned: !note.pinned });
          }}
        >
          <Pin className="size-5" strokeWidth={1.75} fill={note.pinned ? "currentColor" : "none"} />
        </IconButton>
        <IconButton
          label={note.kind === "text" ? "Transformar em lista" : "Transformar em texto"}
          onClick={() => {
            setArmed(false);
            convertNote(note.id);
          }}
        >
          {note.kind === "text" ? (
            <ListTodo className="size-5" strokeWidth={1.75} />
          ) : (
            <FileText className="size-5" strokeWidth={1.75} />
          )}
        </IconButton>
        <IconButton
          label={note.archived ? "Restaurar" : "Arquivar"}
          onClick={() => {
            setArmed(false);
            updateNote(note.id, { archived: !note.archived });
          }}
        >
          {note.archived ? (
            <ArchiveRestore className="size-5" strokeWidth={1.75} />
          ) : (
            <Archive className="size-5" strokeWidth={1.75} />
          )}
        </IconButton>
        {armed ? (
          <button
            type="button"
            onClick={() => deleteNote(note.id)}
            className="tap inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-on-accent"
          >
            Excluir
          </button>
        ) : (
          <IconButton label="Excluir" onClick={() => setArmed(true)}>
            <Trash2 className="size-5" strokeWidth={1.75} />
          </IconButton>
        )}
      </header>

      <div className="flex items-center justify-between gap-3 px-6 sm:px-10">
        <label className="relative min-w-0">
          <span className="sr-only">Caderno</span>
          <select
            value={note.notebookId}
            onChange={(event) => updateNote(note.id, { notebookId: event.target.value })}
            className="h-11 max-w-full appearance-none bg-transparent pr-6 text-base font-medium text-muted"
          >
            {notebooks.map((notebook) => (
              <option key={notebook.id} value={notebook.id}>
                {notebook.name}
              </option>
            ))}
          </select>
        </label>
        <p className="shrink-0 text-xs text-faint">
          Salvo · <TimeAgo timestamp={note.updatedAt} />
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="relative mx-auto w-full max-w-2xl px-6 pt-4 pb-16 sm:px-12 safe-bottom">
          <span className="pointer-events-none absolute top-0 bottom-0 left-3 w-px bg-accent sm:left-6" aria-hidden />
          {note.archived ? (
            <p className="mb-4 text-sm text-muted">No arquivo. Restaure para voltar à lista.</p>
          ) : null}
          <textarea
            ref={titleRef}
            rows={1}
            value={note.title}
            lang="pt-BR"
            placeholder="Sem título"
            aria-label="Título"
            onChange={(event) => updateNote(note.id, { title: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (note.kind === "text") bodyRef.current?.focus();
                else document.getElementById(`chk-${note.items[0]?.id}`)?.focus();
              }
            }}
            className="w-full resize-none bg-transparent font-serif text-3xl leading-tight text-ink outline-none placeholder:text-faint placeholder:italic sm:text-4xl"
          />

          {note.kind === "text" ? (
            <textarea
              ref={bodyRef}
              value={note.body}
              lang="pt-BR"
              placeholder="Comece a escrever…"
              aria-label="Nota"
              onChange={(event) => updateNote(note.id, { body: event.target.value })}
              className="mt-4 min-h-[50vh] w-full resize-none bg-transparent text-base leading-relaxed text-pretty text-ink outline-none placeholder:text-faint"
            />
          ) : (
            <div className="mt-4">
              {note.items.map((item) => (
                <div key={item.id} className="flex items-start gap-1">
                  <button
                    type="button"
                    aria-pressed={item.done}
                    aria-label={item.done ? "Marcar como pendente" : "Marcar como feito"}
                    onClick={() => toggleItem(note.id, item.id)}
                    className="tap mt-0.5 inline-flex size-11 shrink-0 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border",
                        item.done ? "border-accent bg-accent text-on-accent" : "border-line bg-page",
                      )}
                    >
                      {item.done ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                  </button>
                  <input
                    id={`chk-${item.id}`}
                    value={item.text}
                    lang="pt-BR"
                    placeholder="Item"
                    aria-label="Item da lista"
                    onChange={(event) => updateItem(note.id, item.id, event.target.value)}
                    onPaste={(event) => {
                      const text = event.clipboardData.getData("text");
                      if (!text.includes("\n")) return;
                      event.preventDefault();
                      const lines = text
                        .split(/\n/)
                        .map((line) => line.trim())
                        .filter(Boolean);
                      if (!lines.length) return;
                      updateItem(note.id, item.id, lines[0] ?? "");
                      let after = item.id;
                      for (const line of lines.slice(1)) {
                        const next = addItem(note.id, after, line);
                        if (next) after = next;
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        const next = addItem(note.id, item.id, "");
                        if (next) focusRef.current = next;
                      }
                      if (event.key === "Backspace" && item.text === "") {
                        event.preventDefault();
                        const index = note.items.findIndex((entry) => entry.id === item.id);
                        const prev = note.items[index - 1];
                        removeItem(note.id, item.id);
                        if (prev) focusRef.current = prev.id;
                      }
                    }}
                    className={cn(
                      "h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint",
                      item.done && "text-faint line-through",
                    )}
                  />
                  <button
                    type="button"
                    aria-label="Remover item"
                    onClick={() => removeItem(note.id, item.id)}
                    className="tap inline-flex size-11 shrink-0 items-center justify-center text-faint hover:text-ink"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const next = addItem(note.id);
                  if (next) focusRef.current = next;
                }}
                className="tap mt-1 inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted hover:text-ink"
              >
                <Plus className="size-4" strokeWidth={1.75} />
                Adicionar item
              </button>
            </div>
          )}

          <p className="mt-10 text-sm text-faint tabular-nums">
            {note.kind === "list"
              ? progress.total === 0
                ? "Nenhum item ainda"
                : `${progress.done} de ${progress.total} ${progress.total === 1 ? "feito" : "feitos"}`
              : wordsLabel(wordCount(note.body))}
          </p>
        </article>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  active,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "tap inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-raised hover:text-ink",
        active && "text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}

function useAutosize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);
  return ref;
}
