import { observer } from "mobx-react-lite"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { chatsStore } from "../../model/chatListStore"
import { createChat } from "../../api/chat"

interface User {
    id: string;
    username: string;
    avatar?: string;
}

interface CreateChatButtonProps {
    filterUsers: (query: string) => Promise<User[]>;
    handleSuccess: (chatID: string) => void;
    children?: React.ReactNode;
}

export const CreateChatButton = observer(({ filterUsers, handleSuccess, children }: CreateChatButtonProps) => {
    const [username, setUsername] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const searchUsers = async () => {
            if (!username.trim()) {
                setFilteredUsers([]);
                return;
            }

            setIsLoading(true);
            try {
                const users = await filterUsers(username);
                // Filter out already selected users
                const availableUsers = users.filter(user =>
                    !selectedUsers.some(selected => selected.id === user.id)
                );
                setFilteredUsers(availableUsers.slice(0, 5)); // Top 5 available users
            } catch (error) {
                console.error('Failed to filter users:', error);
                setFilteredUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [username, filterUsers, selectedUsers]);

    const handleUserSelect = (user: User) => {
        setSelectedUsers(prev => [...prev, user]);
        setUsername(""); // Clear search input after selection
        setFilteredUsers([]);
    };

    const handleUserRemove = (userId: string) => {
        setSelectedUsers(prev => prev.filter(user => user.id !== userId));
    };

    const resetForm = () => {
        setSelectedUsers([]);
        setUsername("");
        setFilteredUsers([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUsers.length > 0) {
            const participantIds = selectedUsers.map(user => user.id);
            const chatTitle = selectedUsers.length === 1
                ? selectedUsers[0].username
                : `Group with ${selectedUsers.map(u => u.username).join(', ')}`;

            createChat(participantIds, chatTitle).then((newChat) => {
                chatsStore.addChat(newChat);
                handleSuccess(newChat.id);
                resetForm();
                setIsOpen(false);
            }).catch((error) => {
                console.log("failed to create chat", error);
            });
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset form when dialog closes
            resetForm();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || <Button variant="outline">➕</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создать чат</DialogTitle>
                        <DialogDescription>
                            Найдите пользователей по имени
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {/* Selected users display */}
                        {selectedUsers.length > 0 && (
                            <div className="grid gap-2">
                                <Label>Выбранные пользователи:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                        >
                                            {user.avatar && (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username}
                                                    className="w-4 h-4 rounded-full"
                                                />
                                            )}
                                            <span>{user.username}</span>
                                            <button
                                                type="button"
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                                onClick={() => handleUserRemove(user.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-3 relative">
                            <Label htmlFor="username">Найти пользователя</Label>
                            <Input
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите имя пользователя"
                                autoComplete="off"
                            />

                            {/* User suggestions dropdown */}
                            {(filteredUsers.length > 0 || isLoading) && (
                                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-2 text-gray-500">Поиск...</div>
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                {user.avatar && (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                )}
                                                <span>{user.username}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-2 text-gray-500">Пользователи не найдены</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Закрыть</Button>
                        </DialogClose>
                        <Button type="submit" disabled={selectedUsers.length === 0}>
                            Создать чат ({selectedUsers.length})
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})