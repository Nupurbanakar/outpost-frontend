# Styling Audit Report

**Date:** October 22, 2026  
**Scope:** Key pages and components of the Outpost Frontend  
**Objective:** Identify styling inconsistencies and provide recommendations for design system alignment

---

## Executive Summary

This audit reviews the styling across the Outpost platform to ensure consistency with the established design system. The platform aims for an **editorial, field-notes aesthetic** with warm tones, generous whitespace, and sharp corners.

### Overall Findings

- **Strengths:** Well-defined design tokens in Tailwind config, consistent use of ink/paper-light colors in core pages
- **Issues:** HomePage uses a different design language (gradient-heavy, rounded, modern SaaS style) that conflicts with the editorial aesthetic
- **Priority:** HomePage redesign to align with the Outpost design system

---

## Design System Documentation

### Color Palette

Based on Tailwind config (`tailwind.config.js`):

| Token | Hex | Usage |
|-------|-----|-------|
| **ink** | `#202c3d` | Primary text, headings, buttons |
| **paper** | `#f7f4ec` | Page backgrounds |
| **paper-light** | `#fbf9f3` | Cards, elevated surfaces |
| **line** | `#ded7ca` | Borders, dividers |
| **gold/primary** | `#d69b42` | Primary accent color |
| **gold-dark** | `#94651f` | Gold text on light backgrounds |
| **gold-light** | `#f2e5cc` | Gold badge backgrounds |
| **green** | `#467c68` | Success states, challenge category |
| **green-light** | `#deebe4` | Green badge backgrounds |
| **green-dark** | `#376c59` | Green text |
| **rose** | `#b86a64` | Mentor category, warnings |
| **rose-light** | `#f0dfdc` | Rose badge backgrounds |
| **muted-text** | `#72777b` | Secondary text |

### Typography

- **Sans:** DM Sans (body text)
- **Serif:** Manrope (headings)
- **Mono:** IBM Plex Mono (labels, uppercase tags)

### Border Radius

- **Default:** `0` (sharp corners throughout)
- **Exception:** `50%` for avatars and circular elements only

### Spacing

4px-based system: `1, 2, 3, 4, 5, 6, 8, 10, 16, 24`

### Shadows

Minimal, subtle shadows:
- Card hover: `0 8px 22px rgba(32, 44, 61, 0.06)`
- Hero: `9px 12px 0 rgba(41, 51, 66, 0.035)`
- Auth: `0 15px 50px rgba(31, 43, 57, 0.07)`

---

## Page-by-Page Audit

### 1. HomePage (Landing Page)

**File:** `src/pages/HomePage.tsx`

#### Issues Identified

❌ **Critical: Completely different design language**

| Element | Current Style | Expected Style |
|---------|---------------|----------------|
| **Background** | `gradient-to-br from-slate-50 via-white to-indigo-50/30` | `bg-paper` or `bg-paper-light` |
| **Button** | `bg-gradient-to-r from-indigo-600 to-purple-600`, `rounded-xl` | `bg-ink text-paper-light`, sharp corners |
| **Color scheme** | Indigo/purple gradient, modern SaaS style | Ink/paper/gold editorial style |
| **Border radius** | `rounded-xl`, `rounded-2xl`, `rounded-full` throughout | `0` for all except avatars |
| **Card style** | `rounded-2xl shadow-xl border border-slate-100` | Sharp corners, `border-line`, subtle shadow |
| **Badge** | `bg-indigo-50 border-indigo-100 rounded-full` | `bg-[#f5f3ed] border-line`, sharp corners |
| **Typography** | No serif headings | `font-serif` for all headings |
| **Animations** | Floating cards with custom keyframes | Rise-in stagger animation |

#### Specific Elements

**Hero Section:**
- ❌ Indigo gradient background instead of paper tones
- ❌ Rounded pills and buttons
- ❌ Purple/pink gradient text instead of ink
- ❌ "Start Free Today" CTA should be "Explore Opportunities" or similar
- ❌ Floating card animations don't match editorial aesthetic

**Features Section:**
- ❌ Bento grid uses colorful gradients (`from-emerald-500 to-teal-600`)
- ❌ Should use category colors (gold, green, rose) with badges
- ❌ Rounded cards instead of sharp corners

**CTA Section:**
- ❌ Gradient background (`from-indigo-600 to-purple-600`)
- ❌ Should use warm editorial tone (ink on paper-light)

**Footer:**
- ✅ Good structure
- ❌ Colors need adjustment (slate-900 → ink, slate-400 → muted-text)
- ❌ Logo uses gradient instead of ink

#### Recommendations

1. **Redesign HomePage** to align with DiscoverPage aesthetic
2. **Use editorial color palette:** ink, paper-light, gold accents
3. **Replace gradients** with solid colors from design tokens
4. **Remove all border-radius** except for avatars/icons
5. **Use font-serif** for all headings
6. **Implement subtle shadows** instead of bold shadows
7. **Replace floating animations** with rise-in stagger
8. **Adjust CTA language** to be less "SaaS-y", more editorial

