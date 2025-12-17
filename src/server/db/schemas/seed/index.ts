import { resetDatabase } from "./reset";
import { seedBasics } from "./basics";
import { seedRelations } from "./relations";


export async function seedAll() {
await resetDatabase();
const basics = await seedBasics();
await seedRelations(basics);
}