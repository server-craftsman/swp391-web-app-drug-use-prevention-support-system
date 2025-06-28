# Settings Page Components

## Overview
The Settings page has been modularized into separate, reusable components for better maintainability, readability, and testing.

## Component Structure

```
src/pages/client/settings/
├── index.tsx                 # Main Settings page (orchestrates all components)
├── components/
│   ├── index.ts             # Barrel export for all components
│   ├── SettingsHeader.tsx   # Page header with title and description
│   ├── SettingsTabs.tsx     # Tab navigation and layout
│   ├── ProfileTab.tsx       # Profile management tab content
│   └── PasswordTab.tsx      # Password change tab content
└── README.md                # This documentation
```

## Components

### 🏠 **index.tsx** (Main Page)
- **Purpose**: Main container that orchestrates all settings components
- **Responsibilities**:
  - Manages global loading state
  - Provides layout structure
  - Renders header and tabs
- **Props**: None (root component)

### 📋 **SettingsHeader.tsx**
- **Purpose**: Displays page title and description
- **Responsibilities**:
  - Shows animated page header
  - Provides consistent styling
- **Props**: None
- **Features**: Framer Motion animations

### 🗂️ **SettingsTabs.tsx**
- **Purpose**: Manages tab navigation and content rendering
- **Responsibilities**:
  - Defines tab structure and icons
  - Handles tab switching
  - Passes props to tab components
- **Props**:
  - `loading: boolean` - Global loading state
  - `setLoading: (loading: boolean) => void` - Loading state setter

### 👤 **ProfileTab.tsx**
- **Purpose**: Handles user profile management
- **Responsibilities**:
  - Avatar upload and preview
  - Profile form with validation
  - API calls for profile updates
  - Context and localStorage updates
- **Props**:
  - `loading: boolean` - Loading state for submit buttons
  - `setLoading: (loading: boolean) => void` - Loading state control
- **Features**:
  - File upload with S3 integration
  - Form validation
  - Real-time avatar preview
  - User info updates

### 🔐 **PasswordTab.tsx**
- **Purpose**: Handles password change functionality
- **Responsibilities**:
  - Password change form with validation
  - API calls for password updates
  - Security tips and guidelines
- **Props**:
  - `loading: boolean` - Loading state for submit buttons
  - `setLoading: (loading: boolean) => void` - Loading state control
- **Features**:
  - Password strength validation
  - Confirmation matching
  - Security guidelines
  - Success/error handling

## State Management

### Global State
- **Loading State**: Shared across components to prevent concurrent operations
- **Auth Context**: User information management and updates

### Local State
- **ProfileTab**: Avatar URL, form instances, upload state
- **PasswordTab**: Form instance for password fields

## Benefits of Modularization

### 🔧 **Maintainability**
- **Single Responsibility**: Each component has a clear, focused purpose
- **Easy Updates**: Changes to one feature don't affect others
- **Code Organization**: Related functionality is grouped together

### 🧪 **Testing**
- **Unit Testing**: Each component can be tested independently
- **Mocking**: Easier to mock dependencies for specific components
- **Isolation**: Test specific functionality without side effects

### 🔄 **Reusability**
- **Component Reuse**: Components can be used in other parts of the application
- **Consistent UI**: Shared styling and behavior patterns
- **Props Interface**: Clear contracts between components

### 👥 **Developer Experience**
- **Code Readability**: Smaller, focused files are easier to understand
- **Collaboration**: Multiple developers can work on different components
- **Debugging**: Easier to locate and fix issues in specific features

## Usage Examples

### Adding a New Tab
1. Create a new component in `components/` folder:
```tsx
// components/NotificationsTab.tsx
import React from 'react';

interface NotificationsTabProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ loading, setLoading }) => {
  // Component implementation
  return <div>Notifications Settings</div>;
};

export default NotificationsTab;
```

2. Export it in `components/index.ts`:
```tsx
export { default as NotificationsTab } from './NotificationsTab';
```

3. Add it to `SettingsTabs.tsx`:
```tsx
import { NotificationsTab } from './';

// Add to tabItems array
{
  key: 'notifications',
  label: <span><BellOutlined className="mr-2" />Thông báo</span>,
  children: <NotificationsTab loading={loading} setLoading={setLoading} />,
}
```

### Customizing Components
Each component accepts props for customization and can be easily modified or extended without affecting other parts of the settings page.

## API Integration

### ProfileTab
- **Update Profile**: `UserService.updateUser()`
- **File Upload**: `BaseService.uploadFile()`
- **Auth Context**: Updates user info in context and localStorage

### PasswordTab
- **Change Password**: Direct API call to `API_PATH.USER.CHANGE_PASSWORD`
- **Security**: Validates current password before updating

This modular structure makes the Settings page more maintainable, testable, and scalable for future enhancements. 