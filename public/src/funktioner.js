console.log("funktioner.js funkar")

async function loading(url = "src/exempel.json") {
    let response = await fetch(url)
    let receptlista = await response.json()
    return receptlista
}

async function show() {
    const recepten = await loading()
    for (const recept in recepten["middag"]) {
        const {
            bildlank,
            tid,
            portioner,
            ingredienser,
            steg
        } = recepten["middag"][recept]


        skapaRecept(recept, bildlank, tid, portioner, ingredienser, steg)
    }
}

show()

function skapaRecept(namn, bildlank, tid, portioner, ingredienser, steg) {

    const rubrik = document.createElement("h2")
    rubrik.textContent = namn
    rubrik.className = "rubrik"

    const bild = document.createElement("img")
    bild.src = bildlank
    bild.alt = "Bild på rätt"
    bild.className = "preview"

    const info = document.createElement("div")
    info.className = "info"

    const spanTid = document.createElement("span")
    spanTid.className = "tid"
    spanTid.textContent = tid

    const spanPortioner = document.createElement("span")
    spanPortioner.className = "portioner"
    spanPortioner.textContent = `ca ${portioner} portioner`

    info.append(spanTid, spanPortioner)

    const ingredienserHeader = document.createElement("h3")
    ingredienserHeader.setAttribute("aria-hidden", "true")
    ingredienserHeader.textContent = "Ingredienser"
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
    const hideSteg = createCaret()
    stegHeader.append(hideSteg)

    const stegLista = document.createElement("ol")
    stegLista.setAttribute("aria-hidden", "true")
    stegLista.className = "steg"

    for (let del of steg) {
        const li = document.createElement("li")
        li.textContent = del
        stegLista.append(li)
    }

    // TESTSTÄLLE
    let veckodag = document.querySelector(".weekday")
    veckodag.append(rubrik, bild, info, ingredienserHeader, ingredienserLista, stegHeader, stegLista)

}

function markForShopping() {
    console.log("Funktion för att lägga till varan i shoppinglista samt markera att den inte finns")
    if (!this.classList.contains("needToBuy")) {
        this.parentElement.classList.add("needToBuy")
    } else {
        this.parentElement.classList.remove("needToBuy")
    }
}

function markInFridge() {
    console.log("Funktion för att  markera att varan redan finns")
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
    caret.addEventListener("click", hideParent)

    return caret
}

function hideParent() {
    const parentToAffect = this.parentElement
    const elementToAffect = this.parentElement.nextSibling
    const oldState = JSON.parse(elementToAffect.getAttribute("aria-hidden"))
    elementToAffect.setAttribute("aria-hidden", !oldState)
    parentToAffect.setAttribute("aria-hidden", !oldState)
}