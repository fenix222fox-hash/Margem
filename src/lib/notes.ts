import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NoteKind = "text" | "list";

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Note = {
  id: string;
  notebookId: string;
  title: string;
  body: string;
  kind: NoteKind;
  items: ChecklistItem[];
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Notebook = {
  id: string;
  name: string;
};

export type ThemeMode = "dark" | "light";

export const FILTER_ALL = "all";
export const FILTER_ARCHIVED = "archived";

const GERAL: Notebook = { id: "geral", name: "Geral" };

type NotePatch = Partial<Omit<Note, "id" | "createdAt">>;

type NotesState = {
  notebooks: Notebook[];
  notes: Note[];
  theme: ThemeMode;
  query: string;
  notebookFilter: string;
  selectedId: string | null;
  setQuery: (query: string) => void;
  setNotebookFilter: (filter: string) => void;
  setSelected: (id: string | null) => void;
  toggleTheme: () => void;
  createNote: (kind: NoteKind) => string;
  updateNote: (id: string, patch: NotePatch) => void;
  deleteNote: (id: string) => void;
  createNotebook: (name: string) => string | null;
  renameNotebook: (id: string, name: string) => void;
  deleteNotebook: (id: string) => void;
  addItem: (noteId: string, afterId?: string, text?: string) => string | null;
  updateItem: (noteId: string, itemId: string, text: string) => void;
  toggleItem: (noteId: string, itemId: string) => void;
  removeItem: (noteId: string, itemId: string) => void;
  convertNote: (id: string) => void;
};

function uid(): string {
  return crypto.randomUUID();
}

function seedNotes(now: number): Note[] {
  return [
    {
      id: "seed-welcome",
      notebookId: "geral",
      title: "Bem-vindo à Margem",
      body: "Este caderno fica neste aparelho. Sem conta, sem nuvem.\n\nToque em + para uma nota nova. Fixe o que precisa ficar no topo. Separe o resto em cadernos — Pessoal, Trabalho, ou um que você criar.\n\nListas servem para compras, pendências e viagens. A faixa laranja à esquerda é a margem: escreva do lado de dentro.",
      kind: "text",
      items: [],
      pinned: true,
      archived: false,
      createdAt: now - 1000 * 60 * 60 * 24 * 4,
      updatedAt: now - 1000 * 60 * 18,
    },
    {
      id: "seed-tasks",
      notebookId: "trabalho",
      title: "Pendências da semana",
      body: "",
      kind: "list",
      items: [
        { id: "seed-task-1", text: "Revisar o orçamento do projeto", done: true },
        { id: "seed-task-2", text: "Responder a Ana", done: false },
        { id: "seed-task-3", text: "Fechar a apresentação", done: false },
        { id: "seed-task-4", text: "Separar as notas da reunião", done: false },
      ],
      pinned: false,
      archived: false,
      createdAt: now - 1000 * 60 * 60 * 30,
      updatedAt: now - 1000 * 60 * 50,
    },
    {
      id: "seed-recipe",
      notebookId: "geral",
      title: "Pão de queijo",
      body: "250 g de polvilho azedo\n100 ml de leite\n40 ml de óleo\n1 ovo\n80 g de queijo meia-cura ralado\n1 colher de café de sal\n\nFerva o leite com o óleo e despeje sobre o polvilho, mexendo. Quando amornar, entre o ovo, o queijo e o sal. Enrole bolinhas e asse em forno quente até dourar.",
      kind: "text",
      items: [],
      pinned: false,
      archived: false,
      createdAt: now - 1000 * 60 * 60 * 20,
      updatedAt: now - 1000 * 60 * 60 * 6,
    },
    {
      id: "seed-sunday",
      notebookId: "pessoal",
      title: "Domingo sem pressa",
      body: "Café forte, janela aberta e nenhuma obrigação antes das onze.\n\nSe sobrar tarde: caminhar sem pressa, comprar fruta da estação e ligar para alguém que faz falta.",
      kind: "text",
      items: [],
      pinned: false,
      archived: false,
      createdAt: now - 1000 * 60 * 60 * 50,
      updatedAt: now - 1000 * 60 * 60 * 26,
    },
  ];
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export const useNotes = create<NotesState>()(
  persist(
    (set, get) => ({
      notebooks: [
        GERAL,
        { id: "pessoal", name: "Pessoal" },
        { id: "trabalho", name: "Trabalho" },
      ],
      notes: seedNotes(Date.now()),
      theme: "dark",
      query: "",
      notebookFilter: FILTER_ALL,
      selectedId: null,
      setQuery: (query) => set({ query }),
      setNotebookFilter: (notebookFilter) => set({ notebookFilter }),
      setSelected: (selectedId) => set({ selectedId }),
      toggleTheme: () =>
        set((state) => {
          const theme = state.theme === "dark" ? "light" : "dark";
          applyTheme(theme);
          return { theme };
        }),
      createNote: (kind) => {
        const id = uid();
        const filter = get().notebookFilter;
        const notebookId = get().notebooks.some((notebook) => notebook.id === filter)
          ? filter
          : GERAL.id;
        const note: Note = {
          id,
          notebookId,
          title: "",
          body: "",
          kind,
          items: kind === "list" ? [{ id: uid(), text: "", done: false }] : [],
          pinned: false,
          archived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [note, ...state.notes],
          selectedId: id,
          query: "",
          notebookFilter: filter === FILTER_ARCHIVED ? FILTER_ALL : filter,
        }));
        return id;
      },
      updateNote: (id, patch) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...patch,
                  id: note.id,
                  createdAt: note.createdAt,
                  updatedAt: Date.now(),
                }
              : note,
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        })),
      createNotebook: (raw) => {
        const name = raw.trim().slice(0, 28);
        if (!name) return null;
        const id = uid();
        set((state) => ({
          notebooks: [...state.notebooks, { id, name }],
          notebookFilter: id,
        }));
        return id;
      },
      renameNotebook: (id, raw) => {
        const name = raw.trim().slice(0, 28);
        if (!name || id === GERAL.id) return;
        set((state) => ({
          notebooks: state.notebooks.map((notebook) =>
            notebook.id === id ? { ...notebook, name } : notebook,
          ),
        }));
      },
      deleteNotebook: (id) => {
        if (id === GERAL.id) return;
        set((state) => ({
          notebooks: state.notebooks.filter((notebook) => notebook.id !== id),
          notes: state.notes.map((note) =>
            note.notebookId === id ? { ...note, notebookId: GERAL.id } : note,
          ),
          notebookFilter: state.notebookFilter === id ? FILTER_ALL : state.notebookFilter,
        }));
      },
      addItem: (noteId, afterId, text = "") => {
        const id = uid();
        let found = false;
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            found = true;
            const items = [...note.items];
            const index = afterId
              ? items.findIndex((item) => item.id === afterId)
              : items.length - 1;
            items.splice(Math.max(index, -1) + 1, 0, { id, text, done: false });
            return { ...note, items, updatedAt: Date.now() };
          }),
        }));
        return found ? id : null;
      },
      updateItem: (noteId, itemId, text) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  updatedAt: Date.now(),
                  items: note.items.map((item) =>
                    item.id === itemId ? { ...item, text } : item,
                  ),
                }
              : note,
          ),
        })),
      toggleItem: (noteId, itemId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  updatedAt: Date.now(),
                  items: note.items.map((item) =>
                    item.id === itemId ? { ...item, done: !item.done } : item,
                  ),
                }
              : note,
          ),
        })),
      removeItem: (noteId, itemId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  updatedAt: Date.now(),
                  items: note.items.filter((item) => item.id !== itemId),
                }
              : note,
          ),
        })),
      convertNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== id) return note;
            if (note.kind === "text") {
              const lines = note.body
                .split("\n")
                .map((line) => line.replace(/^\s*[•*\-]\s+/, "").trim())
                .filter(Boolean);
              const items = (lines.length ? lines : [""]).map((text) => ({
                id: uid(),
                text,
                done: false,
              }));
              return { ...note, kind: "list", items, body: "", updatedAt: Date.now() };
            }
            const body = note.items
              .filter((item) => item.text.trim())
              .map((item) => `${item.done ? "✓ " : ""}${item.text.trim()}`)
              .join("\n");
            return { ...note, kind: "text", body, items: [], updatedAt: Date.now() };
          }),
        })),
    }),
    {
      name: "margem-notes",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : localStorage,
      ),
      partialize: (state) => ({
        notebooks: state.notebooks,
        notes: state.notes,
        theme: state.theme,
        notebookFilter: state.notebookFilter,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.notebooks.some((notebook) => notebook.id === GERAL.id)) {
          state.notebooks = [GERAL, ...state.notebooks];
        }
        const known = new Set(state.notebooks.map((notebook) => notebook.id));
        if (
          state.notebookFilter !== FILTER_ALL &&
          state.notebookFilter !== FILTER_ARCHIVED &&
          !known.has(state.notebookFilter)
        ) {
          state.notebookFilter = FILTER_ALL;
        }
        applyTheme(state.theme === "light" ? "light" : "dark");
      },
    },
  ),
);

