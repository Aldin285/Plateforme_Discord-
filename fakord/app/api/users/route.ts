import connectDB from "@/app/lib/mongo";
import User from "@/app/model/user";
import room from "@/app/model/room";
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
    const { firstname, lastname, email, password, username, birthday, gender } = body;

    if (!firstname || !lastname || !birthday || !email || !password || !username || !gender){
      return NextResponse.json({ message: "All the fields are required" }, { status: 400 });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      username,
      rooms:[],
      friends: [],
      birthday,
      gender,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, newRoomId } = body; // update is an object with fields to update

    if (!userId || !newRoomId) {
      return NextResponse.json({ message: "All the fields are required" }, { status: 400 });
    }

    // const newRoom= await room.findOne({name:newRoomName});
    // if(!newRoom){
    //   return NextResponse.json({ message: "Room not found" }, { status: 404 });
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$push: { rooms: newRoomId }},
      { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}
