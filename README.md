# AI Tic-Tac-Toe Game with React 🤖

A classic Tic-Tac-Toe game built with **React**, where you can play against a surprisingly challenging computer opponent. This project was created as an extension of the official React tutorial, enhancing it with more complex state management, an AI opponent, and additional features like a score tracker and move history.

![image](https://user-images.githubusercontent.com/68509830/230792533-7a774b31-ab29-4016-a2ce-1e1d4dee3540.png)
![image](https://user-images.githubusercontent.com/68509830/230792438-45454a1e-3e09-48fb-ac29-a706573797f1.png)
![image](https://user-images.githubusercontent.com/68509830/230792409-85229b80-00a3-41a8-b297-65cf11b08c98.png)

## ✨ What is This?

This project is a fully functional Tic-Tac-Toe game where a human player can compete against an AI. The game logic is built using React's class components and state management. The AI isn't just random; it follows a simple algorithm to make strategic moves, making the game more engaging.

I built this to solidify my understanding of React's core concepts, such as state, props, and component lifecycle methods, while also practicing algorithmic thinking for the AI opponent.

### Core Features

* **🧠 Smart AI Opponent:** Play against a computer that makes strategic moves. The AI will:
    1.  Win if it has two in a row.
    2.  Block the player if they have two in arow.
    3.  Otherwise, make a random move.
* **📝 Move History & Time Travel:** A list of all moves is recorded. Players can click on any move in the history to go back and review the state of the board at that point in the game.
* **📊 Round & Score Tracking:** The game keeps track of the score between you and the AI across multiple rounds. The winner of a round gets to start the next one.
* **🎲 Randomized Start:** At the beginning of the first round (and after a tie), the starting player (Human or AI) is chosen randomly.
* **🎨 Custom CSS & Animations:** The game features custom styling and a CSS-animated countdown to add a bit of flair before the game starts.

---

## 🔧 Tech Stack & Architecture

This project was built using Create React App and focuses on React's class-based component architecture.

* **Core Library:** **React**
* **Language:** **JavaScript (ES6+)**
* **Styling:** **CSS** with custom animations.

### Architectural Highlights

1.  **Stateful Game Logic in a Class Component (`Game.js`)**
    The entire game's state—including the board history, scores, current player, and AI logic—is managed within a single `Game` class component. This centralized approach makes it easy to control the flow of the game and pass data down to child components via props.

2.  **AI Opponent Algorithm (`componentDidUpdate`)**
    The AI's logic is implemented within the `componentDidUpdate` lifecycle method. After the human player makes a move, `componentDidUpdate` is triggered. It checks if it's the AI's turn and then runs through a series of checks:
    * First, it iterates through all possible winning lines to see if it can win in the current turn.
    * If it can't win, it iterates again to see if the human player is about to win, and if so, it blocks them.
    * If neither condition is met, it selects a random empty square.

3.  **"Time Travel" with State History**
    The game state is stored as a `history` array, where each element is an object representing the state of the `squares` at a particular move. The "time travel" feature works by simply updating the `stepNumber` in the state, which causes the `Board` component to re-render with the squares from that point in history.

---

## 🏃‍♂️ Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YasaminAlizadeh/tictactoe.git
    cd tictactoe
    ```

2.  **Install dependencies:**
    * The `package.json` file was not included in the source, but this project was bootstrapped with `create-react-app`. You can install the necessary dependencies by running:
    ```bash
    npm install react react-dom react-scripts
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

