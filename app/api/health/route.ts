import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'DATABASE_URL environment variable is not set. Please check your .env file.',
          setup: 'Run setup.ps1 or see BACKEND_SETUP.md for instructions'
        },
        { status: 503 }
      );
    }

    // Try to import prisma
    const { prisma } = await import('@/lib/prisma');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'Database connection successful',
      database: 'connected'
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        message: error.message || 'Could not connect to database',
        details: 'Make sure PostgreSQL is running and DATABASE_URL is correct in .env',
        help: 'See BACKEND_SETUP.md for setup instructions'
      },
      { status: 503 }
    );
  }
}
