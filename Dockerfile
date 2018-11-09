FROM node:10 as builder

ARG VERSION
ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN npm ci \
 && npm run reveal \
 && npm run build \
 && mkdir -p /app \
 && cp -r web/ /app/ \
 && sed -i -e "s|{{version}}|${VERSION}|g" /app/web/index.html \
 && sed -i -e "s|{{version}}|${VERSION}|g" /app/web/js/index.js

FROM vibioh/viws:light

COPY --from=builder /app/web/ /www/
