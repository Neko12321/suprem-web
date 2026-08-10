import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const allProducts = await db
    .select({ id: products.id, title: products.title, price: products.price, deposit: products.deposit })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder));
  return NextResponse.json(allProducts);
}
