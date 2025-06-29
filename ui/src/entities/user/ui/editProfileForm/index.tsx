import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Upload } from "lucide-react";
import { userStore } from "../../model/userStore";
import { toast } from "sonner";
import { getUserAvatar, updateUser } from "../../api/user";

interface EditProfileFormProps {
    children?: React.ReactNode
    onSave?: () => void;
    onCancel?: () => void;
}

export const EditProfileForm = observer(({ onSave, onCancel, children }: EditProfileFormProps) => {
    const user = userStore.currentUser;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [avatarUrl, setAvatarUrl] = useState<string>("");


    useEffect(() => {
        if (user) {
            getUserAvatar(user).then((v: string) => {
                setAvatarUrl(v)
            })
            setFormData({
                name: user.name || "",
            });
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            await updateUser(user.id, formData.name)

            toast.success("Профиль успешно обновлен");
            onSave?.();
        } catch (error) {
            toast.error("Ошибка при обновлении профиля");
            console.error("Failed to update profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
            });
        }
        onCancel?.();
    };

    const hasChanges = user && (
        formData.name !== user.name
    );

    if (!user) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Редактировать профиль</CardTitle>
                <CardDescription>
                    Обновите информацию о своем профиле. Имя пользователя изменить нельзя.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-lg">
                            {formData.name?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Аватар (URL)</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="avatar"
                                placeholder="https://example.com/avatar.jpg"
                                disabled
                                onChange={(e) => handleInputChange("avatar", e.target.value)}
                                className="flex-1"
                            />
                            <Button variant="outline" size="icon" disabled>
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Username (Read-only) */}
                <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                        Имя пользователя нельзя изменить
                    </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                        id="name"
                        placeholder="Введите ваше имя"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        disabled
                        value={user.email}
                    />
                </div>

                {/* Account Info (Read-only) */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Информация об аккаунте</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Статус верификации</Label>
                            <div className="flex items-center space-x-2">
                                <div className={`h-2 w-2 rounded-full ${user.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="text-sm text-muted-foreground">
                                    {user.verified ? 'Подтвержден' : 'Не подтвержден'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Дата создания</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(user.created).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                    </Button>
                    {children ? children : ""}
                </div>
            </CardContent>
        </Card>
    );
});