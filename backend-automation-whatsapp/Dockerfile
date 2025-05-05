FROM node:18

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Garante que o Puppeteer baixe o Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# Definir o caminho correto para o Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Instala dependências do Chrome (padrão Debian para headless)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    chromium \
    --no-install-recommends \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Rodando o comando de build
RUN npm run build

EXPOSE 3001

# Define o comando para iniciar o backend
CMD ["npm", "run", "start"]
