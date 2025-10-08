FROM node:20.10.0 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN npm run postinstall

FROM debian:bullseye-slim


COPY --from=builder /usr/local/ /usr/local/
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV=production
ENV PATH=/usr/local/bin:$PATH

CMD ["npm", "run", "start"]
