"use strict"
// console.clear() // för användning med Nodemon

const puppeteer = require("puppeteer")

async function hamtaData(adress, selectorInnehall, screenshot = false) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(adress)

    if (screenshot) {
        const regex = /https?:\/\/www.(\w+).*/
        const filnamn = adress.match(regex)[1]

        await page.screenshot({
            path: `tmp/puppeteertest/${filnamn}.png`
        })
    }

    selectorInnehall.adress = adress

    // För att få ut datan
    const innehall = await page.evaluate((passedSelectors) => {

        function cleanScrape(string) {
            return string.replace(/\n|\t/g, " ").replace(/\s{1,}/g, " ").trim()
        }

        const {
            rubrikSelector,
            bildlankSelector,
            tidSelector,
            portionerSelector,
            ingredienserSelector,
            stegSelector,
            stegSelectorReserv,
            adress
        } = passedSelectors

        const data = {}

        data.rubrik = document.querySelector(rubrikSelector).textContent
        data.egetRecept = false
        data.originalLank = adress
        data.bildlank = document.querySelector(bildlankSelector).src
        data.tid = document.querySelector(tidSelector).textContent.replace("Tid:", "").trim()
        data.portioner = document.querySelector(portionerSelector).textContent.replace("portioner", "").trim()

        data.ingredienser = []
        const ingredienser = document.querySelectorAll(ingredienserSelector)
        for (let i = 0; i < ingredienser.length; i++) {
            let ingrediens = ingredienser[i].children[0].textContent
            let matt = ingredienser[i].textContent.replace(ingrediens, "").split(" ")
            let ingrediensObjekt = {
                ingrediens: ingrediens,
                antal: matt[0],
                enhet: matt[1]
            }

            data.ingredienser.push(ingrediensObjekt)
        }

        let totalaSteg = document.querySelectorAll(stegSelector)
        if (totalaSteg.length === 0) {
            // Används när layouten är annorlunda på vissa sidor
            totalaSteg = document.querySelectorAll(stegSelectorReserv)
        }



        data.steg = []
        for (let i = 0; i < totalaSteg.length; i++) {
            data.steg.push(cleanScrape(totalaSteg[i].innerText))
        }
        return data
    }, selectorInnehall)

    await browser.close()

    return innehall
}

const laggTillLokalJson = (adress) => {
    const selectorsReceptenDotSe = {
        rubrikSelector: "#content>article>h1",
        bildlankSelector: "#mainImageContainer>img",
        tidSelector: "#content>article>div:nth-child(6)",
        portionerSelector: "#content>article>div:nth-child(7)",
        ingredienserSelector: "#content>article>ul.ingredients>li",
        stegSelector: "#content>article>div.instructions>p",
        stegSelectorReserv: "#content>article>div.instructions li.instruction>div:nth-child(1)"
    }


    // Används vid DEV
    const fs = require("fs")
    const exempelJson = "public/src/nodeScraperExempel.json"
    let rawData = fs.readFileSync(exempelJson)
    const oldData = JSON.parse(rawData) // json-filen får inte vara tom

    let svar = hamtaData(adress, selectorsReceptenDotSe)
    svar.then((data) => {
        oldData.middag[data.rubrik] = data

        const newData = JSON.stringify(oldData)
        fs.writeFileSync(exempelJson, newData)
    })
}

exports.laggTillLokalJson = laggTillLokalJson