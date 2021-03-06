"use strict"

// GLOBALS //FIXME: fixa så man slipper globala
const middagsRecepten = []

async function loading(url = "src/exempel.json") {
    console.log(url)
    let response = await fetch(url)
    let receptlista = await response.json()
    return receptlista
}

async function showExample() {
    const recepten = await loading()
    for (const recept in recepten["middag"]) {
        if (recept !== "mall") {
            skapaRecept(recepten["middag"][recept])
        }
    }
}

function clearChildren(target) {
    const children = document.querySelector(target).children
    for (let i = children.length - 1; 0 <= i; i--) {
        children[i].remove()
    }
}

function changeActiveDay() {
    changeActive(this)

    document.querySelector(".weekday").classList.add("removing")

    document.querySelector(".weekday").addEventListener("transitionend", () => {
        clearChildren(".weekday")

        const index = this.dataset.index
        skapaRecept(middagsRecepten[index])

        document.querySelector(".preview").addEventListener("load", () => {
            document.querySelector(".weekday").classList.remove("removing")
        })
    }, {
        once: true
    })
}

//FIXME: Exempel för test

async function createRecipeWeekMenu() {
    // const recepten = await loading()
    const recepten = await loading("src/nodeScraperExempel.json") //för test med Node Scraper
    const {
        middag
    } = recepten

    for (const namn in middag) {
        if (namn !== "mall") {
            middagsRecepten.push(middag[namn])
        }
    }
}

function skapaRecept(recept) {
    const {
        egetRecept,
        originalLank,
        bildlank,
        tid,
        portioner,
        ingredienser,
        steg,
        rubrik
    } = recept

    const headerContainer = document.createElement("div")
    headerContainer.className = "headerContainer"

    const receptRubrik = document.createElement("h2")
    receptRubrik.textContent = rubrik
    receptRubrik.className = "rubrik"

    // Om det inte är ett eget recept
    const credits = document.createElement("div")
    if (!egetRecept) {

        credits.className = "credits"
        credits.textContent = "Ⓒ"
        const linkToCredit = document.createElement("a")
        linkToCredit.href = originalLank
        //Hämtar namnet genom länken
        const regex = /https?:\/\/www.(\w+\.\w+)/ //TODO: Behöver förbättras
        const creditNamn = originalLank.match(regex)[1]

        linkToCredit.textContent = creditNamn
        credits.append(linkToCredit)
        receptRubrik.append(credits)
    }

    headerContainer.append(receptRubrik, credits)

    const bild = document.createElement("img")
    bild.src = bildlank
    bild.alt = "Bild på rätt"
    bild.className = "preview"

    const info = document.createElement("div")
    info.className = "info"

    const spanTid = document.createElement("span")
    spanTid.className = "tid"

    if (tid) {
        spanTid.textContent = tid
    }

    const spanPortioner = document.createElement("span")
    spanPortioner.className = "portioner"
    if (portioner) {
        spanPortioner.textContent = `ca ${portioner} portioner`
    }

    info.append(spanTid, spanPortioner)

    const ingredienserHeader = document.createElement("h3")
    ingredienserHeader.setAttribute("aria-hidden", "true")
    ingredienserHeader.textContent = "Ingredienser"
    ingredienserHeader.addEventListener("click", hideParent)
    const hideIngredienser = createCaret()
    ingredienserHeader.append(hideIngredienser)


    const ingredienserLista = document.createElement("ul")
    ingredienserLista.setAttribute("aria-hidden", "true")
    ingredienserLista.className = "ingredienser"

    for (let aktuellIngrediens of ingredienser) {
        const {
            ingrediens,
            antal,
            enhet
        } = aktuellIngrediens

        const li = document.createElement("li")

        const ingrediensElement = document.createElement("span")
        ingrediensElement.className = "ingrediens"
        ingrediensElement.textContent = ingrediens

        const mangdElement = document.createElement("span")
        mangdElement.className = "mangd"
        mangdElement.textContent = `${antal} ${enhet}`

        li.append(ingrediensElement, mangdElement)

        //ändras sedan till "fa-check-circle" när varan finns
        const finnsIkon = document.createElement("i")
        finnsIkon.className = "fas fa-circle"
        finnsIkon.addEventListener("click", markInFridge)

        const vagnIkon = document.createElement("i")
        vagnIkon.className = "fas fa-shopping-cart"
        vagnIkon.addEventListener("click", markForShopping)

        li.append(finnsIkon, vagnIkon)
        ingredienserLista.append(li)
    }

    const stegHeader = document.createElement("h3")
    stegHeader.setAttribute("aria-hidden", "true")
    stegHeader.textContent = "Steg"
    stegHeader.addEventListener("click", hideParent)
    const hideSteg = createCaret()
    stegHeader.append(hideSteg)

    const stegLista = document.createElement("ol")
    stegLista.setAttribute("aria-hidden", "true")
    stegLista.className = "steg"

    for (let del of steg) {
        const li = document.createElement("li")
        li.textContent = del
        li.addEventListener("click", doneStep)
        stegLista.append(li)
    }

    // TESTSTÄLLE
    let veckodag = document.querySelector(".weekday")
    // veckodag.append(receptRubrik, bild, info, ingredienserHeader, ingredienserLista, stegHeader, stegLista)

    // TILLFÄLLIGT TEST //
    veckodag.append(headerContainer, bild, info, ingredienserHeader, ingredienserLista, stegHeader, stegLista)
    // TILLFÄLLIGT TEST //

}

