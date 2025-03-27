import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "USER",
      permissions: JSON.stringify(data.permissions),
    },
  });

  return NextResponse.json(newUser);
}
