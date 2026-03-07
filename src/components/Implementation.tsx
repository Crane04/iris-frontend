import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import backendUrl from "../constant";

const Implementation = ({ tableOnly = false }: { tableOnly?: boolean }) => {
  const [activeLang, setActiveLang] = useState("curl");
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: "curl", name: "cURL" },
    { id: "rust", name: "Rust" },
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
    { id: "go", name: "Go" },
  ];

  const codeExamples: Record<string, string> = {
    curl: `curl -X POST ${backendUrl}/v1/compare \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: iris_your_api_key_here" \\
  -d '{
    "target_url": "https://img.url/user-face",
    "people": [
      {
        "name": "user_001",
        "image_url": "https://img.url/database-ref-1"
      }
    ]
  }'`,
    rust: `use serde::Serialize;
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
        target_url: "https://img.url/user-face".into(),
        people: vec![Person {
            name: "user_001".into(),
            image_url: "https://img.url/database-ref-1".into(),
        }],
    };

    let res = client
        .post("${backendUrl}/v1/compare")
        .header("X-API-Key", "iris_your_api_key_here")
        .json(&payload)
        .send()
        .await?;

    println!("{:#?}", res.text().await?);
    Ok(())
}`,
    python: `import requests

payload = {
    "target_url": "https://img.url/user-face",
    "people": [
        {
            "name": "user_001",
            "image_url": "https://img.url/database-ref-1"
        }
    ]
}

headers = {
    "X-API-Key": "iris_your_api_key_here"
}

response = requests.post(
    "${backendUrl}/v1/compare",
    json=payload,
    headers=headers
)
print(response.json())`,
    javascript: `const payload = {
  target_url: "https://img.url/user-face",
  people: [
    {
      name: "user_001",
      image_url: "https://img.url/database-ref-1"
    }
  ]
};

fetch("${backendUrl}/v1/compare", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "iris_your_api_key_here"
  },
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
		"target_url": "https://img.url/user-face",
		"people": []map[string]string{
			{
				"name":      "user_001",
				"image_url": "https://img.url/database-ref-1",
			},
		},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "${backendUrl}/v1/compare", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", "iris_your_api_key_here")

	client := &http.Client{}
	resp, _ := client.Do(req)
	fmt.Println("Status:", resp.Status)
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const table = (
    <div className="border border-iris-purple bg-iris-black overflow-hidden">
        {/* Language Tabs */}
        <div className="flex border-b border-iris-purple overflow-x-auto no-scrollbar">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-widest transition-all border-r border-iris-purple last:border-r-0 whitespace-nowrap ${
                activeLang === lang.id
                  ? "bg-iris-purple text-iris-black"
                  : "text-zinc-500 hover:text-iris-purple hover:bg-iris-grey/50"
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
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
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
  );

  if (tableOnly) return table;

  return (
    <section
      id="docs"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-iris-purple"
    >
      <div className="mb-12">
        <h3 className="text-3xl font-black uppercase tracking-tight mb-2 font-sans">
          Implementation
        </h3>
        <p className="text-iris-purple font-mono text-[10px] font-bold tracking-widest uppercase">
          Pure REST. No SDK required.
        </p>
      </div>

      {/* API key callout */}
      <div className="mb-8 border border-zinc-800 px-6 py-4 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400 mb-1">
            Authentication required
          </p>
          <p className="text-xs font-mono text-zinc-600">
            All API requests must include your key as the{" "}
            <code className="text-iris-purple">X-API-Key</code> header.
            Keys are free and generated instantly.
          </p>
        </div>
        <Link
          to="/register"
          className="shrink-0 bg-iris-purple text-iris-black text-[10px] font-mono font-bold uppercase px-5 py-2 border border-iris-purple hover:bg-iris-black hover:text-iris-purple transition-all"
        >
          Get your free API key →
        </Link>
      </div>

      {table}
    </section>
  );
};

export default Implementation;
