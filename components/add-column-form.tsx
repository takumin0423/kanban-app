'use client'

import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createColumn } from '@/app/actions/board'

interface AddColumnFormProps {
  boardId: string
}

const PREDEFINED_COLORS = [
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#6366f1', // indigo-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#6b7280', // gray-500
]

export function AddColumnForm({ boardId }: AddColumnFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('color', selectedColor)
      formData.append('boardId', boardId)
      
      await createColumn(formData)
      
      // フォームをリセット
      setTitle('')
      setSelectedColor(PREDEFINED_COLORS[0])
      setIsOpen(false)
    } catch (error) {
      console.error('カラムの作成に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setSelectedColor(PREDEFINED_COLORS[0])
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isOpen) {
    return (
      <div className="flex-shrink-0 w-80">
        <Button
          variant="outline"
          className="w-full h-full min-h-[100px] border-dashed"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新しいカラムを追加
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-background border border-border rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="カラム名を入力"
            autoFocus
            disabled={isLoading}
            className="text-sm"
          />
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">カラー</div>
            <div className="grid grid-cols-6 gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  disabled={isLoading}
                >
                  {selectedColor === color && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!title.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? '作成中...' : '追加'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}