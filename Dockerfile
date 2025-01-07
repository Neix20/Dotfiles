FROM alpine:3.20

RUN apk update && apk add --no-cache \
  make \
  build-base \
  bash \
  openssh \
  curl \
  coreutils \
  findutils \
  python3 \
  nodejs \
  git \
  curl \
  bash-completion \
  sudo \
  neovim \
  fontconfig \
  7zip \
  && apk add openjdk21 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.20/community

RUN mkdir -p /opt/scripts \
  && mkdir -p /opt/maven \
  && mkdir -p /opt/config

ARG MAVEN_VERSION=3.8.8
ARG MAVEN_BASE_URL=https://apache.osuosl.org/maven/maven-3/${MAVEN_VERSION}/binaries

RUN curl -fsSL -o /opt/apache-maven.tar.gz ${MAVEN_BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
  && tar -xzf /opt/apache-maven.tar.gz -C /opt/maven --strip-components=1 \
  && rm -f /opt/apache-maven.tar.gz \
  && ln -s /opt/maven/bin/mvn /opt/mvn

# Setup Github Config
COPY .gitconfig /root/.gitconfig

# Setup LazyVim
COPY .config/nvim /root/.config/nvim
COPY .local /root/.local

# Setup Fonts
RUN mkdir -p /root/.local/share/fonts
COPY FiraCodeNerdFontMono-Regular.ttf /root/.local/share/fonts/FiraCodeNerdFontMono-Regular.ttf
RUN fc-cache -f -v

ENTRYPOINT [ "/bin/sh", "-c", "sleep infinity" ]

