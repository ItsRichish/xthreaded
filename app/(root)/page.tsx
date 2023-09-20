import KnotCard from "@/components/cards/KnotCard";
import { fetchPosts } from "@/lib/actions/knot.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  const res = await fetchPosts(1, 30);
  // console.log(res);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {res.posts.length === 0 ? (
          <p className="no-result">No Knots Found</p>
        ) : (
          <>
            {res.posts.map((post) => (
              <KnotCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
