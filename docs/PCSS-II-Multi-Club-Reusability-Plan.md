# PCSS II Multi-Club Platform Reusability Plan

## 1. Executive Summary

This plan evolves the current robotics-focused site into a reusable, highly configurable club platform for the entire PCSS II umbrella organization. The target is a "single platform, many clubs" operating model where each club (Robotics, Science, Math, Art, Physics, Biology, and future clubs) can launch and manage its own branded web presence using configuration rather than custom code.

The core strategy:

1. Convert the current single-club content model into a multi-club schema.
2. Introduce a reusable section/component registry with per-club composition.
3. Create centralized governance and shared services under PCSS II.
4. Add role-based, club-scoped admin operations.
5. Ship a migration path that keeps Robotics online while onboarding additional clubs in waves.

---

## 2. Vision and Outcome

### 2.1 Vision

Build a PCSS II Club Experience Platform (CEP) where:

- PCSS II controls umbrella-level standards and shared resources.
- Each club independently manages content, events, sponsors, and pages.
- New clubs can be onboarded in hours, not weeks.
- The platform remains maintainable, secure, and fast.

### 2.2 Target Outcomes

- A single deployment serves all clubs.
- Club identity is configuration-driven (name, palette, assets, nav, modules).
- Common workflows (news, events, join forms, sponsor tiers, gallery, contact) are reusable.
- Club-specific needs can be handled by feature flags and extension points.

---

## 3. Current-State Assessment

### 3.1 Strengths in Current Codebase

- Content is mostly data-driven through `siteContent.json`.
- Section rendering is component-mapped and extensible.
- Routes are generated from content pages.
- Admin editing and export flow already exists.

### 3.2 Gaps for Multi-Club Reusability

- Content model is single-tenant (one club identity).
- No club isolation boundary (content, branding, admin roles).
- Navigation and section types are globally coupled to one site context.
- No hierarchy between umbrella-level and club-level configuration.

---

## 4. Target Architecture

### 4.1 Platform Model

Adopt a three-level model:

1. Organization Layer (PCSS II umbrella)
2. Club Layer (Robotics, Science, Math, Art, Physics, Biology, ...)
3. Experience Layer (pages, sections, events, assets, forms)

### 4.2 Rendering Strategy

- Keep one frontend app.
- Resolve active club via route segment (`/clubs/:clubSlug/...`) or host mapping.
- Render pages by selecting the active club's configuration and content.

### 4.3 Multi-Tenancy Boundary

Every mutable resource includes:

- `orgId`
- `clubId`
- `visibilityScope` (`org`, `club`, `public`)

This guarantees club separation while preserving umbrella sharing.

---

## 5. Configuration System Design

### 5.1 Configuration Layers

Define layered configuration with deterministic override order:

1. `platformDefaults`
2. `organizationDefaults` (PCSS II)
3. `clubConfig`
4. `environmentOverrides`

Resolution rule:

- Last writer wins for primitives.
- Deep merge for objects.
- Explicit replace for arrays when specified.

### 5.2 Configuration Domains

Split config into domains:

- `identity` (club name, mission, contact)
- `brand` (logo, color tokens, typography)
- `navigation` (primary, secondary, utility)
- `features` (enabled section types and workflows)
- `operations` (event templates, sponsor workflows)
- `integrations` (form endpoints, analytics ids)
- `access` (role-policy map)

### 5.3 Strong Schema Validation

Use JSON Schema (or Zod at runtime) to validate:

- Structural integrity
- Enum constraints
- Required fields per module
- Cross-field rules (for example, feature enabled implies required config present)

Fail-safe behavior:

- Invalid club config should not crash app.
- Show fallback error page with diagnostic id.
- Keep other clubs unaffected.

---

## 6. Data Model Evolution

### 6.1 Organization Model

- `organization.id`
- `organization.name`
- `organization.brand`
- `organization.sharedAssets`
- `organization.policies`

### 6.2 Club Model

