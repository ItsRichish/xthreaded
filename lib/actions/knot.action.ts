"use server";

import { revalidatePath } from "next/cache";
import Knot from "../models/knot.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createKnot({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdKnot = await Knot.create({
      text,
      author,
      community: null,
    });

    //Update the user model
    await User.findByIdAndUpdate(author, {
      $push: { knots: createdKnot._id },
    });

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to create/update user: ${e.message}`);
  }
}
