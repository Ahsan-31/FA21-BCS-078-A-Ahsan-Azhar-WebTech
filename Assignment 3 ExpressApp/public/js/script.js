function register(){
    var email = $("#email").val();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var password = $("#password").val();
}

$(document).ready(function() {
    $("#submitBtn").click(register);
});