- `club.id`
- `club.slug`
- `club.type` (`robotics`, `science`, `math`, `art`, `physics`, `biology`, `custom`)
- `club.brand`
- `club.navigation`
- `club.pages`
- `club.modules`

### 6.3 Content Model

Move from single file to club-scoped structure:

- `content/org/defaults.json`
- `content/clubs/robotics.json`
- `content/clubs/science.json`
- `content/clubs/math.json`
- `content/clubs/art.json`
- `content/clubs/physics.json`
- `content/clubs/biology.json`

### 6.4 Reusable Taxonomy

Introduce cross-club taxonomy to standardize discovery:

- `disciplineTags`
- `audienceTags`
- `eventType`
- `competitionType`
- `programLevel`

---

## 7. Reusable Module System

### 7.1 Module Catalog

Create a reusable module catalog:

- Hero
- Story
- Programs Grid
- Event Calendar / Atlas
- Sponsors
- Gallery
- Contact
- Join/Apply
- Team Leadership
- Resources/Links
- Results/Awards

### 7.2 Module Contract

Every module must define:

- `moduleId`
- `supportedClubTypes`
- `requiredConfig`
- `defaultConfig`
- `validationRules`
- `renderComponent`

### 7.3 Club-Specific Variants

Use variant keys rather than forks:

- `eventAtlas.variant = "competition" | "workshop" | "exhibition"`
- `programGrid.variant = "lab" | "studio" | "olympiad"`

This supports domain diversity without component duplication.

---

## 8. Navigation and Routing Plan

### 8.1 URL Strategy

Preferred:

- `https://pcssii.org/clubs/robotics`
- `https://pcssii.org/clubs/science`
- `https://pcssii.org/clubs/math`

Optional host-mapped aliases later:

- `robotics.pcssii.org`
- `science.pcssii.org`

### 8.2 Router Refactor

- Add club resolver middleware in router creation.
- Generate page routes from selected club config.
- Add umbrella-level pages (`/about-pcssii`, `/clubs`, `/governance`).

### 8.3 Fallback Behavior

If club slug not found:

- Show umbrella club directory page.
- Provide monitored 404 with analytics event.

---

## 9. Branding and Theme Tokens

### 9.1 Token Set

Define token contract:

- `color.primary`
- `color.secondary`
- `color.surface`
- `color.accent`
- `typography.heading`
- `typography.body`
- `shape.radius`

### 9.2 Accessibility Guardrails

- Enforce AA contrast thresholds per token pair.
- Validate focus/hover states automatically.
- Reject unsafe combinations in admin preview.

### 9.3 Umbrella + Club Co-Branding

Support dual identity:

- Club-first header
- PCSS II endorsement lockup
- Optional umbrella footer strip for consistency

---

## 10. Admin and Governance Model

### 10.1 Role-Based Access

Roles:

- `org-super-admin` (full umbrella control)
- `org-editor` (shared templates and policies)
- `club-admin` (single club full edit)
- `club-editor` (content only)
- `club-viewer` (read-only)

### 10.2 Guardrails

- Club admins cannot edit another club's content.
- Organization defaults are read-only for club roles.
- All changes include audit metadata and change reason.

### 10.3 Editorial Workflow

- Draft -> Review -> Publish model for each club.
- Scheduled publishing for events and announcements.
- Rollback snapshots per club.

---

## 11. Operational Model Under PCSS II

### 11.1 Shared Services

Centralized services:

- Analytics
- Form delivery
- Media storage
- Error monitoring
- Search index

### 11.2 Club Onboarding Kit

Standard onboarding package:

- Club config template
- Required branding assets checklist
- Starter page map
- Sample event/sponsor modules
- Validation checklist

### 11.3 SLA and Ownership

- Platform team owns uptime, security, and core modules.
- Club leads own content freshness and event correctness.

---

## 12. Performance and Reliability Plan

### 12.1 Performance Budget

Set budgets:

- Entry JS target <= 250 KB gzip (stretch)
- LCP image <= 200 KB
- CLS < 0.1

### 12.2 Caching Strategy

- Immutable hashes for static assets.
- Club config JSON with short revalidation.
- Edge cache for club page shells.

