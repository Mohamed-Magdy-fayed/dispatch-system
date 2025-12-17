# Generic Repository

This TypeScript generic repository provides a familiar Entity Framework Core-like interface for database operations using Drizzle ORM. It's designed as a direct adaptation of the .NET GenericRepository pattern.

## Overview

The `GenericRepository<TEntity, TKey>` class implements the `IGenericRepository<TEntity, TKey>` interface and provides CRUD operations for any Drizzle table. It supports:

- Filtering with lambda-style expressions
- Pagination
- Ordering
- Soft delete (optional)
- Type-safe operations

## Type Constraints

```typescript
export class GenericRepository<TEntity extends Record<string, any>, TKey>
```

- `TEntity`: Must extend `Record<string, any>` (object type)
- `TKey`: The primary key type (usually `number` for auto-increment IDs)

## Constructor

```typescript
constructor(table: PgTable)
```

Pass any Drizzle table definition:

```typescript
import { customers } from "../schemas/core";
import { GenericRepository } from "./GenericRepository";

const customerRepo = new GenericRepository(customers);
```

## Methods

### getAsync

Retrieves multiple entities with optional filtering, paging, and ordering.

```typescript
async getAsync(
  filter?: (table: any) => any,
  page?: number,
  pageSize?: number,
  orderBy?: (table: any) => any,
  includeProperties?: string[],
  noTrack?: boolean,
  cancellationToken?: AbortSignal
): Promise<TEntity[]>
```

**Examples:**

```typescript
// Get all customers
const allCustomers = await customerRepo.getAsync();

// Filter customers by name
const johns = await customerRepo.getAsync((table) => eq(table.name, "John"));

// Paginated results
const page2 = await customerRepo.getAsync(
  undefined, // no filter
  2, // page 2
  20 // 20 per page
);

// Ordered by name
const ordered = await customerRepo.getAsync(
  undefined, // no filter
  undefined, // no paging
  undefined, // default page size
  (table) => asc(table.name) // order by name ascending
);

// Combined filter, paging, and ordering
const filteredPaged = await customerRepo.getAsync(
  (table) => like(table.email, "%@example.com"),
  1,
  10,
  (table) => desc(table.createdAt)
);
```

### getByIdAsync

Retrieves a single entity by its primary key.

```typescript
async getByIdAsync(id: TKey, cancellationToken?: AbortSignal): Promise<TEntity | undefined>
```

**Example:**

```typescript
const customer = await customerRepo.getByIdAsync(123);
if (customer) {
  console.log(customer.name);
}
```

### countAsync

Counts entities matching an optional filter.

```typescript
async countAsync(filter?: (table: any) => any, cancellationToken?: AbortSignal): Promise<number>
```

**Examples:**

```typescript
// Count all customers
const total = await customerRepo.countAsync();

// Count active customers
const activeCount = await customerRepo.countAsync((table) =>
  eq(table.status, "active")
);
```

### addAsync

Inserts a new entity and returns it with any generated fields.

```typescript
async addAsync(entity: TEntity, cancellationToken?: AbortSignal): Promise<TEntity>
```

**Example:**

```typescript
const newCustomer = await customerRepo.addAsync({
  name: "John Doe",
  email: "john@example.com",
  phone: "123-456-7890",
});
// newCustomer now includes the generated ID
```

### updateAsync

Updates an existing entity. Requires the entity to have an `id` property.

```typescript
async updateAsync(entity: TEntity, cancellationToken?: AbortSignal): Promise<void>
```

**Example:**

```typescript
const customer = await customerRepo.getByIdAsync(123);
if (customer) {
  customer.name = "Jane Doe";
  await customerRepo.updateAsync(customer);
}
```

### deleteAsync

Permanently deletes an entity by ID.

```typescript
async deleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>
```

**Example:**

```typescript
await customerRepo.deleteAsync(123);
```

### softDeleteAsync

Soft deletes an entity if the table has an `isDeleted` column, otherwise performs hard delete.

