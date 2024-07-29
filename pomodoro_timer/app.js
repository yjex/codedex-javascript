const bells = new Audio('./sounds/bell.wav');

// HTML elements must be selected to be used in JavaScript
// .querySelector() method used to select and update the elements on the webpage
const startBtn = document.querySelector(".btn-start");
const session = document.querySelector(".minutes");
let myInterval;

// flag for when the application is running: if state is true, timer progresses, if false, alerts user that session has begun
let state = true;

const appTimer = () => {
    const sessionAmount = Number.parseFloat(session.textContent)

    if (state) {
        state = false;
        let totalSeconds = sessionAmount * 60;

        const updateSeconds = () => {
                const minuteDiv = document.querySelector(".minutes");
                const secondDiv = document.querySelector(".seconds");

                // decreasing totalSeconds after each second passes
                totalSeconds--;

                // converting seconds into minutes and ensuring secondsLeft is a positive integer between 0 and 50
                let minutesLeft = Math.floor(totalSeconds/60);
                let secondsLeft = totalSeconds % 60;

                // checks secondsLeft variable
                // secondDiv.textContent to display the current number of secondsLeft or minutesLeft (if more than 10s are left)
                if (secondsLeft < 10) {
                    secondDiv.textContent = "0"+secondsLeft;
                } else {
                    secondDiv.textContent = secondsLeft;
                }
                minuteDiv.textContent = minutesLeft;
                
                // when timer reaches 0, play the bell sound
                // clearInterval() turns off the updateSeconds() function to stop running it every second
                if (minutesLeft === 0 && secondsLeft === 0) {
                    bells.play()
                    clearInterval(myInterval);
                }
        }
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert("Session has already started.");
    }
}

// adding addEventListener to startBtn DOM variable selected earlier
// app listens for mouse click, appTimer function runs when clicked 
startBtn.addEventListener("click", appTimer)

// add reset button pausing timer and bringing it back to initial time
// add pause button stopping and resuming timer