# SPEC.md – Pre-MVP Landing Site (resp.ph)

## 1. Purpose
The Pre-MVP Landing Site is a **teaser website** to:
- Communicate the platform’s vision.  
- Segment audiences (Aspiring, Licensed, Providers).  
- Capture leads (email waitlist).  
- Build early credibility (About page, Developer’s message, Privacy/Terms).  

No seminar listings or functional flows yet.  

---

## 2. Pages & Sitemap
```
/ (Landing Page)
/about
/privacy
/terms
```
Optional later: `/contact`

---

## 3. Branding & Visual Direction
- **Colors**  
  - Primary (Blue): `#1E3A8A`  
  - Accent (Green): `#059669`  
  - Highlight (Yellow): `#FACC15`  
  - Neutral BG: `#F9FAFB`  
  - Text Dark: `#111827`  
  - Text Light: `#6B7280`  

- **Typography**: Inter (Google Fonts)  
  - Headings: Bold  
  - Body: Regular  
  - CTAs: SemiBold  

- **Layout**: Clean, modern, mobile-first.  
- **Imagery**: Aspirational, not stocky. UI mockups as placeholders.  

---

## 4. Landing Page Structure

### Hero Section
- Background: Deep Blue (`#1E3A8A`)  
- Elements:  
  - Headline: *“Your Real Estate Career, From Start to Success”*  
  - Subtext: *“From aspiring to licensed professionals — review classes, CPD seminars, and university programs, all in one place.”*  
  - CTA: `[Join the Waitlist]` (green button)  
- Placeholder graphic: `hero-image.jpg` (young professionals in classroom/seminar)  

---

### Who It’s For
- 3 blocks, equal weight, **no buttons**.  
- Icons (placeholders: `icon-aspiring.svg`, `icon-licensed.svg`, `icon-provider.svg`)  
- Text:  
  - **Aspiring Professionals 🎓** → “Pass your board exams with review classes and university programs.”  
  - **Licensed Professionals 📜** → “Stay compliant and ahead with accredited CPD seminars.”  
  - **Providers & Universities 🏫** → “List your courses and degree programs nationwide.”  

---

### Preview Section
- 3 preview mockup cards:  
  - `preview-seminar-listing.png` (fake seminar cards)  
  - `preview-review-classes.png` (aspiring courses)  
  - `preview-provider-profile.png` (provider microsite)  
- Tagline: *“Here’s what we’re building — tailored for every role.”*  

---

### Signup Section
- Background: Light Gray (`#F9FAFB`)  
- Title: *“Be the First to Know When We Launch”*  
- Fields:  
  - Name (optional)  
  - Email (required)  
  - Role (dropdown: Aspiring / Licensed / Provider)  
  - If Provider → Accreditation Number (optional)  
  - Questions/Comments (optional textarea)  
- CTA: `[Join the Waitlist]` (green button)  

---

### Provider CTA (Dedicated Block)
- Title: *“For Providers and Universities”*  
- Text: *“Post your seminars, review classes, or degree programs nationwide.”*  
- CTA: `[Become a Provider]` (blue button)  
- Placeholder background: `provider-cta-bg.jpg`  

---

### Footer
- Links: About Us | Contact | PRC Info | Privacy & Terms  
- Logo placeholder: `resp-logo.png`  

---

## 5. About Page Structure

### Header
- Background: `about-hero.jpg` (skyline/seminar)  
- Headline: *“About resp.ph”*  

### Our Mission
- Icon: `icon-mission.svg`  
- Text: *“We’re building the first dedicated platform for every stage of a real estate career in the Philippines...”*  

### Our Team
- Icon: `icon-team.svg`  
- Text: *“resp.ph is created by licensed practitioners...”*  
- Placeholders: `team-member1.jpg`, `team-member2.jpg`  

### Developer’s Message
- Avatar: `dev-avatar.png`  
- Highlighted box:  
  *“resp.ph is built from the ground up by professionals in the industry. As the lead developer, I want this platform to be transparent, simple, and focused on helping real estate practitioners grow their careers.”*  

### Contact
- Icon: `icon-contact.svg`  
- Email: `support@resp.ph`  

### Footer
- Same as Landing Page  

---

## 6. Privacy & Terms Pages
- Simple boilerplate text (generated or template-based).  
- Include branding (logo, header).  

---

## 7. File Structure (Recommended)
```
/resp-ph/
  index.html          (Landing Page)
  /about.html
  /privacy.html
  /terms.html
  /css/
    style.css         (global styles)
  /images/
    hero-image.jpg
    about-hero.jpg
    provider-cta-bg.jpg
    resp-logo.png
    icon-aspiring.svg
    icon-licensed.svg
    icon-provider.svg
    icon-mission.svg
    icon-team.svg
    icon-contact.svg
    preview-seminar-listing.png
    preview-review-classes.png
    preview-provider-profile.png
    team-member1.jpg
    dev-avatar.png
```

---

## 8. CSS Best Practices
- **External file only** → `/css/style.css`.  
- **Reusable classes**: `.section`, `.card`, `.cta-button`.  
- **Mobile-first breakpoints** (`@media (max-width: 640px)`).  
- **Accessibility**: alt text on all images, semantic HTML, color contrast compliant.  
- **Performance**: optimize images to `.webp` where possible.  
