// Prime Group jQuery Challenge
// jQuery is great! It allows us to do so many things! You and your group will need to flex everything you know about Javascript, jQuery, and CSS to tackle this challenge.
//
// The Fruit Market
// For this challenge, you will be working with 4 commodities; Apples, Oranges, Bananas, and Grapes. Delicious, right?
//
// When the application loads, you will need to have information for each of the commodities, specifically the name and the market price of each. This information will need to be displayed in a meaningful way on the DOM (this is not displayed in the wireframe below, but is a part of the requirements).
//
// Every 15 seconds, the prices should change however, and with it, the listed price on the DOM. Specifically, the market price of each of the items should fluctuate up or down 50 cents (between 1 cent and 50 cents) with each 15 second interval. Any given fruit is not allowed to go below a cost of 50 cents, or above the cost of 9 dollars and 99 cents.
//
// The information displayed for each of the fruit should have a button-like functionality where the user can interact with each of the fruit displays.
//
// Available to the user is a total cash and an inventory display that shows how much of each of the fruits they have purchased. Also in the user display, should be an average purchased price, which shows, on average, how much money they have spent on a given fruit in their inventory.
//
// Meaning that by clicking on the display for each of the fruits, allows the user to buy one of the fruits, at market price, which will be deducted from the total cash. The user is not allowed to spend more than they have.
//
// The user will start with $100.
//
// Application Mockup
// Use this image as a guide for what the application should look like.
//
// Hard Mode
// Create a button below each of the Fruit buttons that allows the User to ‘sell’ one of their fruits of the same type at the current market price. This will also remove one from their inventory. The user should be not able to sell fruits they do not already own.
//
// Pro Mode
// Limit the application experience to five minutes. At the end, stop the price fluctuation, sell all of the fruits in their inventory at current market price, and then display the total money they earned from the experience.
//
// Master Mode
// Try your hand at styling everything using CSS!

var fruitArray = ['apples', 'oranges', 'bananas', 'grapes'];
var startingPrice = 5.00;
var minSwing = 0.01;
var maxSwing = 0.50;
var minPrice = 0.50;
var maxPrice = 9.99;
var gameIntervalTime = 15000; // prices change every 15 seconds
var startingCash = 100;
var user;
var startTime = 299;
var fullGame = setInterval(gameInterval, gameIntervalTime);

function Fruit(name, price) { // object constructor assigning name and price, and price change function to each fruit
  this.name = name;
  this.price = price;
  this.changePrice = function(){ // this changes the price of each fruit in the array
    var priceSwing = randomNumber(minSwing, maxSwing);
    var randomAdjustment = randomNumber(1,2);
    if(randomAdjustment == 1){
      priceSwing = -priceSwing;
    } else {
      priceSwing += minSwing;
    }
    this.price += priceSwing;
    (this.price).toFixed(2);
    if (this.price > maxPrice) {
      this.price = maxPrice;
    } else if (this.price < minPrice){
      this.price = minPrice;
    }
  }
}

function User(){ // sets a user with starting cash to play the game and is used below (hoisted downward)
  this.startingCash = startingCash;
  this.totalCash = startingCash;
  $('#userContainer').text("Total Cash: $" + startingCash.toFixed(2));
}

// When the user clicks on the button,
//toggle between hiding and showing the dropdown content
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


$(document).ready(function(){
  init(); // the entire game runs within this function
  // $('.sell-button').bind("mouseover", function(){
  //   var color  = $(this).css("background-color");
  //   $(this).css("background", "gray");
  //   $(this).bind("mouseout", function(){
  //     $(this).css("background-color", color);
  //   })
  // });

  $('.dropbtn').bind("mouseover", function(){
    var color  = $(this).css("background-color");
    $(this).css("background", "green");
    $(this).bind("mouseout", function(){
      $(this).css("background", color);
    })
  });

  $('.fruit-button').bind("mouseover", function(){
    var opacity  = $(this).css("opacity");
    $(this).css("opacity", ".5");
    $(this).bind("mouseout", function(){
      $(this).css("opacity", opacity);
    })
  });
});

