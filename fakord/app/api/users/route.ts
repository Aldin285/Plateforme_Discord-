import connectDB from "@/app/lib/mongo";
import User from "@/app/model/user";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log('Received body:', body);
    const { firstname, lastname, rooms, info } = body;

    if (!firstname || !lastname || !info?.birthday || !info?.gender) {
      return NextResponse.json({ message: "All the fields are required" }, { status: 400 });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      rooms: rooms || [],
      info,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