### 12.3 Failure Isolation

- Club-level config failures do not affect other clubs.
- Feature-flag kill switch per module.
- Safe-mode rendering for invalid module payloads.

---

## 13. Security and Compliance

### 13.1 Security Controls

- Input sanitization for all admin-editable rich text.
- Strict CSP and allowed media domains.
- Role checks at API boundary and client route guard.

### 13.2 Data Retention and Audit

- Retain publish logs and change diffs.
- Redact sensitive data from exported configs.

---

## 14. Migration Plan

### Phase 0: Foundation (1-2 weeks)

- Freeze schema changes in current model.
- Introduce organization + club data contracts.
- Build compatibility adapter to keep Robotics live.

### Phase 1: Robotics as First Club Tenant (1 week)

- Move Robotics data into `clubs/robotics`.
- Verify parity snapshots and route parity.

### Phase 2: Add Science and Math (1-2 weeks)

- Onboard two new clubs using templates.
- Validate no code changes required for basic launch.

### Phase 3: Add Art, Physics, Biology (1-2 weeks)

- Enable variant modules for discipline-specific needs.
- Expand event templates and gallery behaviors.

### Phase 4: Umbrella Experience and Governance (1 week)

- Launch PCSS II club directory and governance pages.
- Finalize RBAC and publication workflow.

### Phase 5: Scale and Hardening (ongoing)

- Add observability dashboards.
- Expand module catalog and templates.

---

## 15. Implementation Workstreams

### Workstream A: Schema and Config Engine

Deliverables:

- Club-aware schema
- Layered config merge utility
- Schema validation pipeline

### Workstream B: Router and Rendering

Deliverables:

- Club resolver
- Dynamic route generation per club
- Club fallback/404 handling

### Workstream C: Admin UX and RBAC

Deliverables:

- Role-aware editing views
- Draft/review/publish flow
- Audit history

### Workstream D: Module Refactor

Deliverables:

- Module catalog with contracts
- Club type variants
- Feature flags and safety fallbacks

### Workstream E: Ops and SRE

Deliverables:

- Performance dashboards
- Error alerts per club
- Deployment and rollback playbook

---

## 16. Success Metrics

### Platform Metrics

- Time to onboard a new club <= 1 day
- New club code changes required: 0 for standard modules
- Cross-club incident blast radius <= single club

### Product Metrics

- Number of active clubs on platform
- Monthly content update frequency per club
- Event page engagement per club

### Engineering Metrics

- Build stability
- Config validation pass rate
- Mean time to recover from bad publish

---

## 17. Risk Register and Mitigation

1. Over-generalization risk
- Mitigation: module variants + extension hooks

2. Governance friction
- Mitigation: explicit role boundaries + templates

3. Club branding inconsistency
- Mitigation: token validation and co-brand policy

4. Content schema drift
- Mitigation: versioned schemas and migration scripts

5. Performance regressions as clubs grow
- Mitigation: budgets, lazy loading, synthetic checks

---

## 18. Recommended Immediate Next Actions (First 14 Days)

1. Define and approve the canonical multi-club schema.
2. Build a club-resolver proof of concept using Robotics as tenant 1.
3. Create onboarding templates for Science and Math.
4. Implement role scaffolding for org admin and club admin.
5. Stand up parity tests between current Robotics pages and tenantized Robotics pages.

---

## 19. Deliverables Checklist

- [ ] Multi-club schema spec
- [ ] Config merge and validation engine
- [ ] Club-aware router
- [ ] Organization + club admin roles
- [ ] Club onboarding templates
- [ ] Migration scripts and rollback strategy
- [ ] Observability and KPI dashboard
- [ ] Operating handbook for PCSS II umbrella administration

---

## 20. Final Recommendation

Treat this as a platform product, not a one-off website migration. The highest-leverage decision is a strict config contract plus club isolation boundary. That combination unlocks rapid onboarding for Science, Math, Art, Physics, Biology, and future clubs while preserving centralized PCSS II governance and maintaining reliability as scale increases.
