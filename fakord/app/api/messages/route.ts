import connectDB from "@/app/lib/mongo";
import room from "@/app/model/room";
import { NextResponse } from "next/server";


export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log('Received body:', body);
    const { sender, content,roomId } = body;

    if (!sender || !content || !roomId){
      return NextResponse.json({ message: "All the fields are required" }, { status: 400 });
    }

    const newMessage = await room.findByIdAndUpdate(
      roomId,
      {$push: { messages: { sender, content } }},
      { new: true }
    );
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating room" }, { status: 500 });
  }
}
