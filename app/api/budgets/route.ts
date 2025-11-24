import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all budgets for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        category: 'asc',
      },
    });

    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget: any) => {
        const now = new Date();
        let startDate = new Date();

        switch (budget.period) {
          case 'WEEKLY':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'MONTHLY':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'YEARLY':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        const spent = await prisma.transaction.aggregate({
          where: {
            userId: session.userId,
            category: budget.category,
            type: 'EXPENSE',
            date: {
              gte: startDate,
              lte: now,
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          ...budget,
          spent: spent._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({ budgets: budgetsWithSpent });
  } catch (error) {
    console.error('Get budgets error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching budgets' },
      { status: 500 }
    );
  }
}

// POST create a new budget
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category, limit, period } = body;

    if (!category || !limit || !period) {
      return NextResponse.json(
        { error: 'Category, limit, and period are required' },
        { status: 400 }
      );
    }

    if (limit <= 0) {
      return NextResponse.json(
        { error: 'Limit must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if budget already exists for this category and period
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_category_period: {
          userId: session.userId,
          category,
          period: period.toUpperCase(),
        },
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and period' },
        { status: 409 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        category,
        limit: parseFloat(limit),
        period: period.toUpperCase(),
        userId: session.userId,
      },
    });

    return NextResponse.json({
      message: 'Budget created successfully',
      budget: {
        ...budget,
        spent: 0,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create budget error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating budget' },
      { status: 500 }
    );
  }
}

// PUT update a budget
export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, limit } = body;

    if (!id || !limit) {
      return NextResponse.json(
        { error: 'Budget ID and limit are required' },
        { status: 400 }
      );
    }

    if (limit <= 0) {
      return NextResponse.json(
        { error: 'Limit must be greater than 0' },
        { status: 400 }
      );
    }

    // Verify ownership
    const budget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    if (budget.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: { limit: parseFloat(limit) },
    });

    return NextResponse.json({
      message: 'Budget updated successfully',
      budget: updatedBudget,
    });
  } catch (error) {
    console.error('Update budget error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating budget' },
      { status: 500 }
    );
  }
}

// DELETE a budget
export async function DELETE(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const budget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    if (budget.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting budget' },
      { status: 500 }
    );
  }
}
