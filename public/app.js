$(document).ready(function(){
    $.get("/scrape", function(data){
        $.get("/articles", function(data){
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<p id='" + data[i]._id + "'>" + "<a href='" + data[i].link +  "' target= '_blank'>" + data[i].title + "</a>" + "<br />" + data[i].author + "<button class='comment' data-id='" + data[i]._id + "'>View Comments</button>" + "</p>");
                var comments = data[i].comments
                
              }
        })
    })


    $(document).on("click", ".comment", function(){
        var id = $(this).attr("data-id")
        printComments(id)
        
    });

    $(document).on("click", "#addcomment", function(){
        var content = $("#bodyinput").val()
        $("#bodyinput").empty()
        var commentObj = {
            id: $(this).attr("data-id"),
            comment: content
        }
        

        $.post("/submit", commentObj, function(data){
            
            printComments(data._id)
        })
    })

});

function printComments(id){
    $("#commentbox").empty()
    $.get("/article/" + id, function(data){
        // console.log(data)
        
        
            var comments = data[0].comments
            $("#comments").empty()
            for (var x = 0; x < comments.length; x++){
                $("#comments").append(comments[x].comment + "<br>")
            }
          
        $("#commentbox").append("<textarea id='bodyinput' name='body'></textarea>");
        
        $("#commentbox").append("<button data-id='" + data[0]._id + "' id='addcomment'>Add Comment</button>");
    });
}