export function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function notePreview(note: Note): string {
  if (note.kind === "list") {
    const pending = note.items.find((item) => item.text.trim() && !item.done);
    if (pending) return pending.text.trim();
    if (note.items.some((item) => item.text.trim())) return "Tudo feito";
    return "Lista vazia";
  }
  const line = note.body.replace(/\s+/g, " ").trim();
  return line || "Nota vazia";
}

export function listProgress(note: Note): { done: number; total: number } {
  const filled = note.items.filter((item) => item.text.trim());
  return {
    done: filled.filter((item) => item.done).length,
    total: filled.length,
  };
}

export function noteMeta(note: Note, notebookName: string): string {
  if (note.kind !== "list") return notebookName;
  const { done, total } = listProgress(note);
  if (!total) return `${notebookName} · lista`;
  return `${notebookName} · ${done}/${total}`;
}

export function wordCount(body: string): number {
  const trimmed = body.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function wordsLabel(count: number): string {
  return count === 1 ? "1 palavra" : `${count} palavras`;
}

export function timeAgo(timestamp: number): string {
  if (Date.now() - timestamp < 45_000) return "agora";
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR });
}

export function visibleNotes(
  notes: Note[],
  notebooks: Notebook[],
  query: string,
  filter: string,
): Note[] {
  const q = normalize(query.trim());
  return notes
    .filter((note) => {
      if (filter === FILTER_ARCHIVED) {
        if (!note.archived) return false;
      } else if (note.archived) {
        return false;
      } else if (filter !== FILTER_ALL && note.notebookId !== filter) {
        return false;
      }
      if (!q) return true;
      const notebook = notebooks.find((item) => item.id === note.notebookId)?.name ?? "";
      const hay = [note.title, note.body, notebook, ...note.items.map((item) => item.text)].join(
        "\n",
      );
      return normalize(hay).includes(q);
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
}

export function notebookName(notebooks: Notebook[], id: string): string {
  return notebooks.find((notebook) => notebook.id === id)?.name ?? "Geral";
}
