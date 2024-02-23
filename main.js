
const suits = ["❤️", "♠️", "♣️", "♦️"];
const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

let deck=[];
let playerOneHand = [];
let playerTwoHand = [];
let warPile = [];

let playerOnePoints = 0;
let playerTwoPoints = 0;


function Card(suit, number, value){
    this.number = number;
    this.suit = suit;
    this.value = value;
}



window.addEventListener("load", () => {

    createCardDeck();
    console.log(deck);
    
    createPlayerHands();

    drawPlayerPoints();
    drawPlayerHandsLength();

    let audioShuffle = new Audio('sounds/shuffle.mp3');
    audioShuffle.play();

    
    console.log("Player One Hand", playerOneHand);
    console.log("Player One Hand", playerTwoHand);
  });




const playRoundButton = document.getElementById("play-round-button");
if(playRoundButton) {
    playRoundButton.addEventListener("click", () => {

        
        playRoundOfCards();

        let flipCard = new Audio('sounds/flipcard.mp3');
        flipCard.play();

        console.log(playerOnePoints);
        console.log(playerTwoPoints);


        console.log("Player One Hand", playerOneHand);
        console.log("Player Two Hand", playerTwoHand);
        console.log("War Pile", warPile);
    })
}

const restartButton = document.getElementById("restart-button");
if(restartButton) {
    restartButton.addEventListener("click", () => {

    resetAll();

    createCardDeck();

    createPlayerHands();

    drawPlayerPoints();
    drawPlayerHandsLength();

    console.log(deck);


    document.querySelectorAll(".cards").forEach(el => el.remove());
    document.getElementById("end-message").firstChild.remove();
    

    playRoundButton.disabled = false;
       
    })
}

function resetAll(){
    deck=[];
    playerOneHand = [];
    playerTwoHand = [];
    warPile = [];

    playerOnePoints = 0;
    playerTwoPoints = 0;
}






function createCardDeck() {
   for (let i= 0; i < suits.length; i++){
    for (let j=0; j < values.length; j++){
        deck.push(new Card(suits[i], values[j], values.indexOf(values[j])));
    }
   }
}

function shuffleDeck(){
    deck.sort(() => Math.random() - 0.5);    
}


function createPlayerHands() {  

    shuffleDeck();

    playerOneHand = deck.splice(0, 5);
    playerTwoHand = deck.splice(11, 5);
  
}

function playRoundOfCards(){


    document.querySelectorAll(".war").forEach(el => el.remove());

    let card1 = playerOneHand.shift();
    drawCard(card1.number, card1.suit, "one");

    
    let card2 = playerTwoHand.shift();
    drawCard(card2.number, card2.suit, "two");

    
    checkForRoundWinner(card1, card2);
    
    drawPlayerPoints();
    drawPlayerHandsLength();
       
}

function checkForRoundWinner(card1, card2){

    if(card1.value === card2.value){
        warPile.push(card1);
        warPile.push(card2);
        if(playerOneHand.length < 3){
            playerTwoWins();
            return;
        }
        if(playerTwoHand.length < 3){
            playerOneWins();
            return;
        }
        if(playerOneHand.length < 3 && playerTwoHand.length < 3){
            playerDraw();
            return;
        }
        dealWithTiedCards();
        return;
    }

    if(card1.value > card2.value){
        playerOneHand.push(card1);
        playerOneHand.push(card2);
        playerOneHand.push(...warPile);
        playerOnePoints += (card1.value - card2.value);
        checkForGameWinner();
    } else {
        playerTwoHand.push(card1);
        playerTwoHand.push(card2);
        playerTwoHand.push(...warPile);
        playerTwoPoints += (card2.value - card1.value);    
        checkForGameWinner();
    }
    warPile = [];
}


function dealWithTiedCards() {
    drawCardInWar(playerOneHand[0].number, playerOneHand[0].suit, "one");
    drawSecondCardInWar(playerOneHand[1].number, playerOneHand[1].suit, "one");
    drawCardInWar(playerTwoHand[0].number, playerTwoHand[0].suit, "two");
    drawSecondCardInWar(playerTwoHand[1].number, playerTwoHand[1].suit, "two");
    warPile.push(...playerOneHand.splice(0,2));
    warPile.push(...playerTwoHand.splice(0,2));

}