---

### 2. DiscoverPage ✅

**File:** `src/pages/DiscoverPage.tsx`

#### Analysis

✅ **Excellent adherence to design system**

| Element | Implementation | Status |
|---------|----------------|--------|
| **Background** | `bg-paper-light` | ✅ Correct |
| **Headings** | `font-serif font-bold text-ink` | ✅ Correct |
| **Cards** | `bg-paper-light border border-line` | ✅ Correct |
| **Buttons** | `bg-ink text-paper-light hover:bg-[#304258]` | ✅ Correct |
| **Badge** | `bg-[#f5f3ed] border border-[#ddd6c9]` | ✅ Correct |
| **Icons** | Gold/green/rose category colors | ✅ Correct |
| **Typography** | Serif headings, sans body text | ✅ Correct |
| **Spacing** | Generous whitespace, 4px-based | ✅ Correct |

#### Minor Suggestions

- ✨ Consider adding rise-in animation to stats cards
- ✨ Could enhance "Closing Soon" stat with actual deadline data

---

### 3. GrantsPage ✅

**File:** `src/pages/GrantsPage.tsx`

#### Analysis

✅ **Strong alignment with design system**

| Element | Implementation | Status |
|---------|----------------|--------|
| **Layout** | Clean, editorial grid | ✅ Correct |
| **Typography** | `font-serif` for headings | ✅ Correct |
| **Colors** | Ink/paper-light/gold | ✅ Correct |
| **Filters** | Consistent pill style | ✅ Correct |
| **AI badge** | Green with Sparkles icon | ✅ Correct |
| **Cards** | OpportunityCard component | ✅ Correct |

#### Minor Issues

- ⚠️ Filter pills use `bg-ink` when active
  - Consider: `bg-[#f5f3ed] border-2 border-ink` for active state to maintain warmth
- ✅ Pagination component follows design system

---

### 4. ProfilePage ✅

**File:** `src/pages/ProfilePage.tsx`

#### Analysis

✅ **Excellent implementation of editorial style**

| Element | Implementation | Status |
|---------|----------------|--------|
| **Layout** | Single column, generous spacing | ✅ Correct |
| **Colors** | Ink/paper-light/gold accent | ✅ Correct |
| **Icons** | Gold-toned icon backgrounds `bg-[#f5f3ed]` | ✅ Correct |
| **Buttons** | Sharp corners, ink background | ✅ Correct |
| **Inputs** | Clean, sharp corners, proper focus states | ✅ Correct |
| **Section dividers** | `border-b border-line` | ✅ Correct |

#### Minor Suggestions

- ✅ Read-only fields properly styled with disabled state
- ✅ Success/error messages have proper color coding
- ✨ Consider adding subtle hover state to editable sections

#### Issues

- ⚠️ Links use `text-indigo-600 hover:text-indigo-700`
  - **Should be:** `text-[#b58c4f] hover:text-[#94651f]` (gold tones)

---

### 5. MentorDetailPage ✅

**File:** `src/pages/MentorDetailPage.tsx`

#### Analysis

✅ **Strong adherence with minor exceptions**

| Element | Implementation | Status |
|---------|----------------|--------|
| **Layout** | Two-column with sticky sidebar | ✅ Correct |
| **Avatar** | Circular with fallback initials | ✅ Correct |
| **Typography** | Serif headings, proper hierarchy | ✅ Correct |
| **Colors** | Ink/paper-light/gold/green | ✅ Correct |
| **Sidebar card** | `bg-[#f5f3ed] border border-line` | ✅ Correct |
| **Expertise tags** | `bg-[#f5f3ed] text-ink border border-line` | ✅ Correct |

#### Issues

- ✅ No border-radius except for avatar (correct)
- ✅ Proper use of green accent for headline `text-[#2d6a4f]`
- ✅ Breadcrumb navigation follows style guide

---

## Component-Level Audit

### OpportunityCard Component ✅

**File:** `src/components/OpportunityCard.tsx`

✅ **Excellent implementation**

- Sharp corners throughout
- Proper category badges with correct colors:
  - Grant: `bg-[#f0f9f4] text-[#2d6a4f] border-[#95d5b2]`
  - Challenge: `bg-[#fef3e2] text-[#b58c4f] border-[#f4d8a8]`
- AI reason box with green background
- Hover states with subtle shadow
- Proper use of ink/paper-light colors

### MentorCard Component ✅

**File:** `src/components/MentorCard.tsx`

✅ **Well-implemented with dark variant**

- Supports light and dark variants
- Circular avatar (correct exception to sharp corners)
- Proper color mapping for dark mode:
  - `bg-[#1f2b25]` for dark cards
  - `text-[#e8f0ed]` for dark text
- Grayscale image effect with color on hover (nice touch!)
- AI reason support

#### Minor Suggestion

- ✨ Consider extracting dark mode colors to Tailwind config as `dark-surface`, `dark-text`, etc.

