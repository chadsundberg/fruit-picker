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
var startingPrice = 5.00; // whole numbers = dollarz
var minSwing = 0.03;
var maxSwing = 1.97;
var minPrice = 0.50;
var maxPrice = 9.99;
var gameIntervalTime = 2000;
var startingCash = 100;
var user;

function Fruit(name, price) { // object constructor assigning name and price, and price change function to each fruit
  this.name = name;
  this.price = price;
  this.changePrice = function(){
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
  $('#userContainer').first().append("<div>" + "Total: $" + startingCash.toFixed(2) + "</div>");
}

$(document).ready(function(){
  init(); // the entire game runs within this function
});

function init() { // the init function is a string of other functions
  user = new User();
  buildFruits(fruitArray);
  buildDomFruits(fruitArray);
  enable();
}

function buildFruits(array){ // first function called in init(), it takes in the fruit array and adds name and price to new fruit objects
  for (var i = 0; i < array.length; i++) {
    var newFruit = new Fruit(array[i], startingPrice);
    array[i] = newFruit;
    newFruit.changePrice();
    user[newFruit.name] = [];
    // user["purchaseprices" + newFruit.price] = [];
    // console.log(user[fruit][i]);
  }
  console.log(user);
  // console.log(user[fruit][i]);
  // console.log(user.fruit);
}

// for (var i = 0; i < user[fruit].length; i++){
//     var totalFruitInvestment = 0;
//      totalFruitInvestment += user[fruit[i]].sum();
//      console.log(totalFruitInvestment);
//      $('#aveContainer').empty();
//     $('#aveContainer').append(fruit + ' Investment: $' + totalFruitInvestment);
//   }



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
  }
}

function enable(){
  $("#fruitContainer").on('click', '.fruit-button', clickFruit);
  $("#sellContainer").on('click', '.sell-button', sellFruit);
  setInterval(gameInterval, gameIntervalTime);
}

function disable(){
  clearInterval(gameInterval);
}

function sellFruit(){ // create a way to average price of fruit sold
  var fruit = $(this).data("fruit");
  var price = $(this).data("price");
  if (user[fruit].length > 0 ) {
    user[fruit].pop();
    console.log(fruit + " inventory after .pop", user["inv" + fruit]);
    user.totalCash += price;
  } else {
    return alert("You have no " + fruit + " left to sell.");
  }
  $('#userContainer').first().empty();
  $('#userContainer').first().append("<div>" + "Total: $" + user.totalCash.toFixed(2) + "</div>");
  console.log(fruit, price);
  console.log("user after selling ", user);
  totalCashMade();
}

function clickFruit(){ // need to add in code that averages price of fruit purchased
  var fruit = $(this).data("fruit");
  var price = $(this).data("price");
  if(user.totalCash >= price){
    user[fruit].push(price);
    user.totalCash -= price;
    console.log(user);
    $('#userContainer').first().empty();
    $('#userContainer').first().append("<div>" + "Total: $" + user.totalCash.toFixed(2) + "</div>");
    // averagePurchasePrice();
    console.log(user[fruit].length);
    var totalFruitInvestment = 0;
    for (var i = 0; i < user[fruit].length; i++){
      console.log(user[fruit][i]);
        // var totalFruitInvestment = 0;
        var priceNumber = Number(user[fruit][i]);
         totalFruitInvestment += priceNumber;
       }
       var avePurchasePrice = totalFruitInvestment / user[fruit].length;
         console.log(totalFruitInvestment);
        $('#aveContainer').empty();
        $('#aveContainer').append(fruit + ' investment: $' + totalFruitInvestment.toFixed(2) + ' for an average purchase price of $' + avePurchasePrice.toFixed(2));

  }
  totalCashMade();

}

function gameInterval(){
  for (var i = 0; i < fruitArray.length; i++) {
    fruitArray[i].changePrice(); // creates changing prices for each fruit
  }
  updateFruitDom();
  buildSellButtons();
  // averagePurchasePrice();
}

function updateFruitDom(){ // this function updates prices of fruit on the DOM
  for (var i = 0; i < fruitArray.length; i++) {
    var fruit = fruitArray[i];
    fruit.element.find(".fruit-price").text("$" + fruit.price.toFixed(2));
    fruit.element.data("price", fruit.price.toFixed(2));
  }
}

function totalCashMade(){
  var profit = user.totalCash.toFixed(2) - startingCash;
  $('#profitContainer').last().empty();
  $('#profitContainer').first().append("<div><h4>" + "Profit: $" + profit.toFixed(2) + "</h4></div>");
}

// function averagePurchasePrice(User, fruit){ // working out price averaging function
//
//   for (var i = 0; i < user[fruit].length; i++){
//     var totalFruitInvestment = 0;
//      totalFruitInvestment += user[fruit[i]].sum();
//      console.log(totalFruitInvestment);
//      $('#aveContainer').empty();
//     $('#aveContainer').append(fruit + ' Investment: $' + totalFruitInvestment);
//   }
// }

// Utility functions
function randomNumber(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}
