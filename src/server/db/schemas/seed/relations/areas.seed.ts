import { db } from "../../../index";
import { areas } from "../../core";

export async function seedAreas({ routes }: any) {
  return db
    .insert(areas)
    .values(
      routes.map((r: any) => ({
        name: `Area ${r.code}`,
        routeId: r.id,
      }))
    )
    .returning();
}
