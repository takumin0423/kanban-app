'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Priority } from '@prisma/client'

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

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as Priority
  const dueDate = formData.get('dueDate') as string
  const columnId = formData.get('columnId') as string

  if (!title || title.trim() === '') {
    throw new Error('タイトルは必須です')
  }

  if (!columnId) {
    throw new Error('カラムIDが必要です')
  }

  // カラム内のタスクの最大position値を取得
  const maxPositionTask = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { position: 'desc' }
  })

  const newPosition = (maxPositionTask?.position ?? -1) + 1

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      columnId,
      position: newPosition,
    },
  })

  // ボードページを再検証
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true }
  })

  if (column) {
    revalidatePath(`/boards/${column.boardId}`)
  }

  return task
}

export async function createColumn(formData: FormData) {
  const title = formData.get('title') as string
  const color = formData.get('color') as string
  const boardId = formData.get('boardId') as string

  if (!title || title.trim() === '') {
    throw new Error('カラム名は必須です')
  }

  if (!boardId) {
    throw new Error('ボードIDが必要です')
  }

  // ボード内のカラムの最大position値を取得
  const maxPositionColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { position: 'desc' }
  })

  const newPosition = (maxPositionColumn?.position ?? -1) + 1

  const column = await prisma.column.create({
    data: {
      title: title.trim(),
      color: color || '#6b7280', // gray-500 as default
      boardId,
      position: newPosition,
    },
    include: {
      tasks: true
    }
  })

  revalidatePath(`/boards/${boardId}`)

  return column
}