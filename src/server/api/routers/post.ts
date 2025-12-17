import { eq, exists, ilike } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { GenericRepository } from "@/server/db/Generic/GenericRepository";
import { customers } from "@/server/db/schema";
// import { posts } from "@/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      const customerRepo = new GenericRepository(customers);

      customerRepo.getAsync({
        filters: (table) => ilike(table.email, "%email%"),
      });

      customerRepo.countAsync((table) => exists(table.phone));

      customerRepo.updateAsync({
        id: 1,
        name: "",
      });

      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: publicProcedure
  // 	.input(z.object({ name: z.string().min(1) }))
  // 	.mutation(async ({ ctx, input }) => {
  // 		await ctx.db.insert(posts).values({
  // 			name: input.name,
  // 		});
  // 	}),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  // 	const post = await ctx.db.query.posts.findFirst({
  // 		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  // 	});

  // 	return post ?? null;
  // }),
});
