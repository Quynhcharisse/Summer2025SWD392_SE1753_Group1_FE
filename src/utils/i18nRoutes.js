import i18n from "../i18n";
import { PUBLIC_ROUTES } from "../constants/routes";

/**
 * Helper function to get localized route info
 * This centralizes the route path and translated labels
 */
export const getLocalizedRoutes = () => {
  const t = i18n.getFixedT(null, 'home');
  
  return {
    home: {
      path: PUBLIC_ROUTES.HOMEPAGE,
      label: t('navigation.home')
    },
    admission: {
      path: PUBLIC_ROUTES.HOMEPAGE_ADMISSION,
      label: t('navigation.admission')
    },
    events: {
      path: PUBLIC_ROUTES.HOMEPAGE_EVENTS,
      label: t('navigation.events')
    },
    classes: {
      path: PUBLIC_ROUTES.HOMEPAGE_CLASSES,
      label: t('navigation.classes')
    },
    about: {
      path: PUBLIC_ROUTES.HOMEPAGE_ABOUT,
      label: t('navigation.about')
    },
    contact: {
      path: PUBLIC_ROUTES.HOMEPAGE_CONTACT,
      label: t('navigation.contact')
    }
  };
};

/**
 * Map route paths to their translation keys
 * Useful for dynamically getting translations for the current route
 */
export const routeToTranslationKey = {
  [PUBLIC_ROUTES.HOMEPAGE]: 'navigation.home',
  [PUBLIC_ROUTES.HOMEPAGE_ADMISSION]: 'navigation.admission',
  [PUBLIC_ROUTES.HOMEPAGE_EVENTS]: 'navigation.events',
  [PUBLIC_ROUTES.HOMEPAGE_CLASSES]: 'navigation.classes',
  [PUBLIC_ROUTES.HOMEPAGE_ABOUT]: 'navigation.about',
  [PUBLIC_ROUTES.HOMEPAGE_CONTACT]: 'navigation.contact',
};