function init() { // the init function is a string of other functions
  user = new User();
  buildFruits(fruitArray);
  buildDomFruits(fruitArray);
  enable();
  myGame();
}

function buildFruits(array){ // first function called in init(), it takes in the fruit array and adds name and price to new fruit objects
  for (var i = 0; i < array.length; i++) {
    var newFruit = new Fruit(array[i], startingPrice);
    array[i] = newFruit;
    newFruit.changePrice();
    user[newFruit.name] = [];
  }
  console.log(user);
}

function buildDomFruits(array){ // This is the second function called in init().  this function builds the fruit buttons on the DOM from the fruit object and assigns names and prices.
  for (var i = 0; i < array.length; i++) {
    $('#fruitContainer').append("<div class=fruit-button></div>"); // camelcase for iDs and dashes for classes
    $('#fruitContainer').children().last();
    var $el = $('#fruitContainer').children().last();  // the $ in front of the variable is a hint to let myself know that this is a jquery dependent variable.
    $el.data("fruit", array[i].name);
    $el.data("price", array[i].price);
    $el.append("<p class='fruit-price'> $" + array[i].price.toFixed(2) + '</p>');
    $el.addClass(array[i].name);
    array[i].element = $el;
    var avePurchasePrice = 0;
    var fruitInventory = 0;
    $('#aveContainer').first().append("<div class=avePrice" + array[i].name + ">Avg. Purchase Price: $" + avePurchasePrice.toFixed(2) + "</div>");
    $('#invContainer').first().append("<div class=invFruit" + array[i].name + ">Inventory: " + array[i].name + " " + fruitInventory + "</div>");
  }
  buildSellButtons();
  totalCashMade();
}

function buildSellButtons(){ // this function creates sell buttons on the DOM
  $('#sellContainer').empty();
  for (var i = 0; i < fruitArray.length; i++){
    var name = fruitArray[i].name;
    var price = fruitArray[i].price;
    $('#sellContainer').append("<button class='sell-button'>Sell</div>");
    $('#sellContainer').children().last();
    var $el = $('#sellContainer').children().last();  // the $ in front of the variable is a hint to let myself know that this is a jquery dependent variable.
    $el.data("fruit", name);
    $el.data("price", price);
    // $('.sell-button').bind("mouseover", function(){ // need to get this in the right place so that it works.
    //   var color  = $(this).css("background-color");
    //   $(this).css("background", "gray");
    //   $(this).bind("mouseout", function(){
    //     $(this).css("background-color", color);
    //   })
    // });
  }
}

function enable(){ // this function enables the game
  $("#fruitContainer").on('click', '.fruit-button', clickFruit);
  $("#sellContainer").on('click', '.sell-button', sellFruit);
  fullGame;
}

function disable(){ // this function ends the game and stops prices from changing
  $("#fruitContainer").off('click');
  $("#sellContainer").off('click');
  clearInterval(fullGame);
  finalSale(fruitArray);
}

function gameInterval(){ // this function runs the price changes every 15 seconds
  for (var i = 0; i < fruitArray.length; i++) {
    fruitArray[i].changePrice(); // creates changing prices for each fruit
  }
  updateFruitDom();
  buildSellButtons();
}

function sellFruit(){ // this function is the logic that allows a user to sell fruit at current market price, get an updated average price purchased, and an updated inventory number
  var fruit = $(this).data("fruit");
  var price = $(this).data("price");
  if (user[fruit].length > 0 ) {
    user[fruit].pop();
    console.log(fruit + " inventory after .pop", user[fruit]);
    console.log(fruit + " sale price on click of sell button: " + price);
    user.totalCash += price;
  } else {
    return alert("You have no " + fruit + " left to sell.");
  }
  $('#userContainer').text("Total Cash: $" + user.totalCash.toFixed(2));
  averagePurchasePrice(fruit);
  updateFruitInventory(fruit);
  totalCashMade();
}

