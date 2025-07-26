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
      image: "/img1.webp",
      title: "Welcome to Sunshine Preschool",
      description: "Nurturing young minds for a brighter future.",
    },
    {
      id: 2,
      image: "/img2.jpg",
      title: "Modern Facilities",
      description: "Safe, fun, and creative learning environment.",
    },
    {
      id: 3,
      image: "/img3.webp",
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
    <div className="relative w-full max-w-5xl mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl bg-gray-100" style={{ minHeight: '400px' }}>
      
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`transition-all duration-1000 ease-in-out absolute inset-0 ${idx === current ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"}`}
          style={{ display: idx === current ? 'block' : 'none' }}
        >
          {/* Fallback background color */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-64 md:h-96 lg:h-[500px] object-cover relative z-10"
            style={{
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
            onError={(e) => {
              console.error(`Failed to load image: ${slide.image}`);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log(`Loaded image: ${slide.image}`);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end items-center text-white p-8">
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-2xl leading-tight">{slide.title}</h2>
              <p className="text-lg md:text-xl lg:text-2xl drop-shadow-lg font-medium">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Dots navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${idx === current ? "bg-white scale-125 shadow-lg" : "bg-white/60 hover:bg-white/80 hover:scale-110"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Arrow navigation */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 hover:scale-110 transition-all duration-300 z-20 shadow-lg backdrop-blur-sm"
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 hover:scale-110 transition-all duration-300 z-20 shadow-lg backdrop-blur-sm"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
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
