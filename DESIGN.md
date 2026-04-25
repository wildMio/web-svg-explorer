---
name: SVGOLOT
description: Restrained dark workbench for SVG review, optimization, and export.
colors:
  base-ink: "#10161D"
  panel-slate: "#151E26"
  control-slate: "#1B252F"
  raised-slate: "#22303B"
  code-well: "#111921"
  line-soft: "#99B2BC29"
  line-strong: "#99B2BC47"
  text-primary: "#EEF3F5"
  text-secondary: "#DBE5EAC2"
  text-muted: "#B5C6CDAD"
  action-teal: "#66C3B2"
  action-teal-soft: "#66C3B224"
  warning-amber: "#D9A95A"
  success-sage: "#72BF95"
  danger-rose: "#D98686"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.96rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  supporting:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xs: "10px"
  sm: "11px"
  md: "13px"
  lg: "14px"
  xl: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-teal-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.control-slate}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "42px"
  chip-status:
    backgroundColor: "{colors.control-slate}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "6px 13px"
  panel-surface:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "16px 20px"
  input-text:
    backgroundColor: "{colors.control-slate}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "13px 14px"
  code-well:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: SVGOLOT

## 1. Overview: The Asset Review Bench

**Creative North Star: "The Asset Review Bench"**

A frontend engineer is reviewing a directory of exported icons beside an editor, browser devtools, and a design source file, usually in a workspace already dominated by dark code surfaces. SVGOLOT should feel like the quiet inspection bench in that flow: low-glare, explicit about state, and dense enough to keep preview, metadata, settings, and markup in one place.

The system is restrained and operational. It uses tinted dark neutrals, one controlled teal accent, native-feeling typography, and minimal elevation so the SVG assets stay central. It explicitly rejects marketing-page behavior, playful gallery energy, and decorative dashboard tropes. This is a product tool. Design serves review speed and trust in output.

**Key Characteristics:**

- Dark, low-glare shell with blue-green tinted neutrals.
- One operational teal accent used for primary action, selection, and active state.
- Native sans typography with a compact fixed scale.
- Flat resting surfaces, with elevation reserved for hover, popover, and selected state.
- Dense but readable workflow, where preview, metadata, markup, and settings remain tightly coupled.

## 2. Colors: The Low-Glare Workbench Palette

A restrained palette built from cool dark neutrals and one controlled teal accent, with secondary colors reserved for state rather than decoration.

### Primary

