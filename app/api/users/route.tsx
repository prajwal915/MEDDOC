import { db } from "@/config/db";
import { userTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {

    const user=await currentUser();
    try{
    //check if user already exist
    const users=await db.select().from(userTable)
    //@ts-ignore
    .where(eq(userTable.email,user?.primaryEmailAddress?.emailAddress))
    

    //if not then create new user
    if (users?.length === 0) {
     const result=await db.insert(userTable).values([
    {
      name: user?.fullName ?? "Unknown",
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      credits: 10,
    },
  ])
  .returning()
   return NextResponse.json(result[0]);
   
}
    
    return NextResponse.json(users[0]);
    }
    catch(e){
        return NextResponse.json(e);
    }
}  