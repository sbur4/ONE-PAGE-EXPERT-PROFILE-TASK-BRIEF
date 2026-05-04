## Step 1: Data Retrieval from EPAM Telescope

### Required Data Points

**Basic Profile Information:**

- Full name and contact details
- Current location and office
- Personal photo URL
- Current project assignment
- Manager information
- Custom role/title

**Professional Profile Data:**

- Work experience and project history
- Technical skills and competencies
- Certifications and training
- Education background
- Languages spoken

**Organizational Information:**

- Current position and level
- Department and practice
- Start date at EPAM
- Career progression within EPAM

**Development & Activities:**

- Extra mile activities
- Professional development initiatives
- Internal training completed
- Mentoring activities

**Staffing Profile (Corporate CV):**

- Detailed project experience
- Client-facing experience
- Technical expertise summary
- Industry experience

## Step 2: Enhanced Template Structure for telescope_profile.js

```javascript
// telescope_profile.js template structure with AI Profile constraints
const profileData = {
    // Hero Section (Required fields)
    hero: {
        fullName: "", // Replace [TOKEN] placeholder
        roleTitle: "", // Current position from Telescope
        tagline: "", // One-liner professional summary
        email: "", // Verified email from Telescope
        linkedInUrl: "", // Must be working URL
        githubUrl: "", // Must return HTTP 200
        photoUrl: "" // Professional photo from Telescope
    },

    // Expertise with Years of Experience (Required)
    expertise: {
        java: 0, // Years of Java experience
        ai: 0, // Years of AI/ML experience
        cloud: 0, // Years of Cloud experience
        devops: 0 // Years of DevOps experience
    },

    // Certifications (Must have working Credly/issuer URLs)
    certifications: [
        {
            name: "", // Certificate name from Telescope
            issueDate: "", // Format: MM/YYYY
            credlyUrl: "", // Must be working verification link
            badgeUrl: "" // Badge image URL
        }
    ],

    // Projects (All links must return HTTP 200)
    projects: [
        {
            name: "", // Project name from Telescope
            description: "", // One-sentence description
            techStack: [], // Technologies used
            impactMetrics: "", // Quantifiable impact
            repoUrl: "", // Must be live GitHub link
            demoUrl: "", // Must be live demo link
            client: "", // Client name (if applicable)
            duration: "", // Project duration
            role: "" // Your role in project
        }
    ],

    // Radar Chart Data (Self-assessed scores 1-10)
    radarChart: {
        programming: 0, // 1-10 scale
        architecture: 0,
        leadership: 0,
        communication: 0,
        problemSolving: 0,
        innovation: 0
    },

    // Timeline (Career progression)
    timeline: [
        {
            employer: "EPAM Systems",
            role: "", // From Telescope
            dateRange: "", // Format: MM/YYYY - Present
            achievement: "" // One headline achievement
        }
    ],

    // Footer Contact
    footer: {
        email: "", // Same as hero email
        linkedIn: "", // Same as hero LinkedIn
        github: "", // Same as hero GitHub
        availabilityStatus: "" // Current availability
    },

    // Additional CV Assets
    assets: {
        cvPdfUrl: "assets/cv.pdf" // Must be present and up to date
    }
};

export default profileData;

```

## Step 3: Technical Implementation Constraints

### Performance Requirements

- Lighthouse Performance score ≥ 90 (mandatory)
- Total page weight < 400 KB
- WCAG 2.1 AA contrast standards compliance

### Technology Stack Constraints

- Vanilla HTML5, CSS3, and JavaScript only (no frameworks)
- Chart.js 4.x via CDN for radar charts
- Simple Icons or Devicons SVGs for tech logos
- Single index.html or organized as /css, /js, /assets structure

### Responsive Design Requirements

- 4-column grid for ≥1280px viewport
- 2-column grid for 768–1279px viewport
- Single-column layout for <768px viewport

### Animation Requirements

- Particle canvas hero background
- Scroll-reveal fade-up animations
- Radar chart drawing animation on viewport entry
- Certification badge glow effect on hover

### Deployment Constraints

- Host on GitHub Pages or Netlify free tier
- Custom .dev domain recommended
- Must be tested on both mobile and desktop devices

## Step 4: Content Validation and Quality Assurance

### Pre-Deployment Checklist

- All [TOKEN] placeholders replaced with real Telescope data
- All certification badges link to working Credly/issuer URLs
- All project links (GitHub/demo) return HTTP 200 status
- Downloadable CV (assets/cv.pdf) present and current
- No placeholder values visible on the page
- Lighthouse Performance score ≥ 90 achieved
- Page tested and functional on mobile devices
- Page tested and functional on desktop devices
- Performance score screenshot attached as proof

### Link Verification Process

- Test all external URLs before deployment
- Verify Credly certification links are active
- Ensure GitHub repository links are public and accessible
- Validate demo links return successful responses
- Confirm LinkedIn and contact links work properly

### Content Completeness Check

- Hero section: All required fields populated from Telescope
- Expertise: Years calculated from Telescope work history
- Certifications: All certificates from Telescope with verification
- Projects: EPAM projects with quantifiable impact metrics
- Radar chart: Self-assessment scores provided
- Timeline: Complete career progression from Telescope
- Footer: All contact information verified and current

## Step 5: Automated Workflow with Constraints

1. Data Extraction & Validation
    - Query EPAM Telescope for complete profile data
    - Validate all URLs and links before processing
    - Calculate years of experience from project history
    - Extract and verify certification details
2. Template Population with Compliance
    - Replace all placeholder tokens with real data
    - Ensure no [TOKEN] values remain in final output
    - Validate all external links return HTTP 200
    - Generate downloadable PDF version
3. Performance Optimization
    - Optimize images and assets to meet 400KB limit
    - Implement lazy loading for non-critical resources
    - Minify CSS and JavaScript files
    - Compress and optimize all images
4. Quality Assurance Testing
   - Run Lighthouse performance audit
   - Test responsive design across all breakpoints
   - Verify accessibility compliance (WCAG 2.1 AA)
   - Validate all animations and interactions
5. Deployment and Verification
   - Deploy to GitHub Pages or Netlify
   - Test live URL on mobile and desktop
   - Capture and save Lighthouse performance screenshot
   - Verify all external links work in production environment

## Implementation Notes

### EPAM Telescope Integration

**Based on EPAM Telescope capabilities, the system can access:**

- Standard Employee Profile Data: Contact info, location, project, managers, photo, custom role
- Professional Activities: Skills, certifications, training history
- Organizational Attributes: Position, department, career progression
- Extra Mile Activities: Development initiatives, mentoring, community involvement
- Staffing Profile: Corporate CV data for client-facing purposes

### Data Mapping Strategy

- Personal Info: Direct mapping from Telescope basic profile
- Experience Calculation: Derive years from project history and start dates
- Skills Assessment: Convert Telescope skills data to radar chart scores
- Project Portfolio: Transform Telescope project data to showcase format
- Certification Verification: Validate and link all certificates from Telescope

### Quality Standards

**This implementation ensures:**

- Technical Excellence: High performance and accessibility standards
- Professional Presentation: Client-ready CV format
- Data Integrity: All information verified and up-to-date
- Compliance: Meets both EPAM standards and modern web requirements