- **Action Teal** (#66C3B2): Primary actions, active chips, selected asset state, and focus accents. This is the only expressive accent in the system.

### Neutral

- **Base Ink** (#10161D): App background and outer frame.
- **Panel Slate** (#151E26): Main shell panels, summary bars, empty state, and asset cards.
- **Control Slate** (#1B252F): Buttons, inputs, toggle rows, chips, and small control surfaces.
- **Raised Slate** (#22303B): Hover and active lift for controls that need a stronger state layer.
- **Code Well** (#111921): Markup surface and dense code background.
- **Soft Line** (#99B2BC29): Resting borders and separators.
- **Strong Line** (#99B2BC47): Emphasized control outlines and stronger interaction edges.
- **Primary Text** (#EEF3F5): Main content and labels.
- **Secondary Text** (#DBE5EAC2): Explanatory copy, helper text, and lower-priority metadata.
- **Muted Text** (#B5C6CDAD): Eyebrows, tertiary labels, and recessed state language.

### State Signals

- **Warning Amber** (#D9A95A): Long-running work and in-progress state.
- **Success Sage** (#72BF95): Completed optimization and successful state.
- **Danger Rose** (#D98686): Error-risk or negative-change state.

### Named Rules

**The Quiet Shell Rule.** Neutrals do most of the work. Accent belongs to actions and current state, not decoration.

**The Inspection Contrast Rule.** Preview, metadata, and code surfaces must separate clearly without jumping to pure black or pure white.

**The One-Action Accent Rule.** Action Teal is the only high-attention accent. Warning, success, and danger colors are for status only.

## 3. Typography: Native and Code-Adjacent

**Display Font:** -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif

**Body Font:** -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif

**Label/Mono Font:** ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace

**Character:** Typography should feel native to a developer workstation: compact, familiar, and trustworthy. The system uses one sans family for operational UI and a monospace face only where markup and code need a different reading rhythm.

### Hierarchy

- **Display** (600, 1.625rem, 1.05): Workspace title and highest-level app heading.
- **Headline** (600, 1.2rem, 1.2): Panel titles, current-batch heading, and markup section headers.
- **Title** (600, 0.96rem, 1.3): Asset names, setting row titles, and emphasized labels inside dense UI.
- **Body** (400, 1rem, 1.55): Main explanatory copy. Keep prose around 60ch where possible.
- **Supporting** (500, 0.86rem, 1.55): Chips, helper text, secondary metadata, and card detail rows.
- **Label** (700, 0.78rem, 0.08em letter spacing, uppercase): Eyebrows, state labels, and compact section markers.
- **Mono** (400, 0.875rem, 1.6): Markup panes, code wells, and any machine-oriented content.

### Named Rules

**The One-Family Rule.** Use the native sans stack for headings, buttons, labels, and body text. Do not introduce display typography into operational UI.

**The Fixed-Scale Rule.** Product UI here uses a fixed scale, not fluid type. Headings should stay predictable as the layout compresses.

**The Mono-Where-It-Earns-It Rule.** Monospace is for markup and machine-facing content only, not for decorative labeling.

## 4. Elevation

SVGOLOT is flat at rest. Depth comes from tonal layering first, then from shadow only when a surface is floating, selected, or responding to hover. This keeps the workspace calm while still making active or floating elements legible.

### Shadow Vocabulary

- **Soft Lift** (`0 12px 28px rgba(5, 9, 12, 0.18)`): Hovered asset cards and floating popovers.
- **Selected Halo** (`0 0 0 1px rgba(102, 195, 178, 0.18), 0 12px 28px rgba(5, 9, 12, 0.18)`): Active asset card only.

### Named Rules

**The Resting Flat Rule.** Shell surfaces, summaries, and panels stay flat while idle. Shadow is a state signal, not a permanent texture.

**The Floating-Only Rule.** Popovers and selected cards may lift. Static layout containers should separate with borders and tone, not shadow.

## 5. Components

### Buttons

- **Shape:** Rounded but compact, using a 14px radius for toolbar actions.
- **Primary:** Soft teal background, strong outline, 42px minimum height, and quiet emphasis instead of a loud filled CTA.
- **Hover / Focus:** Slight vertical lift, stronger border, and a clear focus outline in transparent teal.
- **Secondary:** Same shape and height as primary, but built on Control Slate with the same border vocabulary.

### Chips

- **Style:** Compact status chips use Control Slate with 11px corners and medium-weight text.
- **State:** Active or optimized chips tint toward teal; idle chips stay neutral.

### Cards / Containers

- **Corner Style:** Main panels and cards sit between 14px and 16px radii, depending on weight.
- **Background:** Panel Slate for major containers, Control Slate for nested working rows.
- **Shadow Strategy:** Flat at rest. Hover and selected state handle lift.
- **Border:** Every major surface uses a thin Soft Line border.
- **Internal Padding:** 16px to 24px for most surfaces, tuned for dense review rather than spacious marketing layouts.

### Inputs / Fields

- **Style:** Inputs sit on Control Slate with a 13px radius and strong border vocabulary.
- **Focus:** Focus uses a 2px teal-tinted outline with offset, not glow-heavy decoration.
- **Error / Disabled:** Keep the same structure, change only line and state color.

### Navigation / Toolbar

- **Style:** The header and toolbar behave like one operational strip, not a marketing hero.
- **Typography:** Workspace facts and tool labels use the same native sans vocabulary as the rest of the app.
- **Responsive Behavior:** On narrow screens, toolbar groups stack structurally rather than shrinking type or inventing a different pattern.

### Asset Card

- **Preview Zone:** SVG preview sits in a quiet framed well with the status pill in the top-left and card actions in the top-right.
- **State Vocabulary:** Original, optimizing, and optimized states are explicit. Ratio badges and metadata rows make file changes inspectable without opening markup.
- **Interaction:** Hover adds a soft lift. Selection adds the teal halo. The card must read as both preview and file-state summary.

### Settings Rows and Markup Wells

- **Settings Rows:** Each toggle or slider row uses the same Control Slate surface, border language, and compact spacing as toolbar controls.
- **Markup Wells:** Code surfaces use Code Well with mono type, 14px corners, and a border rather than ornamental glow.

## 6. Do's and Don'ts

### Do:

- **Do** keep the outer app on Base Ink and reserve brighter neutrals for nested working surfaces.
- **Do** use Action Teal for primary action, current selection, active chips, and focus only.
- **Do** keep important batch state visible in the shell, such as asset count, optimization progress, preview mode, and markup visibility.
- **Do** keep first-run empty states procedural, teaching the workflow rather than advertising the app.
- **Do** use the same rounded and border vocabulary across buttons, chips, cards, settings rows, and inputs.
- **Do** keep code and preview surfaces side by side when space allows, then stack them structurally on narrow screens.

### Don't:

- **Don't** make this feel like a marketing landing page, a playful icon toy, or a generic CRUD admin.
- **Don't** introduce decorative dashboards, loud gradients, novelty motion, or cluttered icon galleries.
- **Don't** turn the asset grid into a gallery with hidden file state. Original size, optimized size, and delta remain visible.
- **Don't** use a second accent color or apply teal broadly to inactive surfaces.
- **Don't** hide optimization state behind vague copy, icon-only cues, or hard-to-scan panel hierarchy.
- **Don't** add nested cards, colored side-stripe callouts, glassmorphism, or glowing hero metrics.
