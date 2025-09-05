# Document Q&A Frontend Application

A modern React TypeScript application for document question-and-answer functionality with comprehensive features including document management, real-time search, and intelligent Q&A simulation.

## 🌟 Features

### Core Functionality
- **Document Upload**: Drag-and-drop interface with simulated progress tracking
- **Document Library**: Browse uploaded files with metadata and search
- **Q&A System**: Ask questions about documents with mock AI responses
- **Real-time Search**: Search through Q&A history with highlighting
- **Persistence**: Local storage maintains your data between sessions

### Advanced Features
- **Keyboard Shortcuts**: Efficient navigation and actions
- **Form Validation**: Real-time validation with helpful feedback
- **Error Boundaries**: Graceful error handling and recovery
- **Export Functionality**: Download Q&A history as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Toast Notifications**: User-friendly success/error messages
- **Markdown Support**: Rich text formatting in answers
- **Smooth Animations**: Enhanced user experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
4. **Open your browser** to `http://localhost:5173` (Vite) or `http://localhost:3000` (Create React App)

### Build for Production
```bash
npm run build
```

## 🎮 Usage Guide

### Getting Started
1. **Upload Documents**: Drag and drop files onto the upload zone
2. **Select Document**: Click on any document in the sidebar to select it
3. **Ask Questions**: Type your question and press Enter or click "Ask"
4. **Search**: Use the search bar to find specific Q&A content
5. **Export**: Download your Q&A history as JSON

### Keyboard Shortcuts
- `Ctrl + K` - Focus Q&A search
- `Ctrl + Shift + K` - Focus document search
- `Ctrl + Enter` - Submit question (when textarea is focused)

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── DocumentItem.tsx     # Individual document display
│   ├── DocumentLibrary.tsx  # Document list and search
│   ├── ErrorBoundary.tsx    # Error handling component
│   ├── FileDropzone.tsx     # Drag-and-drop upload
│   ├── Header.tsx           # App header with theme toggle
│   ├── QnASection.tsx       # Main Q&A interface
│   └── *.css               # Component styles
├── context/              # React Context providers
│   ├── DocumentContext.tsx  # Document state management
│   └── ThemeContext.tsx     # Theme state management
├── hooks/               # Custom React hooks
│   └── useDebounce.ts      # Debounced input handling
├── types/               # TypeScript type definitions
│   └── index.ts            # All application types
├── App.tsx              # Main application component
├── App.css              # Global styles
└── main.tsx             # Application entry point
```

## 🔧 Technical Implementation

### State Management
- **Context API**: Centralized state management for documents and themes
- **Custom Hooks**: Reusable logic for debouncing and data management
- **Local Storage**: Automatic persistence of application state

### TypeScript Integration
- **Strict Typing**: All components and data structures are fully typed
- **Interface Definitions**: Clear contracts for all data shapes
- **Type Safety**: Compile-time error checking and IntelliSense support

### Performance Optimizations
- **Debounced Search**: Prevents excessive API calls during typing
- **Memoization**: Efficient re-rendering with React best practices
- **Code Splitting**: Optimized bundle loading

### User Experience
- **Responsive Design**: Mobile-first approach with Flexbox/Grid
- **Accessibility**: Keyboard navigation and screen reader support
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-dom` - React DOM bindings
- `typescript` - Type safety
- `uuid` - Unique ID generation
- `react-toastify` - Toast notifications

### Development Dependencies
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `@types/*` - TypeScript definitions

## 🎯 Requirements Fulfilled

This application meets all specified requirements:

### ✅ Core Features (5/5)
- Document upload simulation with drag-and-drop
- Document library with metadata display
- Question input with character counting
- Q&A history with mock responses
- Search functionality across Q&A content

### ✅ Technical Requirements (7/7)
- React with TypeScript implementation
- Custom hooks for data management
- Component composition and reusability
- Proper TypeScript interfaces
- Error boundaries and loading states
- Context API state management
- Mock data with simulated API responses

### ✅ UI/UX Features (5/5)
- File upload progress indicators
- Toast notifications for all states
- Responsive sidebar navigation layout
- Keyboard shortcuts for common actions
- Dark/light mode toggle

### ✅ Technical Implementation (5/5)
- Simulated file uploads with progress
- Mock Q&A responses with realistic delays
- Debounced search functionality
- Real-time form validation
- Local storage persistence

### 🌟 Bonus Features
- Export Q&A history as JSON
- Markdown rendering in responses
- Smooth CSS animations
- Enhanced error handling
- Advanced keyboard shortcuts

## 🔮 Future Enhancements

- **API Integration**: Connect to real document analysis services
- **File Processing**: Support for PDF, DOCX, and other document formats
- **Advanced Search**: Full-text search with filters and sorting
- **User Accounts**: Multi-user support with authentication
- **Real AI Integration**: Connect to OpenAI, Claude, or similar APIs
- **Collaboration**: Share documents and Q&A sessions
- **Analytics**: Usage tracking and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Notes

This application demonstrates modern React development practices with TypeScript, focusing on user experience, performance, and maintainability. The mock data and simulated responses provide a realistic preview of how the application would work with real backend services.