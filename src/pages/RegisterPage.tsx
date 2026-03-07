import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import irisImage from "../assets/iris.png";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-iris-black flex flex-col">
      {/* Top bar */}
      <div className="border-b border-iris-purple px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={irisImage} alt="" width={80} />
          <span className="font-black text-xl tracking-tighter uppercase font-sans text-white">
            Iris
          </span>
        </Link>
        <Link
          to="/login"
          className="text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-iris-purple transition-colors"
        >
          Sign in →
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-iris-purple mb-3">
              Get started
            </p>
            <h1 className="text-4xl font-black tracking-tight uppercase font-sans text-white">
              Create account
            </h1>
            <p className="text-zinc-500 text-sm font-mono mt-2">
              Free. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                placeholder="Your name"
                className="w-full bg-iris-grey border border-zinc-800 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-iris-purple transition-colors placeholder-zinc-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-iris-grey border border-zinc-800 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-iris-purple transition-colors placeholder-zinc-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full bg-iris-grey border border-zinc-800 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-iris-purple transition-colors placeholder-zinc-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Confirm Passwrd
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full bg-iris-grey border border-zinc-800 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-iris-purple transition-colors placeholder-zinc-700"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono border border-red-900 bg-red-950/30 px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-iris-purple text-iris-black text-[11px] font-mono font-bold uppercase tracking-[0.15em] py-3 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-mono text-zinc-600">
            Already have an account?{" "}
            <Link to="/login" className="text-iris-purple hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
