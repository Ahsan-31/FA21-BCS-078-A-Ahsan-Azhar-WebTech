function fetchStories(){
    $.ajax({
        type:"GET",
        url:"https://usmanlive.com/wp-json/api/stories",

        success: function(response){
                var table = $("#table-body");
                table.empty();
                let tableEntry="<tr>"
                response.forEach(element => {
                    tableEntry=tableEntry+"<td>"+element.title+"</td>";
                    tableEntry=tableEntry+"<td>"+element.content+"</td>";
                    tableEntry=tableEntry+"<td>"+`<div><button class="btn btn-info btn-edit action-buttons" elementID="${element.id}">Edit</button><button class="btn btn-danger btn-del action-buttons" elementID="${element.id}">Delete</button></div>`+"</td>";
                    tableEntry=tableEntry+"</tr>";
                });
                table.append(tableEntry);

        }
    })
}

function deleteStory() {
    let elementID = $(this).attr("elementID");
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + elementID,
      method: "DELETE",
      success: function () {
        fetchStories();
      },
      error: function (error) {
        console.log("Error deleting story:", error);
      },
    });
  }

$(document).ready(function(){
    fetchStories();
    $(document).on("click", ".btn-del", deleteStory);
})