"use strict"
window.onload = async () => {

    const days = document.querySelectorAll(".day")
    for (const day of days) {
        day.addEventListener("click", changeActiveDay)
    }
    await createRecipeWeekMenu()
    setCurrentDay()
    // showExample()

}