function checkForGameWinner() {

    if(playerOneHand.length < 1){
        playerTwoWins();
        return;
    }
    if(playerTwoHand.length < 1){
        playerOneWins();
        return;
    }
    if(playerOneHand.length < 1 && playerTwoHand.length < 1){
        playerDraw();
    }
}

function victorySong(){
    let medievalSong = new Audio('sounds/bagpipe-victory.mp3');
        medievalSong.play();
    
}

function playerTwoWins() {
    console.log("player Two wins!");
    let message = document.createTextNode("Player 2 Wins!");
    document.getElementById("end-message").appendChild(message);
    playRoundButton.disabled = true;
    victorySong();   
}

function playerOneWins() {
    console.log("player One wins!");
    let message = document.createTextNode("Player 1 Wins!");
    document.getElementById("end-message").appendChild(message);
    playRoundButton.disabled = true;
    victorySong();       
}

function playerDraw() {
    console.log("It's a draw!");
    let message = document.createTextNode("It's a draw!");
    document.getElementById("end-message").appendChild(message);
    playRoundButton.disabled = true;
    victorySong();       
}


function removeExistingPlayersPoint() {
    const playerOneScore = document.getElementsByClassName("position-player-points-one")[0];
    playerOneScore?.remove();   
    const playerTwoScore = document.getElementsByClassName("position-player-points-two")[0];
    playerTwoScore?.remove();   
}

function drawPlayerPoints(){

    removeExistingPlayersPoint();

    const playerOnePointsScore = document.createElement("div");
    const playerTwoPointsScore = document.createElement("div");

    let content1 = document.createTextNode(playerOnePoints);
    let content2 = document.createTextNode(playerTwoPoints);

    playerOnePointsScore.appendChild(content1);
    playerTwoPointsScore.appendChild(content2);
    
    playerOnePointsScore.setAttribute("class", "position-player-points-one");
    playerTwoPointsScore.setAttribute("class", "position-player-points-two");
    
    const boardGame = document.getElementById("game");
    boardGame.appendChild(playerOnePointsScore);
    boardGame.appendChild(playerTwoPointsScore);
}

function removeExistingCardLength() {
    const playerOneCardLength = document.getElementsByClassName("player-one-hand-length")[0];
    playerOneCardLength?.remove();   
    const playerTwoCardLength = document.getElementsByClassName("player-two-hand-length")[0];
    playerTwoCardLength?.remove();   
}

function drawPlayerHandsLength() {

    removeExistingCardLength();

    const playerOneCardsLength = document.createElement("div");
    const playerTwoCardsLength = document.createElement("div");

    let content1 = document.createTextNode(`Cards: ${playerOneHand.length}`);
    let content2 = document.createTextNode(`Cards: ${playerTwoHand.length}`);

    playerOneCardsLength.appendChild(content1);
    playerTwoCardsLength.appendChild(content2);

    playerOneCardsLength.setAttribute("class", "player-one-hand-length");
    playerTwoCardsLength.setAttribute("class", "player-two-hand-length");

    const boardGame = document.getElementById("game");
    boardGame.appendChild(playerOneCardsLength);
    boardGame.appendChild(playerTwoCardsLength);
}

























function drawCard (number, suit, player){

    const divCardsElement = document.createElement("div");
    divCardsElement.setAttribute("class", "cards");

    const divCardElement = document.createElement("div");
    divCardElement.setAttribute("class", "card"+number+"");

    const divTokenTopElement = tokenTop(number, suit);
    const divTokenBottomElement = tokenBottom(number, suit);

    designCard(number, suit, divCardElement);
    
    divCardElement.appendChild(divTokenBottomElement);
    divCardElement.appendChild(divTokenTopElement);    
    divCardsElement.appendChild(divCardElement);

    divCardsElement.classList.add(`position-player-${player}`);

    if(player === "one"){
        divCardsElement.classList.add("card-slide-left");
    }
    if(player === "two"){
        divCardsElement.classList.add("card-slide");
    }
   
    const boardElement = document.getElementById("game"); 
    
    boardElement.appendChild(divCardsElement);
   
}

