$(document).ready(function() {
    $("#submitBtn").click(validateForm);
});

function validateForm() {
    var email = $("#email").val();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var message = $("#message").val();

    if (email === "" || firstName === "" || lastName === "" || message === "") {
        alert("Please fill in all fields.");
        return false;
    }

    var emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    alert("Message Sent successfully!");
}