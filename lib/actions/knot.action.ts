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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent  (a thread that is not a comment/reply).
  const postsQuery = Knot.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Knot.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchKnotById(id: string) {
  connectToDB();

  try {
    const knot = await Knot.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Knot,
            populate: {
              path: "author",
              model: User,
              select: "_id name parentId image",
            },
          },
        ],
      })
      .exec();

    return knot;
  } catch (error: any) {
    throw new Error(`Error fetching knot ${error.message}`);
  }
}

export async function addCommentToKnot(
  knotId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    //adding comment to knot
    const originalKnot = await Knot.findById(knotId);

    if (!originalKnot) throw new Error("Knot not found");

    //Create a new Knot with the comment text
    const commentKnot = new Knot({
      text: commentText,
      author: userId,
      parentId: knotId,
    });

    //Save the new knot
    const savedCommentKnot = await commentKnot.save();

    // Update the original knot to include the new comment
    originalKnot.children.push(savedCommentKnot._id);

    // Save the original knot
    await originalKnot.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to Knot ${error.message}`);
  }
}