function drawCardInWar (number, suit, player){

    const divCardsElement = document.createElement("div");
    divCardsElement.setAttribute("class", "cards");

    const divCardElement = document.createElement("div");
    divCardElement.setAttribute("class", "card"+number+"");

    const divTokenTopElement = tokenTop(number, suit);
    const divTokenBottomElement = tokenBottom(number, suit);

    designCard(number, suit, divCardElement);
    
    divCardElement.appendChild(divTokenBottomElement);
    divCardElement.appendChild(divTokenTopElement);    
    divCardsElement.appendChild(divCardElement);

    divCardsElement.classList.add("war");

    divCardsElement.classList.add(`war-position-${player}`);

    if(player === "one"){
        divCardsElement.classList.add("card-war-slide-left");
    }
    if(player === "two"){
        divCardsElement.classList.add("card-war-slide-right");
    }
    
    const boardElement = document.getElementById("game"); 
    
    boardElement.appendChild(divCardsElement);
}

function drawSecondCardInWar (number, suit, player){

    const divCardsElement = document.createElement("div");
    divCardsElement.setAttribute("class", "cards");

    const divCardElement = document.createElement("div");
    divCardElement.setAttribute("class", "card"+number+"");

    const divTokenTopElement = tokenTop(number, suit);
    const divTokenBottomElement = tokenBottom(number, suit);

    designCard(number, suit, divCardElement);
    
    divCardElement.appendChild(divTokenBottomElement);
    divCardElement.appendChild(divTokenTopElement);    
    divCardsElement.appendChild(divCardElement);

    divCardsElement.classList.add("war");

    divCardsElement.classList.add(`war-position-${player}-second-card`);

    if(player === "one"){
        divCardsElement.classList.add("card-war-slide-left");
    }
    if(player === "two"){
        divCardsElement.classList.add("card-war-slide-right");
    }
    
    const boardElement = document.getElementById("game"); 
    
    boardElement.appendChild(divCardsElement);
}








function designCard(number, suit, divCardElement){
    switch (number) {
        case "2": drawCard2(suit, divCardElement);
        break;
        case "3": drawCard3(suit, divCardElement);
        break;
        case "4": drawCard4(suit, divCardElement);
        break;
        case "5": drawCard5(suit, divCardElement);
        break;
        case "6": drawCard6(suit, divCardElement);
        break;
        case "7": drawCard7(suit, divCardElement);
        break;
        case "8": drawCard8(suit, divCardElement);
        break;
        case "9": drawCard9(suit, divCardElement);
        break;
        case "10": drawCard10(suit, divCardElement);
        break;
        case "A": drawCardA(suit, divCardElement);
        break;
        default: drawCardFigure(number, suit, divCardElement);
        break;

    }
}
    
    


function drawCard2(suit, divCardElement) {
    const divSuitTopCenterElement = suitTopCenter(suit);
    const divSuitBottomCenterElement = suitBottomCenter(suit);

    divCardElement.appendChild(divSuitTopCenterElement);
    divCardElement.appendChild(divSuitBottomCenterElement);
}


function drawCard3(suit, divCardElement) {
    const divSuitTopCenterElement = suitTopCenter(suit);
    const divSuitBottomCenterElement = suitBottomCenter(suit);
    const divSuitCenterMiddleElement = suitCenterMiddle(suit);

    divCardElement.appendChild(divSuitTopCenterElement);
    divCardElement.appendChild(divSuitBottomCenterElement);
    divCardElement.appendChild(divSuitCenterMiddleElement);
}

