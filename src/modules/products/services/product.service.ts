import { z } from "zod";
import { and, ilike, sql, SQL } from "drizzle-orm";
import { GenericRepository } from "../../../server/db/Generic/GenericRepository";
import { products } from "../../../server/db/schemas/core/products.table";
import type {
  GetAllProductsResult,
  GetProductsOptions,
} from "../types/product.types"; // ✅ type-only import
import {
  createProductSchema,
  updateProductSchema,
} from "../types/product.types";

export class ProductService {
  private repo: GenericRepository<typeof products>;

  constructor() {
    this.repo = new GenericRepository(products);
  }

  async create(data: z.infer<typeof createProductSchema>) {
    const validated = createProductSchema.parse(data);
    const entity = { ...validated, price: validated.price.toString() };
    return this.repo.addAsync(entity);
  }

  async update(data: z.infer<typeof updateProductSchema>) {
    const validated = updateProductSchema.parse(data);
    const { price, ...rest } = validated;
    const entity = {
      ...rest,
      ...(price !== undefined && { price: price.toString() }),
    };
    return this.repo.updateAsync(entity);
  }

  async getAll(options?: GetProductsOptions): Promise<GetAllProductsResult> {
    const { page = 1, pageSize = 10, filters, sort } = options ?? {};

    const filterFn = (t: typeof products): SQL => {
      const conditions: SQL[] = [];

      if (filters?.name) {
        conditions.push(ilike(t.name, `%${filters.name}%`) as SQL);
      }

      if (filters?.description) {
        conditions.push(
          ilike(t.description, `%${filters.description}%`) as SQL
        );
      }

      // ✅ force type to SQL to remove undefined
      return (conditions.length > 0 ? and(...conditions) : sql`true`) as SQL;
    };

    const orderFn = sort
      ? (t: typeof products) => {
          const column = t[sort.field as keyof typeof t];
          return sort.direction === "desc"
            ? sql`${column} desc`
            : sql`${column} asc`;
        }
      : undefined;

    const data = await this.repo.getAsync({
      filters: filterFn,
      order: orderFn,
      page,
      perPage: pageSize,
    });

    const countWithFilters = await this.repo.countAsync(filterFn);
    const countTotal = await this.repo.countAsync();

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        countWithFilters,
        countTotal,
      },
    };
  }

  async getById(id: number) {
    return this.repo.getByIdAsync(id);
  }

  async delete(id: number) {
    return this.repo.softDeleteAsync(id);
  }
}
