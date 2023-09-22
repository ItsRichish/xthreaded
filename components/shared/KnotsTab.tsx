import { fetchUserPosts } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import KnotCard from "../cards/KnotCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const KnotsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let res = await fetchUserPosts(accountId);
  // console.log(res);

  if (!res) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {res.knots.map((knot: any) => (
        <KnotCard
          key={knot._id}
          id={knot._id}
          currentUserId={currentUserId}
          parentId={knot.parentId}
          content={knot.text}
          author={
            accountType === "User"
              ? { name: res.name, image: res.image, id: res.id }
              : {
                  name: knot.author.name,
                  image: knot.author.image,
                  id: knot.author.id,
                }
          }
          community={knot.community}
          createdAt={knot.createdAt}
          comments={knot.children}
        />
      ))}
    </section>
  );
};

export default KnotsTab;
