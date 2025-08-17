import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari tutorial, artikel, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 pl-16 pr-32 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Button */}
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <Button
              type="submit"
              size="lg"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Cari
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {searchTerm.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-2">Pencarian cepat:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Arduino",
                  "ESP32",
                  "Raspberry Pi",
                  "Tutorial",
                  "Project",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setSearchTerm(suggestion)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Popular Searches */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500 mb-2">Pencarian populer:</div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Arduino Tutorial",
            "ESP32 Project",
            "Raspberry Pi Guide",
            "IoT Basics",
          ].map((term) => (
            <button
              key={term}
              onClick={() => setSearchTerm(term)}
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
