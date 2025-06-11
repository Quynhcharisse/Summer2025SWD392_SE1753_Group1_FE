/**
 * Token Debug Component
 * Provides debugging tools for token refresh mechanism
 */
import { Button } from "@atoms";
import {
  getCurrentTokenData,
  hasAccessToken,
  isTokenExpired,
  refreshToken,
} from "@services/JWTService.jsx";
import { authService } from "@services/authService";
import { useState } from "react";

const TokenDebugComponent = () => {
  const [debugInfo, setDebugInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logDebugInfo = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => `${prev}\n[${timestamp}] ${message}`);
    console.log(`[TokenDebug] ${message}`);
  };

  const clearLogs = () => {
    setDebugInfo("");
  };

  const checkTokenStatus = () => {
    logDebugInfo("=== Token Status Check ===");

    const hasToken = hasAccessToken();
    const isExpired = isTokenExpired();
    const tokenData = getCurrentTokenData();

    logDebugInfo(`Has Access Token: ${hasToken}`);
    logDebugInfo(`Is Token Expired: ${isExpired}`);
    logDebugInfo(
      `Token Data: ${
        tokenData
          ? JSON.stringify(
              {
                role: tokenData.role,
                exp: new Date(tokenData.exp * 1000).toLocaleString(),
                name: tokenData.name,
              },
              null,
              2
            )
          : "null"
      }`
    );
  };

  const testTokenRefresh = async () => {
    setIsLoading(true);
    logDebugInfo("=== Testing Token Refresh ===");

    try {
      const result = await refreshToken();
      logDebugInfo("✅ Token refresh successful");
      logDebugInfo(`Result: ${JSON.stringify(result, null, 2)}`);

      // Check token status after refresh
      const newTokenData = getCurrentTokenData();
      logDebugInfo(
        `New token data: ${
          newTokenData
            ? JSON.stringify(
                {
                  role: newTokenData.role,
                  exp: new Date(newTokenData.exp * 1000).toLocaleString(),
                  name: newTokenData.name,
                },
                null,
                2
              )
            : "null"
        }`
      );
    } catch (error) {
      logDebugInfo("❌ Token refresh failed");
      logDebugInfo(`Error: ${error.message}`);
      logDebugInfo(
        `Response: ${
          error.response ? JSON.stringify(error.response.data) : "No response"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  O;
  const testProfileAPIWithRetry = async () => {
    setIsLoading(true);
    logDebugInfo("=== Testing Profile API with Retry ===");

    try {
      const profile = await authService.getUserProfile();

      logDebugInfo("✅ Profile API call successful");
      logDebugInfo(
        `Profile: ${JSON.stringify(
          {
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: profile.role,
          },
          null,
          2
        )}`
      );
    } catch (error) {
      logDebugInfo("❌ Profile API call failed");
      logDebugInfo(`Error: ${error.message}`);
      logDebugInfo(`Status: ${error.response?.status}`);
      logDebugInfo(
        `Response: ${
          error.response ? JSON.stringify(error.response.data) : "No response"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectProfileAPI = async () => {
    setIsLoading(true);
    logDebugInfo("=== Testing Direct Profile API (no retry) ===");

    try {
      const profile = await authService.getUserProfile();
      logDebugInfo("✅ Direct Profile API call successful");
      logDebugInfo(
        `Profile: ${JSON.stringify(
          {
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: profile.role,
          },
          null,
          2
        )}`
      );
    } catch (error) {
      logDebugInfo("❌ Direct Profile API call failed");
      logDebugInfo(`Error: ${error.message}`);
      logDebugInfo(`Status: ${error.response?.status}`);
      logDebugInfo(
        `Response: ${
          error.response ? JSON.stringify(error.response.data) : "No response"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Token Debug Tools</h3>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={checkTokenStatus}
          disabled={isLoading}
        >
          Check Token Status
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={testTokenRefresh}
          disabled={isLoading}
        >
          Test Token Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={testProfileAPIWithRetry}
          disabled={isLoading}
        >
          Test Profile API (with retry)
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={testDirectProfileAPI}
          disabled={isLoading}
        >
          Test Profile API (direct)
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearLogs}
          disabled={isLoading}
        >
          Clear Logs
        </Button>
      </div>

      {debugInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Debug Logs:
          </h4>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
            {debugInfo}
          </pre>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default TokenDebugComponent;