### UI Components

#### Button Component (`src/components/ui/Button.tsx`)

✅ **Solid implementation**

| Variant | Colors | Status |
|---------|--------|--------|
| **Primary** | `bg-ink text-paper-light hover:bg-[#304258]` | ✅ Correct |
| **Secondary** | `bg-transparent text-ink border hover:bg-[#eee9de]` | ✅ Correct |
| **Ghost** | `bg-transparent text-ink hover:bg-paper` | ✅ Correct |

- Sharp corners (default border-radius: 0) ✅
- Proper focus states ✅
- Disabled states handled ✅

#### Card Component (`src/components/ui/Card.tsx`)

✅ **Perfect alignment**

- `bg-[#fffdf8]` (cream white)
- `border border-[#ded8cc]`
- Sharp corners
- Subtle hover lift with shadow
- Matches design system perfectly

---

## Inconsistencies Summary

### Critical Issues

1. **HomePage design conflict** (Priority 1)
   - Completely different design language
   - Modern SaaS gradient style vs. editorial field-notes style
   - **Impact:** Brand inconsistency, confusing user experience
   - **Fix:** Full redesign using DiscoverPage as reference

### Medium Issues

2. **Link colors in ProfilePage** (Priority 2)
   - Using indigo (`text-indigo-600`) instead of gold
   - **Fix:** Replace with `text-[#b58c4f] hover:text-[#94651f]`

3. **Active filter pill style** (Priority 3)
   - Could be warmer with outlined style
   - **Fix:** Use outlined style with border-2 for active state

### Minor Suggestions

4. **Dark mode color tokens** (Enhancement)
   - Extract dark mode colors to Tailwind config
   - Makes MentorCard and future dark components more maintainable

5. **Animation library** (Enhancement)
   - Add rise-in stagger animations to more pages
   - Currently only documented in style guide, not widely used

---

## Recommendations

### Immediate Actions

1. **Redesign HomePage** to match editorial aesthetic
   - Use DiscoverPage as the style reference
   - Replace all gradients with solid colors
   - Remove border-radius except for avatars
   - Use serif headings throughout
   - Implement proper color tokens

2. **Fix link colors** in ProfilePage
   - Global search and replace for indigo colors
   - Use gold tones consistently

### Short-term Improvements

3. **Create reusable animation utilities**
   ```css
   @keyframes rise-in {
     from { opacity: 0; transform: translateY(12px); }
     to { opacity: 1; transform: translateY(0); }
   }
   ```

4. **Extend Tailwind config** with dark mode colors
   ```js
   dark: {
     surface: '#1f2b25',
     text: '#e8f0ed',
     accent: '#6b8073',
   }
   ```

5. **Document component patterns**
   - Create storybook or component showcase
   - Document when to use light vs. dark variants

### Long-term Enhancements

6. **Accessibility audit**
   - Verify color contrast ratios
   - Test keyboard navigation
   - Add focus-visible indicators consistently

7. **Performance optimization**
   - Consider reducing shadow usage
   - Optimize animation performance

8. **Design token automation**
   - Consider using CSS custom properties for runtime theming
   - Make it easier to test alternative color schemes

---

## Design System Compliance Score

| Page/Component | Score | Notes |
|----------------|-------|-------|
| **DiscoverPage** | 10/10 | Perfect reference implementation |
| **GrantsPage** | 9.5/10 | Minor filter pill suggestion |
| **ProfilePage** | 9/10 | Link color issue |
| **MentorDetailPage** | 10/10 | Excellent implementation |
| **HomePage** | 2/10 | Requires full redesign |
| **OpportunityCard** | 10/10 | Perfect |
| **MentorCard** | 10/10 | Perfect |
| **UI Button** | 10/10 | Perfect |
| **UI Card** | 10/10 | Perfect |

**Overall Average:** 8.9/10 (9.8/10 excluding HomePage)

---

## Conclusion

The Outpost platform has a **strong, well-defined design system** with excellent implementation across most pages. The primary issue is the **HomePage**, which uses a completely different design language that conflicts with the editorial aesthetic.

### Next Steps

1. ✅ **This audit document created**
2. ⏭️ **Redesign HomePage** (FE-060)
3. ⏭️ **Fix link colors** (FE-061)
4. ⏭️ **Add animation utilities** (FE-062)
5. ⏭️ **Accessibility review** (FE-063)

### Reference Pages

When creating new pages or components, use these as style references:

- **DiscoverPage:** Overall layout, stats cards, section headers
- **ProfilePage:** Form styling, icon backgrounds, sections
- **MentorDetailPage:** Two-column layout, sidebar cards
- **OpportunityCard:** Card hover states, badges, AI reason boxes
- **MentorCard:** Dark variant implementation

---

**Auditor Note:** The design system is well-documented and the implementation quality is high. The main task ahead is bringing the HomePage into alignment with the established editorial aesthetic. Once that's done, the platform will have excellent design consistency throughout.
