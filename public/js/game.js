window.onload = pageLoad;

function pageLoad() {
  document.getElementById('playgame').onclick = GameScript;
  showLeaderboard();
  checkCookie(); 
  checker();
  
  document.getElementById("button_post").onclick = getData;
}

function checkCookie(){
  var username = "";
  if(getCookie("username") == false){
    document.cookie = "username=Guest";
  }
}

function getCookie(name){
  var value = "";
  try{
    value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    .split("=")[1];
    return value;
  }catch(err){
    return false;
  }
}

function checker() {
  if (getCookie("username") == "Guest") {
    // Do something if the username is Guest
  } else {
    var username = getCookie("username");
    // Use getElementById (without 's') to get the element
    document.getElementById("user_name").innerHTML = username;
   // CollectScore();
  }
}

//<====game section====>

function GameScript() {
  var canvas = document.getElementById('canvas_game');
  var context = canvas.getContext('2d');
  var grid = 16;
  var count = 0;
  var score = 0;
  var max = 0;

  var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
  };

  var food = {
    x: 320,
    y: 320
  };

  // get random whole numbers in a specific range
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // game loop
  function loop() {
    requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 3) {
      return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;
    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });
    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }
    // draw food
    context.fillStyle = 'white';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);

    // draw snake one cell at a time
    context.fillStyle = '#E43F5A';
    snake.cells.forEach(function (cell, index) {

      // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
      context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
      // snake ate food
      if (cell.x === food.x && cell.y === food.y) {
        snake.maxCells++;
        score += 1;
        document.getElementById('score').innerHTML = '&nbsp;' + score;
        // canvas is 400x400 which is 25x25 grids 
        food.x = getRandomInt(0, canvas.width/16) * grid;
        food.y = getRandomInt(0, canvas.height/16) * grid;
      }

      // check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.cells.length; i++) {
        
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          if (score > max) {
            max = score;
            sendHighScore(score);
          }
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;
          score = 0;
          food.x = getRandomInt(0, canvas.width/16) * grid;
          food.y = getRandomInt(0, canvas.height/16) * grid;
          document.getElementById('high').innerHTML = '&nbsp;' + max;

          var totalSeconds = 3; //3 second before vanished.
          var losegame = document.getElementById('label_lose');

          if (losegame.innerHTML === "") {
            losegame.innerHTML = "You Lose!,Try again later";
          } else {
            losegame.innerHTML = "";
          }

          if (losegame.innerHTML = "You Lose!,Try again later") {
            setInterval(setTime, 1000);
            function setTime() {
              totalSeconds--;
              if (totalSeconds == 0) {
                losegame.innerHTML = "";
              }
            }
          }
        }
      }
    });
  }

  // listen to keyboard events to move the snake
  document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // left arrow key 37 , A 65
    if (e.which === 65 && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    }
    // up arrow key 38 , W 87
    else if (e.which === 87 && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    }
    // right arrow key 39 , D 68
    else if (e.which === 68 && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    }
    // down arrow  40 , S 83
    else if (e.which === 83 && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  });
  // start the game
  requestAnimationFrame(loop);
}
//<-----------Get HightScore------------------->
async function sendHighScore(score) {
  // Send the high score to the server
 
  let response =
  await fetch("/updateboard", {
    
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: getCookie("username"),
      score: score,
    }),
  })
}

//<----------------leaderboard here-------------------------------------------->
async function showLeaderboard(score) {
  ""
       console.log('Fetching leaderboard data...');
       // Fetch data from the server
       let response = await fetch("/leaderBoarding");
       let content = await response.json();
         console.log(content);
     
       // Display data on the webpage
       displayLeaderboard(content);
       console.log("2");
   }
 
 function displayLeaderboard(data) {
   // Access the DOM element where you want to display the leaderboard
   let leaderboard_username = document.getElementById("grid_username");
   let leaderboard_score = document.getElementById("grid_score");
   let leaderboard_like = document.getElementById("grid_like");
 
   // Clear existing content
   leaderboard_username.innerHTML = "";
   leaderboard_score.innerHTML = "";
   leaderboard_like.innerHTML = "";
 
   let defaulboard = document.createElement("p");
   defaulboard.textContent = ` Username`;
   leaderboard_username.appendChild(defaulboard);
   let defaulboard2 = document.createElement("p");
   defaulboard2.textContent = ` Score`;
   leaderboard_score.appendChild(defaulboard2);
   let defaulboard3 = document.createElement("p");
   defaulboard3.textContent = ` Liked`;
   leaderboard_like.appendChild(defaulboard3);
   // Iterate through the data and create HTML elements to display it
   for (let entry of data) {
 
       let username = document.createElement("p");
       username.textContent = ` ${entry.username}`;
       let score = document.createElement("p");
       score.textContent = ` ${entry.Score}`;

 
       let likeButton = document.createElement("button");
       likeButton.className = "block_like";

        if (entry.User_Like !== undefined) {
            likeButton.textContent = `Like: ${entry.User_Like}`;
        } else {
            likeButton.textContent = "Like: 0"; 
        }
       likeButton.addEventListener("click", () => {
 
       });
 
       leaderboard_username.appendChild(username);
       leaderboard_score.appendChild(score);
       leaderboard_like.appendChild(likeButton);
   }
 }
 //<=====like system====>
 

 //<=====comment section====>


 async function getData() {
	var msg = document.getElementById("textarea_Comment").value;
	document.getElementById("textarea_Comment").value = "";
	await writePost(msg);
	await readPost();
  }
 async function readPost() {
	let response = await fetch("/readPost");
	let content = await response.json();
	showPost(content);
  }
  async function writePost(msg) {
    let response = await fetch("/writePost", {
      method: "POST",
      headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      user: getCookie("username"),
      message: msg,
      }),
    });
    }

    function showPost(data) {
      var keys = Object.keys(data);
      console.log(keys);
      var divTag = document.getElementById("div_post");
      divTag.innerHTML = "";
      for (var i = keys.length - 1; i >= 0; i--) {
        var temp = document.createElement("p");
        temp.className = "p_post";
        divTag.appendChild(temp);
        temp.innerHTML = data[keys[i]]["username"] + ": " + data[keys[i]]["post"]; // Change this line
        
        // var temp1 = document.createElement("p");
        // temp1.className = "postuser";
        // temp1.innerHTML = data[keys[i]]["username"] + ": " + data[keys[i]]["post"]; // Change this line
        // temp.appendChild(temp1);
    
       
      }
    }
    
 