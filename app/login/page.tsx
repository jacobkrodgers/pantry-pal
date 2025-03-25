import { create_session } from "@/model/userModel";

export default async function Page()
{
    await create_session("9593172c-927b-4a52-9ac3-2546e1c2be84", new Date("1/1/2030"))
}