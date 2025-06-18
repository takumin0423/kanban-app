'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { Board, Column, Task } from '@prisma/client'
import { AddTaskDialog } from '@/components/add-task-dialog'

interface BoardViewProps {
  board: Board & {
    columns: (Column & {
      tasks: Task[]
    })[]
  }
}

export function BoardView({ board: initialBoard }: BoardViewProps) {
  const [board, setBoard] = useState(initialBoard)

  // 簡易的なドラッグ&ドロップの実装
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null)

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task)
    setDraggedFromColumn(columnId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    
    if (!draggedTask || !draggedFromColumn || draggedFromColumn === targetColumnId) {
      return
    }

    // UIを即座に更新
    setBoard(prevBoard => {
      const newColumns = prevBoard.columns.map(column => {
        if (column.id === draggedFromColumn) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id)
          }
        }
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, { ...draggedTask, columnId: targetColumnId }]
          }
        }
        return column
      })

      return {
        ...prevBoard,
        columns: newColumns
      }
    })

    // TODO: サーバーに変更を保存する処理を実装
    console.log(`Moved task ${draggedTask.id} from ${draggedFromColumn} to ${targetColumnId}`)

    setDraggedTask(null)
    setDraggedFromColumn(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {board.columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <Card className="h-full">
            <CardHeader
              className="pb-3"
              style={{
                borderTop: `4px solid ${column.color}`,
              }}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {column.title}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {column.tasks.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <AddTaskDialog columnId={column.id} />
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'URGENT'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              : task.priority === 'HIGH'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                              : task.priority === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}
                        >
                          {task.priority === 'URGENT'
                            ? '緊急'
                            : task.priority === 'HIGH'
                            ? '高'
                            : task.priority === 'MEDIUM'
                            ? '中'
                            : '低'}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      
      <div className="flex-shrink-0 w-80">
        <Button
          variant="outline"
          className="w-full h-full min-h-[100px] border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          カラムを追加
        </Button>
      </div>
    </div>
  )
}