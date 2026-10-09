# AI Usage

This project was developed primarily by the researchers. AI tools were used only as an **assistance and verification tool** throughout the development process. AI was used to help review ideas, clarify technical concepts, suggest possible solutions, and double-check implementation decisions. The researchers remained responsible for the actual coding, integration, testing, and final decisions made in the project.

## 1. How AI Was Used

### Week 1 – Wireframes and Component Planning

* **Tool:** Claude
* **Purpose:** Used as a reference and brainstorming tool to help review the planned wireframes, screen structure, component organization, and user flow for the five main screens: Dashboard, Availability, Planner, Session Details, and History.
* **How it assisted:** AI provided suggestions for organizing the screens and identifying possible reusable components.
* **What I did:** I reviewed the suggestions and used only the parts that were appropriate for the project's requirements. The actual interface structure and final component implementation were decided and implemented by me.
* **Commit:** `<commit SHA>`

### Week 1 – Design System Review

* **Tool:** Claude
* **Purpose:** Used to double-check the consistency of the project's colors, typography, spacing, and reusable UI components.
* **How it assisted:** AI suggested possible color tokens, typography sizes, spacing guidelines, and component organization that could be considered for the project.
* **What I did:** I evaluated the suggestions and selected or adjusted the values based on the project's design requirements. The final design system and CSS implementation were manually integrated into the project.
* **Commit:** `<SHA where the design system was added>`

### Week 1 – React Project Structure

* **Tool:** Claude
* **Purpose:** Used as a technical reference while setting up and reviewing the React/Vite project structure and routing.
* **How it assisted:** AI was used to explain possible approaches for organizing the five screens and routing between them.
* **What I did:** I implemented and tested the structure in the actual project and made the necessary changes to match the class requirements and existing project template.
* **Commit:** `<SHA for the initial project structure>`

### Week 1 – API Layer and Class Template Integration

* **Tool:** Claude
* **Purpose:** Used to review the existing class template and help understand how the frontend API layer was intended to work.
* **How it assisted:** AI helped explain the relationship between `src/api/index.js`, `mockApi.js`, and `httpApi.js`, and suggested ways to keep the pages compatible with the template's mock/real-API structure.
* **What I did:** I applied the appropriate changes to the project manually and tested the resulting data flow. The final architecture was based on the class template requirements rather than being generated wholesale by AI.
* **Commit:** `<SHA for the template integration>`

### Week 2 – Join / Create Squad Functionality

* **Tool:** Claude
* **Purpose:** Used to review the onboarding flow and identify a missing functionality: allowing users to create a squad instead of only joining an existing squad.
* **How it assisted:** AI suggested possible approaches for organizing a Join/Create interface and generating a squad code.
* **What I did:** I evaluated the suggestion and implemented the required functionality into the existing project. The final interface, logic, and integration were tested and adjusted manually.
* **Commit:** `<SHA for the Join/Create functionality>`

### Week 2 – Backend and API Contract Review

* **Tool:** Claude / Google AI Studio
* **Purpose:** Used as a reference for reviewing the backend requirements and checking whether the planned Express/PostgreSQL API would properly communicate with the existing frontend.
* **How it assisted:** AI helped identify possible routes, database entities, validation requirements, and API response structures that needed to be considered.
* **What I did:** I reviewed the suggestions against the actual project requirements and existing frontend API contract. The backend implementation and final integration were handled and verified within the project.
* **Commit:** `<SHA>`

---

## 2. Where AI Assistance Was Incorrect

AI suggestions were not always accurate or compatible with the existing project. These cases were reviewed and corrected rather than being directly accepted.

### Case 1 – Generated a Separate Application Instead of Assisting the Existing Project

* **What it gave me:** Google AI Studio suggested and generated a separate application structure instead of working within the existing repository.
* **What was wrong with it:** The suggested structure did not follow the required JavaScript-based project organization, existing React Router setup, frontend API layer, or Express/PostgreSQL architecture.
* **What I did instead:** I did not use the generated application. I returned to the existing project structure and continued development using the required class template and existing codebase.
* **Commit:** `<SHA, if applicable>`

### Case 2 – Incorrect Assumption About Git Changes

* **What it gave me:** AI-assisted terminal work led to an incorrect assumption that the project's changes had already been successfully committed and pushed.
* **What was wrong with it:** The changes were not actually reflected in the remote repository as expected.
* **What I did instead:** I manually checked the repository using Git commands such as `git status` and reviewed the commit history. I then reapplied the necessary files, committed the actual changes, and verified that the repository contained the expected project files before continuing.
* **Commit:** `<SHA of the verified commit>`

### Case 3 – AI Suggestions Required Manual Verification

* **What it gave me:** Some AI suggestions regarding implementation details, project structure, or API behavior did not exactly match the requirements of the existing project.
* **What was wrong with it:** AI suggestions were based on general development patterns and could not always account for the specific constraints of the class template and existing implementation.
* **What I did instead:** I treated the suggestions only as references, checked them against the existing source code and project requirements, and manually corrected or rejected anything that did not fit.
* **Commit:** `<SHA, if applicable>`

---

## 3. Who Wrote What

The **researchers/developers wrote and implemented the actual project code, interface, database integration, API integration, testing, and final project structure**.

AI tools were used only as supplementary assistance for:

* Brainstorming and reviewing possible solutions
* Clarifying programming concepts
* Reviewing project structure
* Suggesting possible approaches to implementation
* Double-checking code and technical decisions
* Identifying potential errors or missing functionality
* Providing alternative approaches when troubleshooting

The final implementation was **reviewed, modified, tested, and decided upon by the researchers**. AI-generated suggestions were not automatically incorporated into the project, and any suggestions that conflicted with the project requirements were rejected or revised.

The researchers therefore remained responsible for the project's final design, code, functionality, integration, testing, and overall output.
