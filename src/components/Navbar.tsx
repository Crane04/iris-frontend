import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import irisImage from "../assets/iris.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    closeMenu();
  };

  const navLinks = [
    { id: "workflow", label: "Workflow" },
    { id: "playground", label: "Playground" },
    { id: "docs", label: "Implementation" },
  ];

  return (
    <>
      <nav className="border-b border-iris-purple px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 bg-iris-black z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={scrollToTop}
        >
          <img src={irisImage} alt="" width={100} />
          <span className="font-black text-2xl tracking-tighter uppercase font-sans">
            Iris
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="hover:text-iris-purple transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-[10px] font-mono font-bold uppercase px-5 py-2 border border-zinc-700 text-zinc-400 hover:border-iris-purple hover:text-iris-purple transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-[10px] font-mono font-bold uppercase text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-iris-purple transition-colors px-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-iris-purple text-iris-black text-[10px] font-mono font-bold uppercase px-6 py-2 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all"
              >
                Get API Key
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 z-50"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-6 h-0.5 bg-iris-purple transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-iris-purple my-1.5 transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-iris-purple transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-iris-black/95 backdrop-blur-sm z-40 md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
          onClick={closeMenu}
        >
          <div
            className={`absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center space-y-10">
              {navLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-2xl font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-iris-purple transition-all duration-300 transform hover:scale-105"
                  onClick={closeMenu}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                  }}
                >
                  {link.label}
                </a>
              ))}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="text-2xl font-mono font-bold tracking-[0.2em] uppercase text-iris-purple"
                    style={{ transitionDelay: isMenuOpen ? `${navLinks.length * 100}ms` : "0ms" }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-mono font-bold tracking-[0.2em] uppercase text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-2xl font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-iris-purple transition-colors"
                    style={{ transitionDelay: isMenuOpen ? `${navLinks.length * 100}ms` : "0ms" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-4 bg-iris-purple text-iris-black text-sm font-mono font-bold uppercase px-8 py-3 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all duration-300"
                    style={{ transitionDelay: isMenuOpen ? `${(navLinks.length + 1) * 100}ms` : "0ms" }}
                  >
                    Get API Key
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
