import irisImage from "../assets/iris.png";
import { Github, Mail, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-iris-purple bg-iris-black text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={irisImage} alt="" width={100} />
          <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase">
            Iris Biometric Infrastructure — v1.0.0
          </span>
        </div>

        <div className="flex gap-6">
          <a
            href="https://github.com/Crane04"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-iris-purple transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://x.com/Crane04"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-iris-purple transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="mailto:mayowayusuf3004@gmail.com"
            className="text-zinc-400 hover:text-iris-purple transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
