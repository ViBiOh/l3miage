FROM node:10 as builder

ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN npm ci \
 && npm run build \
 && mkdir -p /app \
 && cp -r dist/ /app/

FROM vibioh/viws:light

COPY --from=builder /app/dist/ /www/
