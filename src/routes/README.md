# Route Structure Documentation

## Overview
This application implements a role-based routing system for a drug prevention community support platform. Each user role has specific access permissions and dedicated layouts.

## User Roles & Access Levels

### 🔴 Admin (Highest Level)
- **Access**: Full system access including admin panel + customer features
- **Layout**: Admin sidebar layout with comprehensive management tools
- **Default Route**: `/admin`
- **Features**:
  - User management
  - Blog management
  - Course management
  - System settings
  - Full customer access

### 🟣 Manager (High Level)
- **Access**: Manager dashboard + customer features
- **Layout**: Manager sidebar layout with oversight tools
- **Default Route**: `/manager`
- **Features**:
  - Staff management
  - Consultant oversight
  - Analytics & reports
  - Program management
  - Operations monitoring
  - Compliance tracking
  - Full customer access

### 🟢 Staff (Medium Level)
- **Access**: Staff dashboard + customer features
- **Layout**: Staff sidebar layout with content management tools
- **Default Route**: `/staff`
- **Features**:
  - Course content management
  - Community program management
  - Assessment creation
  - Event management
  - Resource management
  - User support
  - Full customer access

### 🔵 Consultant (Medium Level)
- **Access**: Consultant dashboard + customer features
- **Layout**: Consultant sidebar layout with consultation tools
- **Default Route**: `/consultant`
- **Features**:
  - Appointment management
  - Client management
  - Consultation sessions
  - Risk assessments
  - Resource library
  - Reports & analytics
  - Full customer access

### 🟡 Customer (Base Level)
- **Access**: Public features + customer dashboard
- **Layout**: Main layout for public + customer sidebar for protected features
- **Default Route**: `/` (home page)
- **Features**:
  - Course enrollment
  - Risk assessments
  - Consultation booking
  - Community participation
  - Personal dashboard
  - Shopping cart
  - Settings management

## Route Structure

```
/
├── Public Routes (Unprotected)
│   ├── / (Home)
│   ├── /courses (Course catalog)
│   ├── /blog (Blog posts)
│   ├── /about (About page)
│   ├── /counseling (Counseling info)
│   ├── /community (Community programs)
│   ├── /assessment (Risk assessment)
│   └── Auth Routes
│       ├── /login
│       ├── /register
│       ├── /forgot-password
│       └── /verify-email
│
├── Admin Routes (Protected - Admin only)
│   ├── /admin (Dashboard)
│   ├── /admin/users (User management)
│   ├── /admin/settings (System settings)
│   ├── /admin/manager-blog (Blog management)
│   ├── /admin/manager-course (Course management)
│   └── /admin/manager-user (User management)
│
├── Manager Routes (Protected - Manager only)
│   ├── /manager (Dashboard)
│   ├── /manager/analytics (Data analytics)
│   ├── /manager/staff (Staff management)
│   ├── /manager/consultants (Consultant management)
│   ├── /manager/programs (Program oversight)
│   ├── /manager/courses (Course oversight)
│   ├── /manager/reports (Reports)
│   ├── /manager/compliance (Compliance tracking)
│   ├── /manager/operations (Operations)
│   ├── /manager/schedule (Schedule management)
│   ├── /manager/reviews (Reviews)
│   └── /manager/settings (Manager settings)
│
├── Staff Routes (Protected - Staff only)
│   ├── /staff (Dashboard)
│   ├── /staff/courses (Course management)
│   ├── /staff/content (Content management)
│   ├── /staff/community-programs (Community programs)
│   ├── /staff/assessments (Assessment management)
│   ├── /staff/events (Event management)
│   ├── /staff/resources (Resource management)
│   ├── /staff/users (User support)
│   ├── /staff/reports (Staff reports)
│   └── /staff/settings (Staff settings)
│
├── Consultant Routes (Protected - Consultant only)
│   ├── /consultant (Dashboard)
│   ├── /consultant/appointments (Appointment management)
│   ├── /consultant/clients (Client management)
│   ├── /consultant/consultations (Consultation sessions)
│   ├── /consultant/assessments (Risk assessments)
│   ├── /consultant/resources (Resource library)
│   ├── /consultant/reports (Consultant reports)
│   └── /consultant/settings (Consultant settings)
│
└── Customer Routes (Protected - All roles)
    ├── /dashboard (Customer dashboard)
    ├── /my-courses (Enrolled courses)
    ├── /my-assessments (Assessment history)
    ├── /appointments (Consultation appointments)
    ├── /cart (Shopping cart)
    ├── /favorites (Favorite items)
    └── /settings (Profile settings)
```

## Security Features

### Route Guards
- **GuardProtectedRoute**: Validates user authentication and role permissions
- **Role-based Access Control**: Each route checks for specific role permissions
- **Automatic Redirects**: Unauthenticated users redirected to login
- **Fallback Routes**: Unknown roles redirect to appropriate default pages

### Layout Security
- **Isolated Layouts**: Each role has its own layout preventing cross-role access
- **Context Protection**: User context validates permissions at component level
- **Sidebar Navigation**: Role-specific navigation prevents unauthorized access

## Implementation Details

### Protected Route Logic
```typescript
switch (role) {
  case UserRole.ADMIN:
    // Admin gets admin routes + customer routes
  case UserRole.MANAGER:
    // Manager gets manager routes + customer routes
  case UserRole.STAFF:
    // Staff gets staff routes + customer routes
  case UserRole.CONSULTANT:
    // Consultant gets consultant routes + customer routes
  case UserRole.CUSTOMER:
    // Customer gets customer routes only
}
```

### Layout Components
- `src/layouts/admin/` - Admin layout with management sidebar
- `src/layouts/manager/` - Manager layout with oversight tools
- `src/layouts/staff/` - Staff layout with content management
- `src/layouts/consultant/` - Consultant layout with consultation tools
- `src/layouts/customer/` - Customer layout with personal tools
- `src/layouts/main/` - Public layout for unprotected pages

### Route Configuration Files
- `src/routes/protected/access/adminPermission.tsx`
- `src/routes/protected/access/managerPermission.tsx`
- `src/routes/protected/access/staffPermission.tsx`
- `src/routes/protected/access/consultantPermission.tsx`
- `src/routes/protected/access/customerPermission.tsx`

## Usage Examples

### Adding New Routes
1. Add route constant to `src/consts/router.path.const.ts`
2. Create page component in appropriate `src/pages/[role]/` directory
3. Add route to respective permission file
4. Update sidebar navigation in layout component

### Role-based Navigation
```typescript
// Example: Adding a new consultant route
{
  path: "new-feature",
  element: <NewFeaturePage />,
}
```

### Page Protection
All protected routes automatically include:
- Authentication verification
- Role permission checking
- Loading states
- Error handling
- Automatic redirects

## Best Practices

1. **Principle of Least Privilege**: Users only access features needed for their role
2. **Hierarchical Access**: Higher roles include lower role capabilities
3. **Consistent Layout**: Each role has consistent navigation and layout
4. **Security First**: All routes protected by default, public routes explicitly defined
5. **User Experience**: Clear role-based navigation with appropriate branding

This routing structure ensures secure, scalable, and maintainable access control for the drug prevention community support platform.
