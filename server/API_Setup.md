# Django API README

## PostgreSQL Docker Setup

### Option 1: Direct Docker Command
To run PostgreSQL using Docker, use the following command:

```bash
docker run --name postgres-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -p 5432:5432 -d postgres
```

### Option 2: Docker Compose (Recommended)
Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```

- Replace `postgres`, `password`, and `postgres` with your desired credentials.
- The database will be accessible at `localhost:5432`.

To stop and remove the container:

```bash
# For direct Docker:
docker stop postgres-db
docker rm postgres-db

# For Docker Compose:
docker-compose down
```

## Django Setup

### 0. Setup venv
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
```

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# Cloudinary configuration
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Email configuration
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
```

### 3. Database Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

Get the token from the login response and use it for subsequent requests.

## Testing

### Run Tests
```bash
python manage.py test
```

### Test Coverage
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html

coverage run --source='.' manage.py test <app_name> # if you want to test a particular app
```

Note that the a lot of file are loaded by the app but tested beyond that. 
For example all url files will be marked as covered while on this date (23/09/25) only accouts app endpoints are tested.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL container is running
   - Check database credentials in `.env`
   - Verify port 5432 is not blocked

3. **Migration Issues**
   - Delete migration files (keep `__init__.py`)
   - Run `python manage.py makemigrations` again
   - Check for circular dependencies

### Docker Commands Quick Reference

```bash
# View running containers
docker ps

# View container logs
docker logs postgres-db

# Connect to PostgreSQL
docker exec -it postgres-db psql -U postgres -d postgres

# Remove all containers and volumes
docker-compose down -v
```