function doneStep() {
    if (this.classList.contains("done")) {
        switchClass(this, {
            oldClass: "done"
        })
    } else {
        switchClass(this, {
            newClass: "done"
        })
    }
}

function markForShopping() {

    //TODO: snygga till
    if (this.parentElement.classList.contains("isHome")) {
        this.parentElement.classList.remove("isHome")
        this.previousSibling.classList.add("fa-circle")
        this.previousSibling.classList.remove("fa-check-circle")
    }

    if (!this.parentElement.classList.contains("needToBuy")) {
        this.parentElement.classList.add("needToBuy")
    } else {
        this.parentElement.classList.remove("needToBuy")
    }
}

function markInFridge() {
    if (this.parentElement.classList.contains("needToBuy")) {
        this.parentElement.classList.remove("needToBuy")
    }

    if (!this.classList.contains("fa-check-circle")) {
        this.parentElement.classList.add("isHome")
        this.classList.remove("fa-circle")
        this.classList.add("fa-check-circle")
    } else {
        this.parentElement.classList.remove("isHome")
        this.classList.add("fa-circle")
        this.classList.remove("fa-check-circle")
    }
}

function createCaret() {
    const caret = document.createElement("i")
    caret.className = "fas fa-caret-up"

    return caret
}

function createDice() {
    const dice = document.createElement("i")
    dice.className = "fas fa-dice"

    return dice
}

function createAdd() {
    const addingButton = document.createElement("i")
    addingButton.className = "fas fa-plus-circle"

    return addingButton
}

function hideParent() {
    const thisElement = this
    const elementToAffect = this.nextSibling
    const oldState = JSON.parse(elementToAffect.getAttribute("aria-hidden"))
    elementToAffect.setAttribute("aria-hidden", !oldState)
    thisElement.setAttribute("aria-hidden", !oldState)
}

function switchClass(element, {
    oldClass,
    newClass
}) {

    if (oldClass) {
        element.classList.remove(oldClass)
    }
    if (newClass) {
        element.classList.add(newClass)
    }
}

function setCurrentDay() {
    let today = new Intl.DateTimeFormat("en-GB", {
        weekday: "long"
    }).format().toLowerCase()
    document.getElementById(today).click()
}

function changeActive(element) {
    const days = document.querySelectorAll(".day")
    for (let day of days) {
        switchClass(day, {
            oldClass: "active"
        })
    }

    switchClass(element, {
        newClass: "active"
    })
}

function randomSingleRecipe() {
    console.log("Funktionen som triggas ska ersätta receptet med ett slumpvis valt")
}

function switchApp() {
    console.log("Funktionen som triggas ska öppna en ny sida för att kunna lägga till nya recept")
    // clearAll()

    // Tillfälligt
    const addRecipeApp = document.querySelector(".addRecipeApp")
    const mainApp = document.querySelector(".mainApp")

    // FIXME: Tillfällig lösning för dev
    const weekOverview = document.querySelector(".weekOverview")

    weekOverview.style.display = "none"

    const status = document.querySelector(".addRecipeApp").style.display

    if (status !== "block") {
        addRecipeApp.style.display = "block"
        mainApp.style.display = "none"

        document.querySelector(".newRecipe span").textContent = "Se veckans recept"
    } else {
        addRecipeApp.style.display = "none"
        mainApp.style.display = "block"
        document.querySelector(".newRecipe span").textContent = "Lägg till recept"
    }

}

