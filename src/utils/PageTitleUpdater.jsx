import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeToTranslationKey } from "./i18nRoutes";

/**
 * Component that updates the document title based on the current route
 * Uses i18n translations for page titles
 */
export const PageTitleUpdater = () => {
  const { t } = useTranslation('home');
  const location = useLocation();
  
  useEffect(() => {
    // Default title
    let title = "Sunshine Preschool";
    
    // Find the translation key for the current path
    const path = location.pathname;
    const exactMatch = routeToTranslationKey[path];
    
    if (exactMatch) {
      // If we have an exact match, use that translation
      title = t(exactMatch) + " - " + title;
    } else {
      // Otherwise, try to find a partial match for nested routes
      const matchingPath = Object.keys(routeToTranslationKey).find(routePath => 
        path.startsWith(routePath) && path !== '/'
      );
      
      if (matchingPath) {
        title = t(routeToTranslationKey[matchingPath]) + " - " + title;
      }
    }
    
    // Update document title
    document.title = title;
  }, [location.pathname, t]);
  
  // This component doesn't render anything
  return null;
};

export default PageTitleUpdater;
