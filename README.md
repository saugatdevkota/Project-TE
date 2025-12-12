# Tutor Everywhere

## Deployment

This project is containerized using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1.  **Environment Setup**:
    Copy the example environment file to `.env`:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your specific configuration if needed.

2.  **Build and Run**:
    Run the following command to build and start the services:
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**:
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:5000`

### Services

- **Frontend**: Next.js application
- **Backend**: Node.js/Express application
- **Database**: PostgreSQL

## Development

To run the project locally without Docker:

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
