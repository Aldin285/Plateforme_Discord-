import connectDB from "@/app/lib/mongo";
import room from "@/app/model/room";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();
    const rooms = await room.find();
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching rooms" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log('Received body:', body);
    const { name, createdBy,members } = body;

    if (!name || !createdBy || !members || members.length === 0){
      return NextResponse.json({ message: "All the fields are required" }, { status: 400 });
    }

    const newRoom = await room.create({
      name,
      createdBy,
      members,
      currentOwner: createdBy,
    });
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating room" }, { status: 500 });
  }
}
