Playwright-framework

===

**My first automation project!**

# Playwright QA Automation Framework

\### Restful-Booker Platform — QA Engineer Interview Assignment



!\[Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge\&logo=playwright\&logoColor=white)

!\[TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)

!\[GitHub Actions](https://img.shields.io/badge/GitHub\_Actions-2088FF?style=for-the-badge\&logo=github-actions\&logoColor=white)



\---



\## 📋 Project Overview



This is a complete QA automation framework built for the 

\*\*Restful-Booker Platform\*\* (https://automationintesting.online) 

as part of a QA Engineer interview assignment.



The framework covers:

\- ✅ Manual Test Cases (Excel)

\- ✅ API Automation (Auth, Booking, Room, Message, Branding)

\- ✅ UI Automation (Booking Flow, Contact Form, Admin Panel)

\- ✅ Page Object Model (POM)

\- ✅ CI/CD with GitHub Actions

\- ✅ HTML Test Reports



\---



\## 🛠️ Tech Stack



| Tool | Purpose |

|------|---------|

| Playwright (TypeScript) | API \& UI Automation |

| GitHub Actions | CI/CD Pipeline |

| GitHub Pages | HTML Report Hosting |

| Node.js 20 | Runtime |

| dotenv | Environment Variables |



\---



\## 📁 Project Structure

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

│   └── index.ts              # Page Object Models

├── helpers/

│   ├── auth.helper.ts        # Token caching helper

│   └── booking.helper.ts     # Booking fixture factory

├── .github/

│   └── workflows/

│       └── playwright.yml    # CI/CD Pipeline

├── playwright.config.ts

├── package.json

└── .env.example

```



\---



\## ⚙️ Installation \& Running Tests Locally



\### Prerequisites

\- Node.js 20 or higher

\- Git



\### Step 1 — Clone the repository

```bash

git clone https://github.com/captain123dev/Playwright-framework.git

cd Playwright-framework

```



\### Step 2 — Install dependencies

```bash

npm install

```



\### Step 3 — Install Playwright browsers

```bash

npx playwright install --with-deps chromium

```



\### Step 4 — Create .env file

```bash

cp .env.example .env

```



\### Step 5 — Run tests

```bash

\# Run all tests

npx playwright test



\# Run only API tests

npx playwright test tests/api



\# Run only UI tests

npx playwright test tests/ui



\# Run with visible browser

npx playwright test tests/ui --headed



\# Open HTML report

npx playwright show-report

```



\---



\## 🔐 Environment Variables



| Variable | Description | Default |

|----------|-------------|---------|

| `BASE\_URL` | Web UI base URL | `https://automationintesting.online` |

| `BASE\_API\_URL` | API base URL | `https://automationintesting.online/api` |

| `ADMIN\_USER` | Admin username | `admin` |

| `ADMIN\_PASS` | Admin password | `password` |



Create a `.env` file in the root folder:

```

BASE\_URL=https://automationintesting.online

BASE\_API\_URL=https://automationintesting.online/api

ADMIN\_USER=admin

ADMIN\_PASS=password

```



> ⚠️ Never commit `.env` to version control



\---



\## 🚀 CI/CD — GitHub Actions



\### Triggers

\- Push to `main` branch

\- Pull Request to `main` branch

\- Manual trigger via `workflow\_dispatch`



\### How to trigger manually

1\. Go to your GitHub repo

2\. Click \*\*Actions\*\* tab

3\. Click \*\*Playwright Tests\*\* workflow

4\. Click \*\*Run workflow\*\* button



\### Where to find the report

After workflow completes:

1\. Click on the workflow run

2\. Scroll down to \*\*Artifacts\*\*

3\. Download \*\*playwright-report\*\*



\### GitHub Secrets Required

Go to Settings → Secrets → Actions and add:

\- `BASE\_URL`

\- `BASE\_API\_URL`

\- `ADMIN\_USER`

\- `ADMIN\_PASS`



\---



\## 📊 Test Coverage Summary



| Module | Spec File | Test Count |

|--------|-----------|------------|

| Auth API | tests/api/auth.spec.ts | 3 |

| Booking API | tests/api/booking.spec.ts | 8 |

| Room API | tests/api/room-message-branding.spec.ts | 6 |

| Message API | tests/api/room-message-branding.spec.ts | 2 |

| Branding API | tests/api/room-message-branding.spec.ts | 3 |

| UI – Booking Flow | tests/ui/booking.spec.ts | 3 |

| UI – Contact Form | tests/ui/booking.spec.ts | 3 |

| UI – Admin Panel | tests/ui/admin.spec.ts | 6 |

| \*\*Total\*\* | | \*\*34\*\* |



\---



\## 🏗️ Framework Design Decisions



\### 1. Page Object Model (POM)

All UI locators and actions are defined in `pages/index.ts`.

Test files never contain raw selectors — keeping tests clean and maintainable.



\### 2. Auth Helper with Token Caching

Auth token is fetched once and reused across all tests in a run.

Prevents unnecessary API calls and speeds up test execution.



\### 3. Test Independence

Every test creates and cleans up its own data.

No test depends on another — fully deterministic results.



\### 4. No Hard Waits

All waits use Playwright built-in strategies:

`waitForURL`, `toBeVisible`, `waitForLoadState` — never `waitForTimeout`.



\### 5. Dual Projects

API and UI tests run as separate Playwright projects.

Can be run independently or together.



\---



\## 📝 Known Issues



\- Platform data resets periodically — tests are designed to be fully independent

\- `automationintesting.online` is a shared test environment — occasional flakiness possible

\- Branding API requires full object in PUT request including valid logoUrl format



\---



\## 👨‍💻 Author



\*\*Shobhit Upadhyay\*\*

\- Email: shobhitupadhyay12@gmail.com

\- LinkedIn: linkedin.com/in/upadhyayshobhit12

\- GitHub: github.com/captain123dev

