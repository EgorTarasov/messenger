import { Button } from '@/components/ui/button'
import { CreateChatButton } from '@/entities/chats'
import { getUsersByUsername } from '@/entities/user'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/home/')({
    component: HomePage,
})

function HomePage() {
    const navigate = useNavigate()

    const filterUsers = async (username: string) => {
        return await getUsersByUsername(username)
    }

    const handleNewChat = async (newChatID: string) => {
        navigate({ to: `/home/${newChatID}` })
    }


    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <h1>Выберите или создайте чат!</h1>
                <CreateChatButton filterUsers={filterUsers} handleSuccess={handleNewChat}>
                    <Button>Создать чат!</Button>
                </CreateChatButton>
            </div>
        </div>
    )
}
