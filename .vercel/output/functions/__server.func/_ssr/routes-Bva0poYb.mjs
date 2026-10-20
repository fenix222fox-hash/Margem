import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, c as Moon, d as Check, f as BookOpen, h as ArchiveRestore, i as Sun, l as ListTodo, m as Archive, o as Plus, p as ArrowLeft, r as Trash2, s as Pin, t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as formatDistanceToNow, t as ptBR } from "../_libs/date-fns.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bva0poYb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var FILTER_ARCHIVED = "archived";
var GERAL = {
	id: "geral",
	name: "Geral"
};
function uid() {
	return crypto.randomUUID();
}
function seedNotes(now) {
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
			createdAt: now - 3456e5,
			updatedAt: now - 108e4
		},
		{
			id: "seed-tasks",
			notebookId: "trabalho",
			title: "Pendências da semana",
			body: "",
			kind: "list",
			items: [
				{
					id: "seed-task-1",
					text: "Revisar o orçamento do projeto",
					done: true
				},
				{
					id: "seed-task-2",
					text: "Responder a Ana",
					done: false
				},
				{
					id: "seed-task-3",
					text: "Fechar a apresentação",
					done: false
				},
				{
					id: "seed-task-4",
					text: "Separar as notas da reunião",
					done: false
				}
			],
			pinned: false,
			archived: false,
			createdAt: now - 108e6,
			updatedAt: now - 3e6
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
			createdAt: now - 72e6,
			updatedAt: now - 216e5
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
			createdAt: now - 18e7,
			updatedAt: now - 936e5
		}
	];
}
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	document.documentElement.dataset.theme = theme;
}
var useNotes = create()(persist((set, get) => ({
	notebooks: [
		GERAL,
		{
			id: "pessoal",
			name: "Pessoal"
		},
		{
			id: "trabalho",
			name: "Trabalho"
		}
	],
	notes: seedNotes(Date.now()),
	theme: "dark",
	query: "",
	notebookFilter: "all",
	selectedId: null,
	setQuery: (query) => set({ query }),
	setNotebookFilter: (notebookFilter) => set({ notebookFilter }),
	setSelected: (selectedId) => set({ selectedId }),
	toggleTheme: () => set((state) => {
		const theme = state.theme === "dark" ? "light" : "dark";
		applyTheme(theme);
		return { theme };
	}),
	createNote: (kind) => {
		const id = uid();
		const filter = get().notebookFilter;
		const note = {
			id,
			notebookId: get().notebooks.some((notebook) => notebook.id === filter) ? filter : GERAL.id,
			title: "",
			body: "",
			kind,
			items: kind === "list" ? [{
				id: uid(),
				text: "",
				done: false
			}] : [],
			pinned: false,
			archived: false,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		set((state) => ({
			notes: [note, ...state.notes],
			selectedId: id,
			query: "",
			notebookFilter: filter === "archived" ? "all" : filter
		}));
		return id;
	},
	updateNote: (id, patch) => set((state) => ({ notes: state.notes.map((note) => note.id === id ? {
		...note,
		...patch,
		id: note.id,
		createdAt: note.createdAt,
		updatedAt: Date.now()
	} : note) })),
	deleteNote: (id) => set((state) => ({
		notes: state.notes.filter((note) => note.id !== id),
		selectedId: state.selectedId === id ? null : state.selectedId
	})),
	createNotebook: (raw) => {
		const name = raw.trim().slice(0, 28);
		if (!name) return null;
		const id = uid();
		set((state) => ({
			notebooks: [...state.notebooks, {
				id,
				name
			}],
			notebookFilter: id
		}));
		return id;
	},
	renameNotebook: (id, raw) => {
		const name = raw.trim().slice(0, 28);
		if (!name || id === GERAL.id) return;
		set((state) => ({ notebooks: state.notebooks.map((notebook) => notebook.id === id ? {
			...notebook,
			name
		} : notebook) }));
	},
	deleteNotebook: (id) => {
		if (id === GERAL.id) return;
		set((state) => ({
			notebooks: state.notebooks.filter((notebook) => notebook.id !== id),
			notes: state.notes.map((note) => note.notebookId === id ? {
				...note,
				notebookId: GERAL.id
			} : note),
			notebookFilter: state.notebookFilter === id ? "all" : state.notebookFilter
		}));
	},
	addItem: (noteId, afterId, text = "") => {
		const id = uid();
		let found = false;
		set((state) => ({ notes: state.notes.map((note) => {
			if (note.id !== noteId) return note;
			found = true;
			const items = [...note.items];
			const index = afterId ? items.findIndex((item) => item.id === afterId) : items.length - 1;
			items.splice(Math.max(index, -1) + 1, 0, {
				id,
				text,
				done: false
			});
			return {
				...note,
				items,
				updatedAt: Date.now()
			};
		}) }));
		return found ? id : null;
	},
	updateItem: (noteId, itemId, text) => set((state) => ({ notes: state.notes.map((note) => note.id === noteId ? {
		...note,
		updatedAt: Date.now(),
		items: note.items.map((item) => item.id === itemId ? {
			...item,
			text
		} : item)
	} : note) })),
	toggleItem: (noteId, itemId) => set((state) => ({ notes: state.notes.map((note) => note.id === noteId ? {
		...note,
		updatedAt: Date.now(),
		items: note.items.map((item) => item.id === itemId ? {
			...item,
			done: !item.done
		} : item)
	} : note) })),
	removeItem: (noteId, itemId) => set((state) => ({ notes: state.notes.map((note) => note.id === noteId ? {
		...note,
		updatedAt: Date.now(),
		items: note.items.filter((item) => item.id !== itemId)
	} : note) })),
	convertNote: (id) => set((state) => ({ notes: state.notes.map((note) => {
		if (note.id !== id) return note;
		if (note.kind === "text") {
			const lines = note.body.split("\n").map((line) => line.replace(/^\s*[•*\-]\s+/, "").trim()).filter(Boolean);
			const items = (lines.length ? lines : [""]).map((text) => ({
				id: uid(),
				text,
				done: false
			}));
			return {
				...note,
				kind: "list",
				items,
				body: "",
				updatedAt: Date.now()
			};
		}
		const body = note.items.filter((item) => item.text.trim()).map((item) => `${item.done ? "✓ " : ""}${item.text.trim()}`).join("\n");
		return {
			...note,
			kind: "text",
			body,
			items: [],
			updatedAt: Date.now()
		};
	}) }))
}), {
	name: "margem-notes",
	version: 1,
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
	partialize: (state) => ({
		notebooks: state.notebooks,
		notes: state.notes,
		theme: state.theme,
		notebookFilter: state.notebookFilter
	}),
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		if (!state.notebooks.some((notebook) => notebook.id === GERAL.id)) state.notebooks = [GERAL, ...state.notebooks];
		const known = new Set(state.notebooks.map((notebook) => notebook.id));
		if (state.notebookFilter !== "all" && state.notebookFilter !== "archived" && !known.has(state.notebookFilter)) state.notebookFilter = "all";
		applyTheme(state.theme === "light" ? "light" : "dark");
	}
}));
function normalize(value) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
function notePreview(note) {
	if (note.kind === "list") {
		const pending = note.items.find((item) => item.text.trim() && !item.done);
		if (pending) return pending.text.trim();
		if (note.items.some((item) => item.text.trim())) return "Tudo feito";
		return "Lista vazia";
	}
	return note.body.replace(/\s+/g, " ").trim() || "Nota vazia";
}
function listProgress(note) {
	const filled = note.items.filter((item) => item.text.trim());
	return {
		done: filled.filter((item) => item.done).length,
		total: filled.length
	};
}
function noteMeta(note, notebookName) {
	if (note.kind !== "list") return notebookName;
	const { done, total } = listProgress(note);
	if (!total) return `${notebookName} · lista`;
	return `${notebookName} · ${done}/${total}`;
}
function wordCount(body) {
	const trimmed = body.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
}
function wordsLabel(count) {
	return count === 1 ? "1 palavra" : `${count} palavras`;
}
function timeAgo(timestamp) {
	if (Date.now() - timestamp < 45e3) return "agora";
	return formatDistanceToNow(timestamp, {
		addSuffix: true,
		locale: ptBR
	});
}
function visibleNotes(notes, notebooks, query, filter) {
	const q = normalize(query.trim());
	return notes.filter((note) => {
		if (filter === "archived") {
			if (!note.archived) return false;
		} else if (note.archived) return false;
		else if (filter !== "all" && note.notebookId !== filter) return false;
		if (!q) return true;
		const notebook = notebooks.find((item) => item.id === note.notebookId)?.name ?? "";
		return normalize([
			note.title,
			note.body,
			notebook,
			...note.items.map((item) => item.text)
		].join("\n")).includes(q);
	}).sort((a, b) => {
		if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
		return b.updatedAt - a.updatedAt;
	});
}
function notebookName(notebooks, id) {
	return notebooks.find((notebook) => notebook.id === id)?.name ?? "Geral";
}
function NotebookBar() {
	const notebooks = useNotes((state) => state.notebooks);
	const filter = useNotes((state) => state.notebookFilter);
	const setFilter = useNotes((state) => state.setNotebookFilter);
	const createNotebook = useNotes((state) => state.createNotebook);
	const renameNotebook = useNotes((state) => state.renameNotebook);
	const deleteNotebook = useNotes((state) => state.deleteNotebook);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [renamingId, setRenamingId] = (0, import_react.useState)(null);
	const [armedId, setArmedId] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: filter === "all",
				onClick: () => setFilter("all"),
				children: "Todos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
				active: filter === FILTER_ARCHIVED,
				onClick: () => setFilter(FILTER_ARCHIVED),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Arquivo"]
			}),
			notebooks.map((notebook) => renamingId === notebook.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameField, {
				initial: notebook.name,
				label: "Renomear caderno",
				onCancel: () => setRenamingId(null),
				onCommit: (name) => {
					renameNotebook(notebook.id, name);
					setRenamingId(null);
				}
			}, notebook.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("inline-flex h-11 shrink-0 items-center rounded-full", filter === notebook.id ? "bg-ink text-page" : "bg-page text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (filter === notebook.id && notebook.id !== "geral") {
							setRenamingId(notebook.id);
							setArmedId(null);
							return;
						}
						setFilter(notebook.id);
						setArmedId(null);
					},
					className: "h-11 px-4 text-sm font-medium",
					title: filter === notebook.id && notebook.id !== "geral" ? "Toque de novo para renomear" : void 0,
					children: notebook.name
				}), filter === notebook.id && notebook.id !== "geral" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("tap inline-flex h-11 items-center pr-3 text-sm font-medium", armedId === notebook.id ? "text-accent" : "text-page"),
					"aria-label": armedId === notebook.id ? `Confirmar exclusão de ${notebook.name}` : `Excluir caderno ${notebook.name}`,
					onClick: () => {
						if (armedId === notebook.id) {
							deleteNotebook(notebook.id);
							setArmedId(null);
							return;
						}
						setArmedId(notebook.id);
					},
					children: armedId === notebook.id ? "Excluir" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						strokeWidth: 1.75
					})
				}) : null]
			}, notebook.id)),
			creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameField, {
				initial: "",
				placeholder: "Novo caderno",
				label: "Nome do caderno",
				onCancel: () => setCreating(false),
				onCommit: (name) => {
					if (name.trim()) createNotebook(name);
					setCreating(false);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				onClick: () => setCreating(true),
				label: "Novo caderno",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-4",
					strokeWidth: 1.75
				})
			})
		]
	});
}
function Chip({ active, onClick, children, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		"aria-label": label,
		onClick,
		className: cn("tap inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium", active ? "bg-ink text-page" : "bg-page text-muted hover:text-ink"),
		children
	});
}
function NameField({ initial, placeholder, label, onCommit, onCancel }) {
	const cancel = (0, import_react.useRef)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		autoFocus: true,
		defaultValue: initial,
		placeholder,
		maxLength: 28,
		"aria-label": label,
		onKeyDown: (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				cancel.current = true;
				onCancel();
			}
			if (event.key === "Enter") event.currentTarget.blur();
		},
		onBlur: (event) => {
			if (cancel.current) return;
			onCommit(event.target.value);
		},
		className: "h-11 w-40 shrink-0 rounded-full bg-ink px-4 text-base text-page outline-none placeholder:text-faint"
	});
}
function TimeAgo({ timestamp }) {
	const [label, setLabel] = (0, import_react.useState)("agora");
	(0, import_react.useEffect)(() => {
		const update = () => setLabel(timeAgo(timestamp));
		update();
		const id = window.setInterval(update, 3e4);
		return () => window.clearInterval(id);
	}, [timestamp]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums",
		children: label
	});
}
function NoteEditor({ note, onBack, onCreate }) {
	if (!note) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyEditor, { onCreate });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		note,
		onBack
	});
}
function EmptyEditor({ onCreate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full flex-col justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "editor-in relative mx-auto w-full max-w-lg pl-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-y-0 left-0 w-px bg-accent",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-accent",
					children: "Margem"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-serif text-4xl leading-tight text-balance italic",
					children: "A página em branco"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-sm text-pretty text-muted",
					children: "Escolha uma nota na lista ou comece outra. Tudo fica neste aparelho."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onCreate("text"),
						className: "tap inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "size-4",
							strokeWidth: 1.75
						}), "Nova nota"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onCreate("list"),
						className: "tap inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, {
							className: "size-4",
							strokeWidth: 1.75
						}), "Nova lista"]
					})]
				})
			]
		})
	});
}
function Editor({ note, onBack }) {
	const notebooks = useNotes((state) => state.notebooks);
	const updateNote = useNotes((state) => state.updateNote);
	const deleteNote = useNotes((state) => state.deleteNote);
	const convertNote = useNotes((state) => state.convertNote);
	const addItem = useNotes((state) => state.addItem);
	const updateItem = useNotes((state) => state.updateItem);
	const toggleItem = useNotes((state) => state.toggleItem);
	const removeItem = useNotes((state) => state.removeItem);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const titleRef = useAutosize(note.title);
	const bodyRef = (0, import_react.useRef)(null);
	const focusRef = (0, import_react.useRef)(null);
	const openedId = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setArmed(false);
	}, [note.id]);
	(0, import_react.useEffect)(() => {
		if (!armed) return;
		const id = window.setTimeout(() => setArmed(false), 4e3);
		return () => window.clearTimeout(id);
	}, [armed]);
	(0, import_react.useEffect)(() => {
		if (openedId.current === note.id) return;
		openedId.current = note.id;
		if (note.title === "" && note.body === "" && note.items.every((item) => item.text === "")) titleRef.current?.focus();
	}, [note]);
	(0, import_react.useLayoutEffect)(() => {
		const id = focusRef.current;
		if (!id) return;
		const node = document.getElementById(`chk-${id}`);
		if (node instanceof HTMLInputElement) {
			node.focus();
			focusRef.current = null;
		}
	});
	const progress = listProgress(note);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "editor-in flex h-full min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "safe-top flex items-center gap-1 px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Voltar às notas",
						onClick: onBack,
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: note.pinned ? "Desafixar" : "Fixar",
						active: note.pinned,
						onClick: () => {
							setArmed(false);
							updateNote(note.id, { pinned: !note.pinned });
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
							className: "size-5",
							strokeWidth: 1.75,
							fill: note.pinned ? "currentColor" : "none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: note.kind === "text" ? "Transformar em lista" : "Transformar em texto",
						onClick: () => {
							setArmed(false);
							convertNote(note.id);
						},
						children: note.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, {
							className: "size-5",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: note.archived ? "Restaurar" : "Arquivar",
						onClick: () => {
							setArmed(false);
							updateNote(note.id, { archived: !note.archived });
						},
						children: note.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, {
							className: "size-5",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					armed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => deleteNote(note.id),
						className: "tap inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-on-accent",
						children: "Excluir"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Excluir",
						onClick: () => setArmed(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "size-5",
							strokeWidth: 1.75
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 px-6 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "Caderno"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: note.notebookId,
						onChange: (event) => updateNote(note.id, { notebookId: event.target.value }),
						className: "h-11 max-w-full appearance-none bg-transparent pr-6 text-base font-medium text-muted",
						children: notebooks.map((notebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: notebook.id,
							children: notebook.name
						}, notebook.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "shrink-0 text-xs text-faint",
					children: ["Salvo · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeAgo, { timestamp: note.updatedAt })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "relative mx-auto w-full max-w-2xl px-6 pt-4 pb-16 sm:px-12 safe-bottom",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute top-0 bottom-0 left-3 w-px bg-accent sm:left-6",
							"aria-hidden": true
						}),
						note.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-sm text-muted",
							children: "No arquivo. Restaure para voltar à lista."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: titleRef,
							rows: 1,
							value: note.title,
							lang: "pt-BR",
							placeholder: "Sem título",
							"aria-label": "Título",
							onChange: (event) => updateNote(note.id, { title: event.target.value }),
							onKeyDown: (event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									if (note.kind === "text") bodyRef.current?.focus();
									else document.getElementById(`chk-${note.items[0]?.id}`)?.focus();
								}
							},
							className: "w-full resize-none bg-transparent font-serif text-3xl leading-tight text-ink outline-none placeholder:text-faint placeholder:italic sm:text-4xl"
						}),
						note.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: bodyRef,
							value: note.body,
							lang: "pt-BR",
							placeholder: "Comece a escrever…",
							"aria-label": "Nota",
							onChange: (event) => updateNote(note.id, { body: event.target.value }),
							className: "mt-4 min-h-[50vh] w-full resize-none bg-transparent text-base leading-relaxed text-pretty text-ink outline-none placeholder:text-faint"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [note.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": item.done,
										"aria-label": item.done ? "Marcar como pendente" : "Marcar como feito",
										onClick: () => toggleItem(note.id, item.id),
										className: "tap mt-0.5 inline-flex size-11 shrink-0 items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("flex size-5 items-center justify-center rounded-full border", item.done ? "border-accent bg-accent text-on-accent" : "border-line bg-page"),
											children: item.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "size-3",
												strokeWidth: 3
											}) : null
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: `chk-${item.id}`,
										value: item.text,
										lang: "pt-BR",
										placeholder: "Item",
										"aria-label": "Item da lista",
										onChange: (event) => updateItem(note.id, item.id, event.target.value),
										onPaste: (event) => {
											const text = event.clipboardData.getData("text");
											if (!text.includes("\n")) return;
											event.preventDefault();
											const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
											if (!lines.length) return;
											updateItem(note.id, item.id, lines[0] ?? "");
											let after = item.id;
											for (const line of lines.slice(1)) {
												const next = addItem(note.id, after, line);
												if (next) after = next;
											}
										},
										onKeyDown: (event) => {
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
										},
										className: cn("h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint", item.done && "text-faint line-through")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Remover item",
										onClick: () => removeItem(note.id, item.id),
										className: "tap inline-flex size-11 shrink-0 items-center justify-center text-faint hover:text-ink",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
											className: "size-4",
											strokeWidth: 1.75
										})
									})
								]
							}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const next = addItem(note.id);
									if (next) focusRef.current = next;
								},
								className: "tap mt-1 inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted hover:text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									strokeWidth: 1.75
								}), "Adicionar item"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-10 text-sm text-faint tabular-nums",
							children: note.kind === "list" ? progress.total === 0 ? "Nenhum item ainda" : `${progress.done} de ${progress.total} ${progress.total === 1 ? "feito" : "feitos"}` : wordsLabel(wordCount(note.body))
						})
					]
				})
			})
		]
	});
}
function IconButton({ label, onClick, active, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		onClick,
		className: cn("tap inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-raised hover:text-ink", active && "text-accent", className),
		children
	});
}
function useAutosize(value) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const element = ref.current;
		if (!element) return;
		element.style.height = "0px";
		element.style.height = `${element.scrollHeight}px`;
	}, [value]);
	return ref;
}
function NoteList({ notes, notebooks, selectedId, query, filter, onSelect, onCreate }) {
	if (notes.length === 0) {
		const message = query.trim() ? `Nada para “${query.trim()}”.` : filter === "archived" ? "O arquivo está vazio." : "Nenhuma nota neste caderno.";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-2xl text-balance text-ink",
				children: message
			}), !query.trim() && filter !== "archived" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onCreate,
				className: "tap mt-5 inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-on-accent",
				children: "Nova nota"
			}) : null]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col",
		children: notes.map((note) => {
			const selected = note.id === selectedId;
			const title = note.title.trim() || "Sem título";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(note.id),
				"aria-label": `${title}${note.pinned ? ", fixada" : ""}`,
				className: cn("note-rise relative w-full border-b border-line px-4 py-4 text-left", selected ? "bg-page" : "hover:bg-raised", selected && "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("font-serif text-xl leading-tight text-balance", note.title.trim() ? "text-ink" : "text-faint italic"),
							children: title
						}), note.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
							className: "mt-1 size-4 shrink-0 text-accent",
							strokeWidth: 1.75,
							"aria-hidden": true
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block line-clamp-2 text-sm leading-relaxed text-pretty text-muted",
						children: notePreview(note)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 flex items-center justify-between gap-3 text-xs text-faint",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: noteMeta(note, notebookName(notebooks, note.notebookId)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeAgo, { timestamp: note.updatedAt })
						})]
					})
				]
			}, note.id);
		})
	});
}
function NotesApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
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
	const [panel, setPanel] = (0, import_react.useState)("list");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	const booted = (0, import_react.useRef)(false);
	const visible = (0, import_react.useMemo)(() => visibleNotes(notes, notebooks, query, filter), [
		notes,
		notebooks,
		query,
		filter
	]);
	const selected = notes.find((note) => note.id === selectedId) ?? null;
	const activeCount = notes.filter((note) => !note.archived).length;
	(0, import_react.useEffect)(() => {
		if (booted.current) return;
		booted.current = true;
		if (selectedId) return;
		if (!window.matchMedia("(min-width: 1024px)").matches) return;
		const first = visibleNotes(useNotes.getState().notes, useNotes.getState().notebooks, useNotes.getState().query, useNotes.getState().notebookFilter)[0];
		if (!first) return;
		setSelected(first.id);
		setPanel("editor");
	}, [selectedId, setSelected]);
	(0, import_react.useEffect)(() => {
		if (!selectedId) setPanel("list");
	}, [selectedId]);
	(0, import_react.useEffect)(() => {
		if (!menu) return;
		const onPointer = (event) => {
			if (menuRef.current?.contains(event.target)) return;
			setMenu(false);
		};
		window.addEventListener("pointerdown", onPointer);
		return () => window.removeEventListener("pointerdown", onPointer);
	}, [menu]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			const typing = target && [
				"INPUT",
				"TEXTAREA",
				"SELECT"
			].includes(target.tagName);
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
	function openNew(kind) {
		createNote(kind);
		setPanel("editor");
		setMenu(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh overflow-hidden bg-page text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Notas",
			className: cn("h-full min-h-0 w-full shrink-0 flex-col bg-sheet lg:flex lg:w-80 lg:border-r lg:border-line xl:w-96", panel === "list" ? "flex" : "hidden lg:flex"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "safe-top px-4 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
								className: "size-5 text-accent",
								strokeWidth: 1.75,
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-2xl leading-none",
								children: "Margem"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-faint tabular-nums",
							children: [activeCount === 1 ? "1 nota" : `${activeCount} notas`, " neste aparelho"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {
								theme,
								onToggle: toggleTheme
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								ref: menuRef,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Nova nota",
									"aria-expanded": menu,
									"aria-haspopup": "menu",
									onClick: () => setMenu((open) => !open),
									className: "tap inline-flex size-11 items-center justify-center rounded-full bg-accent text-on-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										className: "size-5",
										strokeWidth: 1.75
									})
								}), menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "menu",
									className: "absolute top-full right-0 z-30 mt-1 w-44 rounded-2xl border border-line bg-raised p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "menuitem",
										onClick: () => openNew("text"),
										className: "tap flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-ink hover:bg-sheet",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											className: "size-4",
											strokeWidth: 1.75
										}), "Nota de texto"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "menuitem",
										onClick: () => openNew("list"),
										className: "tap flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-ink hover:bg-sheet",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, {
											className: "size-4",
											strokeWidth: 1.75
										}), "Lista"]
									})]
								}) : null]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint",
								strokeWidth: 1.75,
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Buscar nas notas",
								"aria-label": "Buscar nas notas",
								className: "h-12 w-full rounded-full bg-page pr-12 pl-11 text-base text-ink outline-none placeholder:text-faint"
							}),
							query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Limpar busca",
								onClick: () => setQuery(""),
								className: "tap absolute top-1/2 right-1 inline-flex size-11 -translate-y-1/2 items-center justify-center text-faint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									className: "size-4",
									strokeWidth: 1.75
								})
							}) : null
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteList, {
						notes: visible,
						notebooks,
						selectedId,
						query,
						filter,
						onSelect: (id) => {
							setSelected(id);
							setPanel("editor");
						},
						onCreate: () => openNew("text")
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: cn("h-full min-h-0 min-w-0 flex-1 flex-col bg-page", panel === "editor" ? "flex" : "hidden lg:flex"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only lg:hidden",
				children: "Margem"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteEditor, {
				note: selected,
				onBack: () => setPanel("list"),
				onCreate: openNew
			})]
		})]
	});
}
function ThemeButton({ theme, onToggle }) {
	const dark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-label": dark ? "Usar tema claro" : "Usar tema escuro",
		onClick: onToggle,
		className: "tap relative inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-raised hover:text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			className: cn("absolute size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", dark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
			strokeWidth: 1.75
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
			className: cn("size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", dark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
			strokeWidth: 1.75
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesApp, {});
}
//#endregion
export { Home as component };
