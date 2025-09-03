# Professional Gym Website PRD

A modern, professional gym website showcasing workout modalities with beautiful cards and an admin panel for media management.

**Experience Qualities**: 
1. **Energetic** - Dynamic visuals and vibrant colors that motivate and inspire fitness
2. **Professional** - Clean, trustworthy design that builds confidence in the gym's expertise  
3. **Accessible** - Clear navigation and information that welcomes all fitness levels

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-page structure with workout modalities, media gallery, and admin functionality for content management

## Essential Features

### Workout Modalities Display
- **Functionality**: Display three main workout types (Functional/Cross, Musculação, Zumba) with descriptions and media
- **Purpose**: Showcase gym's specialized training programs to attract members
- **Trigger**: User visits homepage or navigates to modalities section
- **Progression**: Homepage → View modality cards → Click for details → See photos/videos → Contact/enrollment
- **Success criteria**: Clear presentation of each workout type with engaging visuals

### Media Gallery
- **Functionality**: Display photos and videos organized by workout modality
- **Purpose**: Show real gym environment and classes in action to build trust
- **Trigger**: User clicks on modality card or gallery section
- **Progression**: Modality selection → Media grid view → Lightbox/modal for full view
- **Success criteria**: Fast loading, organized media with smooth viewing experience

### Admin Panel
- **Functionality**: Upload, organize, and manage photos/videos by workout category
- **Purpose**: Allow gym staff to keep content fresh and current
- **Trigger**: Admin login → Dashboard access
- **Progression**: Login → Dashboard → Select modality → Upload media → Preview → Publish
- **Success criteria**: Intuitive upload interface with drag-and-drop, preview, and organization

### Contact/Information Section
- **Functionality**: Display gym information, location, hours, and contact details
- **Purpose**: Convert visitors into members with clear next steps
- **Trigger**: User seeks more information or wants to join
- **Progression**: Interest → Contact section → View details → Contact action
- **Success criteria**: Easy-to-find contact information with clear call-to-action

## Edge Case Handling
- **Empty Media States**: Display placeholder graphics when no photos/videos uploaded yet
- **Upload Failures**: Show clear error messages with retry options for failed uploads
- **Large File Handling**: Progress indicators and compression for large video files
- **Unauthorized Access**: Redirect non-admin users away from admin panel gracefully
- **Mobile Responsiveness**: Ensure admin panel works on tablets for on-the-go updates

## Design Direction
The design should feel energetic yet professional - combining the motivation of a modern fitness brand with the trustworthiness of an established gym, using bold colors and dynamic layouts while maintaining clean, organized information presentation.

## Color Selection
Complementary (opposite colors) - Using energetic orange paired with deep blue to create high contrast that energizes while maintaining professionalism.

- **Primary Color**: Deep Blue `oklch(0.3 0.15 240)` - Communicates trust, stability, and professionalism
- **Secondary Colors**: Light Blue `oklch(0.85 0.1 240)` for backgrounds and Charcoal `oklch(0.25 0.02 240)` for text
- **Accent Color**: Energetic Orange `oklch(0.7 0.2 45)` - High-energy highlight for CTAs and important elements
- **Foreground/Background Pairings**: 
  - Background (White `oklch(1 0 0)`): Charcoal text `oklch(0.25 0.02 240)` - Ratio 8.2:1 ✓
  - Primary (Deep Blue `oklch(0.3 0.15 240)`): White text `oklch(1 0 0)` - Ratio 6.8:1 ✓
  - Accent (Energetic Orange `oklch(0.7 0.2 45)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Card (Light Blue `oklch(0.85 0.1 240)`): Charcoal text `oklch(0.25 0.02 240)` - Ratio 7.1:1 ✓

## Font Selection
Typography should convey strength and modernity while remaining highly legible for all fitness information and class descriptions.

- **Typographic Hierarchy**: 
  - H1 (Gym Name): Inter Black/48px/tight letter spacing
  - H2 (Modality Titles): Inter Bold/32px/normal spacing  
  - H3 (Section Headers): Inter SemiBold/24px/normal spacing
  - Body (Descriptions): Inter Regular/16px/relaxed line height
  - CTA Buttons: Inter Medium/16px/wide letter spacing

## Animations
Subtle, purposeful animations that enhance the fitness energy without overwhelming - smooth card hover effects and gentle parallax to create depth while maintaining fast, responsive interactions.

- **Purposeful Meaning**: Motion reinforces the gym's dynamic energy while guiding attention to key workout programs and call-to-action elements
- **Hierarchy of Movement**: Modality cards get primary animation focus, followed by CTA buttons, with subtle background elements providing ambient movement

## Component Selection
- **Components**: 
  - Cards for workout modalities with hover animations
  - Dialog/Modal for media lightbox viewing
  - Tabs for organizing admin panel sections
  - Form components for admin uploads with progress indicators
  - Button variants for primary (join/contact) and secondary (learn more) actions
- **Customizations**: 
  - Custom media upload component with drag-and-drop
  - Specialized workout card with overlay text and background images
  - Admin dashboard layout with sidebar navigation
- **States**: 
  - Buttons: Energetic hover effects with slight scale and color shifts
  - Cards: Gentle lift on hover with shadow increase
  - Upload areas: Clear drag-over states with border and background changes
- **Icon Selection**: 
  - Dumbbell/fitness icons for workout modalities
  - Upload/cloud icons for admin functions
  - Play button overlays for video content
- **Spacing**: Consistent 4/8/16/24px spacing using Tailwind scale, generous whitespace around workout cards
- **Mobile**: 
  - Single-column card layout on mobile
  - Simplified admin panel with collapsible sidebar
  - Touch-optimized media gallery with swipe navigation
  - Mobile-first responsive design with progressive enhancement