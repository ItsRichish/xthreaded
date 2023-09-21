"use client";

import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CommentValidation } from "@/lib/validations/knot";
import { Button } from "@/components/ui/button";
import { addCommentToKnot } from "@/lib/actions/knot.action";
import { Input } from "../ui/input";
import Image from "next/image";

interface Props {
  knotId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comments = ({ knotId, currentUserImg, currentUserId }: Props) => {
  console.log(currentUserId);

  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      knot: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToKnot(
      knotId,
      values.knot,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="knot"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  className="rounded-full object-cover"
                  src={currentUserImg}
                  alt="Current User"
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  className="no-focus text-light-1 outline-none "
                  type="text"
                  placeholder="Comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comments;