function drawCard4(suit, divCardElement) {
    const divSuitTopMiddleLeftElement = suitTopMiddleLeft(suit);
    const divSuitTopMiddleRightElement = suitTopMiddleRight(suit);
    const divSuitBottomMiddleLeftElement = suitBottomMiddleLeft(suit);
    const divSuitBottomMiddleRightElement = suitBottomMiddleRight(suit);


    divCardElement.appendChild(divSuitTopMiddleLeftElement);
    divCardElement.appendChild(divSuitTopMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleLeftElement);
    divCardElement.appendChild(divSuitBottomMiddleRightElement);

}

function drawCard5(suit, divCardElement) {
    const divSuitTopMiddleLeftElement = suitTopMiddleLeft(suit);
    const divSuitTopMiddleRightElement = suitTopMiddleRight(suit);
    const divSuitBottomMiddleLeftElement = suitBottomMiddleLeft(suit);
    const divSuitBottomMiddleRightElement = suitBottomMiddleRight(suit);
    const divSuitCenterMiddleElement = suitCenterMiddle(suit);



    divCardElement.appendChild(divSuitTopMiddleLeftElement);
    divCardElement.appendChild(divSuitTopMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleLeftElement);
    divCardElement.appendChild(divSuitBottomMiddleRightElement);
    divCardElement.appendChild(divSuitCenterMiddleElement);
}

function drawCard6(suit, divCardElement) {
    const divSuitTopLeftElement = suitTopLeft(suit);
    const divSuitTopRightElement = suitTopRight(suit);
    const divSuitBottomLeftElement = suitBottomLeft(suit);
    const divSuitBottomRightElement = suitBottomRight(suit);
    const divSuitCenterLeftElement = suitCenterLeft(suit);
    const divSuitCenterRightElement = suitCenterRight(suit);


    divCardElement.appendChild(divSuitTopLeftElement);
    divCardElement.appendChild(divSuitTopRightElement);
    divCardElement.appendChild(divSuitBottomLeftElement);
    divCardElement.appendChild(divSuitBottomRightElement);
    divCardElement.appendChild(divSuitCenterLeftElement);
    divCardElement.appendChild(divSuitCenterRightElement);
}

function drawCard7(suit, divCardElement) {
    const divSuitTopLeftElement = suitTopLeft(suit);
    const divSuitTopRightElement = suitTopRight(suit);
    const divSuitBottomLeftElement = suitBottomLeft(suit);
    const divSuitBottomRightElement = suitBottomRight(suit);
    const divSuitCenterLeftElement = suitCenterLeft(suit);
    const divSuitCenterRightElement = suitCenterRight(suit);
    const divSuitCenterTopMiddleElement = suitCenterTopMiddle(suit);

    divCardElement.appendChild(divSuitTopLeftElement);
    divCardElement.appendChild(divSuitTopRightElement);
    divCardElement.appendChild(divSuitBottomLeftElement);
    divCardElement.appendChild(divSuitBottomRightElement);
    divCardElement.appendChild(divSuitCenterLeftElement);
    divCardElement.appendChild(divSuitCenterRightElement);
    divCardElement.appendChild(divSuitCenterTopMiddleElement);
}

function drawCard8(suit, divCardElement) {
    const divSuitTopLeftElement = suitTopLeft(suit);
    const divSuitTopRightElement = suitTopRight(suit);
    const divSuitBottomLeftElement = suitBottomLeft(suit);
    const divSuitBottomRightElement = suitBottomRight(suit);
    const divSuitCenterLeftElement = suitCenterLeft(suit);
    const divSuitCenterRightElement = suitCenterRight(suit);
    const divSuitCenterTopMiddleElement = suitCenterTopMiddle(suit);
    const divSuitCenterBottompMiddleElement = suitCenterBottomMiddle(suit);


    divCardElement.appendChild(divSuitTopLeftElement);
    divCardElement.appendChild(divSuitTopRightElement);
    divCardElement.appendChild(divSuitBottomLeftElement);
    divCardElement.appendChild(divSuitBottomRightElement);
    divCardElement.appendChild(divSuitCenterLeftElement);
    divCardElement.appendChild(divSuitCenterRightElement);
    divCardElement.appendChild(divSuitCenterTopMiddleElement);
    divCardElement.appendChild(divSuitCenterBottompMiddleElement);

}

