import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { observer } from "mobx-react-lite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userStore } from "../../model/userStore";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Пожалуйста, введите корректный email адрес"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

interface LoginCardProps {
  onSuccess?: () => void;
}

type LoginFormData = z.infer<typeof LoginFormSchema>;

export const LoginForm = observer(({ onSuccess }: LoginCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await userStore.authenticateUser(data.email, data.password);
      toast.success("Вход выполнен успешно!", {
        description: "Добро пожаловать!",
      });
      onSuccess?.();
    } catch (error) {
      toast.error("Ошибка входа", {
        description:
          error instanceof Error ? error.message : "Произошла ошибка",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Войти в аккаунт</CardTitle>
        <CardDescription>
          Введите ваш email ниже для входа в аккаунт
        </CardDescription>
        <CardAction>
          <Button variant="link">Регистрация</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="example@mail.ru"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Пароль</FormLabel>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Забыли пароль?
                    </a>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите ваш пароль"
                        className="pr-10"
                        autoComplete="current-password"
                        onKeyDown={handleKeyDown}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Скрыть пароль" : "Показать пароль"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Hidden submit button for Enter key functionality */}
            <button type="submit" style={{ display: 'none' }} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="button"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={userStore.currentUserLoading}
        >
          {userStore.currentUserLoading ? "Вход..." : "Войти"}
        </Button>
        <Button variant="outline" className="w-full">
          Войти через Google
        </Button>
      </CardFooter>
    </Card>
  );
});