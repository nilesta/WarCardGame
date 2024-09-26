import {newDeck, drawCard} from "./cards.js";

$(document).ready(function(){
    // Events
    $("#btnNewGame").on("click", function(){
        newGame();
    });

    $("#btnDrawCards").on("click", function(){
        newRound();
    });
});

function newGame(){
    // This will just overwrite localstorage, so it can be used to restart an existing game as well.
    localStorage.clear();

    let players = [
        {
            "name": "Player A",
            "deck": "deckA"
        },
        {
            "name": "Player B",
            "deck": "deckB"
        }
    ];

    // Get Decks, do Setup:
    $(players).each(function (i){
        $("#"+players[i].deck+"Name").text(players[i].name);
        $("#"+players[i].deck+"Points").text("0");
        newDeck(players[i].deck);
    });

    // Switch Buttons:
    $("#btnNewGame").html("Reset").removeClass("btn-primary").addClass("btn-danger");
    $("#btnDrawCards").toggle(true);
    $("#noticeRow").html("");
}

function makeNumber(val){
    // returns the value of a card, if it has one, or a made up value if not
    if (parseInt(val) > 0) return parseInt(val);
    switch (val){
        case "JACK":
            return 11;
            break;
        case "QUEEN":
            return 12;
            break;
        case "KING":
            return 13;
            break;
        case "ACE":
            return 14;
            break;
    }

    // If you're still here, something weird happened:
    console.log("Invalid value: "+val);
}

function newRound() {
    // Do one round of the game
    $.when(drawCard(localStorage.getItem("deckA_ID")), drawCard(localStorage.getItem("deckB_ID"))).then(function(roundA, roundB){
        // Show new cards
        $("#deckACards").html("<img src=\""+roundA[0].cards[0].image+"\" alt=\""+roundA[0].cards[0].value+" of "+roundA[0].cards[0].suit+"\">");
        $("#deckBCards").html("<img src=\""+roundB[0].cards[0].image+"\" alt=\""+roundB[0].cards[0].value+" of "+roundB[0].cards[0].suit+"\">");

        // Compare values, add points
        let a = makeNumber(roundA[0].cards[0].value);
        let b = makeNumber(roundB[0].cards[0].value);
        if (a > b){
            localStorage.setItem("deckA_points", parseInt(localStorage.getItem("deckA_points"))+1);
        }
        if (b > a){
            localStorage.setItem("deckB_points", parseInt(localStorage.getItem("deckB_points"))+1);
        }

        // Show points
        $("#deckAPoints").text(localStorage.getItem("deckA_points"));
        $("#deckBPoints").text(localStorage.getItem("deckB_points"));

        // If all the cards are gone, finish the game:
        if (roundA[0].remaining < 1){
            endGame();
        }
    },function(result){
        // Something went wrong.  Debug this:
        console.log(result);
    });
}

function endGame(){
    // Just remove the draw button and show the winner
    $("#btnDrawCards").toggle(false);

    // Check winner
    let winner = "Everyone";
    let a = parseInt(localStorage.getItem("deckA_points"));
    let b = parseInt(localStorage.getItem("deckB_points"));
    if (a > b){
        winner = "Player A";
    }else if (b > a){
        winner = "Player B"
    }

    $("#noticeRow").html("<div class=\"alert alert-success\">"+winner+" wins!</div>");
}