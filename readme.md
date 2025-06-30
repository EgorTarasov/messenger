# Тестовый проект для проверки работы с pocketbase

# Сборка и запуск

для сборки проекта используется [Docker](https://docs.docker.com/engine/install/) и [taskfile](https://taskfile.dev/installation/) .

## Перменные окружения

-   `DATA` - путь к папке с данными pocketbase, по умолчанию `./pb_data`

для запуска приложения необходимо выполнить команду:

```
task run-docker
```

она соберет образ Docker и запустит контейнер с приложением.

# Разработка

Для разработки приложения используются следующе зависимости:

-   [pnpm](https://pnpm.io/installation) - менеджер пакетов для JavaScript
-   [Node.js](https://nodejs.org/en/download/) - JavaScript runtime
-   [go](https://go.dev/doc/install) - язык программирования Go
-   [Taskfile](https://taskfile.dev/) - инструмент для автоматизации задач
-   [pocketbase](https://pocketbase.io/docs/) - backend as a service для упрощения разработки

## "Backend"

Весь код расположен в директории `backend/`.

```
backend
├── cmd
│   └── server // точка входа в приложение
├── migrations
├── pb_data // данные pocketbase для локальной разработки
│   ├── backups
│   └── storage
│       ├── _pb_users_auth_
│       │   └── gmzksgrczoclszx
│       │       └── thumbs_screenshot_2025_06_06_at_8_44_fmvkw676jc.24PM.png
│       └── pbc_3861817060
│           └── x2y5pq52u4jft6l
│               └── thumbs_untitled_2_zax5ld1ny0.png
└── static // директория со статическими файлами spa приложения
    └── build // скомпилированное react приложения используйте команду `build-frontend` для сборки
        └── assets
```

## "Frontend"

Весь код расположен в директории `ui/`.

```
ui
├── public // публичная директория для статических файлов
└── src
    ├── app
    ├── components // переиспользуемые компоненты shadcn/ui
    ├── entities // сущности приложения со своими страницами и компонентами
    ├── hooks
    ├── lib // переиспользуемые функции и утилиты
    ├── routes // страницы приложения с routing tanstack file router
    └── shared // переиспользуемые компоненты

```
