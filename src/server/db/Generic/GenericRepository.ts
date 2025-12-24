import type { AnyColumn, InferInsertModel, InferModel, SQL } from "drizzle-orm";
import { and, eq, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { TableLikeHasEmptySelection } from "drizzle-orm/pg-core/query-builders/select.types";
import { db } from "../index";

type PrimaryKey<TEntity> = TEntity extends { id: infer Id } ? Id : number;
type TableWithSelection<TTable extends PgTable> =
  TableLikeHasEmptySelection<TTable> extends true ? never : TTable;
type InsertModelOf<TTable extends PgTable> = InferInsertModel<
  TableWithSelection<TTable>
>;
type UpdateModelOf<TTable extends PgTable, TKey> = Partial<
  Omit<InsertModelOf<TTable>, "id">
> & { id: TKey };

export interface GetAsyncOptions<TTable extends PgTable> {
  filters?: (table: TTable) => SQL;
  order?: (table: TTable) => SQL;
  page?: number;
  perPage?: number;
  pageSize?: number;
  includeProperties?: string[];
  noTrack?: boolean;
  cancellationToken?: AbortSignal;
}

export interface IGenericRepository<
  TTable extends PgTable,
  TEntity extends Record<string, unknown> = InferModel<TTable, "select">,
  TKey = PrimaryKey<TEntity>
> {
  getAsync(options?: GetAsyncOptions<TTable>): Promise<TEntity[]>;

  getByIdAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<TEntity | undefined>;

  countAsync(
    filter?: (table: TTable) => SQL,
    cancellationToken?: AbortSignal
  ): Promise<number>;

  addAsync(
    entity: InsertModelOf<TTable>,
    cancellationToken?: AbortSignal
  ): Promise<TEntity>;

  updateAsync(
    entity: UpdateModelOf<TTable, TKey>,
    cancellationToken?: AbortSignal
  ): Promise<void>;

  deleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>;

  softDeleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void>;
}

export class GenericRepository<
  TTable extends PgTable,
  TEntity extends Record<string, unknown> = InferModel<TTable, "select">,
  TKey = PrimaryKey<TEntity>
> implements IGenericRepository<TTable, TEntity, TKey>
{
  private readonly table: TTable;

  constructor(table: TTable) {
    this.table = table;
  }

  private get tableWithId(): TTable & { id: AnyColumn } {
    return this.table as TTable & { id: AnyColumn };
  }

  private get tableWithIsDeleted(): TTable & { isDeleted?: AnyColumn } {
    return this.table as TTable & { isDeleted?: AnyColumn };
  }

  private get selectableTable(): TableWithSelection<TTable> {
    return this.table as TableWithSelection<TTable>;
  }

  async getAsync(options?: GetAsyncOptions<TTable>): Promise<TEntity[]> {
    const opts = options ?? {};
    const { filters, page, perPage, pageSize, order, includeProperties } = opts;
    void opts.noTrack;
    void opts.cancellationToken;

    const effectivePageSize = perPage ?? pageSize ?? 10;

    const baseQuery = db.select().from(this.selectableTable);

    const tableWithIsDeleted = this.tableWithIsDeleted;
    const hasIsDeleted = "isDeleted" in tableWithIsDeleted;
    const isDeletedColumn = hasIsDeleted
      ? (tableWithIsDeleted.isDeleted as AnyColumn)
      : undefined;

    const whereConditions: SQL[] = [];
    if (isDeletedColumn) {
      whereConditions.push(eq(isDeletedColumn, false));
    }

    if (filters) {
      whereConditions.push(filters(this.table));
    }

    const combinedWhere = whereConditions.reduce<SQL | undefined>(
      (acc, condition) => (acc ? and(acc, condition) : condition),
      undefined
    );

    const filteredQuery = combinedWhere
      ? baseQuery.where(combinedWhere)
      : baseQuery;

    // Note: Drizzle doesn't have direct includes like EF Core
    // For relations, you'd need to use with() or separate queries
    // This is a simplified version
    if (includeProperties && includeProperties.length > 0) {
      // For now, skip includes as Drizzle handles relations differently
      console.warn(
        "Includes not fully implemented in generic repo - use specific queries for relations"
      );
    }

    const orderedQuery = order
      ? filteredQuery.orderBy(order(this.table))
      : filteredQuery;

    const pagedQuery =
      page && page > 0
        ? orderedQuery
            .limit(effectivePageSize)
            .offset((page - 1) * effectivePageSize)
        : orderedQuery;

    const result = await pagedQuery;
    return result as TEntity[];
  }

  async getByIdAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<TEntity | undefined> {
    void cancellationToken;
    const result = await db
      .select()
      .from(this.selectableTable)
      .where(eq(this.tableWithId.id, id))
      .limit(1);

    return result[0] as TEntity | undefined;
  }

  async countAsync(
    filter?: (table: TTable) => SQL,
    cancellationToken?: AbortSignal
  ): Promise<number> {
    let whereCondition: SQL | undefined;
    if (filter) {
      whereCondition = filter(this.table);
    }

    void cancellationToken;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(this.selectableTable)
      .where(whereCondition);

    return result[0]?.count ?? 0;
  }

  async addAsync(
    entity: InsertModelOf<TTable>,
    cancellationToken?: AbortSignal
  ): Promise<TEntity> {
    void cancellationToken;
    const result = await db
      .insert(this.selectableTable)
      .values(entity)
      .returning();
    return result[0] as TEntity;
  }

  async updateAsync(
    entity: UpdateModelOf<TTable, TKey>,
    cancellationToken?: AbortSignal
  ): Promise<void> {
    void cancellationToken;
    const { id: entityId, ...rawUpdates } = entity;
    if (!entityId)
      throw new Error("Entity must have an id property for update");

    const updates = rawUpdates as unknown as Partial<InsertModelOf<TTable>>;
    await db
      .update(this.selectableTable)
      .set(updates)
      .where(eq(this.tableWithId.id, entityId));
  }

  async deleteAsync(id: TKey, cancellationToken?: AbortSignal): Promise<void> {
    void cancellationToken;
    await db.delete(this.selectableTable).where(eq(this.tableWithId.id, id));
  }

  async softDeleteAsync(
    id: TKey,
    cancellationToken?: AbortSignal
  ): Promise<void> {
    void cancellationToken;
    const tableWithIsDeleted = this.tableWithIsDeleted;
    const isDeletedColumn = tableWithIsDeleted.isDeleted;
    if (isDeletedColumn) {
      const softDeleteValues = { isDeleted: true } as unknown as Partial<
        InsertModelOf<TTable>
      >;
      await db
        .update(this.selectableTable)
        .set(softDeleteValues)
        .where(eq(this.tableWithId.id, id));
    } else {
      // Fallback to hard delete if no soft delete column
      await this.deleteAsync(id);
    }
  }
}
