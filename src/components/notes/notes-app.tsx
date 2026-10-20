import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, FileText, ListTodo, Moon, Plus, Search, Sun, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotes, visibleNotes } from "@/lib/notes";
import { NotebookBar } from "@/components/notes/notebook-bar";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteList } from "@/components/notes/note-list";

export function NotesApp() {
  return <Shell />;
}

function Shell() {
  const notebooks = useNotes((state) => state.notebooks);
  const notes = useNotes((state) => state.notes);
  const query = useNotes((state) => state.query);
  const filter = useNotes((state) => state.notebookFilter);
  const selectedId = useNotes((state) => state.selectedId);
  const theme = useNotes((state) => state.theme);
  const setQuery = useNotes((state) => state.setQuery);
  const setSelected = useNotes((state) => state.setSelected);
  const toggleTheme = useNotes((state) => state.toggleTheme);
  const createNote = useNotes((state) => state.createNote);
  const [panel, setPanel] = useState<"list" | "editor">("list");
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const visible = useMemo(
    () => visibleNotes(notes, notebooks, query, filter),
    [notes, notebooks, query, filter],
  );
  const selected = notes.find((note) => note.id === selectedId) ?? null;
  const activeCount = notes.filter((note) => !note.archived).length;

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (selectedId) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const first = visibleNotes(
      useNotes.getState().notes,
      useNotes.getState().notebooks,
      useNotes.getState().query,
      useNotes.getState().notebookFilter,
    )[0];
    if (!first) return;
    setSelected(first.id);
    setPanel("editor");
  }, [selectedId, setSelected]);

  useEffect(() => {
    if (!selectedId) setPanel("list");
  }, [selectedId]);

  useEffect(() => {
    if (!menu) return;
    const onPointer = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMenu(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [menu]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        createNote("text");
        setPanel("editor");
        setMenu(false);
      }
      if (event.key === "Escape" && !typing) setPanel("list");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createNote]);

  function openNew(kind: "text" | "list") {
    createNote(kind);
    setPanel("editor");
    setMenu(false);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-page text-ink">
      <nav
        aria-label="Notas"
        className={cn(
          "h-full min-h-0 w-full shrink-0 flex-col bg-sheet lg:flex lg:w-80 lg:border-r lg:border-line xl:w-96",
          panel === "list" ? "flex" : "hidden lg:flex",
        )}
      >
        <header className="safe-top px-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-accent" strokeWidth={1.75} aria-hidden />
                <h1 className="font-serif text-2xl leading-none">Margem</h1>
              </div>
              <p className="mt-1 text-xs text-faint tabular-nums">
                {activeCount === 1 ? "1 nota" : `${activeCount} notas`} neste aparelho
              </p>
            </div>
            <div className="flex items-center">
              <ThemeButton theme={theme} onToggle={toggleTheme} />
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Nova nota"
                  aria-expanded={menu}
                  aria-haspopup="menu"
                  onClick={() => setMenu((open) => !open)}
                  className="tap inline-flex size-11 items-center justify-center rounded-full bg-accent text-on-accent"
                >
                  <Plus className="size-5" strokeWidth={1.75} />
                </button>
                {menu ? (
                  <div
                    role="menu"
                    className="absolute top-full right-0 z-30 mt-1 w-44 rounded-2xl border border-line bg-raised p-1"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => openNew("text")}
                      className="tap flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-ink hover:bg-sheet"
                    >
                      <FileText className="size-4" strokeWidth={1.75} />
                      Nota de texto
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => openNew("list")}
                      className="tap flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-ink hover:bg-sheet"
                    >
                      <ListTodo className="size-4" strokeWidth={1.75} />
                      Lista
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar nas notas"
              aria-label="Buscar nas notas"
              className="h-12 w-full rounded-full bg-page pr-12 pl-11 text-base text-ink outline-none placeholder:text-faint"
            />
            {query ? (
              <button
                type="button"
                aria-label="Limpar busca"
                onClick={() => setQuery("")}
                className="tap absolute top-1/2 right-1 inline-flex size-11 -translate-y-1/2 items-center justify-center text-faint"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        </div>

        <NotebookBar />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <NoteList
            notes={visible}
            notebooks={notebooks}
            selectedId={selectedId}
            query={query}
            filter={filter}
            onSelect={(id) => {
              setSelected(id);
              setPanel("editor");
            }}
            onCreate={() => openNew("text")}
          />
        </div>
      </nav>

      <main
        className={cn(
          "h-full min-h-0 min-w-0 flex-1 flex-col bg-page",
          panel === "editor" ? "flex" : "hidden lg:flex",
        )}
      >
        <h1 className="sr-only lg:hidden">Margem</h1>
        <NoteEditor
          note={selected}
          onBack={() => setPanel("list")}
          onCreate={openNew}
        />
      </main>
    </div>
  );
}

function ThemeButton({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
      onClick={onToggle}
      className="tap relative inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-raised hover:text-ink"
    >
      <Sun
        className={cn(
          "absolute size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          dark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
        )}
        strokeWidth={1.75}
      />
      <Moon
        className={cn(
          "size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          dark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
