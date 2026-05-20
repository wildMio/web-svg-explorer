---
name: SVGOLOT
description: Dual-theme matte workbench for SVG review, optimization, and export.
colors:
  base-ink: "#12100D"
  panel-slate: "#1A1713"
  control-slate: "#221D17"
  raised-slate: "#2B241D"
  code-well: "#15120F"
  line-soft: "#C7AE8229"
  line-strong: "#C7AE8247"
  text-primary: "#F0E6D3"
  text-secondary: "#F0E6D3C7"
  text-muted: "#C9B792A3"
  action-ochre: "#C6A05A"
  action-ochre-soft: "#C6A05A24"
  warning-amber: "#C28A4C"
  success-sage: "#90A06E"
  danger-rose: "#B67765"
  warm-paper: "#EFE6D7"
  paper-panel: "#F5EEE1"
  paper-control: "#EBDFCB"
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
    backgroundColor: "{colors.action-ochre-soft}"
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

A frontend engineer is reviewing a directory of exported icons beside an editor, browser devtools, and a design source file. Sometimes that happens late in a dim workspace beside dark code surfaces, sometimes during daylight QA on a bright desk. SVGOLOT should feel like the same quiet inspection bench in both scenes: low-glare, explicit about state, and dense enough to keep preview, metadata, settings, and markup in one place.

The system is restrained and operational. It uses matte soot dark neutrals, warm paper light neutrals, one controlled vintage-yellow accent, native-feeling typography, and minimal elevation so the SVG assets stay central. The light and dark themes should feel like the same product under different ambient light, not two different visual systems. It explicitly rejects marketing-page behavior, playful gallery energy, and decorative dashboard tropes. This is a product tool. Design serves review speed and trust in output.

**Key Characteristics:**

- Matte soot dark mode and warm paper light mode share the same component structure and contrast logic.
- One operational vintage-yellow accent used for primary action, selection, and active state.
- Native sans typography with a compact fixed scale.
- Flat resting surfaces, with elevation reserved for hover, popover, and selected state.
- Dense but readable workflow, where preview, metadata, markup, and settings remain tightly coupled.

## 2. Colors: The Low-Glare Workbench Palette

A restrained paired palette built from matte soot dark neutrals, warm paper light neutrals, and one controlled vintage-yellow accent, with secondary colors reserved for state rather than decoration.

### Primary

