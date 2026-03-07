import { useRef, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import backendUrl from "../constant";

type ImageMode = "url" | "upload";

interface PersonState {
  name: string;
  image_url: string;
  mode: ImageMode;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ImageModeToggle = ({
  mode,
  onChange,
}: {
  mode: ImageMode;
  onChange: (m: ImageMode) => void;
}) => (
  <div className="flex border border-zinc-700 w-fit">
    {(["url", "upload"] as ImageMode[]).map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase transition-colors ${
          mode === m
            ? "bg-iris-purple text-iris-black"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        {m}
      </button>
    ))}
  </div>
);

const APIPlayground = () => {
  const [targetMode, setTargetMode] = useState<ImageMode>("url");
  const [targetUrl, setTargetUrl] = useState(
    "https://www.shutterstock.com/image-photo/tobey-maguire-los-angeles-premiere-260nw-286825016.jpg",
  );
  const [people, setPeople] = useState<PersonState[]>([
    {
      name: "Maguire",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqiVCCW7eH5Q_8q4VULShU7O8QnOgp7Us2RBNhAlnesh2_iho_D1Toosuxj_x66J1w8ks&usqp=CAU",
      mode: "url",
    },
    {
      name: "Tom",
      image_url:
        "https://hips.hearstapps.com/hmg-prod/images/tom-holland-attends-the-los-angeles-premiere-of-sony-news-photo-1683915930.jpg?crop=0.596xw:0.894xh;0.226xw,0.106xh&resize=1200:*",
      mode: "url",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [response, setResponse] = useState<any>({
    matches: [
      { name: "user_001", probability: 98.0 },
      { name: "user_042", probability: 14.2 },
    ],
  });

  const targetFileRef = useRef<HTMLInputElement>(null);

  const handleTargetModeChange = (m: ImageMode) => {
    setTargetMode(m);
    setTargetUrl("");
  };

  const handleTargetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTargetUrl(await readFileAsDataUrl(file));
  };

  const addPerson = () => {
    setPeople([...people, { name: "", image_url: "", mode: "url" }]);
  };

  const removePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const updatePerson = (index: number, fields: Partial<PersonState>) => {
    const updated = [...people];
    updated[index] = { ...updated[index], ...fields };
    setPeople(updated);
  };

  const handlePersonModeChange = (index: number, m: ImageMode) => {
    updatePerson(index, { mode: m, image_url: "" });
  };

  const handlePersonUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updatePerson(index, { image_url: await readFileAsDataUrl(file) });
  };

  const handleExecute = async () => {
    setRateLimited(false);
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/playground/compare`,
        {
          target_url: targetUrl,
          people: people.map(({ name, image_url }) => ({ name, image_url })),
        },
        { withCredentials: true }
      );
      setResponse(data);
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setRateLimited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="playground" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12 border-l-4 border-iris-purple pl-6">
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-sans">
          REST API Playground
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] font-bold tracking-widest uppercase">
          Live Demo — 10 free requests/hour &nbsp;·&nbsp;{" "}
          <Link to="/register" className="text-iris-purple hover:underline">
            Get an API key for unlimited access
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-iris-purple">
        {/* Left Input Pane */}
        <div className="p-8 md:p-12 bg-iris-black border-b lg:border-b-0 lg:border-r border-iris-purple">
          <div className="space-y-8">
            {/* Target Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold tracking-widest text-iris-purple uppercase">
                  target_url
                </label>
                <ImageModeToggle
                  mode={targetMode}
                  onChange={handleTargetModeChange}
                />
              </div>
              <div className="flex gap-4">
                {targetMode === "url" ? (
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="flex-1 bg-iris-grey border border-iris-purple p-4 font-mono text-xs focus:bg-iris-purple/5 outline-none text-white"
                    placeholder="Provide a face image URL for comparison"
                  />
                ) : (
                  <>
                    <input
                      ref={targetFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleTargetUpload}
                    />
                    <button
                      onClick={() => targetFileRef.current?.click()}
                      className="flex-1 bg-iris-grey border border-iris-purple p-4 font-mono text-xs text-zinc-500 hover:bg-iris-purple/5 outline-none flex items-center gap-2"
                    >
                      <Upload className="w-3 h-3 flex-shrink-0" />
                      {targetUrl
                        ? "Image loaded — click to replace"
                        : "Click to upload image"}
                    </button>
                  </>
                )}
                {targetUrl && (
                  <div className="w-20 h-20 border border-iris-purple flex-shrink-0 overflow-hidden">
                    <img
                      src={targetUrl}
                      alt="Target"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/80?text=Error";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* People List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold tracking-widest text-iris-purple uppercase">
                  people (comparison list)
                </label>
                <button
                  onClick={addPerson}
                  className="text-iris-purple hover:text-white flex items-center gap-1 text-[10px] font-mono font-bold uppercase"
                >
                  <Plus className="w-3 h-3" /> Add Person
                </button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {people.map((person, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-zinc-800 bg-iris-grey/30 relative group"
                  >
                    <button
                      onClick={() => removePerson(idx)}
                      className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 z-10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-600 uppercase">
                            name
                          </span>
                          <input
                            value={person.name}
                            onChange={(e) =>
                              updatePerson(idx, { name: e.target.value })
                            }
                            className="w-full bg-iris-black border border-zinc-800 p-2 font-mono text-[10px] focus:border-iris-purple outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-zinc-600 uppercase">
                              image_url
                            </span>
                            <ImageModeToggle
                              mode={person.mode}
                              onChange={(m) => handlePersonModeChange(idx, m)}
                            />
                          </div>
                          {person.mode === "url" ? (
                            <input
                              value={person.image_url}
                              onChange={(e) =>
                                updatePerson(idx, { image_url: e.target.value })
                              }
                              className="w-full bg-iris-black border border-zinc-800 p-2 font-mono text-[10px] focus:border-iris-purple outline-none"
                            />
                          ) : (
                            <label className="flex items-center gap-1 w-full bg-iris-black border border-zinc-800 p-2 font-mono text-[10px] text-zinc-500 cursor-pointer hover:border-iris-purple">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePersonUpload(idx, e)}
                              />
                              <Upload className="w-2.5 h-2.5 flex-shrink-0" />
                              {person.image_url ? "Loaded" : "Upload"}
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-20 h-20 border border-zinc-800 overflow-hidden">
                          {person.image_url ? (
                            <img
                              src={person.image_url}
                              alt={person.name || `Person ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/80?text=Error";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-iris-black">
                              <span className="text-[10px] text-zinc-600 font-mono text-center">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {rateLimited && (
              <div className="border border-yellow-800 bg-yellow-950/30 px-4 py-3 text-xs font-mono text-yellow-400">
                Playground limit reached (10 req/hr).{" "}
                <Link to="/register" className="underline hover:text-yellow-300">
                  Create a free account
                </Link>{" "}
                to get an API key with higher limits.
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={isLoading || rateLimited}
              className="w-full bg-iris-purple text-iris-black font-mono font-bold uppercase py-5 flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "POST /compare"}
            </button>
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="bg-iris-black flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-iris-purple bg-iris-grey/50 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              Output: Match Result JSON
            </span>
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

export default APIPlayground;
