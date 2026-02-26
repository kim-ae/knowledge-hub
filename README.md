# Kim7s Knowledge Hub - Next.js Rewrite

This project is a rewrite of the Kim7s Knowledge Hub using Next.js, TypeScript, and Tailwind CSS. It dynamically loads content from a Markdown file.

## Features

- **Dynamic Content**: Articles and categories are parsed from a Markdown file.
- **Responsive Design**: Modern UI built with Tailwind CSS, supporting mobile and desktop.
- **Next.js App Router**: Uses Server Components for efficient data fetching.
- **Docker Ready**: Includes a multi-stage Dockerfile for production.
- **Kubernetes Ready**: Manifests for deployment and service.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd k8s-knowledge-hub
npm install
```

### Development

```bash
npm run dev
```

The application will read from the local `knowledge-hub.md` by default.

### Environment Variables

- `MD_SOURCE`: Path to the Markdown file (local relative path or remote HTTPS URL). Defaults to `knowledge-hub.md`.

## Docker

To build the Docker image:

```bash
docker build -t knowledge-hub:latest .
```

To run the container:

```bash
docker run -p 3000:3000 knowledge-hub:latest
```

## Kubernetes Deployment

The manifests are located in the `k8s/` directory.

1. Update the image in `k8s/deployment.yaml`.
2. Apply the manifests:

```bash
kubectl apply -f k8s/
```

## Markdown Format

The application expects the Markdown file to follow this structure:

```md
# Category Name

## SubCategory Name

* Tags: tag1, tag2
* Url: https://example.com
* Name: Source Name
* Title: Article Title
* Description: Brief summary
* My Thoughts: Personal perspective
```
