# Cult UI Integration Guide

This guide explains how to use Cult UI components in our project.

## Setup

1. We've already installed the required dependencies:
   ```
   npm install tailwindcss@latest clsx tailwind-merge framer-motion
   ```

2. The `cn` utility function has been created in `src/utils/cn.ts`

3. Tailwind configuration has been updated with Cult UI theming

## Usage Examples

### Buttons

```tsx
// Primary Button
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2">
  Primary
</button>

// Secondary Button
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary hover:text-white h-10 px-4 py-2">
  Secondary
</button>

// Destructive Button
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
  Delete
</button>
```

### Cards

```tsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div className="flex flex-col space-y-1.5 p-6">
    <h3 className="text-2xl font-semibold leading-none tracking-tight">Card Title</h3>
    <p className="text-sm text-muted-foreground">Card Description</p>
  </div>
  <div className="p-6">
    {/* Card content */}
  </div>
  <div className="flex items-center p-6 pt-0">
    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2">
      Action
    </button>
  </div>
</div>
```

### Navigation

```tsx
<nav className="flex items-center space-x-4 lg:space-x-6">
  <a
    href="#"
    className="text-sm font-medium transition-colors hover:text-primary"
  >
    Home
  </a>
  <a
    href="#"
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  >
    Features
  </a>
  <a
    href="#"
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  >
    Pricing
  </a>
  <a
    href="#"
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  >
    About
  </a>
</nav>
```

### Form Elements

```tsx
// Input
<input
  type="text"
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Email"
/>

// Checkbox
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
  />
  <label className="text-sm font-medium leading-none">
    Accept terms and conditions
  </label>
</div>
```

## Additional Resources

- [Cult UI Documentation](https://www.cult-ui.com/docs/installation)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/) 