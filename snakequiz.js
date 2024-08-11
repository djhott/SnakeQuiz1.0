/*
Doug's Snake Quiz Game
Version 1.0
This JavaScript sets up the variables that hold the current values in the html div IDs.
Questions are held in this file, although a future update will attempt to use an external file
that can be updated outside of the code. Functions set up the game space and update the game board
and questionss.
*/
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const questionElement = document.getElementById('question')
const answerElement = document.getElementById('answer')
const submitButton = document.getElementById('submit')
const userQuestionInput = document.getElementById('userQuestion')
const userAnswerInput = document.getElementById('userAnswer')
const addQuestionButton = document.getElementById('addQuestion')
const startGameButton = document.getElementById('startGame')
const questionsList = document.getElementById('questions')

const boxSize = 20
const canvasWidth = 800
const canvasHeight = 400
let snake, direction, food, score, game, speed, questionCount

let questions = [
  {
    q: 'How many days are allowed to roll funds back for an IRA to IRA rollover? (number only)',
    a: '60',
  },
  {
    q: 'Before a rollover, a client must perform a _______ from the IRA.',
    a: 'distribution',
  },
  { q: 'What form is generated from a distribution?', a: '1099R' },
  {
    q: 'How many IRA to IRA rollovers are allowed in 12 months?',
    a: '1',
  },
  {
    q: 'How many ERP rollovers are allowed in 12 months?',
    a: 'unlimited',
  },
]

//add or delete a question from the list
function updateQuestionList() {
  questionsList.innerHTML = ''
  questions.forEach((q, index) => {
    const li = document.createElement('li')
    li.textContent = q.q
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.onclick = () => {
      questions.splice(index, 1)
      updateQuestionList()
    }
    li.appendChild(deleteBtn)
    questionsList.appendChild(li)
  })
}

//draw the green snake on the board while game is active
function drawSnake() {
  ctx.fillStyle = 'green'
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize)
  })
}

//draw red food on the canvas while game is active
function drawFood() {
  ctx.fillStyle = 'red'
  ctx.fillRect(food.x, food.y, boxSize, boxSize)
}

//check snake position and update as player moves snake
function moveSnake() {
  const head = { ...snake[0] }
  switch (direction) {
    case 'up':
      head.y -= boxSize
      break
    case 'down':
      head.y += boxSize
      break
    case 'left':
      head.x -= boxSize
      break
    case 'right':
      head.x += boxSize
      break
  }
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    score++
    generateFood()
    askQuestion()
  } else {
    snake.pop()
  }
}

//create new food on the game canvas when eaten by the snake
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasWidth / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasHeight / boxSize)) * boxSize,
  }
}

//check if the snake has not collided with the wall
function checkCollision() {
  const head = snake[0]
  if (
    head.x < 0 ||
    head.x >= canvasWidth ||
    head.y < 0 ||
    head.y >= canvasHeight
  ) {
    return true
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }
  return false
}

//update the score as red food and questions are answered
function drawScore() {
  ctx.fillStyle = 'black'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, 10, 30)
  ctx.fillText(`Questions: ${questionCount}/5`, 10, 60)
}

//run the gameLoop while the game is active to check for food encounter and collisions
function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  moveSnake()
  if (checkCollision()) {
    endGame('Snake collision!')
    return
  }
  drawSnake()
  drawFood()
  drawScore()
}

//start the game when player hits Start button
function startGame() {
  snake = [{ x: 400, y: 200 }]
  direction = 'right'
  food = {}
  score = 0
  questionCount = 0
  speed = 200 // Initial speed (slower)
  canvas.style.display = 'block'
  answerElement.style.display = 'none'
  submitButton.style.display = 'none'
  generateFood()
  game = setInterval(gameLoop, speed)
  document.body.classList.add('game-active')
}

//ask a questions when red food is consumed
function askQuestion() {
  clearInterval(game)
  if (questionCount >= 5) {
    endGame('Quiz completed!')
    return
  }
  const question = questions[Math.floor(Math.random() * questions.length)]
  questionElement.textContent = question.q
  answerElement.value = ''
  answerElement.style.display = 'inline'
  submitButton.style.display = 'inline'
  answerElement.focus()

  submitButton.onclick = () => {
    questionCount++
    if (answerElement.value.toLowerCase() === question.a.toLowerCase()) {
      alert('Correct!')
      score++ // Increment score for correct answer
      speed = Math.max(50, speed - 10) // Increase speed, but not faster than 50ms
    } else {
      alert(`Wrong! The correct answer is ${question.a}`)
    }
    questionElement.textContent = ''
    answerElement.style.display = 'none'
    submitButton.style.display = 'none'
    if (questionCount >= 5) {
      endGame('Quiz completed!')
    } else {
      game = setInterval(gameLoop, speed)
    }
  }
}

//display end game message with reason of game ending
function endGame(reason) {
  clearInterval(game)
  alert(`${reason}\nGame Over!\nFinal Score: ${score}`)
  canvas.style.display = 'none'
  answerElement.style.display = 'none'
  submitButton.style.display = 'none'
  startGameButton.style.display = 'block'
  document.body.classList.remove('game-active')
}

//add an event listener to check arrow key strokes
document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }
  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up'
      break
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down'
      break
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left'
      break
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right'
      break
  }
})

//check for clicks to add a new question and answer
addQuestionButton.addEventListener('click', () => {
  const newQuestion = userQuestionInput.value.trim()
  const newAnswer = userAnswerInput.value.trim()
  if (newQuestion && newAnswer) {
    questions.push({ q: newQuestion, a: newAnswer })
    alert('Question added successfully!')
    userQuestionInput.value = ''
    userAnswerInput.value = ''
    updateQuestionList()
  } else {
    alert('Please enter both a question and an answer.')
  }
})

//check for start game button click
startGameButton.addEventListener('click', () => {
  startGameButton.style.display = 'none'
  startGame()
})

//update the questions list with current question set
updateQuestionList()
