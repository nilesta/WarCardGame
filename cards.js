export function newDeck(id){
    // Shuffles a new deck and stores the ID

    $.ajax("https://deckofcardsapi.com/api/deck/new/shuffle/",{
        dataType: "json",
        type: "GET",
        error: function (result){
            // debug this:
            console.log(result);
        },
        success: function (result) {
            localStorage.setItem(id+"_ID", result.deck_id);
            localStorage.setItem(id+"_points", 0);
            $("#"+id+"Cards").html("<img src=\"https://deckofcardsapi.com/static/img/back.png\" alt=\"Card Back\">");
        }
    });
}

export function drawCard(id){
    // Returns a promise, so this can be used with .when

    return $.ajax("https://deckofcardsapi.com/api/deck/"+id+"/draw/",{
        dataType: "json",
        type: "GET",
    });
}