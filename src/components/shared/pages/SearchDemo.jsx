import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "@components/molecules/search/SearchBar";

const SearchDemo = () => {
  //   const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("idle"); // idle, listening, processing
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Mock search function
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log("🔍 Searching for:", searchQuery);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock search results based on query
      const mockResults = [
        {
          id: 1,
          title: `Admission Program: "${searchQuery}"`,
          type: "program",
          description: "Learn about our admission process",
        },
        {
          id: 2,
          title: `News: "${searchQuery}" updates`,
          type: "news",
          description: "Latest news and announcements",
        },
        {
          id: 3,
          title: `Activities related to "${searchQuery}"`,
          type: "activity",
          description: "Fun activities for children",
        },
        {
          id: 4,
          title: `Teacher resources for "${searchQuery}"`,
          type: "resource",
          description: "Educational materials and guides",
        },
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error("❌ Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Speech-to-text function
  const handleSpeechToText = useCallback(() => {
    if (!speechSupported) {
      alert("❌ Speech recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure speech recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "vi-VN"; // Vietnamese
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setSpeechStatus("listening");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      console.log("🗣️ Speech result:", transcript);
      console.log("📊 Confidence:", confidence);

      setSpeechStatus("processing");
      setSearchValue(transcript); // Update search value with speech result

      // Trigger search with speech result
      handleSearch(transcript);

      setTimeout(() => setSpeechStatus("idle"), 1000);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      setSpeechStatus("idle");

      let errorMessage;
      switch (event.error) {
        case "no-speech":
          errorMessage =
            "🔇 No speech detected. Please speak clearly and try again.";
          break;
        case "audio-capture":
          errorMessage =
            "🎤 Microphone not accessible. Please check permissions.";
          break;
        case "not-allowed":
          errorMessage =
            "🚫 Microphone access denied. Please allow microphone access and try again.";
          break;
        case "network":
          errorMessage =
            "🌐 Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = `❌ Speech recognition error: ${event.error}`;
      }

      alert(errorMessage);
    };

    recognition.onend = () => {
      console.log("⏹️ Speech recognition ended");
      if (speechStatus === "listening") {
        setSpeechStatus("idle");
      }
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error("❌ Failed to start speech recognition:", error);
      setSpeechStatus("idle");
      alert("❌ Failed to start speech recognition");
    }
  }, [speechSupported, handleSearch, speechStatus]);

  const clearResults = () => {
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Search & Voice Demo
          </h1>
          <p className="text-gray-600">
            Test search functionality and speech-to-text features
          </p>
        </div>

        {/* Speech Support Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Speech Recognition:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  speechSupported
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {speechSupported ? "✅ Supported" : "❌ Not supported"}
              </span>
            </div>

            {speechStatus !== "idle" && (
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    speechStatus === "listening"
                      ? "bg-red-500 animate-pulse"
                      : "bg-yellow-500 animate-spin"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {speechStatus === "listening"
                    ? "Listening..."
                    : "Processing..."}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🎯 Main Search</h2>{" "}
          <SearchBar
            size="lg"
            theme="light"
            variant="rounded"
            placeholder="Search for programs, news, activities... (try voice search!)"
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            onSearch={handleSearch}
            onSpeechToText={handleSpeechToText}
            loading={isSearching}
            className="w-full"
          />
          {/* Instructions */}
          <div className="mt-4 text-sm text-gray-500">
            💡 <strong>Tips:</strong> Type your search or click the 🎤
            microphone icon to use voice search. Try saying "chương trình học"
            or "tin tức mới nhất"
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                📋 Search Results ({searchResults.length})
              </h3>
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear Results
              </button>
            </div>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        {
                          "bg-blue-100 text-blue-800":
                            result.type === "program",
                          "bg-green-100 text-green-800": result.type === "news",
                          "bg-purple-100 text-purple-800":
                            result.type === "activity",
                          "bg-orange-100 text-orange-800":
                            result.type !== "program" &&
                            result.type !== "news" &&
                            result.type !== "activity",
                        }
                      )}
                    >
                      {result.type.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {result.title}
                  </h4>
                  <p className="text-sm text-gray-600">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search States */}
        {isSearching && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">🔍 Searching...</p>
          </div>
        )}

        {!isSearching && searchResults.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            <p>🔍 No search results yet. Try searching for something!</p>
          </div>
        )}

        {/* Demo SearchBars */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">🎨 SearchBar Variants</h2>
          <div className="space-y-4">
            {/* Different sizes */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Sizes:
              </div>
              <div className="space-y-2">
                <SearchBar
                  size="sm"
                  placeholder="Small search"
                  onSearch={(v) => console.log("Small:", v)}
                />
                <SearchBar
                  size="md"
                  placeholder="Medium search"
                  onSearch={(v) => console.log("Medium:", v)}
                />
                <SearchBar
                  size="lg"
                  placeholder="Large search"
                  onSearch={(v) => console.log("Large:", v)}
                />
                <SearchBar
                  size="xl"
                  placeholder="Extra large search"
                  onSearch={(v) => console.log("XL:", v)}
                />
              </div>
            </div>

            {/* Different themes */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Themes:
              </div>
              <div className="space-y-2">
                <SearchBar
                  theme="light"
                  placeholder="Light theme"
                  onSearch={(v) => console.log("Light:", v)}
                />
                <SearchBar
                  theme="dark"
                  placeholder="Dark theme"
                  onSearch={(v) => console.log("Dark:", v)}
                />
                <SearchBar
                  theme="minimal"
                  placeholder="Minimal theme"
                  onSearch={(v) => console.log("Minimal:", v)}
                />
              </div>
            </div>

            {/* Different variants */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Variants:
              </div>
              <div className="space-y-2">
                <SearchBar
                  variant="default"
                  placeholder="Default variant"
                  onSearch={(v) => console.log("Default:", v)}
                />
                <SearchBar
                  variant="rounded"
                  placeholder="Rounded variant"
                  onSearch={(v) => console.log("Rounded:", v)}
                />
                <SearchBar
                  variant="square"
                  placeholder="Square variant"
                  onSearch={(v) => console.log("Square:", v)}
                />
                <SearchBar
                  variant="none"
                  placeholder="No border variant"
                  onSearch={(v) => console.log("None:", v)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;
