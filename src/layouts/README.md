# Layout Structure Documentation

## Overview
This application uses role-based layouts to provide tailored user interfaces for different user types in the drug prevention community support platform.

## Layout Architecture

### 🏗️ Layout Components Structure
```
src/layouts/
├── main/                   # Public layout
│   ├── Main.layout.tsx     # Main layout wrapper
│   ├── Header.layout.tsx   # Navigation header
│   └── Footer.layout.tsx   # Site footer
├── admin/                  # Admin dashboard layout
│   ├── Admin.layout.tsx    # Admin layout wrapper
│   └── Sidebar.layout.tsx  # Admin sidebar navigation
├── manager/                # Manager dashboard layout
│   ├── Manager.layout.tsx  # Manager layout wrapper
│   └── Sidebar.layout.tsx  # Manager sidebar navigation
├── staff/                  # Staff dashboard layout
│   ├── Staff.layout.tsx    # Staff layout wrapper
│   └── Sidebar.layout.tsx  # Staff sidebar navigation
├── consultant/             # Consultant dashboard layout
│   ├── Consultant.layout.tsx # Consultant layout wrapper
│   └── Sidebar.layout.tsx  # Consultant sidebar navigation
└── customer/               # Customer dashboard layout
    ├── Customer.layout.tsx # Customer layout wrapper
    └── Sidebar.layout.tsx  # Customer sidebar navigation
```

## Layout Types

### 1. 🌐 Main Layout (Public)
**File**: `src/layouts/main/Main.layout.tsx`
- **Usage**: Public pages, unprotected routes
- **Features**:
  - Responsive header with navigation
  - Role-based menu items
  - Authentication controls
  - Brand identity
  - Shopping cart integration
  - Footer with site information

**Components**:
- `Header.layout.tsx` - Top navigation with user menu
- `Footer.layout.tsx` - Site footer with links

### 2. 🔴 Admin Layout
**File**: `src/layouts/admin/Admin.layout.tsx`
- **Usage**: Admin dashboard and management pages
- **Features**:
  - Fixed sidebar navigation
  - Comprehensive management tools
  - System overview access
  - User management
  - Content management
  - System settings

**Sidebar Navigation**:
- Dashboard overview
- User management
- Blog management
- Course management
- System settings

### 3. 🟣 Manager Layout
**File**: `src/layouts/manager/Manager.layout.tsx`
- **Usage**: Manager dashboard and oversight pages
- **Features**:
  - Executive-level navigation
  - Analytics and reporting tools
  - Staff oversight
  - Program management
  - Compliance monitoring

**Sidebar Navigation**:
- Analytics dashboard
- Staff management
- Consultant oversight
- Program management
- Reports and compliance
- Operations monitoring

### 4. 🟢 Staff Layout
**File**: `src/layouts/staff/Staff.layout.tsx`
- **Usage**: Staff content management and operations
- **Features**:
  - Content creation tools
  - Community program management
  - Event coordination
  - Resource management
  - User support tools

**Sidebar Navigation**:
- Course management
- Content creation
- Community programs
- Assessment tools
- Event management
- Resource library

### 5. 🔵 Consultant Layout
**File**: `src/layouts/consultant/Consultant.layout.tsx`
- **Usage**: Consultant practice management
- **Features**:
  - Appointment scheduling
  - Client management
  - Consultation tools
  - Assessment resources
  - Professional reporting

**Sidebar Navigation**:
- Appointment calendar
- Client management
- Consultation sessions
- Risk assessments
- Resource library
- Professional reports

### 6. 🟡 Customer Layout
**File**: `src/layouts/customer/Customer.layout.tsx`
- **Usage**: Customer personal dashboard
- **Features**:
  - Personal account management
  - Course tracking
  - Appointment booking
  - Assessment history
  - Shopping features

**Sidebar Navigation**:
- Personal dashboard
- My courses
- Assessment history
- Appointments
- Shopping cart
- Profile settings

## Sidebar Features

### Common Sidebar Components
All sidebar layouts include:
- **Collapsible Design**: Toggle between expanded and collapsed states
- **Role Branding**: Distinct colors and icons for each role
- **User Profile**: Quick access to profile and settings
- **Logout Functionality**: Secure session termination
- **Responsive Design**: Adapts to different screen sizes

### Sidebar Color Scheme
- **Admin**: Red theme (`#dc2626`) - Authority and power
- **Manager**: Purple theme (`#7c3aed`) - Leadership and strategy
- **Staff**: Green theme (`#16a34a`) - Growth and productivity
- **Consultant**: Blue theme (`#2563eb`) - Trust and professionalism
- **Customer**: Primary theme (`var(--primary)`) - Brand consistency

## Layout Security

### Access Control
- Each layout is protected by role-based authentication
- Sidebar navigation items are role-specific
- Unauthorized access attempts redirect to appropriate pages
- Context-aware user information display

### Route Protection
```typescript
// Example: Admin layout protection
<GuardProtectedRoute
  component={<AdminLayout />}
  allowedRoles={[UserRole.ADMIN]}
/>
```

## Responsive Design

### Breakpoints
- **Desktop**: Full sidebar with labels
- **Tablet**: Collapsible sidebar
- **Mobile**: Drawer-style navigation

### Mobile Considerations
- Touch-friendly navigation
- Optimized spacing
- Gesture support for sidebar toggle
- Responsive content area

## Customization

### Adding New Navigation Items
```typescript
// Example: Adding new menu item to consultant sidebar
const menuItems = [
  // ... existing items
  {
    key: "/consultant/new-feature",
    icon: <NewFeatureIcon />,
    label: <Link to="/consultant/new-feature">New Feature</Link>,
  },
];
```

### Theme Customization
Each layout supports theme customization through:
- CSS custom properties
- Ant Design theme tokens
- Tailwind CSS utilities
- Role-specific color schemes

## Performance Optimization

### Lazy Loading
- Layout components are lazy-loaded
- Reduces initial bundle size
- Improves time to first paint

### Code Splitting
```typescript
const AdminLayout = lazy(() => import("../../../layouts/admin/Admin.layout"));
```

### Memory Management
- Efficient state management
- Proper cleanup on unmount
- Optimized re-renders

## Best Practices

### Layout Design
1. **Consistency**: Maintain consistent navigation patterns
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Performance**: Optimize for fast rendering
4. **Responsiveness**: Ensure mobile-first design
5. **Security**: Validate user permissions at layout level

### Development Guidelines
1. **Modularity**: Keep layout components focused and reusable
2. **Testing**: Write tests for layout behavior and permissions
3. **Documentation**: Document any layout customizations
4. **Version Control**: Track layout changes carefully

### User Experience
1. **Intuitive Navigation**: Clear, predictable menu structure
2. **Visual Hierarchy**: Proper use of colors and typography
3. **Loading States**: Smooth transitions and loading indicators
4. **Error Handling**: Graceful error boundaries

## Integration with Route System

### Layout-Route Mapping
- Each protected route specifies its layout component
- Layouts wrap route content with appropriate navigation
- Context providers ensure user data availability
- Guards validate permissions at layout level

### Route Inheritance
```typescript
// Admin routes inherit admin layout
{
  path: ROUTER_URL.ADMIN.BASE,
  element: <AdminLayout />,
  children: [
    // All admin routes use admin layout
  ]
}
```

This layout system provides a secure, scalable, and user-friendly interface structure for the drug prevention community support platform, ensuring each user role has access to appropriate tools and information.