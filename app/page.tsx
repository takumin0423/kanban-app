import { getBoards } from '@/app/actions/board'
import { CreateBoardDialog } from '@/components/create-board-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const boards = await getBoards()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">カンバンボード</h1>
          <p className="text-muted-foreground">プロジェクトの進捗を可視化して管理しましょう</p>
        </div>

        <div className="mb-6">
          <CreateBoardDialog />
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">ボードがまだありません</p>
            <CreateBoardDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  最初のボードを作成
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <Link key={board.id} href={`/boards/${board.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{board.title}</CardTitle>
                    {board.description && (
                      <CardDescription className="line-clamp-2">
                        {board.description}
                      </CardDescription>
                    )}
                    <div className="mt-4 space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {board._count.columns} カラム
                      </div>
                      <div className="text-sm text-muted-foreground">
                        作成日: {new Date(board.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}