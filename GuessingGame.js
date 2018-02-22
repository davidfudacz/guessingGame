
function newGame () {
  return new Game();
}


function generateWinningNumber () {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle (arr) {
  var length = arr.length;
  while (length) {
    //pick an index between 0 and excluding the last index
    var moveIndex = Math.floor(Math.random() * length--);
    //save the last index
    var holder = arr[length];
    arr[length] = arr[moveIndex];
    arr[moveIndex] = holder;
  }
  return arr;
}

function Game () {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  this.allIsLost = false;

}

Game.prototype.difference = function () {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
  if (this.allIsLost) return '  You must feel terrible.';
  if (this.playersGuess !== this.winningNumber) return (this.playersGuess < this.winningNumber) ? "  Guess higher!" : "  Guess Lower!";
  else return '';
}

Game.prototype.playersGuessSubmission = function (num) {
  
  if ((num > 100) || (num < 1) || isNaN(num)) {
    throw "That is an invalid guess.";
  } else {
    this.playersGuess = num;
  }
  
  return this.checkGuess(num);
}

Game.prototype.checkGuess = function (num) {

  if (this.pastGuesses.indexOf(num) > -1) {
    return 'You have already guessed that number.';

  }
  else if (num === this.winningNumber) {
    disableButtons(true);
    $('h1').text("OH MY GOD!");
    return 'YOU WON!';
  } 
  else if (this.pastGuesses.length === 4) {
    this.allIsLost = true;
    $('h1').text("Oh.  Wow.");
    return 'You Lost.';
  }
  else {
    
    this.pastGuesses.push(num);
    $('#guesses').append('<li class="guess">'+ num + '</li>');
    var difference = Math.abs(num - this.winningNumber)
    if (difference < 10) {
      return "You're burning up!";
    } else if (difference < 25) {
      return "You're lukewarm.";
    } else if (difference < 50) {
      return "You're a bit chilly.";
    } else return "You're ice cold!";
  }
}



Game.prototype.provideHint = function () {
  var hintArr = [];
  hintArr.push(this.winningNumber);
  hintArr.push(generateWinningNumber());
  hintArr.push(generateWinningNumber());

  shuffle(hintArr);

  return 'The number you are looking for is either ' + hintArr[0] +', ' + hintArr[1] + ', or ' + hintArr[2] + '.';
}


function disableButtons(bool) {
  if (bool) {
    $('#hint').prop('disabled', true);
    $('#submit').prop('disabled', true);
  } else {
    $('#hint').prop('disabled', false);
    $('#submit').prop('disabled', false);
  }
}




$(document).ready(function () {

  disableButtons(false);

  var game = new Game();

  function playerGuessed () {
    var num = $('#input').val();
    $('#input').val('');
    var input = parseInt(num);
    var output = game.playersGuessSubmission(input);
    $('h2').text(output + game.isLower());
    console.log(game.winningNumber);
    $('#input').focus();
  
  }
  
  $('#reset').click(function () {
    location.reload();
  });

  $('#hint').click(function () {
    $('h2').text(game.provideHint());
  });


  $('#submit').click(function () {
    playerGuessed();
  });

  $('#input').keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      playerGuessed();
    }
  });
  
})
