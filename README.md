# Sistema de Gestión de Encomiendas y Transporte 🚚📦

Sistema web desarrollado para la gestión integral de encomiendas, clientes, sucursales, envíos, seguimientos, pagos, facturas y usuarios.

## Descripción

Este proyecto permite administrar el flujo completo de una encomienda:

Cliente → Encomienda → Envío → Seguimiento → Pago → Factura

El sistema cuenta con autenticación mediante JWT, documentación automática con Swagger y despliegue mediante Docker.

---

## Tecnologías utilizadas

### Frontend

* Angular
* TypeScript
* HTML
* CSS
* Tailwind CSS

### Backend

* NestJS
* TypeScript
* TypeORM
* JWT Authentication
* Swagger

### Base de datos

* PostgreSQL

### Contenedores

* Docker
* Docker Compose

---

## Funcionalidades implementadas

### Gestión de clientes

* Registrar clientes
* Editar clientes
* Eliminar clientes
* Buscar por:

  * Nombre
  * Apellido
  * CI
  * Teléfono
  * Email
  * Dirección

### Gestión de sucursales

* Registrar sucursales
* Editar sucursales
* Eliminar sucursales
* Buscar por:

  * Nombre
  * Dirección
  * Ciudad
  * Teléfono

### Gestión de encomiendas

* Registrar encomiendas
* Relación con remitente y destinatario
* Buscar por:

  * Código
  * Descripción

### Gestión de envíos

* Registro de envío
* Selección de origen y destino
* Estados:

  * Pendiente
  * En tránsito
  * Entregado
* Búsqueda por:

  * Código de encomienda
  * Origen
  * Destino
  * Estado

### Gestión de seguimiento

* Registro de seguimiento
* Estado de envío
* Ubicación
* Observaciones
* Fecha
* Búsqueda por:

  * Envío
  * Estado
  * Ubicación
  * Observaciones
  * Fecha

### Gestión de pagos

* Registro de pagos
* Métodos:

  * Efectivo
  * QR
  * Tarjeta
* Búsqueda por:

  * Envío
  * Método de pago

### Gestión de facturas

* Generación de facturas
* Número de factura
* NIT
* Razón social
* Búsqueda por:

  * NIT
  * Razón social

### Gestión de usuarios

* Registro de usuarios
* Roles:

  * Administrador
  * Operador
  * Usuario
* Estado:

  * Activo
  * Inactivo
* Búsqueda por:

  * Usuario
  * Rol
  * Estado

---

## Seguridad

* Autenticación mediante JWT
* Rutas protegidas mediante Guards
* Interceptor de autenticación
* Acceso restringido mediante token

---

## Documentación API

Swagger disponible en:

```bash
http://localhost:3000/docs
```

Permite:

* Probar endpoints
* Realizar peticiones GET
* POST
* PATCH
* DELETE
* Validar autenticación

---

## Arquitectura del sistema

Cliente
↓
Encomienda
↓
Envío
↓
Seguimiento
↓
Pago
↓
Factura

---

## Ejecución mediante Docker

Construir contenedores:

```bash
docker compose build
```

Ejecutar:

```bash
docker compose up
```

Detener:

```bash
docker compose down
```

Reconstruir completamente:

```bash
docker compose build --no-cache
docker compose up
```

---

## Frontend

Ejecutar Angular:

```bash
ng serve
```

URL:

```bash
http://localhost:4200
```

---

## Backend

Ejecutar NestJS:

```bash
npm run start:dev
```

API:

```bash
http://localhost:3000/api
```

---

## Autor

NASHIRA BELEN BASCON FLORES

Proyecto académico — Sistema de Gestión de Encomiendas y Transporte
