$(document).ready(function() {
//----------------------------------------------------------Initial HTML Setup----------------------------------------------------------------------------
$(".gameBoard").append(
  "<div class='gameBtn firstBtn'></div>" +
  "<div class='gameBtn secondBtn'></div>" +
  "<div class='gameBtn thirdBtn'></div>" +
  "<div class='gameBtn fourthBtn'></div>"
);

$(".gameDashboard").append(
  "<button class='startGameButton'>Start</button>" +
  "<h2><label for='lengthOfPattern'>Pattern Length: </label></h2><h2 class='lengthOfPattern' id='lengthOfPattern'>0</h2>" +
  "<h2><label for='strictSwitch'>Strict Mode Enabled: </label></h2><input class='strictSwitch'  id='strictSwitch' type='checkbox' checked>"
);

//-----------------------------------------------------------VariableSetup--------------------------------------------------------------------------------
var simonSaysSequence = [],
    userSequence = [],
    userTurn = false,
    audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    audio4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

//-----------------------------------------------------------Click Functions------------------------------------------------------------------------------

$(".startGameButton").click(function() {
  userTurn = false;
  simonSaysSequence = [];
  userSequence = [];
  simonTurn();
})

$(".gameBtn").click(function() {
  if(userTurn) {
    var userSelection = $(this).index();
    eval("audio" + (userSelection+1) + ".play()");
    userSequence.push(userSelection);
    if (!userMemoryIsCorrect()) {
      if($(".strictSwitch").prop("checked")) {
        resetGameStrict();
      } else {
        resetGameRegular();
      }
    } else if (userSequence.length == simonSaysSequence.length) {
      if (playerBeatGame()) {
        alert("You Won!");
      } else {
        userTurn = false;
        simonTurn();
      }
    }
  }
})

//------------------------------------------------------------Helper Functions ---------------------------------------------------------------------
function simonTurn() {
  userSequence = [];
  addSimonSelection();
  playSimonSequence(simonSaysSequence);
}

function addSimonSelection() {
  var randomSelection = Math.floor(4 * Math.random());
  simonSaysSequence.push(randomSelection);
  $('.lengthOfPattern').text(simonSaysSequence.length);
}

function playSimonSequence(startArray) {
  if (startArray.length > 0) {
    var holder = startArray[0];
    var newArray = startArray.slice(1);
    $(".gameBtn").eq(holder).addClass("playSound");
    eval("audio" + (holder+1) + ".play()");
    setTimeout( function() {
      $(".gameBtn").eq(holder).removeClass("playSound");
      setTimeout( function() {
        playSimonSequence(newArray);
      },300)
    },1000);
  } else {
      userTurn = true;
  }
}

function userMemoryIsCorrect() {
  var memoryCorrect = true;
  for (var i = 0; i < userSequence.length; i++) {
    if (userSequence[i] != simonSaysSequence[i]) {
      memoryCorrect = false;
    }
  }
  return memoryCorrect;
}

function playerBeatGame() {
  return simonSaysSequence.length >= 20;
}

function resetGameRegular() {
  alert("Incorrect, try again");
  playSimonSequence(simonSaysSequence);
  userSequence = [];
}

function resetGameStrict() {
  alert("Incorrect, STRICT: start over and try again");
  simonSaysSequence = [];
  simonTurn();
  userSequence = [];
}

});