```typescript
async softDeleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>
```

**Example:**

```typescript
await customerRepo.softDeleteAsync(123);
// Entity is marked as deleted but not removed from database
```

## Soft Delete Support

The repository automatically handles soft delete for tables with an `isDeleted` boolean column:

- `getAsync()` automatically filters out soft-deleted records
- `softDeleteAsync()` sets `isDeleted = true`
- If no `isDeleted` column exists, `softDeleteAsync()` falls back to hard delete

To add soft delete to a table:

```typescript
export const myTable = createTable("my_table", {
  // ... other columns
  isDeleted: d.boolean().default(false).notNull(),
});
```

## Filtering Syntax

Filters use function callbacks that receive the table and return Drizzle conditions:

```typescript
import { eq, like, gt, and, or } from 'drizzle-orm';

// Simple equality
(table) => eq(table.status, 'active')

// Like pattern
(table) => like(table.email, '%@company.com')

// Greater than
(table) => gt(table.createdAt, new Date('2024-01-01'))

// Complex conditions
(table) => and(
  eq(table.status, 'active'),
  gt(table.createdAt, new Date('2024-01-01'))
)
```

## Ordering Syntax

Order by uses similar callback pattern:

```typescript
import { asc, desc } from 'drizzle-orm';

// Ascending
(table) => asc(table.name)

// Descending
(table) => desc(table.createdAt)

// Multiple columns (not directly supported, use raw SQL if needed)
```

## Limitations

### Includes/Relations

The `includeProperties` parameter is not fully implemented. Drizzle handles relations differently using `with()` syntax. For complex queries with relations, create specific repository methods:

```typescript
// Instead of includes, use Drizzle's with()
const result = await db
  .select()
  .from(customers)
  .where(eq(customers.id, id))
  .with({
    orders: true, // Include related orders
  });
```

### No Tracking

The `noTrack` parameter is currently not implemented as Drizzle doesn't have change tracking like EF Core.

## Comparison to .NET Version

| .NET GenericRepository                                  | TypeScript GenericRepository           |
| ------------------------------------------------------- | -------------------------------------- |
| `Expression<Func<TEntity, bool>>`                       | `(table: any) => any`                  |
| `Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>` | `(table: any) => any`                  |
| `List<Expression<Func<TEntity, object>>>`               | `string[]` (not fully implemented)     |
| `CancellationToken`                                     | `AbortSignal`                          |
| EF Core Includes                                        | Not implemented (use Drizzle `with()`) |
| Change Tracking                                         | Not applicable                         |
| Soft Delete via BaseEntity                              | Column-based detection                 |

## Error Handling

The repository throws errors for:

- Missing `id` property in `updateAsync()`
- Database operation failures (propagated from Drizzle)

## Best Practices

1. **Use specific repositories for complex logic**: Extend `GenericRepository` for table-specific operations
2. **Handle relations explicitly**: Use Drizzle's `with()` for eager loading
3. **Type your entities**: Ensure your entity types match your table schemas
4. **Use transactions**: Wrap multiple operations in database transactions when needed
5. **Validate input**: Add validation before calling repository methods

## Example: Extended Repository

````typescript
import { GenericRepository } from './GenericRepository';
import { customers } from '../schemas/core';
import { eq } from 'drizzle-orm';

export class CustomerRepository extends GenericRepository<typeof customers.$inferSelect, number> {
  constructor() {
    super(customers);
  }

  async getActiveCustomers() {
    return this.getAsync((table) => eq(table.status, 'active'));
  }

  async findByEmail(email: string) {
    const result = await this.getAsync((table) => eq(table.email, email));
    return result[0];
  }
}

// Usage
const customerRepo = new CustomerRepository();
const activeCustomers = await customerRepo.getActiveCustomers();
const customerByEmail = await customerRepo.findByEmail('john@example.com');
```</content>
<parameter name="filePath">e:\Learning\Dispatch-system\dispatch-system\src\server\db\Generic\README.md
````
