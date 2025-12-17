# Database Documentation

This document provides a comprehensive overview of the database schema, tables, relations, and seeding process for the Dispatch System.

## Overview

The database is built using **Drizzle ORM** with **PostgreSQL**. All tables are prefixed with `shipping_` using the `createTable` helper.

## Database Connection

Located in `src/server/db/index.ts`:

- Uses `drizzle-orm/postgres-js` for connection
- Caches connection in development
- Exports `db` instance and `closeDbConnection` function

## Enums

### DispatchStatus (`src/server/db/schemas/types/Dispatch.enum.ts`)

- `Pending = "pending"`
- `InProgress = "in_progress"`
- `Completed = "completed"`
- `Cancelled = "cancelled"`

### OrderStatus (`src/server/db/schemas/types/order.enum.ts`)

- `Pending = "pending"`
- `Shipped = "shipped"`
- `Delivered = "delivered"`
- `Cancelled = "cancelled"`

## Tables

### Core Tables

#### Customers (`shipping_customers`)

- `id`: Primary key, auto-increment
- `name`: VARCHAR(100), NOT NULL
- `phone`: VARCHAR(30), NOT NULL
- `email`: VARCHAR(150), optional
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `customer_phone_idx`, `customer_name_idx`

#### Drivers (`shipping_driver`)

- `id`: Primary key, auto-increment
- `name`: VARCHAR(50), NOT NULL
- `status`: VARCHAR(30), default DispatchStatus.Pending, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `driver_name_idx`

#### Trucks (`shipping_truck`)

- `id`: Primary key, auto-increment
- `model`: VARCHAR(50), NOT NULL
- `plateNumber`: VARCHAR(50), NOT NULL
- `maxBoxes`: INTEGER, NOT NULL
- `driverId`: INTEGER, references drivers.id, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `truck_plate_idx`

#### Products (`shipping_product`)

- `id`: Primary key, auto-increment
- `name`: VARCHAR(256), NOT NULL
- `price`: NUMERIC(10,2), NOT NULL
- `discription`: VARCHAR(500), optional (note: typo in schema)
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `product_name_idx`

#### Routes (`shipping_route`)

- `id`: Primary key, auto-increment
- `code`: VARCHAR(50), NOT NULL
- `name`: VARCHAR(256), NOT NULL
- `isActive`: BOOLEAN, default TRUE, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `route_code_idx`, `route_name_idx`

#### Areas (`shipping_area`)

- `id`: Primary key, auto-increment
- `name`: VARCHAR(256), NOT NULL
- `routeId`: INTEGER, references routes.id, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `area_route_idx`, `area_route_name_idx`

#### Orders (`shipping_order`)

- `id`: Primary key, auto-increment
- `code`: VARCHAR(50), NOT NULL (unique order code)
- `customerId`: INTEGER, references customers.id, NOT NULL
- `areaId`: INTEGER, references areas.id, NOT NULL
- `name`: VARCHAR(256), NOT NULL
- `boxesCount`: INTEGER, NOT NULL
- `status`: VARCHAR(30), default OrderStatus.Pending, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()

#### Dispatches (`shipping_dispatch`)

- `id`: Primary key, auto-increment
- `code`: VARCHAR(50), NOT NULL
- `date`: DATE, NOT NULL
- `status`: VARCHAR(30), default DispatchStatus.Pending, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `dispatch_date_idx`, `dispatch_code_idx`

### Junction Tables

#### Order Products (`shipping_order_products`)

- `id`: Primary key, auto-increment
- `orderId`: INTEGER, references orders.id, NOT NULL
- `productId`: INTEGER, references products.id, NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `orderId_productId_idx`

#### Dispatch Orders (`shipping_dispatch_orders`)

- `id`: Primary key, auto-increment
- `dispatchId`: INTEGER, references dispatches.id, NOT NULL
- `orderId`: INTEGER, references orders.id, NOT NULL
- `boxesCount`: INTEGER, NOT NULL (boxes from this order in this dispatch)
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `dispatch_order_idx`

#### Dispatch Routes (`shipping_dispatch_routes`)

- `id`: Primary key, auto-increment
- `dispatchId`: INTEGER, references dispatches.id, NOT NULL
- `routeId`: INTEGER, references routes.id, NOT NULL
- `boxesCount`: INTEGER, NOT NULL (boxes allocated to this route in this dispatch)
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `dispatch_route_idx`

### Example Table

#### Posts (`shipping_post`)

- `id`: Primary key, auto-increment
- `name`: VARCHAR(256), NOT NULL
- `createdAt`: TIMESTAMP WITH TIMEZONE, default NOW()
- `updatedAt`: TIMESTAMP WITH TIMEZONE, on update NOW()
- Indexes: `name_idx`

## Relations

Defined in `src/server/db/schemas/core/relations.ts`:

- **Customers**: 1:N with Orders
- **Orders**: N:1 with Customers, N:1 with Areas, 1:N with Dispatch_Orders, 1:N with Order_Products
- **Areas**: N:1 with Routes, 1:N with Orders
- **Routes**: 1:N with Areas, 1:N with Dispatch_Routes
- **Dispatches**: 1:N with Dispatch_Orders, 1:N with Dispatch_Routes
- **Dispatch_Orders**: N:1 with Dispatches, N:1 with Orders
- **Dispatch_Routes**: N:1 with Dispatches, N:1 with Routes
- **Products**: 1:N with Order_Products
- **Order_Products**: N:1 with Orders, N:1 with Products
- **Drivers**: 1:N with Trucks
- **Trucks**: N:1 with Drivers

## Seeding

### CLI (`src/server/db/schemas/seed/cli.ts`)

Run seeds using:

```bash
# Run all seeds
node src/server/db/schemas/seed/cli.ts all

# Run only basics
node src/server/db/schemas/seed/cli.ts basics

# Run only relations (requires basics to be run first)
node src/server/db/schemas/seed/cli.ts relations
```

### Basics Seed (`src/server/db/schemas/seed/basics/`)

Seeds foundational data that other data depends on:

- **Routes**: 2 routes (R-01, R-02)
- **Customers**: 2 customers (Ahmed, Omar)
- **Products**: 2 products (Box Small $10, Box Large $20)
- **Drivers**: 2 drivers (Driver 1, Driver 2)

### Relations Seed (`src/server/db/schemas/seed/relations/`)

Seeds dependent data:

- **Areas**: Creates areas for each route (Area R-01, Area R-02)
- **Orders**: 2 orders linked to customers and areas
- **Order Products**: Links all products to all orders
- **Dispatches**: 2 dispatches (DSP-1, DSP-2)

### Reset (`src/server/db/schemas/seed/reset.ts`)

Deletes all data in reverse dependency order to avoid foreign key constraints.

## Migration

Uses Drizzle migrations stored in `drizzle/` folder.

Run migrations with:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## Usage

Import the database instance:

```typescript
import { db } from "@/server/db";
```

Import schemas:

```typescript
import { customers, orders } from "@/server/db/schemas/core";
```

Example query:

```typescript
const result = await db.select().from(customers);
```