function drawCard9(suit, divCardElement) {
    const divSuitTopLeftElement = suitTopLeft(suit);
    const divSuitTopRightElement = suitTopRight(suit);
    const divSuitBottomLeftElement = suitBottomLeft(suit);
    const divSuitBottomRightElement = suitBottomRight(suit);
    const divSuitTopMiddleLeftElement = suitTopMiddleLeft(suit);
    const divSuitTopMiddleRightElement = suitTopMiddleRight(suit);
    const divSuitBottomMiddleRightElement = suitBottomMiddleRight(suit);
    const divSuitBottomMiddleLeftElement = suitBottomMiddleLeft(suit);
    const divSuitCenterMiddleElement = suitCenterMiddle(suit);

    divCardElement.appendChild(divSuitTopLeftElement);
    divCardElement.appendChild(divSuitTopRightElement);
    divCardElement.appendChild(divSuitBottomLeftElement);
    divCardElement.appendChild(divSuitBottomRightElement);
    divCardElement.appendChild(divSuitTopMiddleLeftElement);
    divCardElement.appendChild(divSuitTopMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleLeftElement);
    divCardElement.appendChild(divSuitCenterMiddleElement);
}

function drawCard10(suit, divCardElement) {
    const divSuitTopLeftElement = suitTopLeft(suit);
    const divSuitTopRightElement = suitTopRight(suit);
    const divSuitBottomLeftElement = suitBottomLeft(suit);
    const divSuitBottomRightElement = suitBottomRight(suit);
    const divSuitTopMiddleLeftElement = suitTopMiddleLeft(suit);
    const divSuitTopMiddleRightElement = suitTopMiddleRight(suit);
    const divSuitBottomMiddleRightElement = suitBottomMiddleRight(suit);
    const divSuitBottomMiddleLeftElement = suitBottomMiddleLeft(suit);
    const divSuitTopCenterElement = suitTopCenterTen(suit);
    const divSuitBottomCenterElement = suitBottomCenterTen(suit);


    divCardElement.appendChild(divSuitTopLeftElement);
    divCardElement.appendChild(divSuitTopRightElement);
    divCardElement.appendChild(divSuitBottomLeftElement);
    divCardElement.appendChild(divSuitBottomRightElement);
    divCardElement.appendChild(divSuitTopMiddleLeftElement);
    divCardElement.appendChild(divSuitTopMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleRightElement);
    divCardElement.appendChild(divSuitBottomMiddleLeftElement);
    divCardElement.appendChild(divSuitTopCenterElement);
    divCardElement.appendChild(divSuitBottomCenterElement);

}

function drawCardA(suit, divCardElement) {

    const divSuitCenterMiddleElement = suitCenterMiddleLarger(suit);

    divCardElement.appendChild(divSuitCenterMiddleElement);
   
}

function drawCardFigure(number, suit, divCardElement) {

    const image = suitFigure(number, suit);

    divCardElement.appendChild(image);
}








function tokenTop(number, suit) {
    const divTokenTopElement = document.createElement("div");
    divTokenTopElement.setAttribute("class", "token");
    divTokenTopElement.classList.add("token-top");


    const divTokenTopNumber = document.createElement("div");
    const divTokenTopSymbol = document.createElement("div");

    const divTokenTopNumberContent = document.createTextNode(`${number}`);
    const divTokenTopSymbolContent = document.createTextNode(`${suit}`);

    divTokenTopNumber.appendChild(divTokenTopNumberContent);
    divTokenTopSymbol.appendChild(divTokenTopSymbolContent);

    divTokenTopElement.appendChild(divTokenTopNumber);
    divTokenTopElement.appendChild(divTokenTopSymbol);
    return divTokenTopElement;
}

