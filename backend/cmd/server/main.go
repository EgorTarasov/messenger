package main

import (
	"log"
	_ "messenger/migrations"
	"messenger/static"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)


func main() {
    app := pocketbase.New()
    static.Init()

    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        Automigrate: true,
    })

    // react application route
    app.OnServe().BindFunc(func(se *core.ServeEvent) error {
        se.Router.GET("/{path...}", apis.Static(static.ReactFS, true))
        return se.Next()
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}