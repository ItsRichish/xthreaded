import { currentUser } from "@clerk/nextjs";

import KnotCard from "@/components/cards/KnotCard";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { fetchKnotById } from "@/lib/actions/knot.action";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const knot = await fetchKnotById(params.id);
  console.log(knot);

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
    </section>
  );
};

export default page;
