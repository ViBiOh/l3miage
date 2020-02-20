FROM vibioh/viws:light

ARG VERSION
ENV VERSION=${VERSION}
COPY www/ /www/
