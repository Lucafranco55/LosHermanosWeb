# Los Hermanos

Sitio institucional + panel admin + landing promo QR para la pyme Los Hermanos.

Stack principal:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Deploy preparado para Vercel

## Qué incluye

- Home pública
- Catálogo en `/productos`
- Detalle de producto en `/productos/[slug]`
- Distribución en `/distribucion`
- Puntos de venta en `/puntos-de-venta`
- Contacto en `/contacto`
- Promo QR en `/promo`
- Panel admin protegido en `/admin`
- Metadata SEO
- `sitemap.xml`
- `robots.txt`

## Variables de entorno

Archivo de ejemplo: [.env.example](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/.env.example)

Variables requeridas:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=
AUTH_SECRET=una-clave-segura-para-sesiones
ADMIN_EMAIL=admin@loshermanos.com
ADMIN_PASSWORD=admin12345
```

Notas:

- `DATABASE_URL` debe apuntar a PostgreSQL.
- `NEXT_PUBLIC_SITE_URL` se usa para canonical, sitemap y URLs públicas.
- Si `NEXT_PUBLIC_SITE_URL` empieza con `https://`, la cookie admin se emite como `secure`.
- En local, usá `http://localhost:3000` para que el login admin funcione también con `npm start`.
- `AUTH_SECRET` firma la cookie de sesión del admin.
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` se usan al correr el seed para crear o actualizar el usuario admin.

## Instalación

```bash
npm install
```

## Preparar base de datos

1. Configurá `DATABASE_URL`.
2. Generá el esquema:

```bash
npm run prisma:push
```

3. Cargá datos iniciales:

```bash
npm run seed
```

El seed crea:

- productos de ejemplo
- zonas
- puntos de venta
- contenido general
- usuario admin
- códigos promo de ejemplo

## Correr localmente

```bash
npm run dev
```

Rutas principales:

- `http://localhost:3000`
- `http://localhost:3000/productos`
- `http://localhost:3000/contacto`
- `http://localhost:3000/promo`
- `http://localhost:3000/admin`

## Login admin

El usuario admin se crea con el seed usando:

- email: valor de `ADMIN_EMAIL`
- password: valor de `ADMIN_PASSWORD`

Si no los cambiás:

- email: `admin@loshermanos.com`
- password: `admin12345`

## Uso de la promo

Ruta pública:

```text
/promo
```

Seed inicial:

- `LH-0001` = `no_gana`
- `LH-0002` = `kit_lavado`
- `LH-0003` = `no_gana`
- `LH-0004` = `camiseta_argentina`

Estados manejados:

- código inválido
- código válido sin premio
- código ganador disponible
- código ya utilizado

## Panel admin

Secciones:

- Dashboard
- Productos
- Zonas
- Puntos de venta
- Consultas
- Promo
- Contenido general

## Deploy en Vercel

1. Subí el proyecto a GitHub.
2. Creá un proyecto nuevo en Vercel.
3. Importá el repositorio.
4. Vercel detecta Next.js en forma nativa, por lo que este proyecto no necesita configuración especial de framework.
5. Configurá variables de entorno en Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
DATABASE_URL=postgresql://...
AUTH_SECRET=una-clave-segura
ADMIN_EMAIL=admin@loshermanos.com
ADMIN_PASSWORD=una-clave-segura
```

6. Ejecutá el primer deploy.
7. Luego corré el esquema y seed sobre tu base PostgreSQL productiva.

Opciones:

- correr `npm run prisma:push` y `npm run seed` desde un entorno con acceso a esa `DATABASE_URL`
- o usar un flujo de CI/CD propio si querés automatizarlo

Notas operativas:

- Si cambiás variables de entorno en Vercel, esos cambios no afectan deploys viejos; se aplican al próximo deploy.
- Para producción, `NEXT_PUBLIC_SITE_URL` debe ser tu URL HTTPS real.
- Si usás dominio propio, la URL del QR debe apuntar a `/promo` en ese dominio final.

### Deploy por CLI

Si preferís usar la CLI oficial de Vercel:

```bash
vercel
vercel --prod
```

### Dominio propio

Una vez desplegado:

1. Agregá tu dominio en Vercel.
2. Configurá los DNS que te indique Vercel.
3. Cuando el dominio quede verificado, actualizá:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

4. Volvé a desplegar.

## URL pública final para QR

La URL del QR debe apuntar a:

```text
https://tu-dominio.com/promo
```

o, si todavía no tenés dominio propio:

```text
https://tu-proyecto.vercel.app/promo
```

## Build de producción

```bash
npm run build
npm start
```

## Verificación realizada

Se verificó:

- `npm install`
- generación de Prisma Client
- `npm run build` sin errores

## Validación funcional pendiente del entorno

Las rutas que leen o escriben datos reales requieren `DATABASE_URL` configurada y una base PostgreSQL disponible.

Por eso, para validar en ejecución:

- home con datos
- catálogo con datos
- formularios guardando
- login admin
- promo con reclamos

primero tenés que correr:

```bash
npm run prisma:push
npm run seed
```

con una `DATABASE_URL` válida.

## Archivos clave

- [prisma/schema.prisma](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/prisma/schema.prisma)
- [prisma/seed.mjs](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/prisma/seed.mjs)
- [app/page.tsx](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/page.tsx)
- [app/promo/page.tsx](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/promo/page.tsx)
- [app/api/contact/route.ts](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/api/contact/route.ts)
- [app/api/promo/validate/route.ts](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/api/promo/validate/route.ts)
- [app/api/promo/claim/route.ts](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/api/promo/claim/route.ts)
- [app/admin/page.tsx](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/admin/page.tsx)
- [app/admin/actions.ts](C:/Users/LucaA/Desktop/Campaña%20Mundial%20Los%20hermanos/app/admin/actions.ts)
