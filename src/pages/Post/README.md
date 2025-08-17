# Post Page Components

Folder ini berisi halaman Post dan component-component yang khusus digunakan untuk halaman tersebut.

## Struktur Folder

```
src/pages/Post/
├── index.ts                  # Export Post component
├── Post.tsx                  # Halaman utama Post
├── components/
│   ├── index.ts              # Export semua Post components
│   ├── ArticleContent.tsx    # Component untuk render content artikel
│   ├── CodeView.tsx          # Component untuk syntax highlighting code
│   ├── TableOfContents.tsx   # Component untuk table of contents
│   └── Comments.tsx          # Component untuk komentar artikel
└── README.md                 # Dokumentasi ini
```

## Component Overview

### ArticleContent.tsx

- **Fungsi**: Menangani rendering content artikel dengan styling dan YouTube iframe support
- **Props**: `content: string` - HTML content dari WordPress
- **Fitur**:
  - Heading ID injection untuk TOC
  - Code block processing
  - Language detection (Arduino, Python, JavaScript, C++)
  - YouTube iframe responsive styling

### CodeView.tsx

- **Fungsi**: Syntax highlighting untuk code blocks
- **Props**:
  - `code: string` - Code yang akan di-highlight
  - `language?: string` - Bahasa pemrograman (optional)
- **Fitur**:
  - Prism.js syntax highlighting
  - Copy to clipboard
  - Expand/collapse untuk code panjang
  - Error boundary dan fallback

### TableOfContents.tsx

- **Fungsi**: Generate dan manage table of contents dari heading artikel
- **Props**:
  - `content: string` - HTML content untuk extract heading
  - `className?: string` - Additional CSS classes
- **Fitur**:
  - Dynamic heading extraction
  - Scroll tracking dengan Intersection Observer
  - Active section highlighting
  - Smooth scroll navigation

### Comments.tsx

- **Fungsi**: Component untuk menampilkan dan submit komentar artikel
- **Props**:
  - `postId: number` - ID artikel untuk komentar
- **Fitur**:
  - Form komentar dengan validasi (React Hook Form + Zod)
  - Reply system dengan nested comments
  - Guest dan authenticated user support
  - Real-time comment updates
  - Modern UI dengan shadcn/ui components

## Import Usage

```tsx
// Di Post.tsx
import { ArticleContent, TableOfContents, Comments } from "./components";

// Di component lain yang membutuhkan CodeView
import CodeView from "./Post/components/CodeView";

// Di component lain yang membutuhkan Comments
import { Comments } from "./Post/components";
```

## Keuntungan Struktur Ini

1. **Separation of Concerns**: Component Post terpisah dari global components
2. **Maintainability**: Lebih mudah maintain dan debug
3. **Reusability**: Component bisa digunakan di halaman lain jika diperlukan
4. **Organization**: Struktur project lebih rapi dan terorganisir
5. **Scalability**: Mudah menambah component Post-specific baru