function clickFruit(){ // this function is the logic that allows a user to purchase fruit, get an average price purchased, and an inventory number
  var fruit = $(this).data("fruit");
  var price = $(this).data("price");
  console.log(user);
  if(user.totalCash >= price){
    user[fruit].push(price);
    user.totalCash -= price;
    console.log(user);
    $('#userContainer').text("Total Cash: $" + user.totalCash.toFixed(2));
  }
  averagePurchasePrice(fruit);
  updateFruitInventory(fruit);
  totalCashMade();
}



function updateFruitDom(){ // this function updates prices of fruit on the DOM
  for (var i = 0; i < fruitArray.length; i++) {
    var fruit = fruitArray[i];
    fruit.element.find(".fruit-price").text("$" + fruit.price.toFixed(2));
    fruit.element.data("price", fruit.price.toFixed(2));
  }
}

function averagePurchasePrice(fruit){ // this function averages the price of all fruits in inventory of a given type
  console.log(user);
  console.log(user[fruit]);
  var totalFruitInvestment = 0;
  for (var i = 0; i < user[fruit].length; i++){
    var priceNumber = Number(user[fruit][i]);
    totalFruitInvestment += priceNumber;
  }
  var avePurchasePrice = totalFruitInvestment / user[fruit].length;
  if (user[fruit].length == 0) {
    avePurchasePrice = 0;
  }
  $('.avePrice' + fruit).last().empty();
  $('.avePrice' + fruit).last().append("Avg. Purchase Price: $" + avePurchasePrice.toFixed(2));
}

function updateFruitInventory(fruit){ // this function updates the fruit inventory of a given fruit upon clickFruit and sellFruit
  var fruitInventory = user[fruit].length;
  $('.invFruit' + fruit).last().empty();
  $('.invFruit' + fruit).last().append("Inventory: " + fruit + " " + fruitInventory);
}

function totalCashMade(){ // calculates a live amount of profit
  var profit = user.totalCash.toFixed(2) - startingCash;
  $('#profitContainer').last().empty();
  $('#profitContainer').first().append("<div><h2>" + "Net Profit: $" + profit.toFixed(2) + "</h2></div>");
}

function startTimer(duration, display) { // displays game timer // todo - get end of game to sell all fruit at current market price, stop prices from changing, and stop timer from resetting
  var timer = duration, minutes, seconds;
  var myTimer = setInterval(function () {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      $('.time').empty();
      $('.time').append("<div>Game Over</div>");
      clearInterval(myTimer);
      disable();
    }
  }, 1000);
}

function myGame() { // this function encapsulates the digital clock on the DOM and uses startTimer() to update the display
  display = document.querySelector('#time');
  startTimer(startTime, display);
}

function finalSale(array){ // this function is the logic that allows a user to sell fruit at current market price, get an updated average price purchased, and an updated inventory number
  for (var i = 0; i < array.length; i++) {
    var fruit = array[i].name;
    var price = array[i].price;
    console.log(fruit);
    console.log(user[fruit]);
    while (user[fruit].length > 0 ) {
      user[fruit].pop();
      console.log(fruit + " inventory after .pop", user[fruit]);
      user.totalCash += Number(price);
      console.log(fruit + " sale price on final sale: " + price);
      $('#userContainer').text("Total: $" + user.totalCash.toFixed(2));
      console.log(user[fruit].length);
      averagePurchasePrice(fruit);
      updateFruitInventory(fruit);
      totalCashMade();
    }
  }
}

// $('.sell-button').bind("mouseover", function(){
//             var color  = $(this).css("background-color");
//
//             $(this).css("background", "gray");
//
//             $(this).bind("mouseout", function(){
//                 $(this).css("background", color);
//             })
//         });

// Utility functions
function randomNumber(min, max) { // this function generates random numbers and is used in the priceChange function
  return Math.floor(Math.random() * (1 + max - min) + min);
}
