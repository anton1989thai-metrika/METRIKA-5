import { NextResponse } from 'next/server';
import { getUsers, updateUsers, User } from '@/data/users';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('API Error fetching users:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch users.', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newUsers: User[] = await request.json();

    if (!Array.isArray(newUsers)) {
      return NextResponse.json({ 
        message: 'Invalid data format. Expected an array of users.' 
      }, { status: 400 });
    }

    await updateUsers(newUsers);

    return NextResponse.json({ 
      message: 'Users updated successfully.' 
    }, { status: 200 });
  } catch (error) {
    console.error('API Error updating users:', error);
    return NextResponse.json({ 
      message: 'Failed to update users.', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
