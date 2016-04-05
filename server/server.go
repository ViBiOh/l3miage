package main

import "net/http"
import "log"

const port = "1080"

func main() {
	http.Handle("/", http.FileServer(http.Dir("/")))

	log.Print("Starting server on port " + strPort)
	log.Fatal(http.ListenAndServe(":" + strPort, nil))
}
