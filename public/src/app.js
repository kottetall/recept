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
            document.querySelector(".addRecipeApp input[type=submit]").style.display = "block"
        })
    })

    document.querySelector(".fa-plus-circle").addEventListener("click", copyStegElement)
    document.querySelector(".toRecipes").addEventListener("click", switchApp)



    document.querySelectorAll(".inputLabelContainer").forEach((element) => {
        element.addEventListener("click", moveLabel)
    })

}

function moveLabel() {
    console.log(this)
    this.classList.add("hasContent")
}