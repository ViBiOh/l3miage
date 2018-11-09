FROM node:10 as builder

ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN npm ci \
 && npm run reveal \
 && npm run build \
 && mkdir -p /app \
 && cp -r web/ /app/

FROM vibioh/viws:light

COPY --from=builder /app/web/ /www/
