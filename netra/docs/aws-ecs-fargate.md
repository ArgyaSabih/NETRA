# AWS ECS Fargate Deploy

## Architecture

- ECR repositories: `netra-frontend`, `netra-backend`, `netra-ai-service`
- ECS cluster: `netra-cluster`
- ECS service `frontend`: one container, port `3000`
- ECS service `backend-ai`: two containers, `backend` port `5000` and `ai-service` port `8000`
- Backend calls AI in ECS with `AI_SERVICE_URL=http://localhost:8000`
- AI service has no public listener or target group

## Build Images

```sh
docker build -t netra-frontend ./frontend
docker build -t netra-backend ./backend
docker build -t netra-ai-service ./ai-service
```

## Tag Images

```sh
docker tag netra-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/netra-frontend:latest
docker tag netra-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/netra-backend:latest
docker tag netra-ai-service:latest <account-id>.dkr.ecr.<region>.amazonaws.com/netra-ai-service:latest
```

## Push Images

```sh
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/netra-frontend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/netra-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/netra-ai-service:latest
```

## ECS Environment

Frontend container:

```text
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://<alb-dns-or-domain>
NEXTAUTH_SECRET=<generated-secret>
NEXT_PUBLIC_BACKEND_URL=
BACKEND_URL=http://<backend-internal-or-alb-path>
DATABASE_URL=<database-url>
RESEND_API_KEY=<resend-api-key>
```

Backend container:

```text
NODE_ENV=production
PORT=5000
DATABASE_URL=<database-url>
AI_SERVICE_URL=http://localhost:8000
```

## ALB

Target groups:

- `frontend` target group: port `3000`
- `backend` target group: port `5000`

Listener rules:

- `/api/dashboard*` -> backend target group
- `/api/upload-log*` -> backend target group
- `/api/logs*` -> backend target group
- `/api/threats*` -> backend target group
- `/health` -> backend target group
- default -> frontend target group

Do not route `/api/auth*` to backend. Keep it on frontend for NextAuth.

## Security Groups

- ALB inbound: `80` and `443` from internet
- Frontend ECS inbound: `3000` only from ALB security group
- Backend-ai ECS inbound: `5000` only from ALB security group
- AI service port `8000`: no public inbound rule

## Notes

- Do not commit real `.env` files.
- Replace `<account-id>`, `<region>`, ECR URIs, `DATABASE_URL`, `NEXTAUTH_SECRET`, and domain or ALB DNS before deploy.
