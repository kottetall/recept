"use strict"

const express = require("express")
const app = express()

app.listen(8080)
app.use(express.static("public"))
app.use(express.json())

app.post("/addUrl", async (request, response) => {
    console.log("\tMeddelande mottaget")

    console.log("* Gör snabbkontroll av adressen")

    const nonValidatedAdress = await request.body.urlInput
    console.log(nonValidatedAdress)

    const validatedAdress = validateAdress(nonValidatedAdress)

    const url = validatedAdress
    if (!url) {
        response.send({
            "message": "Not approved"
        })
        return
    }

    console.log(`\tAdressen "${url}" är godkänd`)

    const {
        laggTillLokalJson
    } = require("./scraper.js")

    console.log("* Hämtar adressen")

    // laggTillLokalJson(url) //Tas bort vid tester

    console.log("hämtning lyckad")

    response.send({
        "message": "Database has been updated"
    })
})

app.post("/addOwn", async (request, response) => {

    console.log("\tMeddelande mottaget")

    const recipe = await request.body.recipe

    // FIXME: sanitizefunktion(om den inte läggs till som middleware)

    if (!recipe) {
        console.log("\tReceptobjektet är tomt")
        response.send({
            "message": "Empty object"
        })
        return
    }


    // FIXME: importera funktion som konverterar receptet

    console.log("\t* Importerar receptet till databasen")

    // FIXME:importfunktionen

    console.log("Importen lyckades")

    response.send({
        "message": "Database has been updated"
    })
})

function validateAdress(stringToCheck) {
    if (typeof stringToCheck !== "string") {
        console.log("ej sträng")
        return false
    }

    if (!(/^https?:*/).test(stringToCheck)) {
        console.log("Ingen webbadress")
        return false
    }


    // TODO: kontroll av själva sidan som läggs in - om den hör till gruppen av godkända domäner, så man inte kan lägga in någon skum sida

    return stringToCheck
}