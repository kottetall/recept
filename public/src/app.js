console.log("app.js funkar")

window.onload = () => {

    const days = document.querySelectorAll(".day")
    for (const day of days) {
        day.addEventListener("click", changeActive)
    }

    setCurrentDay()

}