- **Action Ochre** (#C6A05A dark, #8F6A25 light): Primary actions, active chips, selected asset state, and focus accents. This is the only expressive accent in the system.

### Neutral

- **Base Ink** (#12100D dark): App background and outer frame in the matte dark theme.
- **Warm Paper** (#EFE6D7 light): App background in the light theme, intentionally off-white to avoid glare.
- **Panel Slate** (#1A1713 dark, #F5EEE1 light): Main shell panels, summary bars, empty state, and asset cards.
- **Control Slate** (#221D17 dark, #EBDFCB light): Buttons, inputs, toggle rows, chips, and small control surfaces.
- **Raised Slate** (#2B241D dark, #DFCFB4 light): Hover and active lift for controls that need a stronger state layer.
- **Code Well** (#15120F dark, #E7DECD light): Markup surface and dense code background.
- **Soft Line** (rgba(199, 174, 130, 0.16) dark, rgba(88, 69, 42, 0.12) light): Resting borders and separators.
- **Strong Line** (rgba(199, 174, 130, 0.28) dark, rgba(88, 69, 42, 0.22) light): Emphasized control outlines and stronger interaction edges.
- **Primary Text** (#F0E6D3 dark, #231C15 light): Main content and labels.
- **Secondary Text** (rgba(240, 230, 211, 0.78) dark, rgba(35, 28, 21, 0.76) light): Explanatory copy, helper text, and lower-priority metadata.
- **Muted Text** (rgba(201, 183, 146, 0.64) dark, rgba(92, 72, 46, 0.60) light): Eyebrows, tertiary labels, and recessed state language.

### State Signals

- **Warning Amber** (#C28A4C dark, #A76E30 light): Long-running work and in-progress state.
- **Success Sage** (#90A06E dark, #6F7B4D light): Completed optimization and successful state.
- **Danger Rose** (#B67765 dark, #9B5E4F light): Error-risk or negative-change state.

### Named Rules

**The Quiet Shell Rule.** Neutrals do most of the work. Accent belongs to actions and current state, not decoration.

**The Inspection Contrast Rule.** Preview, metadata, and code surfaces must separate clearly without jumping to pure black or pure white.

**The One-Action Accent Rule.** Action Ochre is the only high-attention accent. Warning, success, and danger colors are for status only.

**The Same Bench Rule.** Dark and light mode must preserve the same hierarchy, spacing, and interaction language. Only the ambient surface and contrast profile should change.

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

- **Soft Lift** (`0 14px 32px rgba(7, 6, 4, 0.24)`): Hovered asset cards and floating popovers.
- **Selected Halo** (`0 0 0 1px rgba(198, 160, 90, 0.20), 0 14px 32px rgba(7, 6, 4, 0.24)`): Active asset card only.

### Named Rules

**The Resting Flat Rule.** Shell surfaces, summaries, and panels stay flat while idle. Shadow is a state signal, not a permanent texture.

**The Floating-Only Rule.** Popovers and selected cards may lift. Static layout containers should separate with borders and tone, not shadow.

## 5. Components

### Buttons

- **Shape:** Rounded but compact, using a 14px radius for toolbar actions.
- **Primary:** Soft vintage-yellow background, strong outline, 42px minimum height, and quiet emphasis instead of a loud filled CTA.
- **Hover / Focus:** Slight vertical lift, stronger border, and a clear focus outline in transparent ochre.
- **Secondary:** Same shape and height as primary, but built on Control Slate with the same border vocabulary.

### Chips

- **Style:** Compact status chips use Control Slate with 11px corners and medium-weight text.
- **State:** Active or optimized chips tint toward ochre; idle chips stay neutral.

### Cards / Containers

- **Corner Style:** Main panels and cards sit between 14px and 16px radii, depending on weight.
- **Background:** Panel Slate for major containers, Control Slate for nested working rows.
- **Shadow Strategy:** Flat at rest. Hover and selected state handle lift.
- **Border:** Every major surface uses a thin Soft Line border.
- **Internal Padding:** 16px to 24px for most surfaces, tuned for dense review rather than spacious marketing layouts.

### Inputs / Fields

- **Style:** Inputs sit on Control Slate with a 13px radius and strong border vocabulary.
- **Focus:** Focus uses a 2px ochre-tinted outline with offset, not glow-heavy decoration.
- **Error / Disabled:** Keep the same structure, change only line and state color.

### Navigation / Toolbar

- **Style:** The header and toolbar behave like one operational strip, not a marketing hero.
- **Typography:** Workspace facts and tool labels use the same native sans vocabulary as the rest of the app.
- **Task Zoning:** Batch actions and review tools share the strip, but they should read as separate groups so exporting, scanning duplicates, and opening review controls do not feel like one undifferentiated button run.
- **App Utility:** The light/dark theme switch and the English / Traditional Chinese language switch both stay in the header utility cluster so the operator can change ambient contrast or interface language without opening a secondary panel.
- **Compact Mode:** A minimal compact toggle can live beside the theme switch. When enabled, secondary batch context moves into the display popup so the asset grid can take priority.
- **Duplicate Review:** The toolbar should begin with an explicit scan action, then expose filtering only after results exist. The full flow must stay explicit that matches are heuristic and visually derived rather than a destructive exact match.
- **Responsive Behavior:** On narrow screens, the header should shed secondary copy and facts first, then let toolbar groups wrap into compact multi-column rows before core controls become oversized vertical stacks.

### Workspace Summary

- **Structure:** The selected asset summary should pair with a structured review ledger, not a long chip cloud. Core batch state belongs in repeatable stat cells so the operator can scan it in one pass.
- **Local Review Actions:** The selected asset block should expose one-tap actions for opening markup and jumping into duplicate review so the operator does not have to bounce back to the toolbar or hunt inside the rail for the current file.
- **Signal Layer:** Chips still earn a place for temporary modes such as contrast preview, open markup, or active duplicate filtering, but they should stay secondary to the ledger.
- **Duplicate Feedback:** Duplicate review must report every state clearly: not scanned, scanning, no matches, broad match set, and focused group. A completed scan with no matches should still feel like a resolved outcome.

### Asset Card

- **Preview Zone:** SVG preview sits in a quiet framed well with the status pill in the top-left and card actions in the top-right.
- **Preview Tone:** The card-level contrast toggle should change preview readability for currentColor and single-tone artwork without implying that exported SVG colors are being rewritten.
- **Selection Control:** Each card can expose a small quick-preview checkbox without competing with the primary optimize, copy, and download actions.
- **State Vocabulary:** Original, optimizing, and optimized states are explicit. Ratio badges and metadata rows make file changes inspectable without opening markup.
- **Similarity Flag:** If the app marks likely duplicates, that badge should read as a review hint, not as proof that one file is safe to delete.
- **Compact Density:** In compact mode, cards reduce preview height and footer detail so more assets remain visible in the same viewport.
- **Interaction:** Hover adds a soft lift. Selection adds the ochre halo. The card must read as both preview and file-state summary.

### Quick Preview Dock

- **Placement:** A fixed dock can sit above the bottom edge when the operator has explicitly picked icons for comparison.
- **Behavior:** The dock should show only chosen items, allow fast removal, and let the operator refocus the main selection without losing the batch grid.
- **Responsive Density:** On mobile and narrow windows, dock header chrome and tile metadata should compress before the dock grows taller; the pinned strip must stay useful without dominating the viewport.

### Duplicate Group Panel

- **Placement:** When the heuristic finds candidates, the grouped review panel should live as a rail beside the asset grid on wide screens, then collapse into a bounded, scrollable panel above the grid on narrower layouts.
- **Behavior:** Each group card should offer a focused grid filter and a one-click way to pin the whole group into the quick preview dock for side-by-side comparison.
- **Item Rows:** Candidate rows act like compact review controls: they focus the main selection, show pinned and focused state, and keep optimization readiness visible.
- **Height Control:** The panel must protect the main grid from being pushed far below the fold; long result sets should scroll inside the rail instead of expanding the whole page.
- **Tone:** Copy must keep reminding the operator that these are visually similar candidates, not exact matches or safe-to-delete instructions.

### Toast Feedback

- **Placement:** Toasts live in a fixed viewport near the top-right of the bench, then shift downward on narrow screens so they do not crowd toolbar controls.
- **Tone:** Success feedback should stay compact, lightly elevated, and tinted by semantic state instead of looking like a blocking alert.
- **Interaction:** Toasts auto-dismiss quickly, but always keep a visible manual dismiss affordance for keyboard and touch use.

### Settings Rows and Markup Wells

- **Preset Rail:** The compression profile begins with a three-option preset rail for Safe, Balanced, and Max compression. It should read like a dense workbench decision strip, not like tabs or marketing cards.
- **Settings Rows:** Each toggle, switch, or precision range row uses the same Control Slate surface, border language, and compact spacing as toolbar controls.
- **Custom Control Chrome:** Display and optimization popovers should use the app's own switch and range styling so both panels feel like the same bench instead of mixing in vendor-default control visuals.
- **Markup Wells:** Code surfaces use Code Well with mono type, 14px corners, and a border rather than ornamental glow.

## 6. Do's and Don'ts

### Do:

- **Do** keep the outer app on Base Ink and reserve brighter neutrals for nested working surfaces.
- **Do** use Action Ochre for primary action, current selection, active chips, and focus only.
- **Do** keep the light/dark theme switch visible at the shell level rather than hiding it in a secondary panel.
- **Do** move secondary batch facts into the display popup when compact mode is active instead of deleting them.
- **Do** keep important batch state visible in the shell, such as asset count, optimization progress, preview mode, and markup visibility.
- **Do** keep first-run empty states procedural, teaching the workflow rather than advertising the app.
- **Do** use the same rounded and border vocabulary across buttons, chips, cards, settings rows, and inputs.
- **Do** keep code and preview surfaces side by side when space allows, then stack them structurally on narrow screens.

### Don't:

- **Don't** make this feel like a marketing landing page, a playful icon toy, or a generic CRUD admin.
- **Don't** introduce decorative dashboards, loud gradients, novelty motion, or cluttered icon galleries.
- **Don't** turn the asset grid into a gallery with hidden file state. Original size, optimized size, and delta remain visible.
- **Don't** use a second accent color or apply vintage yellow broadly to inactive surfaces.
- **Don't** hide optimization state behind vague copy, icon-only cues, or hard-to-scan panel hierarchy.
- **Don't** add nested cards, colored side-stripe callouts, glassmorphism, or glowing hero metrics.
