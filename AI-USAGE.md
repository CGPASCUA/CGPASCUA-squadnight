# AI Usage Disclosure

SquadNight was developed by the researchers with assistance from AI tools throughout the planning, implementation, debugging, and documentation process. AI was used to discuss design ideas, explain technical concepts, suggest code changes, troubleshoot errors, and review possible solutions. The researchers evaluated these suggestions, integrated relevant changes into the project, and remained responsible for reviewing and testing the final implementation.

This document describes how AI assistance was used, including cases where suggestions were incorrect or unsuitable for the existing project.

## 1. How AI Was Used

### Week 1 – Wireframes and Component Planning

- **Tool:** Claude
- **Purpose:** To brainstorm and review the planned screen layouts, component organization, and navigation flow for the Dashboard, Availability, Planner, Session Details, and History screens.
- **How AI assisted:** Suggested ways to organize pages and identify reusable interface components.
- **Researcher contribution:** Reviewed the suggestions and determined which ideas matched the project requirements. The resulting interface and component implementation were reviewed and adapted for the project.
- **Commit:** 

### Week 1 – Design System Review

- **Tool:** Claude
- **Purpose:** To review the consistency of colors, typography, spacing, and reusable UI components.
- **How AI assisted:** Suggested design tokens, typography sizes, spacing guidelines, and component organization.
- **Researcher contribution:** Evaluated and adjusted suggestions to suit the intended interface and integrated the selected changes into the project.
- **Commit:** 

### Week 1 – React Project Structure and Routing

- **Tool:** Claude
- **Purpose:** To understand and review the React/Vite project structure and navigation between application screens.
- **How AI assisted:** Explained possible approaches to component organization and React Router configuration.
- **Researcher contribution:** Applied and adjusted the relevant approaches to fit the existing project structure and course requirements.
- **Commit:** 

### Week 1 – API Layer and Template Integration

- **Tool:** Claude
- **Purpose:** To understand the existing frontend API layer and its relationship with the mock and real API implementations.
- **How AI assisted:** Explained the responsibilities of files such as `src/api/index.js`, `mockApi.js`, and `httpApi.js`, and suggested approaches for connecting the frontend to the backend.
- **Researcher contribution:** Reviewed the existing implementation, applied relevant changes, and checked compatibility with the project's API contract.
- **Commit:** 

### Week 2 – Squad Creation and Joining

- **Tool:** Claude and ChatGPT
- **Purpose:** To identify and address issues in the squad onboarding and membership flow.
- **How AI assisted:** Suggested approaches for creating squads, joining existing squads, generating or using squad codes, and making squad membership clearer to users.
- **Researcher contribution:** Reviewed the suggestions and applied appropriate changes to the existing project. The implementation needed to preserve account-specific squad membership and existing application behavior.
- **Commit:** 

### Week 2 – Backend, Database, and API Integration

- **Tool:** Claude, Google AI Studio, and ChatGPT
- **Purpose:** To review backend requirements and troubleshoot communication between the React frontend, Express API, and PostgreSQL database.
- **How AI assisted:** Helped explain API routes, database relationships, environment configuration, schema initialization, and possible causes of integration errors.
- **Researcher contribution:** Evaluated the suggestions against the existing codebase and project requirements, applied relevant fixes, and checked the application through development and database commands.
- **Commit:** 

### Week 2 – Debugging and Feature Corrections

- **Tool:** ChatGPT
- **Purpose:** To troubleshoot implementation issues involving squad membership, session attendance, database setup, API behavior, and frontend functionality.
- **How AI assisted:** Explained error messages, suggested code modifications, and provided step-by-step debugging guidance.
- **Researcher contribution:** Reviewed the suggested changes and applied relevant fixes within the existing project. Commands and code changes still required local verification.
- **Commit:** 

### Documentation

- **Tool:** ChatGPT
- **Purpose:** To help revise the project's README and AI usage disclosure.
- **How AI assisted:** Suggested clearer explanations of the project's features, architecture, setup instructions, and AI-assisted development process.
- **Researcher contribution:** Responsible for checking that the documentation accurately reflects the actual repository, deployment, and development process.
- **Commit:** 

---

## 2. Where AI Assistance Was Incorrect or Needed Correction

AI-generated suggestions were not always compatible with the existing repository. They were reviewed rather than automatically accepted.

### Case 1 – Generating a Separate Application

- **Tool:** Google AI Studio
- **What happened:** A generated application structure was suggested instead of making changes directly within the existing project.
- **Problem:** The proposed structure did not fully match the required JavaScript-based project, existing React Router setup, frontend API layer, and Express/PostgreSQL architecture.
- **What the researchers did:** Returned to the existing repository and continued working within its established structure rather than replacing the project with an incompatible application.
- **Commit:** 

### Case 2 – Incorrect Assumption About Git Changes

- **Tool:** AI-assisted troubleshooting
- **What happened:** There was confusion about whether project changes had already been committed and pushed successfully.
- **Problem:** The remote repository did not reflect the expected changes.
- **What the researchers did:** Checked the repository using Git commands, including `git status` and commit history, then verified the actual files and commits before continuing.
- **Commit:** 

### Case 3 – Suggestions That Did Not Match the Existing Implementation

- **Tool:** AI assistants used during development
- **What happened:** Some suggestions about code structure, API behavior, or implementation details needed adjustment.
- **Problem:** General recommendations did not always account for the project's existing code, backend behavior, or course requirements.
- **What the researchers did:** Compared suggestions with the actual source code and requirements, then adapted or rejected unsuitable changes.
- **Commit:** 

### Case 4 – Frontend Redesign Compatibility

- **Tool:** ChatGPT
- **What happened:** A separate frontend redesign package was prepared for consideration.
- **Problem:** It was not sufficiently verified against the current project before being considered for integration. Replacing files without checking compatibility could have affected existing features.
- **What the researchers did:** Decided not to proceed with the redesign and retained the existing application design to prioritize the working project and submission.
- **Commit:** 

---

## 3. Division of Work and Responsibility

The researchers were responsible for the development and delivery of SquadNight, including project decisions, integration, testing, and final review.

AI tools assisted with:

- Brainstorming interface and component ideas.
- Explaining React, JavaScript, Express, PostgreSQL, and API concepts.
- Suggesting implementation approaches and code modifications.
- Troubleshooting errors and interpreting terminal output.
- Reviewing possible fixes for squad membership and session functionality.
- Drafting and improving project documentation.

AI assistance was not a substitute for verifying the actual project. Suggestions had to be evaluated against the existing source code, database behavior, course requirements, and deployment setup.

The researchers remained responsible for deciding which suggestions to use and for validating the submitted project. The precise division of manually written and AI-assisted code should be described according to the actual development history.

## 4. Verification and Limitations

AI-generated advice can contain errors, rely on assumptions, or propose changes that are incompatible with an existing codebase. For that reason, suggested changes should be checked through source-code review, Git history, local builds, application testing, and database/API checks as appropriate.

A successful build alone does not establish that all features work correctly. Authentication, squad membership, session creation, attendance, and database persistence should be tested separately.

The disclosure does not claim that every AI suggestion was correct or that every suggested fix was successfully tested. The final repository and its actual development history remain the basis for evaluating the completed project.

## 5. Tools Used

- **Claude:** Planning, design discussion, and technical assistance.
- **Google AI Studio:** Application generation and technical exploration.
- **ChatGPT:** Debugging guidance, implementation suggestions, backend troubleshooting, and documentation assistance.

Only tools actually used during the project should remain listed in this section.

