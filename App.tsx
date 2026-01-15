
import React, { useState } from 'react';
import { 
  Fingerprint, 
  CloudUpload, 
  Cpu, 
  Terminal, 
  Copy, 
  Check,
  Zap,
  Lock,
  ShieldCheck,
  Plus,
  Trash2,
  Code2,
  ChevronRight
} from 'lucide-react';

// --- Sub-components ---

const Navbar = () => (
  <nav className="border-b border-iris-purple px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 bg-iris-black z-50">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <Fingerprint className="text-iris-purple w-6 h-6" />
      <span className="font-black text-2xl tracking-tighter uppercase font-sans">Iris</span>
    </div>
    <div className="hidden md:flex items-center gap-10 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500">
      <a href="#workflow" className="hover:text-iris-purple transition-colors">Workflow</a>
      <a href="#playground" className="hover:text-iris-purple transition-colors">Playground</a>
      <a href="#docs" className="hover:text-iris-purple transition-colors">Implementation</a>
    </div>
    <button className="bg-iris-purple text-iris-black text-[10px] font-mono font-bold uppercase px-6 py-2 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all">
      Start Building
    </button>
  </nav>
);

const Hero = () => (
  <section className="py-24 md:py-40 px-6 flex flex-col items-center text-center bg-iris-black">
    <div className="max-w-4xl">
      <h1 className="text-8xl md:text-[10rem] font-black tracking-[-0.05em] uppercase mb-4 leading-none font-sans">
        Iris
      </h1>
      <h2 className="text-iris-purple text-xl md:text-2xl font-mono font-bold tracking-tight mb-8 uppercase">
        The infrastructure layer for medical face comparison.
      </h2>
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans">
        High-speed, stateless biometric matching for hospital emergency systems. Identify unresponsive patients without storing a single byte of biometric data. Open and free for medical developers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#playground" className="min-w-[220px] bg-iris-purple text-iris-black font-mono font-bold py-4 px-8 uppercase text-xs border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all flex items-center justify-center">
          Launch Console
        </a>
        <a href="#docs" className="min-w-[220px] flex items-center justify-center bg-iris-black text-iris-purple font-mono font-bold py-4 px-8 uppercase text-xs border border-iris-purple hover:bg-iris-purple hover:text-iris-black transition-all">
          View Docs
        </a>
      </div>
    </div>
  </section>
);

