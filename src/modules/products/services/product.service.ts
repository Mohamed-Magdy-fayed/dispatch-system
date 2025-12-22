import { z } from "zod";
import { GenericRepository } from "../../../server/db/Generic/GenericRepository";
import { products } from "../../../server/db/schemas/core/products.table";
import { createProductSchema, updateProductSchema } from "../index";

export class ProductService {
  private repo: GenericRepository<typeof products>;

  constructor() {
    this.repo = new GenericRepository(products);
  }

  async create(data: z.infer<typeof createProductSchema>) {
    const validated = createProductSchema.parse(data);
    const entity = {
      ...validated,
      price: validated.price.toString(),
    };
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

  async getAll() {
    return this.repo.getAsync();
  }

  async getById(id: number) {
    return this.repo.getByIdAsync(id);
  }

  async delete(id: number) {
    return this.repo.softDeleteAsync(id);
  }

  async count() {
    return this.repo.countAsync();
  }
}
