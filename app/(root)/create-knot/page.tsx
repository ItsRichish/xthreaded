import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.action";
import PostKnot from "@/components/forms/PostKnot";

async function page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  //   console.log(userInfo);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Knot</h1>

      <PostKnot userId={userInfo._id} />
    </>
  );
}

export default page;