const TechnicalWorkflow = () => {
  const steps = [
    {
      title: "Request",
      icon: <CloudUpload className="w-10 h-10 text-iris-purple" />,
      description: "Hospital sends POST /compare with target_url and people map."
    },
    {
      title: "In-Memory Inference",
      icon: <Cpu className="w-10 h-10 text-iris-purple" />,
      description: "Pixels are converted to 128-bit vectors in RAM."
    },
    {
      title: "Result",
      icon: <Terminal className="w-10 h-10 text-iris-purple" />,
      description: "Similarity scores are returned; RAM is cleared immediately."
    }
  ];

  return (
    <section id="workflow" className="py-24 px-6 max-w-7xl mx-auto border-t border-iris-purple">
      <div className="mb-16 text-center">
        <h3 className="text-iris-purple font-mono text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Technical Workflow</h3>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">The "No-Storage" Pipeline</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-iris-purple">
        {steps.map((step, idx) => (
          <div key={idx} className="p-12 bg-iris-grey/20 border-b md:border-b-0 md:border-r last:border-r-0 border-iris-purple text-center group">
            <div className="flex justify-center mb-8">{step.icon}</div>
            <h4 className="text-xl font-black uppercase mb-4 font-sans tracking-tight">{step.title}</h4>
            <p className="text-zinc-500 text-sm leading-relaxed font-sans">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const APIPlayground = () => {
  const [targetUrl, setTargetUrl] = useState('https://storage.hosp.org/emergency_capture_01.jpg');
  const [people, setPeople] = useState([
    { name: "Patient_992", image_url: "https://records.hosp.org/p992.jpg" },
    { name: "Patient_415", image_url: "https://records.hosp.org/p415.jpg" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>({
    "matches": [
      { "name": "Patient_992", "probability": 98.0 },
      { "name": "Patient_415", "probability": 14.2 }
    ]
  });

  const addPerson = () => {
    setPeople([...people, { name: "", image_url: "" }]);
  };

  const removePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const updatePerson = (index: number, field: 'name' | 'image_url', value: string) => {
    const updated = [...people];
    updated[index][field] = value;
    setPeople(updated);
  };

  const handleExecute = () => {
    setIsLoading(true);
    setTimeout(() => {
      const matches = people.map(p => ({
        name: p.name || "Unknown",
        probability: parseFloat((Math.random() * 99).toFixed(1))
      })).sort((a, b) => b.probability - a.probability);

      setResponse({ matches });
      setIsLoading(false);
    }, 600);
  };

  return (
    <section id="playground" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12 border-l-4 border-iris-purple pl-6">
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-sans">REST API Playground</h2>
        <p className="text-zinc-500 font-mono text-[10px] font-bold tracking-widest uppercase">Live Demo Dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-iris-purple">
        {/* Left Input Pane */}
        <div className="p-8 md:p-12 bg-iris-black border-b lg:border-b-0 lg:border-r border-iris-purple">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold tracking-widest text-iris-purple uppercase">target_url</label>
              <input 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-iris-grey border border-iris-purple p-4 font-mono text-xs focus:bg-iris-purple/5 outline-none text-white"
                placeholder="The emergency capture URL"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold tracking-widest text-iris-purple uppercase">people (comparison list)</label>
                <button 
                  onClick={addPerson}
                  className="text-iris-purple hover:text-white flex items-center gap-1 text-[10px] font-mono font-bold uppercase"
                >
                  <Plus className="w-3 h-3" /> Add Person
                </button>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {people.map((person, idx) => (
                  <div key={idx} className="p-4 border border-zinc-800 bg-iris-grey/30 relative group">
                    <button 
                      onClick={() => removePerson(idx)}
                      className="absolute top-2 right-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">name</span>
                        <input 
                          value={person.name}
                          onChange={(e) => updatePerson(idx, 'name', e.target.value)}
                          className="w-full bg-iris-black border border-zinc-800 p-2 font-mono text-[10px] focus:border-iris-purple outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">image_url</span>
                        <input 
                          value={person.image_url}
                          onChange={(e) => updatePerson(idx, 'image_url', e.target.value)}
                          className="w-full bg-iris-black border border-zinc-800 p-2 font-mono text-[10px] focus:border-iris-purple outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleExecute}
              disabled={isLoading}
              className="w-full bg-iris-purple text-iris-black font-mono font-bold uppercase py-5 flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "POST /compare"}
            </button>
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="bg-iris-black flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-iris-purple bg-iris-grey/50 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Output: Match Result JSON</span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-iris-purple"></div>
              <div className="w-1.5 h-1.5 bg-iris-purple"></div>
            </div>
          </div>
          <div className="flex-1 p-8 md:p-12 overflow-auto font-mono text-sm">
            <pre className="text-iris-purple">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

const Implementation = () => {
  const [activeLang, setActiveLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'rust', name: 'Rust' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'go', name: 'Go' }
  ];

  const codeExamples: Record<string, string> = {
    curl: `curl -X POST http://api.iris.dev/compare \\
  -d '{
    "target_url": "https://img.url/target",
    "people": [
      {
        "name": "Patient_ID_992",
        "image_url": "https://img.url/p992"
      }
    ]
  }'`,
    rust: `use serde::{Serialize, Deserialize};
use reqwest::Client;

#[derive(Serialize)]
struct CompareRequest {
    target_url: String,
    people: Vec<Person>,
}

#[derive(Serialize)]
struct Person {
    name: String,
    image_url: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let payload = CompareRequest {
        target_url: "https://img.url/target".into(),
        people: vec![Person {
            name: "Patient_ID_992".into(),
            image_url: "https://img.url/p992".into(),
        }],
    };

    let res = client.post("http://api.iris.dev/compare")
        .json(&payload)
        .send()
        .await?;

    println!("{:#?}", res.text().await?);
    Ok(())
}`,
    python: `import requests

payload = {
    "target_url": "https://img.url/target",
    "people": [
        {
            "name": "Patient_ID_992",
            "image_url": "https://img.url/p992"
        }
    ]
}

response = requests.post("http://api.iris.dev/compare", json=payload)
print(response.json())`,
    javascript: `const payload = {
  target_url: "https://img.url/target",
  people: [
    {
      name: "Patient_ID_992",
      image_url: "https://img.url/p992"
    }
  ]
};

fetch("http://api.iris.dev/compare", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(console.log);`,
    go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload := map[string]interface{}{
		"target_url": "https://img.url/target",
		"people": []map[string]string{
			{
				"name":      "Patient_ID_992",
				"image_url": "https://img.url/p992",
			},
		},
	}
	
	jsonData, _ := json.Marshal(payload)
	resp, _ := http.Post("http://api.iris.dev/compare", "application/json", bytes.NewBuffer(jsonData))
	
	fmt.Println("Status:", resp.Status)
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-24 px-6 max-w-7xl mx-auto border-t border-iris-purple">
      <div className="mb-12">
        <h3 className="text-3xl font-black uppercase tracking-tight mb-2 font-sans">Implementation Section</h3>
        <p className="text-iris-purple font-mono text-[10px] font-bold tracking-widest uppercase">Developer Proof: No SDK required. Pure REST implementation.</p>
      </div>

      <div className="border border-iris-purple bg-iris-black overflow-hidden">
        {/* Language Tabs */}
        <div className="flex border-b border-iris-purple overflow-x-auto no-scrollbar">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-widest transition-all border-r border-iris-purple last:border-r-0 whitespace-nowrap ${
                activeLang === lang.id 
                  ? 'bg-iris-purple text-iris-black' 
                  : 'text-zinc-500 hover:text-iris-purple hover:bg-iris-grey/50'
              }`}
            >
              {lang.name}
            </button>
          ))}
          <div className="ml-auto px-4 flex items-center">
            <button 
              onClick={handleCopy}
              className="p-2 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 font-mono text-[9px] uppercase font-bold"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <div className="p-8 md:p-12 overflow-x-auto bg-iris-grey/20 max-h-[500px] overflow-y-auto custom-scrollbar">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed">
            {codeExamples[activeLang]}
          </pre>
        </div>
      </div>

      <div className="mt-12 p-8 border border-iris-purple bg-iris-black group hover:bg-iris-purple/5 transition-all cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 flex items-center justify-center bg-iris-purple text-iris-black">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-1">Advanced Documentation</h4>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Read full API reference and authentication models.</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-iris-purple group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </section>
  );
};

const SecuritySection = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-iris-purple bg-iris-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4 border border-iris-purple p-8">
          <Zap className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">Stateless Execution</h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">No persistent storage. Data is processed in volatile RAM and cleared instantly upon response completion. Perfect for emergency privacy.</p>
        </div>
        <div className="space-y-4 border border-iris-purple p-8">
          <Lock className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">Clinical Compliance</h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">Designed for HIPAA-regulated environments. No biometric data leaves the request-response cycle.</p>
        </div>
        <div className="space-y-4 border border-iris-purple p-8">
          <ShieldCheck className="w-8 h-8 text-iris-purple" />
          <h4 className="text-lg font-black uppercase font-sans tracking-tight">Open Infra</h4>
          <p className="text-zinc-500 text-xs leading-relaxed font-sans">Built to be an open standard for medical identity. Free access for clinical research and hospital emergency wards.</p>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-iris-black text-white selection:bg-iris-purple selection:text-iris-black">
      <Navbar />
      <Hero />
      <TechnicalWorkflow />
      <APIPlayground />
      <Implementation />
      <SecuritySection />
      
      <footer className="py-20 px-6 border-t border-iris-purple bg-iris-black text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            <Fingerprint className="text-iris-purple w-5 h-5" />
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Iris Biometric Infrastructure — v2.2.0</span>
          </div>
          <div className="flex gap-8 text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-600">
            <span className="hover:text-iris-purple cursor-pointer">Security</span>
            <span className="hover:text-iris-purple cursor-pointer">Protocol</span>
            <span className="hover:text-iris-purple cursor-pointer">Uptime</span>
            <span className="hover:text-iris-purple cursor-pointer">Audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
