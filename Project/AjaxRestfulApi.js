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
  function submitStory(event) {
    event.preventDefault();
    let storyId = $("#createBtn").attr("elementID");
    var title = $("#Title").val();
    var content = $("#Content").val();
    if (storyId) {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
        method: "PUT",
  
        data: { title, content },
        success: function () {
          fetchStories();
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    } else {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "POST",
        data: { title, content },
        success: function () {
          fetchStories();
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    }
  }
function editStory(event) {
  event.preventDefault();
  let storyId = $(this).attr("elementID");
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
    method: "GET",
    success: function (element) {
      console.log(element);
      $("#clearBtn").show();
      $("#Title").val(element.title);
      $("#Content").val(element.content);
      $("#createBtn").html("Update");
      $("#createBtn").attr("elementID", element.id);
    },
    error: function (error) {
      console.error("Error deleting story:", error);
    },
  });
}
$(document).ready(function(){
    fetchStories();
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editStory);
    $('#Form').submit(submitStory)
    $("#clearBtn").on("click", function (e) {
      e.preventDefault();
      $("#clearBtn").hide();
      $("#createBtn").removeAttr("elementID");
      $("#createBtn").html("Create");
      $("#Title").val("");
      $("#Content").val("");
    });
})