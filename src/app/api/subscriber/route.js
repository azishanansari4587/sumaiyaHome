import connection from '@/lib/connection';
import { NextResponse } from 'next/server';
import sendEmail from "@/lib/sendEmail";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }


    // Check for duplicate
    const [existing] = await connection.query('SELECT * FROM subscriber WHERE email = ?', [trimmedEmail]);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    await connection.query('INSERT INTO subscriber (email) VALUES (?)', [trimmedEmail]);


//     await sendEmail(
//       trimmedEmail,
//       "Subscribe Newsletter",
//       `Hi I am Mohammad Zishan Ansari,\n\nThank you for subscribing to our newsletter! \n\nWe're excited to have you on board. You'll now be the first to receive exclusive updates, valuable insights, and the latest news from Profoelctron Solutions.\n\nIf you ever have questions or suggestions, feel free to reply to this email—we’d love to hear from you! \n\nWelcome to the community! \n\nWarm regards,  \n\nTeam Profoelctron Solutions \n\n[Company Website]`
//     );

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {

    console.error('Subscription error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// ** GET METHOD //
export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM subscriber"); 
    return NextResponse.json({ subscribers: rows });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
