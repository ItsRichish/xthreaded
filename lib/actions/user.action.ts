"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Knot from "../models/knot.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (e: any) {
    throw new Error(`Failed to create/update user: ${e.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path:'communities',
    //   model:Community
    // })
  } catch (e: any) {
    throw new Error(`Failed to create/update user: ${e.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    //Fill all knots authored by user with the given userID
    const knots = await User.findOne({ id: userId }).populate({
      path: "knots",
      model: Knot,
      populate: {
        path: "children",
        model: Knot,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return knots;
  } catch (e: any) {
    throw new Error(`Failed to fetch user posts: ${e.message}`);
  }
}
