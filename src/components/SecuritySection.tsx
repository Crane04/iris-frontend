import { Lock, Zap, ShieldCheck } from "lucide-react";

const SecuritySection = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-iris-purple bg-iris-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4 border border-iris-purple p-8">
          <Zap className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">
            Stateless Execution
          </h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">
            No persistent storage. Data is processed in volatile RAM and cleared
            instantly upon response completion. Perfect for privacy-critical
            applications.
          </p>
        </div>
        <div className="space-y-4 border border-iris-purple p-8">
          <Lock className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">
            Compliance Ready
          </h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">
            Designed for regulatory environments like HIPAA, GDPR, and beyond.
            No biometric data leaves the request-response cycle.
          </p>
        </div>
        <div className="space-y-4 border border-iris-purple p-8">
          <ShieldCheck className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">
            Open Infrastructure
          </h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">
            Built to be an open standard for facial recognition. Free access for
            developers, researchers, and enterprises.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