function copyStegElement() {
    const newNode = document.querySelector(".stegIndividuellContainer").cloneNode({
        deep: true
    })

    const elementToAppendTo = document.querySelector(".stegMainContainer")
    elementToAppendTo.dataset.steg++
    newNode.dataset.steg = elementToAppendTo.dataset.steg
    const newChildNodes = newNode.children
    newChildNodes[0].textContent = ""
    newChildNodes[1].addEventListener("click", copyStegElement)
    elementToAppendTo.append(newNode)
}

function copyIngrediensElement() {
    const newNode = document.querySelector(".ingrediensItem").cloneNode({
        deep: true
    })

    const elementToAppendTo = document.querySelector(".ingredienserContainer")
    const newChildNodes = newNode.children

    for (let i = 0; i < 2; i++) {
        newChildNodes[i].children[1].value = ""
        newChildNodes[i].children[0].style.display = "none"
        newChildNodes[i].classList.remove("hasContent")
    }

    newChildNodes[2].addEventListener("click", copyIngrediensElement)
    elementToAppendTo.append(newNode)
}

function moveLabel() {
    this.classList.add("hasContent")
}



async function sendUrl(e) {
    e.preventDefault()
    console.log("funkar")
    talkingToServer("#addUrl", true)

    const url = document.getElementById("urlInput").value
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": "Kommer sen",
            "urlInput": url
        })
    }
    try {
        const response = await fetch("/addUrl", options)
        const message = await response.json()
        console.log(message)
        talkingToServer("#addUrl", false)
    } catch (error) {
        // console.log(error)
        connectionError("#addUrl", error)
    }
}

async function sendOwn(e) {
    e.preventDefault()
    console.log("funkar")
    talkingToServer("#addOwn", true)

    const recipe = getOwnRecipe()
    console.log(recipe)


    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": "Kommer sen",
            "recipe": recipe
        })
    }

    try {
        const response = await fetch("/addOwn", options)
        const message = await response.json()
        console.log(message)
        talkingToServer("#addOwn", false)

    } catch (error) {
        // console.log(error)
        connectionError("#addOwn", error)
    }


}

function connectionError(buttonId, error) {
    const errorName = error.name
    const button = document.querySelector(buttonId)

    button.classList.remove("loadingAnimation")
    button.classList.add("connectionError")
    button.value = `ERROR - ${errorName}`
    button.addEventListener("animationend", (e) => {
        //TODO: skapa reservplan - ex spara lokalt tills server funkar/svarar
    })
}

function getOwnRecipe() {
    const recipe = {}

    recipe.rubrik = document.getElementById("namnInput").value
    recipe.portioner = document.getElementById("portionerInput").value
    recipe.tid = document.getElementById("tidInput").value
    recipe.ingredienser = []
    recipe.steg = []

    const ingredienserElements = document.querySelectorAll(".ingrediensItem")
    for (const ingrediensElement of ingredienserElements) {
        const delar = ingrediensElement.children
        const total = {}
        total.ingrediens = delar[0].children[1].value
        total.antal = delar[1].children[1].value
        total.enhet = delar[2].children[1].value
        recipe.ingredienser.push(total)
    }

    const allaSteg = document.querySelectorAll(".stegInput")
    for (const steg of allaSteg) {
        recipe.steg.push(steg.textContent)
    }

    return recipe
}

function talkingToServer(buttonId, currentlyTalking) {
    // FIXME: gör så den funkar på båda knapparna

    const button = document.querySelector(buttonId)

    if (currentlyTalking) {
        button.setAttribute("disabled", true)
        button.value = "Laddar..."
        button.classList.add("loadingAnimation")
    } else if (!currentlyTalking) {
        button.value = "Färdigt!"
        button.classList.remove("loadingAnimation")
    }
}

function fillWeekOverview(weekMenu) {
    // FIXME: Behöver troligen ändras när det blir veckomeny ist för alla recept som vid dev


    const dagar = document.querySelectorAll(".dayRecipe")
    let index = 0
    for (const dag of dagar) {
        dag.textContent = middagsRecepten[index].rubrik
        index++
    }

}