import { getCurrentTokenData, isAuthenticated } from "@services/JWTService.jsx";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuthStatusMessage,
  handleEnrollmentNavigation,
} from "@utils/authUtils.js";
import { Button } from "../atoms";
import { ProgramCard, SearchBar } from "../molecules";
import { PageTemplate } from "../templates";

// SlideBar component (simple custom carousel)
function SlideBar() {
  const slides = [
    {
      id: 1,
      image: "/banner1.jpg",
      title: "Welcome to Sunshine Preschool",
      description: "Nurturing young minds for a brighter future.",
    },
    {
      id: 2,
      image: "/banner2.jpg",
      title: "Modern Facilities",
      description: "Safe, fun, and creative learning environment.",
    },
    {
      id: 3,
      image: "/banner3.webp",
      title: "Experienced Teachers",
      description: "Our teachers are passionate and dedicated.",
    },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden shadow-lg bg-gray-100">
      {/* Debug info - remove this later */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-30">
        Current: {current + 1}/{slides.length}
      </div>
      
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`transition-opacity duration-700 absolute inset-0 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-56 md:h-80 object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${slide.image}`);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log(`Loaded image: ${slide.image}`);
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
            <p className="text-base md:text-lg drop-shadow">{slide.description}</p>
          </div>
        </div>
      ))}
      
      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${idx === current ? "bg-white" : "bg-white/50 hover:bg-white/75"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Arrow navigation */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    user: null,
    statusMessage: "",
  });
  useEffect(() => {
    // Title is now handled by PageTitleUpdater component

    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);

    // Check authentication status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const isAuth = isAuthenticated();
    const tokenData = getCurrentTokenData();
    const statusMessage = getAuthStatusMessage(isAuth, tokenData);

    setAuthStatus({
      isAuthenticated: isAuth,
      user: tokenData,
      statusMessage,
    });
  };

  // Handle enrollment button click with authentication check
  const handleEnrollmentClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      },
    });

    if (success) {
//       console.log("Navigated to enrollment successfully");
    }
  };
  // Handle dashboard navigation with auth check
  const handleDashboardClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      redirectPath: "/user/parent/dashboard",
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      },
    });

    if (success) {
//       console.log("Navigated to dashboard successfully");
    }
  };

  // Handle search function
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
//     console.log("Searching for:", searchQuery);

    try {
      // Simulate API call for search
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock search results
      const mockResults = [
        {
          id: 1,
          title: `Admission Information for "${searchQuery}"`,
          type: "page",
        },
        {
          id: 2,
          title: `Programs related to "${searchQuery}"`,
          type: "program",
        },
        { id: 3, title: `News about "${searchQuery}"`, type: "news" },
      ];

      setSearchResults(mockResults);
    } catch (error) {
//       console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle speech-to-text
  const handleSpeechToText = useCallback(() => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure speech recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "vi-VN"; // Vietnamese language

    recognition.onstart = () => {
//       console.log("Speech recognition started");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
//       console.log("Speech result:", transcript);

      // Trigger search with speech result
      handleSearch(transcript);
    };
    recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);

      let errorMessage;
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions.";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone access denied. Please allow microphone access.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      alert(errorMessage);
    };

    recognition.onend = () => {
//       console.log("Speech recognition ended");
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
//       console.error("Failed to start speech recognition:", error);
      alert("Failed to start speech recognition");
    }
  }, [speechSupported, handleSearch]);

  return (
    <PageTemplate
      title={t("welcome")}
      subtitle={t("discover_programs")}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            <Link to="/admission">{t("admission_link")}</Link>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleEnrollmentClick}
            title={authStatus.statusMessage || "Enroll Now"}
          >
            {t("enroll_button")}
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Search Section */}
        <div className="text-center space-y-4">
          <SearchBar
            size="lg"
            theme="light"
            variant="rounded"
            placeholder={t("search_placeholder")}
            onSearch={handleSearch}
            onSpeechToText={handleSpeechToText}
            loading={isSearching}
            className="max-w-2xl mx-auto"
          />
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">{t("search_results")}</h3>
              <ul className="space-y-2">
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    className="p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="text-sm text-gray-500 uppercase">
                      {t(`type_${result.type}`)}
                    </span>
                    <div className="font-medium">{result.title}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* SlideBar Section */}
        <SlideBar />
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {t("featured_programs")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgramCard
              title={t("prog1_title")}
              description={t("prog1_desc")}
              details={{
                age: t("prog1_age"),
                duration: t("prog1_duration"),
                capacity: t("prog1_capacity"),
              }}
              features={[t("prog1_feat1"), t("prog1_feat2"), t("prog1_feat3")]}
              price={t("prog1_price")}
              badge={{ text: t("prog1_badge"), variant: "primary" }}
              onEnroll={handleEnrollmentClick}
            />
            <ProgramCard
              title={t("prog2_title")}
              description={t("prog2_desc")}
              details={{
                age: t("prog2_age"),
                duration: t("prog2_duration"),
                capacity: t("prog2_capacity"),
              }}
              features={[t("prog2_feat1"), t("prog2_feat2"), t("prog2_feat3")]}
              price={t("prog2_price")}
              badge={{ text: t("prog2_badge"), variant: "secondary" }}
              onEnroll={handleEnrollmentClick}
            />
            <ProgramCard
              title={t("prog3_title")}
              description={t("prog3_desc")}
              details={{
                age: t("prog3_age"),
                duration: t("prog3_duration"),
                capacity: t("prog3_capacity"),
              }}
              features={[t("prog3_feat1"), t("prog3_feat2"), t("prog3_feat3")]}
              price={t("prog3_price")}
              badge={{ text: t("prog3_badge"), variant: "outline" }}
              onEnroll={handleEnrollmentClick}
            />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
