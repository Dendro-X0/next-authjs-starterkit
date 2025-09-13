# Troubleshooting

## Common Issues

### 1. pnpm Virtual Store Issues
If you encounter virtual store location conflicts:
```bash
pnpm config set virtual-store-dir "node_modules/.pnpm"
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. Missing Shadcn UI Dependencies
The UI components require additional Radix UI dependencies. Install them as needed:
```bash
pnpm add @radix-ui/react-accordion @radix-ui/react-aspect-ratio @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

### 3. TypeScript Path Resolution
If you encounter path alias issues when running `tsc` directly, use Next.js build instead:
```bash
pnpm build
```

### 4. Prisma Client Generation
If you get Prisma client errors:
```bash
pnpm prisma generate
```
