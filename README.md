# 🌍 Geolocation API

API RESTful para gerenciamento e consulta de regiões geoespaciais, com suporte a buscas por ponto, endereço ou proximidade, além de internacionalização e documentação Swagger.

---

## ✅ Funcionalidades

- ✅ CRUD de regiões geoespaciais (GeoJSON)
- 📍 Consulta por ponto (`/region/contains`)
- 🏠 Consulta por endereço (`/region/address`)
- 📡 Consulta por proximidade (`/region/nearby`)
- 🌐 Traduções dinâmicas via `Accept-Language` ou `?lang=pt`
- 📄 Documentação interativa com Swagger

---

## 🚀 Rodando localmente

### 1. Clone o repositório

```bash
git clone git@github.com:GuilhermeSantiago18/Geolocation.git
cd Geolocation
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3000
GEOCODING_API_BASE_URL=https://nominatim.openstreetmap.org
GEOCODING_COUNTRY_CODE=br
```

### 4. Suba o MongoDB com Docker (requer Docker instalado)

```bash
docker-compose up -d
```

> Isso criará um container com MongoDB na porta padrão `27017`.

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

---

## 📘 Documentação

Acesse a documentação Swagger em:

```
http://localhost:3000/api-docs
```

---

## 📌 Tecnologias Utilizadas

- Node.js 22+
- Express
- TypeScript
- MongoDB 8+ (via Docker)
- Mongoose
- Mocha + Chai (para testes)
- Swagger (via swagger-jsdoc e swagger-ui-express)
- ESLint + Prettier
- i18next (internacionalização)
- Husky (automação de hooks Git para garantir qualidade do código)

---

## 📂 Estrutura Básica

```
src/
├── controllers/
├── services/
├── models/
├── validations/
├── middlewares/
├── routes/
├── utils/
└── config/
```

---

## 🧪 Rodando Testes

```bash
npm run test
```

---
