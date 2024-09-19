let quizSelector = document.getElementById("quizSelector");
let quizContainer = document.getElementById("quizContainer");
let quizQuestion = document.getElementById("quizQuestion");
let quizOptions = document.getElementById("quizOptions");
let btn = document.getElementById("submit");
let result = document.getElementById("result");

let renderQuizContainer = async () => {
    let response = await fetch("./quiz.json");
    let quiz = await response.json();

    let quizHtml = ``

    quiz.map((question, index) => {
        quizHtml += `
        <div class="quizDiv" id="quizDiv${index + 1}">Quiz ${index + 1}</div>
        `
    });
    document.getElementById("quizSelector").innerHTML = quizHtml;

    quiz.forEach((questionsArray, index) => {
        let quizDiv = document.getElementById(`quizDiv${index + 1}`)
        quizDiv.addEventListener("click", () => renderQuestionContainer(questionsArray))
    });


};

class Quiz {
    constructor(questionsArray) {
        this.questionsArray = Quiz.shuffleArray(questionsArray);
        this.currentIndex = 0;
        this.score=0;

    }
    static shuffleArray(arr){
        return [...arr].sort(()=> Math.random() - 0.5)
    } 

    displayQuestions = () => {
        const question =this.questionsArray[this.currentIndex]
        quizQuestion.textContent=question.question;   
        const answers =Quiz.shuffleArray(question.options);
        
        quizOptions.innerHTML = '';
        
        answers.forEach(answer =>{
            let button = document.createElement("button");
            button.classList= ["answerBtn"];
            button.textContent=answer;
            button.addEventListener("click",this.checkAnswer.bind(this))
            quizOptions.appendChild(button);
        })
        console.log(question);
    } 

    
    
    checkAnswer(event){
        const question = this.questionsArray[this.currentIndex];
        let userOption = event.target.textContent
        let correctOptions = question.correct_answer
        
        if(userOption === correctOptions){
            this.score++;    
        }
        this.currentIndex++
        
        if(this.currentIndex < this.questionsArray.length){
            this.displayQuestions();
        }else{
            this.result();
        }

    }
    
    result(){


        if(this.score > 0 ){
            swal.fire(
                "Good Job!", `Your Score is ${this.score} out of ${this.questionsArray.length}`, "success"
            );
        }else if (this.score === 0 ){
            swal.fire(
                "You Failed!", `Your Score is ${this.score} out of ${this.questionsArray.length}!`, "error"
            );
        }

        result.innerHTML = `<p class="fs-4" > Your Score is ${this.score} out of ${this.questionsArray.length} </p>
        <button id="reloadQuiz" class="btn btn-my w-70">Return for new Quiz</button>`
        quizContainer.style.display = "none"
        result.style.display = "block"

        document.getElementById("reloadQuiz").addEventListener("click", ()=>{
            location.reload();
        })

    }
    // result.innerHTML = result


}

let renderQuestionContainer = (questionsArray) => {
    const quiz = new Quiz(questionsArray);
    quiz.displayQuestions();
    quizContainer.style.display="block";
    quizSelector.style.display="none"   
};

renderQuizContainer();
