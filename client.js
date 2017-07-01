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

var fruitArray = ['Apples', 'Oranges', 'Bananas', 'Grapes'];

var startingPrice = 5.00; // whole numbers = dollarz
var minSwing = 0.03;
var maxSwing = 1.97;
var minPrice = 0.50;
var maxPrice = 9.99;
var gameIntervalTime = 1000;
var startingCash = 100;
var user;

startingPrice.toFixed(2);
// document.getElementById("#userCash") = totalCash;

function Fruit(name, price) {
  this.name = name;
  this.price = price;
  this.changePrice = function(){
    var priceSwing = randomNumber(minSwing, maxSwing).toFixed(2);
    var randomAdjustment = randomNumber(1,2);
    if(randomAdjustment == 1){
      priceSwing = -priceSwing;
    }
    // console.log(priceSwing);
    // console.log(this.price);
    priceSwing = priceSwing - minSwing;
    this.price += priceSwing;
    (this.price).toFixed(2);
    if (this.price > maxPrice) {
      this.price = maxPrice;

    } else if (this.price < minPrice){
      this.price = minPrice;
    }
  }
  // console.log("maxPrice is ", maxPrice);

}

// var someFruit = new Fruit(fruitArray[0], 65);
// console.log(someFruit);   this was used as a test fruit


function User(){
  this.startingCash = startingCash;
  this.totalCash = startingCash;
  $('#userContainer').first().append("<div>" + startingCash.toFixed(2) + "</div>");
}


$(document).ready(function(){
  init();


});

function init() {
  user = new User();
  buildFruits(fruitArray);
  buildDomFruits(fruitArray);
  enable();
}

function enable(){
  $("#fruitContainer").on('click', '.fruit-button', clickFruit);
  $("#sellContainer").on('click', '.sell-button', sellFruit);

  setInterval(gameInterval, gameIntervalTime);
}

function disable(){
  clearInterval(gameInterval);
}


function clickFruit(){

  var fruit = $(this).data("fruit");
  var price = $(this).data("price");

  if(user.totalCash >= price){
    user["inv" + fruit].push(price);
    user.totalCash -= price;
    console.log(user);
    document.getElementById("userContainer").innerHTML = user.totalCash.toFixed(2);
    // $('#userContainer').append("<div>" + user.totalCash.toFixed(2) + "</div>").first();
}
}

function sellFruit(){

  var fruit = $(this).data("fruit");
  var price = $(this).data("price");

  user["inv" + fruit]--;
  user.totalCash += price;
  // console.log(user);
  document.getElementById("userContainer").innerHTML = user.totalCash.toFixed(2);
}

function gameInterval(){
  for (var i = 0; i < fruitArray.length; i++) {
    fruitArray[i].changePrice();
    // console.log(fruitArray[i].name, fruitArray[i].price);
  }
  // buildDomFruits(fruitArray);
   updateFruitDom();
}

function buildFruits(array){
  // console.log(array);  testing my theory
  for (var i = 0; i < array.length; i++) {
    var newFruit = new Fruit(array[i], startingPrice); // 50 is called a 'magic number' - which is an intentional test number that will need to be reset
    array[i] = newFruit;  // so we had to create a new variable outside of doc ready called startingPrice to replace our magic number
    newFruit.changePrice();

    user["inv" + newFruit.name] = [];
  }
  // console.log(array); testing it again
  console.log(user);
}

function buildDomFruits(array){
  // $('#fruitContainer').empty();
  for (var i = 0; i < array.length; i++) {
    // $('#fruitContainer').empty();
    // $('#fruitContainer').append("<button class='sell-button'>Sell</div>");
    // $('#fruitContainer').children().first().append("<button class='sell-button'>Sell</div>");
    $('#fruitContainer').append("<div class='fruit-button'></div>"); // camelcase for iDs and dashes for classes
    // $('#fruitContainer').append("<button class='sell-button'>Sell</div>");
    // $('#fruitContainer').children().first().append("<button class='sell-button'>Sell</div>");
    $('#fruitContainer').children().last();
    var $el = $('#fruitContainer').children().last();  // the $ in front of the variable is a hint to let myself know that this is a jquery dependent variable.
    $el.data("fruit", array[i].name);
    $el.data("price", array[i].price);
    $el.append('<p>' + array[i].name + '</p>');
    $el.append("<p class='fruit-price'>" + array[i].price + '</p>');
    array[i].element = $el;
    $('#sellContainer').append("<button class='sell-button'>Sell</div>");
    var $ele = $('#sellContainer').children().last();  // the $ in front of the variable is a hint to let myself know that this is a jquery dependent variable.
    $ele.data("fruit", array[i].name);
    $ele.data("price", array[i].price);
    // $el.append('<p>' + array[i].name + '</p>');
    // $el.append("<p class='fruit-price'>" + array[i].price + '</p>');
    // array[i].element = $el;
  }
}

function updateFruitDom(){
for (var i = 0; i < fruitArray.length; i++) {
  var fruit = fruitArray[i];
  // fruit.price = fruit.price.toFixed(2);
  fruit.element.find(".fruit-price").text(fruit.price.toFixed(2));
  fruit.element.data("price", fruit.price);
}

}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (1 + max - min) + min);
}
