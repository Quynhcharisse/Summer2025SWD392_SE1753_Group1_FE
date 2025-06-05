# Phân tích Role-Based Access Control (RBAC) cho Routes

## Tổng quan hệ thống Role

### 1. Cấu trúc Role hiện tại
- **ADMISSION**: Quyền truy cập trang tuyển sinh
- **EDUCATION**: Quyền truy cập trang lớp học và giáo dục
- Hệ thống role được check qua `roleMiddleware` và `ProtectedRoute`

### 2. Phân tích từng Route

| Route | Bảo vệ | Required Roles | Mô tả | Trạng thái |
|-------|--------|----------------|--------|------------|
| `/` (Home) | ✅ | `[]` (Any authenticated user) | Trang chủ - Chỉ cần đăng nhập | ✅ Protected |
| `/login` | ❌ | N/A | Trang đăng nhập | ❌ Public |
| `/signup` | ❌ | N/A | Trang đăng ký | ❌ Public |
| `/forgot-password` | ❌ | N/A | Quên mật khẩu | ❌ Public |
| `/reset-password` | ❌ | N/A | Đặt lại mật khẩu | ❌ Public |
| `/admission` | ✅ | `["ADMISSION"]` | Tuyển sinh | 🔒 Role-based |
| `/classes` | ✅ | `["EDUCATION"]` | Lớp học | 🔒 Role-based |
| `/book-story-demo` | ❌ | N/A | Demo truyện | ❌ Public |
| `/theme-test` | ❌ | N/A | Test theme | ❌ Public |
| `/unauthorized` | ❌ | N/A | Trang không có quyền | ❌ Public |
| `/*` (404) | ❌ | N/A | Trang không tồn tại | ❌ Public |

### 3. Cơ chế hoạt động

#### a) ProtectedRoute Component
- Có 2 implementation:
  1. `src/auth/ProtectedRoute.jsx` - Sử dụng trong AppRouter
  2. `src/components/shared/auth/ProtectedRoute.jsx` - Implementation khác

#### b) Role Middleware
```javascript
// roleMiddleware.js
export const roleMiddleware = (requiredRoles) => {
  return (userRole) => {
    if (!requiredRoles.includes(userRole)) {
      return false; // Không có quyền truy cập
    }
    return true; // Có quyền truy cập
  };
};
```

#### c) JWT Service
- `hasRole(requiredRole)`: Kiểm tra role cụ thể
- `hasAnyRole(roles)`: Kiểm tra có bất kỳ role nào trong danh sách
- `getCurrentTokenData()`: Lấy thông tin token từ cookie

### 4. Vấn đề và Khuyến nghị

#### 🔴 Vấn đề cần khắc phục:

1. **Duplicate ProtectedRoute**: Có 2 implementation khác nhau
   - Cần thống nhất sử dụng 1 version duy nhất
   - Recommend: Sử dụng version trong `src/components/shared/auth/`

2. **Inconsistent prop naming**:
   - AppRouter sử dụng `requiredRoles`
   - Component sử dụng `allowedRoles` 
   - Cần thống nhất naming

3. **Missing role definitions**:
   - Không có danh sách đầy đủ các role trong hệ thống
   - Cần define constants cho roles

#### 🟡 Cải tiến đề xuất:

1. **Thêm roles mới**:
   - `ADMIN`: Quản trị viên
   - `TEACHER`: Giáo viên
   - `PARENT`: Phụ huynh
   - `STUDENT`: Học sinh

2. **Route cần bảo vệ thêm**:
   - `/theme-test` → Chỉ ADMIN
   - `/book-story-demo` → TEACHER, PARENT, STUDENT

3. **Hierarchical roles**:
   - ADMIN có thể truy cập tất cả
   - Role inheritance system

### 5. Code Sample cải tiến

```javascript
// roles.constants.js
export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER', 
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
  ADMISSION: 'ADMISSION',
  EDUCATION: 'EDUCATION'
};

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT, ROLES.STUDENT, ROLES.ADMISSION, ROLES.EDUCATION],
  [ROLES.TEACHER]: [ROLES.TEACHER, ROLES.EDUCATION],
  [ROLES.PARENT]: [ROLES.PARENT],
  [ROLES.STUDENT]: [ROLES.STUDENT],
  [ROLES.ADMISSION]: [ROLES.ADMISSION],
  [ROLES.EDUCATION]: [ROLES.EDUCATION]
};
```

### 6. Kết luận

Hệ thống RBAC hiện tại hoạt động cơ bản nhưng cần cải tiến:
- ✅ Có cơ chế bảo vệ route
- ✅ Có role-based access control  
- ❌ Cần thống nhất implementation
- ❌ Cần mở rộng role system
- ❌ Cần bảo vệ một số route còn public
