"use client";

/**
 * Uses @xyflow/react (the current React Flow package).
 *
 *   pnpm add @xyflow/react
 *
 * It ships its own stylesheet. Import it once, globally — e.g. in
 * apps/web/app/layout.tsx — rather than inside this component:
 *
 *   import "@xyflow/react/dist/style.css";
 */

import React, { Suspense, useCallback, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import type { DragEvent } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import type { Node, Edge, Connection, NodeTypes, NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Calendar,
  ChevronDown,
  CheckSquare,
  Circle,
  Star,
  Upload,
  Eye,
  Trash2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { c } from "@/components/SideBar";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Field types                                                        */
/* ------------------------------------------------------------------ */

type FieldTypeKey =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "date"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "rating"
  | "file";

interface FieldTypeConfig {
  key: FieldTypeKey;
  icon: LucideIcon;
  label: string;
  defaultLabel: string;
  hasOptions: boolean;
  hasPlaceholder: boolean;
}

const fieldTypeConfigs: FieldTypeConfig[] = [
  { key: "text", icon: Type, label: "Text", defaultLabel: "Short answer", hasOptions: false, hasPlaceholder: true },
  { key: "textarea", icon: AlignLeft, label: "Textarea", defaultLabel: "Long answer", hasOptions: false, hasPlaceholder: true },
  { key: "email", icon: Mail, label: "Email", defaultLabel: "Email address", hasOptions: false, hasPlaceholder: true },
  { key: "number", icon: Hash, label: "Number", defaultLabel: "Number", hasOptions: false, hasPlaceholder: true },
  { key: "phone", icon: Phone, label: "Phone", defaultLabel: "Phone number", hasOptions: false, hasPlaceholder: true },
  { key: "date", icon: Calendar, label: "Date", defaultLabel: "Date", hasOptions: false, hasPlaceholder: false },
  { key: "dropdown", icon: ChevronDown, label: "Dropdown", defaultLabel: "Choose one", hasOptions: true, hasPlaceholder: false },
  { key: "checkbox", icon: CheckSquare, label: "Checkbox", defaultLabel: "Select all that apply", hasOptions: true, hasPlaceholder: false },
  { key: "radio", icon: Circle, label: "Radio", defaultLabel: "Pick one", hasOptions: true, hasPlaceholder: false },
  { key: "rating", icon: Star, label: "Rating", defaultLabel: "Rate your experience", hasOptions: false, hasPlaceholder: false },
  { key: "file", icon: Upload, label: "File Upload", defaultLabel: "Upload a file", hasOptions: false, hasPlaceholder: false },
];

const fieldTypeMap = new Map(fieldTypeConfigs.map((f) => [f.key, f]));

let idSeed = 0;
function genId(prefix: string): string {
  idSeed += 1;
  return `${prefix}-${Date.now()}-${idSeed}`;
}

/* ------------------------------------------------------------------ */
/*  Custom node — one form field on the canvas                         */
/* ------------------------------------------------------------------ */

interface FieldNodeData extends Record<string, unknown> {
  fieldType: FieldTypeKey;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

/** The full node shape, used to type NodeProps and the nodes array. */
type FormFieldNode = Node<FieldNodeData, "field">;

function FieldNode({ id, data, selected }: NodeProps<FormFieldNode>) {
  const config = fieldTypeMap.get(data.fieldType);
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div
      style={{
        borderColor: selected ? c.orange : c.border,
        backgroundColor: c.surface2,
        boxShadow: selected ? `0 0 0 3px rgba(255,90,31,0.15)` : "none",
      }}
      className="border rounded-lg w-[200px] px-3 py-2.5 transition-shadow"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: c.border, width: 8, height: 8, border: "none" }}
      />

      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={12} color={c.orange} className="shrink-0" />
        <span
          style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }}
          className="text-[10px] uppercase tracking-wide truncate"
        >
          {config.label}
        </span>
      </div>

      <p style={{ color: c.text }} className="text-sm font-medium leading-snug break-words">
        {data.label}
        {data.required && <span style={{ color: c.orange }}> *</span>}
      </p>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: c.orange, width: 8, height: 8, border: "none" }}
      />
    </div>
  );
}

