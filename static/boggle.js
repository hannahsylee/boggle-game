class BoggleGame {
    constructor(timeLeft = 60){
        this.timeLeft = timeLeft;
        this.words = new Set();
        this.score = 0;
        this.Timer = setInterval(this.Tick.bind(this), 1000);
        $("#submit-btn").on("click", this.checkWord.bind(this));
    }

    // functions
    showMessage(msg, cls) {
        $(".message")
        .text(msg)
        .removeClass()
        .addClass(`message ${cls}`);
    }

    async checkWord(evt) {
        evt.preventDefault();
    
        const guess = $('#guess').val();
        // if not word
        if (!guess) return;
    
        // check is the guessed word has already been guessed
        if (this.words.has(guess)){
            $('#guess').val("");
            this.showMessage(`${guess} has already been checked`, 'err');
            return;
        } 
    
        const response = await axios.get("/check-guess", { params: { guess : guess }});
        if (response.data.result === "not-word"){
            this.showMessage(`${guess} is not a valid English word`, 'err');
        }
        else if (response.data.result === "not-on-board"){
            this.showMessage(`${guess} is not a valid word on this board`, 'err');
        }
        else {
            this.showMessage(`Added: ${guess}`, "ok");
            // Add the guess to the list
            $('.words').append(`<li>${guess}</li>`);
            // Add guess to words set
            this.words.add(guess);
            // Add how many letters are in guess to score
            this.score += guess.length;
            // update score shown on DOM
            // Step Four: Posting a Score
            $('.score').text(this.score);
        }
        // Empty the guess value shown
        $('#guess').val("");
    }

    // Step Five: Adding a timer
    async Tick() {
        if(this.timeLeft < 0){
            clearInterval(this.Timer);
            await this.checkScore();
            document.querySelector(".countdown").innerHTML = "Finished";
        } else {
            document.querySelector(".countdown").innerHTML = `${this.timeLeft} seconds remaining`;
        }
        this.timeLeft -= 1;
    }


    // Step Six: More statistics!
    async checkScore(){

        $('.guess-form').hide();
        const response = await axios.post("/post-score", { score: this.score });
        if (response.data.brokeRecord){
            // HTML add to class best-score
            // update the best score
            $('.best-score').text(this.score);
            // Show a new message that the best score has been replaced
            this.showMessage(`New record: ${this.score}`, "ok");
        }
        else {
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }

}


// // Step Three: Checking for a Valid Word
// // The page should not refresh when the user submits the form: 
// // this means you’ll have to make an HTTP request without refreshing the page—you can use AJAX to do that!
// const words = new Set();
// let score = 0;

// function showMessage(msg, cls) {
//     $(".message")
//     .text(msg)
//     .removeClass()
//     .addClass(`message ${cls}`);
// }

// async function checkWord(evt) {
//     evt.preventDefault();

//     const guess = $('#guess').val();
//     // if not word
//     if (!guess) return;

//     // check is the guessed word has already been guessed
//     if (words.has(guess)){
//         $('#guess').val("");
//         showMessage(`${guess} has already been checked`, 'err');
//         return;
//     } 

//     const response = await axios.get("/check-guess", { params: { guess : guess }});
//     if (response.data.result === "not-word"){
//         showMessage(`${guess} is not a valid English word`, 'err');
//     }
//     else if (response.data.result === "not-on-board"){
//         showMessage(`${guess} is not a valid word on this board`, 'err');
//     }
//     else {
//         showMessage(`Added: ${guess}`, "ok");
//         // Add the guess to the list
//         $('.words').append(`<li>${guess}</li>`);
//         // Add guess to words set
//         words.add(guess);
//         // Add how many letters are in guess to score
//         score += guess.length;
//         // update score shown on DOM
//         // Step Four: Posting a Score
//         $('.score').text(score);
//     }
//     // Empty the guess value shown
//     $('#guess').val("");
// }

// $("#submit-btn").on("click", checkWord);

// // let startingSeconds = 60;
// // const countdownTime = document.querySelector('.countdown');
// // const countdownTime = $('.countdown');

// // Step Five: Adding a timer

// let timeLeft = 60;
// const Timer = setInterval(Tick, 1000);

// async function Tick() {
//     if(timeLeft < 0){
//         clearInterval(Timer);
//         await checkScore();
//         document.querySelector(".countdown").innerHTML = "Finished";
//     } else {
//         document.querySelector(".countdown").innerHTML = `${timeLeft} seconds remaining`;
//     }
//     timeLeft -= 1;
// }


// // Step Six: More statistics!
// async function checkScore(){

//     $('.guess-form').hide();
//     const response = await axios.post("/post-score", { score: score });
//     if (response.data.brokeRecord){
//         // HTML add to class best-score
//         // update the best score
//         $('.best-score').text(score);
//         // Show a new message that the best score has been replaced
//         showMessage(`New record: ${score}`, "ok");
//     }
//     else {
//         showMessage(`Final score: ${score}`, "ok");
//     }
// }


