import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Copy, Plus, Trash2, Eye, EyeOff, LogOut, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import backendUrl from "../constant";
import irisImage from "../assets/iris.png";
import Implementation from "../components/Implementation";

const api = axios.create({ baseURL: backendUrl, withCredentials: true });

interface ApiKey {
  _id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

interface NewKeyResult {
  key: string;
  id: string;
  name: string;
  prefix: string;
}

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-zinc-500 hover:text-iris-purple transition-colors p-1"
      title="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);

  // New key creation
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newKeyResult, setNewKeyResult] = useState<NewKeyResult | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);

  // Revoke confirmation
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const { data } = await api.get("/keys");
      setKeys(data.keys);
    } catch {
      // session expired — redirect
      navigate("/login");
    } finally {
      setKeysLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreateError("");
    setCreating(true);
    try {
      const { data } = await api.post("/keys", { name: newKeyName.trim() });
      setNewKeyResult(data);
      setShowNewKey(true);
      setNewKeyName("");
      // Refresh list
      fetchKeys();
    } catch (err: any) {
      setCreateError(err?.response?.data?.error ?? "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    try {
      await api.delete(`/keys/${id}`);
      setKeys((prev) => prev.filter((k) => k._id !== id));
    } catch {
      // ignore
    } finally {
      setRevoking(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-iris-black text-white">
      {/* Navbar */}
      <nav className="border-b border-iris-purple px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 bg-iris-black z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={irisImage} alt="" width={80} />
          <span className="font-black text-xl tracking-tighter uppercase font-sans">
            Iris
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-iris-purple transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Page header */}
        <div className="mb-12">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-iris-purple mb-3">
            Developer Dashboard
          </p>
          <h1 className="text-4xl font-black tracking-tight uppercase font-sans">
            API Keys
          </h1>
          <p className="text-zinc-500 text-sm font-mono mt-2 max-w-lg">
            Keys grant access to the Iris API. Include your key as the{" "}
            <code className="text-iris-purple">X-API-Key</code> header on every
            request.
          </p>
        </div>

        {/* New key revealed — shown immediately after creation */}
        {newKeyResult && (
          <div className="border border-iris-purple bg-iris-purple/5 p-5 mb-8">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-iris-purple mb-1">
              Key created — copy it now
            </p>
            <p className="text-xs font-mono text-zinc-400 mb-4">
              This key will not be shown again. Store it securely.
            </p>
            <div className="flex items-center gap-3 bg-iris-black border border-zinc-800 px-4 py-3">
              <code className="flex-1 font-mono text-xs text-white break-all select-all">
                {showNewKey
                  ? newKeyResult.key
                  : newKeyResult.key.slice(0, 12) + "•".repeat(40)}
              </code>
              <button
                onClick={() => setShowNewKey((v) => !v)}
                className="text-zinc-500 hover:text-iris-purple transition-colors p-1 shrink-0"
                title={showNewKey ? "Hide" : "Show"}
              >
                {showNewKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <CopyButton text={newKeyResult.key} />
            </div>
            <button
              onClick={() => setNewKeyResult(null)}
              className="mt-4 text-[10px] font-mono uppercase text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              I've saved it — dismiss
            </button>
          </div>
        )}

        {/* Create new key */}
        <div className="border border-zinc-800 p-6 mb-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
            Generate new key
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Key name (e.g. Production, My App)"
              maxLength={80}
              className="flex-1 bg-iris-grey border border-zinc-800 text-white font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-iris-purple transition-colors placeholder-zinc-700"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim()}
              className="flex items-center gap-2 bg-iris-purple text-iris-black text-[10px] font-mono font-bold uppercase px-5 py-2.5 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Plus size={13} />
              {creating ? "Creating..." : "Generate"}
            </button>
          </div>
          {createError && (
            <p className="mt-3 text-red-400 text-xs font-mono">{createError}</p>
          )}
        </div>

        {/* Keys list */}
        <div className="border border-zinc-800">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-500">
              Active keys
            </p>
            <span className="text-[10px] font-mono text-zinc-600">
              {keys.length} / 10
            </span>
          </div>

          {keysLoading ? (
            <div className="px-5 py-10 text-center text-zinc-600 text-xs font-mono">
              Loading...
            </div>
          ) : keys.length === 0 ? (
            <div className="px-5 py-10 text-center text-zinc-600 text-xs font-mono">
              No keys yet. Generate one above.
            </div>
          ) : (
            <ul>
              {keys.map((key, i) => (
                <li
                  key={key._id}
                  className={`px-5 py-4 flex items-center gap-4 ${
                    i < keys.length - 1 ? "border-b border-zinc-900" : ""
                  }`}
                >
                  {/* Key info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-sans font-bold text-white truncate">
                        {key.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-[11px] font-mono text-zinc-500">
                        {key.prefix}••••••••••••••••••
                      </code>
                      <CopyButton text={key.prefix} />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                    <span className="text-[10px] font-mono text-zinc-600">
                      Created {formatDate(key.createdAt)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-700">
                      Last used {formatDate(key.lastUsedAt)}
                    </span>
                  </div>

                  {/* Revoke */}
                  <button
                    onClick={() => handleRevoke(key._id)}
                    disabled={revoking === key._id}
                    title="Revoke key"
                    className="text-zinc-700 hover:text-red-400 transition-colors p-1 shrink-0 disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
<br />
        <Implementation tableOnly={true} />
      </main>
    </div>
  );
}
