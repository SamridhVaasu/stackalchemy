# StackAlchemy

A modern stack-based architecture for seamless application development and deployment.

## 📖 Overview

StackAlchemy offers a unified platform where developers can manage projects, index GitHub repositories, and interact with rich API endpoints. Built with robust transaction management and error handling, it securely integrates various services for project monitoring and deep code analysis.

## 🏗 Architecture

```mermaid
flowchart TD
    subgraph Client
      A[Web/App Clients]:::client
      style A fill:#f0f9ff,stroke:#0a74da,stroke-width:2px
    end
    subgraph "API Layer"
      B[API Gateway]:::api
      C[REST/GraphQL Endpoints]:::api
      style B fill:#e8f8f5,stroke:#00b894,stroke-width:2px
      style C fill:#e8f8f5,stroke:#00b894,stroke-width:2px
    end
    subgraph Server[Service & Business Logic]
      D[Business Logic & Validation]:::logic
      E[Transaction & Error Handling]:::logic
      style D fill:#fff3e0,stroke:#ff9800,stroke-width:2px
      style E fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    end
    subgraph Persistence
      F[(PostgreSQL Database)]:::db
      G[(Redis Cache)]:::db
      style F fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
      style G fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    end
    subgraph External
      H[GitHub Indexer]:::ext
      style H fill:#fce4ec,stroke:#e91e63,stroke-width:2px
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    D -.-> H
```

## 🔄 System Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as U
    participant FE as Frontend
    participant GW as API Gateway
    participant SV as Service Layer
    participant DB as Database
    participant GH as GitHub Indexer

    U->>FE: Interact with Dashboard/UI
    FE->>GW: Send API Request (e.g., Create Project)
    GW->>SV: Forward Request with Auth & Validation
    SV->>DB: Initiate Transaction
    DB-->>SV: Return Results
    SV->>GW: Send Consolidated Response
    GW->>FE: Deliver Final Response
    FE->>U: Render UI Update
    alt GitHub indexing triggered
      SV->>GH: Index new GitHub repo
      GH-->>SV: Return indexing status
    end
```

## 🔍 Process Overview

```mermaid
flowchart LR
    A[User Input & API Call] --> B[Authentication & Input Validation]
    B --> C[Business Logic Execution]
    C --> D[Database Transaction & Commit]
    C --> E[External Service Integration]
    D --> F[Successful Response]
    E --> F
    C --> G[Error Detection]
    G --> H[Rollback & Logging]
    H --> I[Error Response]
```

## ✨ Features

- High Performance
- Enhanced Security
- Scalability
- Real-time Updates
- Easy Integration
- Monitoring & Analytics

## 🛠 Installation

```bash
git clone https://github.com/yourusername/stackalchemy.git
cd stackalchemy
npm install
```

## 🚀 Getting Started

1. Configure your environment:
```bash
cp .env.example .env
```

2. Start the development server:
```bash
npm run dev
```

## 📊 Component Structure

```mermaid
classDiagram
    class ProjectController {
        +createProject()
        +getCommits()
        +saveAnswer()
        +deleteProject()
    }
    class DBClient {
        +transaction()
        +findUnique()
        +findFirst()
        +deleteMany()
    }
    class GitHubIndexer {
        +indexRepo()
    }
    class AuthService {
        +verifyUser()
    }
    ProjectController --> DBClient : uses
    ProjectController --> GitHubIndexer : indexes
    ProjectController --> AuthService : validates
```

## 🧩 Database Schema Overview

```mermaid
erDiagram
    USER {
      String id PK
      String firstName
      String lastName
      String emailAddress
    }
    PROJECT {
      String id PK
      String name
      String githubUrl
      DateTime createdAt
    }
    USER_TO_PROJECT {
      String id PK
      String userId FK
      String projectId FK
    }
    QUESTION {
      String id PK
      String question
      String answer
      DateTime createdAt
    }
    USER ||--o{ USER_TO_PROJECT : "has"
    PROJECT ||--o{ USER_TO_PROJECT : "associated with"
    PROJECT ||--o{ QUESTION : "contains"
    USER ||--o{ QUESTION : "asks"
```

## ⚙️ API Endpoints

- Create Project: Validates users, ensures no duplicate GitHub URLs, creates projects within a transaction, and indexes GitHub repositories.
- Get Commits: Polls and returns the commit history for a project.
- Save Answer: Stores user questions and corresponding answers alongside file references.
- Delete Project: Removes a project and its related records, ensuring system consistency.