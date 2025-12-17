import { eq, and, sql } from "drizzle-orm";
import { db } from "../index";
import { PgTable } from "drizzle-orm/pg-core";

export interface IGenericRepository<TEntity extends Record<string, any>, TKey> {
  getAsync(
    filter?: (table: any) => any,
    page?: number,
    pageSize?: number,
    orderBy?: (table: any) => any,
    includeProperties?: string[],
    noTrack?: boolean,
    cancellationToken?: AbortSignal
  ): Promise<TEntity[]>;

  getByIdAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<TEntity | undefined>;

  countAsync(
    filter?: (table: any) => any,
    cancellationToken?: AbortSignal
  ): Promise<number>;

  addAsync(entity: TEntity, cancellationToken?: AbortSignal): Promise<TEntity>;

  updateAsync(entity: TEntity, cancellationToken?: AbortSignal): Promise<void>;

  deleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>;

  softDeleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>;
}

export class GenericRepository<TEntity extends Record<string, any>, TKey>
  implements IGenericRepository<TEntity, TKey>
{
  private table: PgTable;

  constructor(table: PgTable) {
    this.table = table;
  }

  async getAsync(
    filter?: (table: any) => any,
    page?: number,
    pageSize = 10,
    orderBy?: (table: any) => any,
    includeProperties?: string[],
    noTrack = false,
    cancellationToken?: AbortSignal
  ): Promise<TEntity[]> {
    let query: any = db.select().from(this.table);

    // Soft delete support - assume entities have isDeleted column
    const hasIsDeleted = "isDeleted" in this.table;
    if (hasIsDeleted) {
      query = query.where(eq((this.table as any).isDeleted, false));
    }

    if (filter) {
      const filterCondition = filter(this.table);
      if (hasIsDeleted) {
        query = query.where(
          and(eq((this.table as any).isDeleted, false), filterCondition)
        );
      } else {
        query = query.where(filterCondition);
      }
    }

    // Note: Drizzle doesn't have direct includes like EF Core
    // For relations, you'd need to use with() or separate queries
    // This is a simplified version
    if (includeProperties && includeProperties.length > 0) {
      // For now, skip includes as Drizzle handles relations differently
      console.warn(
        "Includes not fully implemented in generic repo - use specific queries for relations"
      );
    }

    if (orderBy) {
      query = query.orderBy(orderBy(this.table));
    }

    if (page && page > 0) {
      query = query.limit(pageSize).offset((page - 1) * pageSize);
    }

    const result = await query;
    return result as TEntity[];
  }

  async getByIdAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<TEntity | undefined> {
    const result = await db
      .select()
      .from(this.table)
      .where(eq((this.table as any).id, id))
      .limit(1);

    return result[0] as TEntity | undefined;
  }

  async countAsync(
    filter?: (table: any) => any,
    cancellationToken?: AbortSignal
  ): Promise<number> {
    let whereCondition = undefined;
    if (filter) {
      whereCondition = filter(this.table);
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(whereCondition);

    return result[0]?.count ?? 0;
  }

  async addAsync(
    entity: TEntity,
    cancellationToken?: AbortSignal
  ): Promise<TEntity> {
    const result = await db
      .insert(this.table)
      .values(entity as any)
      .returning();
    return result[0] as TEntity;
  }

  async updateAsync(
    entity: TEntity,
    cancellationToken?: AbortSignal
  ): Promise<void> {
    const id = (entity as any).id;
    if (!id) throw new Error("Entity must have an id property for update");

    await db
      .update(this.table)
      .set(entity as any)
      .where(eq((this.table as any).id, id));
  }

  async deleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void> {
    await db.delete(this.table).where(eq((this.table as any).id, id));
  }

  async softDeleteAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<void> {
    const hasIsDeleted = "isDeleted" in this.table;
    if (hasIsDeleted) {
      await db
        .update(this.table)
        .set({ isDeleted: true } as any)
        .where(eq((this.table as any).id, id));
    } else {
      // Fallback to hard delete if no soft delete column
      await this.deleteAsync(id, cancellationToken);
    }
  }
}
