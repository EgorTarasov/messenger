package main

import (
	"log"
	"messenger/static"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)


func main() {
    app := pocketbase.New()
    static.Init()
    // react application route
    app.OnServe().BindFunc(func(se *core.ServeEvent) error {
        se.Router.GET("/{path...}", apis.Static(static.ReactFS, true))
        return se.Next()
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}