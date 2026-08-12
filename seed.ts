import { db } from "./src/db";
import { adminUsers } from "./src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
  const password = "123";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.update(adminUsers)
    .set({ passwordHash: hashedPassword })
    .where(eq(adminUsers.username, "admin"));
  
  console.log("Şifre güncellendi! Kullanıcı: admin, Şifre: 123");
}

main();