const nodeTypes: NodeTypes = { field: FieldNode };

/* ------------------------------------------------------------------ */
/*  Starting canvas — a small demo flow so the page isn't blank         */
/* ------------------------------------------------------------------ */

const emptyNodes: FormFieldNode[] = [];
const emptyEdges: Edge[] = [];

/* ------------------------------------------------------------------ */
/*  Left panel — draggable field palette                               */
/* ------------------------------------------------------------------ */

function Palette() {
  const onDragStart = (event: DragEvent<HTMLButtonElement>, fieldType: FieldTypeKey) => {
    event.dataTransfer.setData("application/formforge-field", fieldType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{ borderColor: c.border, backgroundColor: c.surface }}
      className="hidden lg:flex flex-col w-56 shrink-0 border-r h-full overflow-y-auto px-4 py-5"
    >
      <p style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }} className="text-xs mb-3">
        FIELD TYPES
      </p>
      <div className="flex flex-col gap-1.5">
        {fieldTypeConfigs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            draggable
            onDragStart={(e) => onDragStart(e, key)}
            style={{ borderColor: c.border, backgroundColor: c.surface2, color: c.text }}
            className="flex items-center gap-2.5 border rounded-md px-3 py-2 text-sm cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors text-left"
          >
            <Icon size={15} color={c.orange} />
            {label}
          </button>
        ))}
      </div>
      <p style={{ color: c.muted }} className="text-xs mt-5 leading-relaxed">
        Drag a field onto the canvas, then connect it to the next step.
      </p>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Right panel — properties editor for the selected field             */
/* ------------------------------------------------------------------ */

interface PropertiesPanelProps {
  node: FormFieldNode | undefined;
  onChange: (patch: Partial<FieldNodeData>) => void;
  onDelete: () => void;
}

function PropertiesPanel({ node, onChange, onDelete }: PropertiesPanelProps) {
  if (!node) {
    return (
      <aside
        style={{ borderColor: c.border, backgroundColor: c.surface }}
        className="hidden xl:flex flex-col w-72 shrink-0 border-l h-full items-center justify-center px-6 text-center"
      >
        <p style={{ color: c.muted }} className="text-sm">
          Select a field on the canvas to edit its properties.
        </p>
      </aside>
    );
  }

  const config = fieldTypeMap.get(node.data.fieldType)!;
  const options = node.data.options ?? [];

  const updateOption = (idx: number, value: string) => {
    onChange({ options: options.map((o, i) => (i === idx ? value : o)) });
  };
  const addOption = () => onChange({ options: [...options, `Option ${options.length + 1}`] });
  const removeOption = (idx: number) => onChange({ options: options.filter((_, i) => i !== idx) });

  return (
    <aside
      style={{ borderColor: c.border, backgroundColor: c.surface }}
      className="hidden xl:flex flex-col w-72 shrink-0 border-l h-full overflow-y-auto px-5 py-5"
    >
      <div className="flex items-center gap-1.5 mb-5">
        <config.icon size={14} color={c.orange} />
        <span style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }} className="text-xs uppercase tracking-wide">
          {config.label} field
        </span>
      </div>

      <label style={{ color: c.muted }} className="text-xs font-medium block mb-1.5">
        Label
      </label>
      <input
        value={node.data.label}
        onChange={(e) => onChange({ label: e.target.value })}
        style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
        className="w-full border rounded-md px-3 py-2 text-sm mb-4"
      />

      {config.hasPlaceholder && (
        <>
          <label style={{ color: c.muted }} className="text-xs font-medium block mb-1.5">
            Placeholder
          </label>
          <input
            value={node.data.placeholder ?? ""}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
            className="w-full border rounded-md px-3 py-2 text-sm mb-4"
          />
        </>
      )}

      {config.hasOptions && (
        <div className="mb-4">
          <label style={{ color: c.muted }} className="text-xs font-medium block mb-1.5">
            Options
          </label>
          <div className="flex flex-col gap-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
                  className="flex-1 min-w-0 border rounded-md px-2.5 py-1.5 text-sm"
                />
                <button onClick={() => removeOption(idx)} aria-label="Remove option" className="shrink-0">
                  <X size={14} color={c.muted} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            style={{ color: c.orange }}
            className="flex items-center gap-1.5 text-xs font-medium mt-2.5 hover:opacity-80 transition-opacity"
          >
            <Plus size={13} />
            Add option
          </button>
        </div>
      )}

      <label className="flex items-center justify-between mb-6 cursor-pointer">
        <span style={{ color: c.text }} className="text-sm font-medium">
          Required field
        </span>
        <button
          role="switch"
          aria-checked={node.data.required}
          onClick={() => onChange({ required: !node.data.required })}
          style={{ backgroundColor: node.data.required ? c.orange : c.border }}
          className="w-9 h-5 rounded-full relative transition-colors shrink-0"
        >
          <span
            style={{ backgroundColor: "#0A0A0B", left: node.data.required ? 18 : 3 }}
            className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          />
        </button>
      </label>

      <button
        onClick={onDelete}
        style={{ borderColor: c.border, color: "#F87171" }}
        className="w-full flex items-center justify-center gap-1.5 border rounded-md py-2 text-sm font-medium hover:bg-white/5 transition-colors"
      >
        <Trash2 size={14} />
        Delete field
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas + top bar                                                   */
/* ------------------------------------------------------------------ */

function BuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");
  const creatingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FormFieldNode>(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>("Untitled form");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const { screenToFlowPosition } = useReactFlow();
  const utils = trpc.useUtils();

  const formQuery = trpc.form.get.useQuery(
    { id: formId! },
    { enabled: !!formId },
  );

  const createForm = trpc.form.create.useMutation({
    onSuccess: ({ id }) => {
      router.replace(`/create-form?id=${id}`);
    },
  });

  const updateForm = trpc.form.update.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      utils.form.list.invalidate();
    },
    onError: () => setSaveStatus("error"),
  });

  const publishForm = trpc.form.publish.useMutation({
    onSuccess: () => {
      setStatus("published");
      utils.form.list.invalidate();
      utils.form.get.invalidate({ id: formId! });
    },
  });

  useEffect(() => {
    if (!formId && !creatingRef.current) {
      creatingRef.current = true;
      createForm.mutate({ name: "Untitled form" });
    }
  }, [formId]);

  useEffect(() => {
    if (!formQuery.data || hydrated) return;

    setFormName(formQuery.data.form.name);
    setStatus(formQuery.data.form.status as "draft" | "published");
    setNodes((formQuery.data.version?.nodes as FormFieldNode[]) ?? []);
    setEdges((formQuery.data.version?.edges as Edge[]) ?? []);
    setHydrated(true);
  }, [formQuery.data, hydrated, setNodes, setEdges]);

  useEffect(() => {
    if (!formId || !hydrated) return;

    setSaveStatus("saving");
    const timer = setTimeout(() => {
      updateForm.mutate({
        id: formId,
        name: formName,
        nodes,
        edges,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [formId, formName, nodes, edges, hydrated]);

  const isLoading =
    !formId || createForm.isPending || (formQuery.isLoading && !hydrated);

  // Keep edges in sync when a node is removed (canvas delete key, panel delete, etc.)
  useEffect(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    setEdges((eds) => eds.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target)));
  }, [nodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const fieldType = event.dataTransfer.getData("application/formforge-field") as FieldTypeKey;
      const config = fieldTypeMap.get(fieldType);
      if (!config) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: FormFieldNode = {
        id: genId("field"),
        type: "field",
        position,
        data: {
          fieldType,
          label: config.defaultLabel,
          required: false,
          placeholder: config.hasPlaceholder ? "" : undefined,
          options: config.hasOptions ? ["Option 1", "Option 2"] : undefined,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedId(newNode.id);
    },
    [screenToFlowPosition, setNodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedId);

  const updateSelectedField = useCallback(
    (patch: Partial<FieldNodeData>) => {
      if (!selectedId) return;
      setNodes((nds) => nds.map((n) => (n.id === selectedId ? { ...n, data: { ...n.data, ...patch } } : n)));
    },
    [selectedId, setNodes]
  );

  const deleteSelectedField = useCallback(() => {
    if (!selectedId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes]);

  if (isLoading) {
    return (
      <div
        style={{ backgroundColor: c.bg }}
        className="w-full h-screen flex items-center justify-center"
      >
        <Loader2 size={32} color={c.orange} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: c.bg }} className="w-full h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', sans-serif; }
        input:focus, button:focus-visible, a:focus-visible { outline: 2px solid ${c.orange}; outline-offset: 2px; }

        .react-flow__attribution { display: none; }
        .react-flow__edge-path { stroke: ${c.border}; stroke-width: 1.5; }
        .react-flow__edge.selected .react-flow__edge-path,
        .react-flow__edge:hover .react-flow__edge-path { stroke: ${c.orange}; }
        .react-flow__connectionline path { stroke: ${c.orange}; stroke-width: 1.5; }
        .react-flow__controls { background: ${c.surface}; border: 1px solid ${c.border}; border-radius: 8px; overflow: hidden; box-shadow: none; }
        .react-flow__controls-button { background: ${c.surface}; border-bottom: 1px solid ${c.border}; fill: ${c.text}; stroke: ${c.text}; }
        .react-flow__controls-button:hover { background: ${c.surface2}; }
        .react-flow__minimap { background: ${c.surface}; border: 1px solid ${c.border}; border-radius: 8px; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderColor: c.border }} className="flex items-center justify-between border-b px-5 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="dashboard" aria-label="Back to forms" className="p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0">
            <ArrowLeft size={16} color={c.muted} />
          </Link>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }}
            className="bg-transparent text-base font-medium min-w-0 w-56 focus:outline-none"
            aria-label="Form name"
          />
          <button
            onClick={() => setStatus((s) => (s === "draft" ? "published" : "draft"))}
            style={{
              color: status === "published" ? "#4ADE80" : c.amber,
              backgroundColor: status === "published" ? "rgba(74,222,128,0.1)" : "rgba(255,165,61,0.1)",
            }}
            className="text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0"
          >
            {status}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span style={{ color: c.muted }} className="text-xs hidden sm:inline mr-1">
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "error"
                ? "Save failed"
                : "Saved"}
          </span>
          <button
            style={{ borderColor: c.border, color: c.text }}
            className="flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => formId && publishForm.mutate({ id: formId })}
            disabled={!formId || publishForm.isPending}
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="rounded-md px-4 py-1.5 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
          >
            {publishForm.isPending ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Palette + canvas + properties */}
      <div className="flex flex-1 min-h-0">
        <Palette />

        <div ref={wrapperRef} className="flex-1 min-w-0" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(null)}
            deleteKeyCode={["Backspace", "Delete"]}
            fitView
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: "smoothstep" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={c.border} style={{ backgroundColor: c.bg }} />
            <Controls showInteractive={false} position="bottom-left" />
            <MiniMap
              position="bottom-right"
              maskColor="rgba(10,10,11,0.7)"
              nodeColor={() => c.surface2}
              nodeStrokeColor={() => c.border}
              nodeBorderRadius={4}
            />
          </ReactFlow>
        </div>

        <PropertiesPanel node={selectedNode} onChange={updateSelectedField} onDelete={deleteSelectedField} />
      </div>
    </div>
  );
}

function CreateFormPage() {
  return (
    <ReactFlowProvider>
      <BuilderInner />
    </ReactFlowProvider>
  );
}

export default function FormForgeCreateForm() {
  return (
    <Suspense
      fallback={
        <div
          style={{ backgroundColor: c.bg }}
          className="w-full h-screen flex items-center justify-center"
        >
          <Loader2 size={32} color={c.orange} className="animate-spin" />
        </div>
      }
    >
      <CreateFormPage />
    </Suspense>
  );
}