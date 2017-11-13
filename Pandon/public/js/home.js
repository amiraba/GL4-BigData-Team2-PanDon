/**
 * Created by Vyndee on 28/05/2017.
 */
jQuery(document).ready(function ($) {

    var user = JSON.parse(localStorage.getItem("user"));

    if (user != null) {
        $("#name-user").text(user.lastName);
        $("#full-name").text(user.firstName + " " + user.lastName);
    }

    $("#logout").click(function () {
        console.log("Logout");
        window.location.href = "login";
        localStorage.clear();
    })

});