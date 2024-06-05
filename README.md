# nodejs-postgresql-pub-sub

Example repository showing how to build pub-sub pattern with Node.js and PostgreSQL

## How to use
1. Run docker-compose
```
docker-compose up
```
2. Execute below SQL command
```
CREATE TABLE job_queue (
    id SERIAL PRIMARY KEY,
    job_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
3. Run node app
```
npm start
```

3. Publish some events by request `/produce` endpoint
```
curl -X GET http://localhost:3000/produce

```