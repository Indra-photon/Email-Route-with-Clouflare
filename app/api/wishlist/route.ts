import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Wishlist } from "@/app/api/models/WishlistModel";
import { auth } from "@clerk/nextjs/server";

// Public route to add an email to the wishlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email is already in the wishlist
    const existingEntry = await Wishlist.findOne({ email: email.toLowerCase() });
    
    if (existingEntry) {
      return NextResponse.json(
        { message: "Email is already on the wishlist" },
        { status: 200 }
      );
    }

    const wishlistDoc = await Wishlist.create({
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      {
        message: "Successfully added to wishlist",
        id: wishlistDoc._id.toString(),
        email: wishlistDoc.email,
        createdAt: wishlistDoc.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to join wishlist" },
      { status: 500 }
    );
  }
}

// Protected route to fetch the wishlist (admin/owner use)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const wishlist = await Wishlist.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const data = wishlist.map((w: any) => ({
      id: w._id.toString(),
      email: w.email,
      createdAt: w.createdAt,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
