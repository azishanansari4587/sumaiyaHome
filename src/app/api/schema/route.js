import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function GET() {
    try {
        const [users] = await connection.execute("DESCRIBE users");
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
