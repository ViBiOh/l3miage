FROM node:11 as builder

ARG VERSION
ENV WORKDIR /usr/src/app
ENV CI true

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN npm ci \
 && npm run reveal \
 && npm run build \
 && mkdir -p /app \
 && cp -r www/ /app/ \
 && sed -i -e "s|{{version}}|${VERSION}|g" /app/www/index.html \
 && sed -i -e "s|{{version}}|${VERSION}|g" /app/www/js/index.js \
 && sed -i -e "s|{{version}}|${VERSION}|g" /app/www/js/algolia.js

FROM vibioh/viws:light

COPY --from=builder /app/www/ /www/