function tokenBottom(number, suit) {
    const divTokenBottomElement = document.createElement("div");
    divTokenBottomElement.setAttribute("class", "token");
    divTokenBottomElement.classList.add("token-bottom");

    const divTokenBottomNumber = document.createElement("div");
    const divTokenBottomSymbol = document.createElement("div");

    const divTokenBottomNumberContent = document.createTextNode(`${number}`);
    const divTokenBottomSymbolContent = document.createTextNode(`${suit}`);

    divTokenBottomNumber.appendChild(divTokenBottomNumberContent);
    divTokenBottomSymbol.appendChild(divTokenBottomSymbolContent);

    divTokenBottomElement.appendChild(divTokenBottomNumber);
    divTokenBottomElement.appendChild(divTokenBottomSymbol);

    return divTokenBottomElement;
}


function suitBottomCenter(suit) {
    const divSuitBottomElement = document.createElement("div");
    divSuitBottomElement.setAttribute("class", "suit suit-center suit-bottom");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomElement.appendChild(content);

    return divSuitBottomElement;
}

function suitTopCenter(suit) {
    const divSuitTopElement = document.createElement("div");
    divSuitTopElement.setAttribute("class", "suit suit-center suit-top");
    const content = document.createTextNode(`${suit}`);
    divSuitTopElement.appendChild(content);
    return divSuitTopElement;
}



function suitTopLeft(suit) {
    const divSuitTopLeftElement = document.createElement("div");
    divSuitTopLeftElement.setAttribute("class", "suit suit-left suit-top");
    const content = document.createTextNode(`${suit}`);
    divSuitTopLeftElement.appendChild(content);
    return divSuitTopLeftElement;
}

function suitTopRight(suit) {
    const divSuitTopRightElement = document.createElement("div");
    divSuitTopRightElement.setAttribute("class", "suit suit-right suit-top");
    const content = document.createTextNode(`${suit}`);
    divSuitTopRightElement.appendChild(content);
    return divSuitTopRightElement;
}

function suitBottomLeft(suit) {
    const divSuitBottomLeftElement = document.createElement("div");
    divSuitBottomLeftElement.setAttribute("class", "suit suit-left suit-bottom");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomLeftElement.appendChild(content);
    return divSuitBottomLeftElement;
}

function suitBottomRight(suit) {
    const divSuitBottomRightElement = document.createElement("div");
    divSuitBottomRightElement.setAttribute("class", "suit suit-right suit-bottom");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomRightElement.appendChild(content);
    return divSuitBottomRightElement;
}

