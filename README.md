# Quizly: Quiz Platform Client

## Installation & Setup

Clone the repository

```bash
git clone https://github.com/KurenkovMaxgit/Meduzzen-quizly-frontend.git
```

Navigate to the project directory

```bash
cd meduzzen-quizly-frontend
```

Install dependencies

```bash
npm install
```

Configure environment variables and edit with your configuration:

- For local development

```bash
cp .env.example .env
```

- For docker production builds

```bash
cp .env.example .env.production.local
```

Start development server

```bash
npm run dev
```

## Docker container build & run

Build image

```bash
npm run docker:build
```

To start container run

```bash
npm run docker:up
```

To stop container run

```bash
npm run docker:down
```
