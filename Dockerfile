FROM vibioh/viws

ENV VIWS_CSP "default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net/algoliasearch/3/ www.datadoghq-browser-agent.com/eu1/v5/; style-src 'self' 'unsafe-inline'; connect-src 'self' *.algolia.net *.algolianet.com browser-intake-datadoghq.eu/api/v2/; child-src www.youtube.com"
ENV VIWS_ENV ALGOLIA_APP,ALGOLIA_KEY,ALGOLIA_INDEX
ENV VIWS_HEADERS X-UA-Compatible:ie=edge~content-language:fr
ENV VIWS_SPA true

ARG TARGETOS
ARG TARGETARCH
COPY revealgolia_${TARGETOS}_${TARGETARCH} /revealgolia

ARG VERSION
ENV VERSION=${VERSION}
COPY www/ /www/
