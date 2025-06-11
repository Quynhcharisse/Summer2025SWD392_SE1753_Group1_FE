import { Button } from "../atoms";
import {
  ProcessStepCard,
  ProgramCard,
  SearchBar,
} from "../molecules";
import { PageTemplate } from "../templates";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { handleEnrollmentNavigation, getAuthStatusMessage } from "../../../utils/authUtils";
import { isAuthenticated, getCurrentTokenData } from "@services/JWTService.jsx";
import { useSnackbar } from "notistack";

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
    statusMessage: ''
  });
  useEffect(() => {
    document.title = t("welcome") + " - Sunshine Preschool";

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
      statusMessage
    });
  };

  // Handle enrollment button click with authentication check
  const handleEnrollmentClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      }
    });
    
    if (success) {
      console.log('Navigated to enrollment successfully');
    }
  };

  // Handle dashboard navigation with auth check  
  const handleDashboardClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      redirectPath: '/parent/dashboard',
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      }
    });
    
    if (success) {
      console.log('Navigated to dashboard successfully');
    }
  };

  // Handle search function
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log("Searching for:", searchQuery);

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
      console.error("Search error:", error);
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
      console.log("Speech recognition started");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Speech result:", transcript);

      // Trigger search with speech result
      handleSearch(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

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
      console.log("Speech recognition ended");
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      alert("Failed to start speech recognition");
    }  }, [speechSupported, handleSearch]);

  return (
    <PageTemplate
      title={t("welcome")}
      subtitle={t("discover_programs")}      actions={        <div className="flex gap-4">
          <Button variant="outline" size="md">
            <Link to="/admission">{t("admission_link")}</Link>
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={handleEnrollmentClick}
            title={authStatus.statusMessage || "Đăng ký nhập học"}
          >
            {t("enroll_button")}
          </Button>
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleDashboardClick}
            title={authStatus.statusMessage || "Truy cập dashboard"}
          >
            Dashboard
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
        {/* Quick Enrollment Process */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {t("quick_enrollment")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ProcessStepCard
              step={1}
              title={t("step1_title")}
              description={t("step1_desc")}
              variant="numbered"
              status="active"
              actionLabel={t("step1_action")}
              onAction={() => console.log("Booking tour")}
            />
            <ProcessStepCard
              step={2}
              title={t("step2_title")}
              description={t("step2_desc")}
              variant="numbered"
              status="pending"
            />
            <ProcessStepCard
              step={3}
              title={t("step3_title")}
              description={t("step3_desc")}
              variant="numbered"
              status="pending"
            />
          </div>
        </div>
        {/* Featured Programs */}
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
              features={[
                t("prog1_feat1"),
                t("prog1_feat2"),
                t("prog1_feat3"),
              ]}
              price={t("prog1_price")}
              badge={{ text: t("prog1_badge"), variant: "primary" }}              onEnroll={handleEnrollmentClick}
              onLearnMore={() =>
                console.log("Learning more about Toddler Discovery")
              }
            />
            <ProgramCard
              title={t("prog2_title")}
              description={t("prog2_desc")}
              details={{
                age: t("prog2_age"),
                duration: t("prog2_duration"),
                capacity: t("prog2_capacity"),
              }}
              features={[
                t("prog2_feat1"),
                t("prog2_feat2"),
                t("prog2_feat3"),
              ]}
              price={t("prog2_price")}
              badge={{ text: t("prog2_badge"), variant: "secondary" }}              onEnroll={handleEnrollmentClick}
              onLearnMore={() =>
                console.log("Learning more about Pre-K Excellence")
              }
            />
            <ProgramCard
              title={t("prog3_title")}
              description={t("prog3_desc")}
              details={{
                age: t("prog3_age"),
                duration: t("prog3_duration"),
                capacity: t("prog3_capacity"),
              }}
              features={[
                t("prog3_feat1"),
                t("prog3_feat2"),
                t("prog3_feat3"),
              ]}
              price={t("prog3_price")}
              badge={{ text: t("prog3_badge"), variant: "outline" }}              onEnroll={handleEnrollmentClick}
              onLearnMore={() =>
                console.log("Learning more about After School Care")
              }
            />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
