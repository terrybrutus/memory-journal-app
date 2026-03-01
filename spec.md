# Memory Journal App

A responsive memory journal application with a retro VHS glitch aesthetic that allows users to create, store, and organize memory entries in a timeline format with privacy controls and sharing capabilities.

## Core Features

### Memory Entry Management
- Create memory entries with multiple content types: photos (JPEG, PNG), videos (MP4), audio recordings (MP3, WAV), screenshots, and rich text
- Each memory entry includes caption/notes, tags/categories, auto-generated timestamp, and favorite/highlight toggle
- Timeline view as the main interface showing all memories chronologically
- Welcoming empty state for new users with no memories
- All supported file types (JPEG, PNG, MP3, WAV, MP4) must successfully upload and create memory entries
- Memory creation must work consistently across all media types with proper validation and error handling

### Privacy and Access Control
- All memory entries are stored per Internet Identity, ensuring complete privacy by default
- Each user can only access their own memories when authenticated with their Internet Identity
- Secure authentication system using Internet Identity for user identification and access control

### Memory Sharing
- Generate secure, shareable links for individual memory entries
- Share memories with friends and family via unique, secure URLs
- Set permissions for shared memories: view-only or edit/add access
- Recipients can view shared memories without needing their own account
- Recipients with edit permissions can contribute additional content to shared memories
- Shared link management with ability to revoke access

### Media Support
- Upload and store all specified file types (JPEG, PNG, MP4, MP3, WAV)
- Display preview content with embedded media players/viewers for video, audio, image, and text
- All uploaded media viewable/playable directly within timeline cards
- Robust file upload handling with proper MIME type validation for all supported formats

### Search and Filtering
- Search functionality across all memory content
- Filter by tags/categories, content type, and favorites/highlights
- User-created tags and categories system

### Visual Theme
- Retro VHS glitch aesthetic with subtle animated background effects including horizontal scan lines, RGB channel offset, and static overlays
- Background VHS effects must maintain WCAG-compliant contrast ratios to ensure all text and UI elements remain easily readable
- No shaking, jitter, or glitch effects on interactive elements or memory cards
- Muted/desaturated color palette with vignette effect
- 80s/90s VHS-inspired typography
- All visual effects must be responsive and maintain functionality

## Technical Requirements
- Fully responsive design for mobile, tablet, and desktop
- Timeline view always visible and functional
- All content and UI in English
- Visual consistency with retro VHS theme across all screens
- Accessibility compliance with strong contrast ratios for readability
- Comprehensive file upload validation and error handling for all supported media types
- Secure sharing system with proper access control validation
- Internet Identity integration for authentication and user management

## Backend Data Storage
- Memory entries with metadata (timestamp, caption, tags, favorite status) stored per Internet Identity
- User-created tags and categories associated with each Internet Identity
- Media file storage and references for efficient serving
- File upload handling for all supported media types with proper validation
- Sharing permissions and secure link generation for individual memories
- Access control enforcement ensuring users can only access their own memories or properly shared content
- Shared link metadata including permissions (view/edit) and expiration handling
- Consistent memory creation workflow regardless of media type
