import { redirect } from "next/dist/server/api-utils";

export default function Product() {
  redirect("/");
  return (
    <>
      <div className=""></div>
    </>
  );
}
