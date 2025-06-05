export const roleMiddleware = (requiredRoles) => {
  return (userRole) => {
    if (!requiredRoles.includes(userRole)) {
      return false; // Không có quyền truy cập
    }
    return true; // Có quyền truy cập
  };
};
