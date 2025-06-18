'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBoard(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!title || title.trim() === '') {
    throw new Error('タイトルは必須です')
  }

  const board = await prisma.board.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      columns: {
        create: [
          { title: 'To Do', position: 0, color: '#ef4444' }, // red-500
          { title: 'In Progress', position: 1, color: '#f59e0b' }, // amber-500
          { title: 'Done', position: 2, color: '#10b981' }, // emerald-500
        ],
      },
    },
  })

  redirect(`/boards/${board.id}`)
}

export async function getBoards() {
  const boards = await prisma.board.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          columns: true,
        },
      },
    },
  })

  return boards
}

export async function deleteBoard(boardId: string) {
  await prisma.board.delete({
    where: {
      id: boardId,
    },
  })

  revalidatePath('/')
}

export async function getBoardWithColumnsAndTasks(boardId: string) {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      columns: {
        orderBy: {
          position: 'asc',
        },
        include: {
          tasks: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  })

  return board
}