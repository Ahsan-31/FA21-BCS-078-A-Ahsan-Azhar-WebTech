$(document).ready(function(){
    $.ajax({
        type:"GET",
        url:"https://usmanlive.com/wp-json/api/stories",

        success: function(response){
                $('#waiting').hide();
                let tableEntry="<tr>"
                response.forEach(element => {
                    tableEntry=tableEntry+"<td>"+element.id+"</td>";
                    tableEntry=tableEntry+"<td>"+element.title+"</td>";
                    tableEntry=tableEntry+"<td>"+element.content+"</td>";
                    tableEntry=tableEntry+"</tr>";
                });
                $("#table-body").append(tableEntry);

        }
    })
})