function suitCenterMiddle(suit) {
    const divSuitCenterMiddleElement = document.createElement("div");
    divSuitCenterMiddleElement.setAttribute("class", "suit suit-center suit-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterMiddleElement.appendChild(content);
    return divSuitCenterMiddleElement;
}
function suitCenterMiddleLarger(suit) {
    const divSuitCenterMiddleLargerElement = document.createElement("div");
    divSuitCenterMiddleLargerElement.setAttribute("class", "suit suit-center suit-middle suit-larger");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterMiddleLargerElement.appendChild(content);
    return divSuitCenterMiddleLargerElement;
}

function suitBottomMiddleRight(suit) {
    const divSuitBottomMiddleRightElement = document.createElement("div");
    divSuitBottomMiddleRightElement.setAttribute("class", "suit suit-right suit-bottom-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomMiddleRightElement.appendChild(content);
    return divSuitBottomMiddleRightElement;
}

function suitBottomMiddleLeft(suit) {
    const divSuitBottomMiddleLeftElement = document.createElement("div");
    divSuitBottomMiddleLeftElement.setAttribute("class", "suit suit-left suit-bottom-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomMiddleLeftElement.appendChild(content);
    return divSuitBottomMiddleLeftElement;
}

function suitTopMiddleLeft(suit) {
    const divSuitTopMiddleLeftElement = document.createElement("div");
    divSuitTopMiddleLeftElement.setAttribute("class", "suit suit-left suit-top-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitTopMiddleLeftElement.appendChild(content);
    return divSuitTopMiddleLeftElement;
}

function suitTopMiddleRight(suit) {
    const divSuitTopMiddleRightElement = document.createElement("div");
    divSuitTopMiddleRightElement.setAttribute("class", "suit suit-right suit-top-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitTopMiddleRightElement.appendChild(content);
    return divSuitTopMiddleRightElement;
}

function suitCenterRight(suit) {
    const divSuitCenterRightElement = document.createElement("div");
    divSuitCenterRightElement.setAttribute("class", "suit suit-right suit-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterRightElement.appendChild(content);
    return divSuitCenterRightElement;
}

function suitCenterLeft(suit) {
    const divSuitCenterLeftElement = document.createElement("div");
    divSuitCenterLeftElement.setAttribute("class", "suit suit-left suit-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterLeftElement.appendChild(content);
    return divSuitCenterLeftElement;
}

function suitCenterTopMiddle(suit) {
    const divSuitCenterTopMiddle = document.createElement("div");
    divSuitCenterTopMiddle.setAttribute("class", "suit suit-center suit-top-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterTopMiddle.appendChild(content);
    return divSuitCenterTopMiddle;
}

function suitCenterBottomMiddle(suit) {
    const divSuitCenterBottomMiddle = document.createElement("div");
    divSuitCenterBottomMiddle.setAttribute("class", "suit suit-center suit-bottom-middle");
    const content = document.createTextNode(`${suit}`);
    divSuitCenterBottomMiddle.appendChild(content);
    return divSuitCenterBottomMiddle;
}

function suitBottomCenterTen(suit) {
    const divSuitBottomCenterTen = document.createElement("div");
    divSuitBottomCenterTen.setAttribute("class", "suit suit-center suit-bottom-center");
    const content = document.createTextNode(`${suit}`);
    divSuitBottomCenterTen.appendChild(content);
    return divSuitBottomCenterTen;
}

function suitTopCenterTen(suit) {
    const divSuitTopCenterTen = document.createElement("div");
    divSuitTopCenterTen.setAttribute("class", "suit suit-center suit-top-center");
    const content = document.createTextNode(`${suit}`);
    divSuitTopCenterTen.appendChild(content);
    return divSuitTopCenterTen;
}

function suitFigure(number, suit) {

    const image = document.createElement("img");

    switch(number) {
        case "J":
            image.setAttribute("class", "image-size suit-center suit-middle");
            switch(suit) {
                case "❤️":
                    image.setAttribute("src", "./images/jackhearts.png");
                    break;    
                case "♠️":
                    image.setAttribute("src", "./images/jackspades.png");
                    break;    
                case "♣️":
                    image.setAttribute("src", "./images/jackclubs.png");
                    break;    
                case "♦️":
                    image.setAttribute("src", "./images/jackdiamonds.png");
                    break;    
                }
                
            image.setAttribute("alt", "A jack card");
            return image;
    }
    switch(number) {
        case "Q":
            image.setAttribute("class", "image-size suit-center suit-middle");
            switch(suit) {
                case "❤️":
                    image.setAttribute("src", "./images/queenhearts.png");
                    break;    
                case "♠️":
                    image.setAttribute("src", "./images/queenspades.png");
                    break;    
                case "♣️":
                    image.setAttribute("src", "./images/queenclubs.png");
                    break;    
                case "♦️":
                    image.setAttribute("src", "./images/queendiamonds.png");
                    break;    
                }
                
            image.setAttribute("alt", "A queen card");
            return image;
    }
    switch(number) {
        case "K":
            image.setAttribute("class", "image-size suit-center suit-middle");
            switch(suit) {
                case "❤️":
                    image.setAttribute("src", "./images/kinghearts.png");
                    break;    
                case "♠️":
                    image.setAttribute("src", "./images/kingspades.png");
                    break;    
                case "♣️":
                    image.setAttribute("src", "./images/kingclubs.png");
                    break;    
                case "♦️":
                    image.setAttribute("src", "./images/kingdiamonds.png");
                    break;    
                }
                
            image.setAttribute("alt", "A queen card");
            return image;
    }
    
}
    