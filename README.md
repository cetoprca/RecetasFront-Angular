# RecetasFront-Angular

Frontend de la aplicación Rataouille.net, una red social de recetas de cocina.
SPA desarrollada con Angular.

**Tecnologías:** Angular, Angular Material, RxJS, TypeScript

**Funcionalidades:**

- Feed con scroll infinito mediante IntersectionObserver
- Resolvers de Angular para precarga de datos
- Filtros combinados con estado reactivo (RxJS)
- Temas visuales personalizables (claro, oscuro, azul, verde)
- Diseño responsive de tres columnas

**Arranque con repo RecetasDeploy-DOCKER:**

Despliegue de desarrollo:
```bash
cd RecetasDeploy-DOCKER
docker compose -f compose.dev.yml up
```

Despliegue de produccion:
```bash
cd RecetasDeploy-DOCKER
docker compose -f compose.prod.yml up
```

Memoria: https://drive.google.com/file/d/15Nng71Sbz7vqwplNdlQJdKne_hKmav5l/view?usp=sharing
