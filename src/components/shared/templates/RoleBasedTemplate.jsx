import PropTypes from 'prop-types';
import { Footer, Header } from '@organisms';
import { themeClasses } from '@theme/colors';
// import useRefreshToken from '../../../hooks/useRefreshToken';

const RoleBasedTemplate = ({ children }) => {
  // Temporarily disable useRefreshToken to avoid conflicts
  // useRefreshToken();

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.backgroundSurface} ${themeClasses.textPrimary}`}>
      <Header />
      <main className={`flex-1 container mx-auto p-4 ${themeClasses.backgroundSurface}`}>{children}</main>
      <Footer />
    </div>
  );
};

RoleBasedTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoleBasedTemplate;
