let padTime = (num) => {
    if (num < 10) {
        return `0${num}`;
    }

    return num;
}

document.addEventListener("DOMContentLoaded", () => {
    const Days = document.getElementById("days");
    const Hours = document.getElementById("hours");
    const Minutes = document.getElementById("minutes");
    const Seconds = document.getElementById("seconds");

    const targetDate = new Date("June 6 2026 08:00:00").getTime();

    let timer = () => {
        const currentDate = new Date().getTime();
        const distance = targetDate - currentDate;

        const days = Math.floor(distance / 1000 / 60 / 60 / 24);
        const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(distance / 1000 / 60) % 60;
        const seconds = Math.floor(distance / 1000) % 60;

        Days.innerHTML = padTime(days);
        Hours.innerHTML = padTime(hours);
        Minutes.innerHTML = padTime(minutes);
        Seconds.innerHTML = padTime(seconds);

        if (distance < 0) {
            Days.innerHTML = "00";
            Hours.innerHTML = "00";
            Minutes.innerHTML = "00";
            Seconds.innerHTML = "00";
        }

}

setInterval(timer, 1000);

});

const colors = ["#000000", "#DEDEDE", "#930000"];
const anims = ["fall-1", "fall-2", "fall-3"];

let selectRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

window.onmousemove = e => {
    console.log("woo");
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.backgroundColor = selectRandom(colors);

    let size = Math.floor(Math.random() * 7 + 3);

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    dot.style.left = `${e.pageX}px`;
    dot.style.top = `${e.pageY}px`;

    dot.style.animation = `${selectRandom(anims)} 1.5s ease-in`;
    dot.style.animationFillMode = "forwards";

    document.body.appendChild(dot);

    setTimeout(() => document.body.removeChild(dot), 1500);

}