FROM node:11 as builder

ENV CI true

ARG APP_VERSION
WORKDIR /usr/src/app
COPY . .

RUN npm ci \
 && npm run reveal \
 && npm run build \
 && mkdir -p /app \
 && cp -r www/ /app/ \
 && sed -i -e "s|{{version}}|${APP_VERSION}|g" /app/www/index.html \
 && sed -i -e "s|{{version}}|${APP_VERSION}|g" /app/www/js/index.js \
 && sed -i -e "s|{{version}}|${APP_VERSION}|g" /app/www/js/algolia.js

FROM vibioh/viws:light

ARG APP_VERSION
ENV VERSION=${APP_VERSION}
COPY --from=builder /app/www/ /www/
