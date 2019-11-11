FROM node:13 as builder

ENV CI true

ARG APP_VERSION
WORKDIR /usr/src/app
COPY . .

RUN npm ci \
 && npm run reveal \
 && npm run build \ \
 && git diff -- *.go \
 && git diff --quiet -- *.go

RUN sed -i -e "s|{{version}}|${APP_VERSION}|g" /usr/src/app/www/index.html \
 && sed -i -e "s|{{version}}|${APP_VERSION}|g" /usr/src/app/www/js/index.js \
 && sed -i -e "s|{{version}}|${APP_VERSION}|g" /usr/src/app/www/js/algolia.js

FROM vibioh/viws:light

ARG APP_VERSION
ENV VERSION=${APP_VERSION}
COPY --from=builder /usr/src/app/www/ /www/
