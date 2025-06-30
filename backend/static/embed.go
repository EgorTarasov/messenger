package static

import (
	"embed"
	"io/fs"
)

//go:embed all:build/*
var buildFS embed.FS

var ReactFS fs.FS

// Init required to properly handle react bundled files
func Init(){
	var err error

    ReactFS, err = fs.Sub(buildFS, "build")
    if err != nil {
        panic("failed to create React filesystem: " + err.Error())
    }
}
