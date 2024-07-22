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

function drawSnake() {
  ctx.fillStyle = 'green'
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize)
  })
}

function drawFood() {
  ctx.fillStyle = 'red'
  ctx.fillRect(food.x, food.y, boxSize, boxSize)
}

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

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasWidth / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasHeight / boxSize)) * boxSize,
  }
}

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

function drawScore() {
  ctx.fillStyle = 'black'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, 10, 30)
  ctx.fillText(`Questions: ${questionCount}/5`, 10, 60)
}

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

function endGame(reason) {
  clearInterval(game)
  alert(`${reason}\nGame Over!\nFinal Score: ${score}`)
  canvas.style.display = 'none'
  answerElement.style.display = 'none'
  submitButton.style.display = 'none'
  startGameButton.style.display = 'block'
  document.body.classList.remove('game-active')
}

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

startGameButton.addEventListener('click', () => {
  startGameButton.style.display = 'none'
  startGame()
})

updateQuestionList()
