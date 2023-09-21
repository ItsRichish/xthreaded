import { currentUser } from "@clerk/nextjs";

import KnotCard from "@/components/cards/KnotCard";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { fetchKnotById } from "@/lib/actions/knot.action";
import Comments from "@/components/forms/Comments";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");
  // console.log(userInfo);

  const knot = await fetchKnotById(params.id);
  // console.log(knot);

  return (
    <section className="relative">
      <div>
        <KnotCard
          key={knot._id}
          id={knot._id}
          currentUserId={user?.id || ""}
          parentId={knot.parentId}
          content={knot.text}
          author={knot.author}
          community={knot.community}
          createdAt={knot.createdAt}
          comments={knot.children}
        />
      </div>

      <div className="mt-7">
        <Comments
          knotId={knot.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        <h2>
          {knot.children.map((child: any) => (
            <KnotCard
              key={child._id}
              id={child._id}
              currentUserId={user.id}
              parentId={child.parentId}
              content={child.text}
              author={child.author}
              community={child.community}
              createdAt={child.createdAt}
              comments={child.children}
              isComment
            />
          ))}
        </h2>
      </div>
    </section>
  );
};

export default page;
