## How to run

### Clone repository and install package dependencies (node v18)
```
git clone git@github.com:putrafajarh/kelontong.git kelontong
cd kelontong
npm install
```

### Run postgres server and seeders
```
docker run --name kelontong-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres:15-alpine

source .env

npx prisma migrate deploy
npx prisma db seed

```

### Run backend app
```
npm run backend:dev
```

### open in new terminal and run frontend app
```
npm run frontend:dev
```

## Login information
```
email: putrafajarh@gmail.com
password: verysecret
```
