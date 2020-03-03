"use strict"
window.onload = async () => {

    // SE RECEPT

    const days = document.querySelectorAll(".day")
    for (const day of days) {
        day.addEventListener("click", changeActiveDay)
    }
    await createRecipeWeekMenu()
    setCurrentDay()
    // showExample()

    // LÄGG TILL RECEPT

    document.querySelectorAll(".buttonsLaggaTill").forEach((element) => {
        element.addEventListener("click", (e) => {
            // TODO: snygga till m animering etc. Ev ändra till klass "hide" eller liknande
            const oppna = "." + e.target.dataset.malklass

            const stangaElement = e.target.previousElementSibling || e.target.nextElementSibling
            const stanga = "." + stangaElement.dataset.malklass

            document.querySelector(oppna).style.display = "block"
            document.querySelector(stanga).style.display = "none"

            document.querySelector(".addRecipeApp header").dataset.childElementsOpen = true
            // document.querySelector(".addRecipeApp input[type=submit]").style.display = "block"
        })
    })

    document.querySelector(".fa-plus-circle").addEventListener("click", copyStegElement)
    document.querySelector(".toRecipes").addEventListener("click", switchApp)



    document.querySelectorAll(".inputLabelContainer").forEach((element) => {
        element.addEventListener("click", moveLabel)
    })

    document.querySelector(".medUrlContainer").addEventListener("submit", sendUrl)
}


async function sendUrl(e) {
    e.preventDefault()
    console.log("funkar")
    const url = document.getElementById("urlInput").value
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "urlInput": url
        })
    }

    const response = await fetch("/addUrl", options)
    const message = await response.json()

    console.log(message)

}