# playwright-qa-assignment

QA Engineer Interview Assignment – Playwright automation for the [Restful-Booker Platform](https://automationintesting.online).

## Tech Stack
- **Playwright** (TypeScript) – API & UI automation
- **GitHub Actions** – CI/CD pipeline
- **GitHub Pages** – HTML report hosting

---

## Installation & Running Tests Locally

```bash
# Clone the repo
git clone https://github.com/<your-username>/playwright-qa-assignment.git
cd playwright-qa-assignment

# Install dependencies
npm ci

# Install browsers
npx playwright install --with-deps chromium

# Copy env file and fill in values
cp .env.example .env

# Run all tests
npm test

# Run only API tests
npm run test:api

# Run only UI tests
npm run test:ui

# Open HTML report
npm run report
```

---

## Environment Variables

| Variable       | Description                              | Default                                        |
|---------------|------------------------------------------|------------------------------------------------|
| `BASE_URL`    | Web UI base URL                          | `https://automationintesting.online`           |
| `BASE_API_URL`| Standalone API base URL                  | `https://restful-booker.herokuapp.com`         |
| `ADMIN_USER`  | Admin username                           | `admin`                                        |
| `ADMIN_PASS`  | Admin password                           | `password`                                     |

Create a `.env` file at the project root:
```
BASE_URL=https://automationintesting.online
BASE_API_URL=https://restful-booker.herokuapp.com
ADMIN_USER=admin
ADMIN_PASS=password
```

> **Never commit `.env` to version control.**

---

## CI/CD

- **Triggers:** Push to `main`, Pull Request to `main`, Manual (`workflow_dispatch`)
- **Secrets:** Set `BASE_URL`, `BASE_API_URL`, `ADMIN_USER`, `ADMIN_PASS` in GitHub → Settings → Secrets → Actions
- **Report:** Available as a GitHub Actions artifact after each run under the **Actions** tab → latest workflow run → `playwright-report`
- **GitHub Pages:** Report is auto-published to `https://<username>.github.io/playwright-qa-assignment/` on every push to `main`

---

## Test Coverage Summary

| Module            | Spec File                          | Test Count |
|-------------------|------------------------------------|-----------|
| Auth API          | tests/api/auth.spec.ts             | 3         |
| Booking API       | tests/api/booking.spec.ts          | 12        |
| Room API          | tests/api/room-message-branding.spec.ts | 6    |
| Message API       | tests/api/room-message-branding.spec.ts | 2    |
| Branding API      | tests/api/room-message-branding.spec.ts | 3    |
| UI – Booking Flow | tests/ui/booking.spec.ts           | 3         |
| UI – Contact Form | tests/ui/booking.spec.ts           | 3         |
| UI – Admin Panel  | tests/ui/admin.spec.ts             | 6         |
| **Total**         |                                    | **38**    |

---

## Project Structure

```
playwright-qa-assignment/
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts
│   │   ├── booking.spec.ts
│   │   └── room-message-branding.spec.ts
│   └── ui/
│       ├── booking.spec.ts
│       └── admin.spec.ts
├── pages/
│   └── index.ts                  # Page Object Models
├── helpers/
│   ├── auth.helper.ts            # Token caching helper
│   └── booking.helper.ts         # Booking fixture factory
├── .github/
│   └── workflows/
│       └── playwright.yml
├── playwright.config.ts
├── package.json
└── README.md
```
