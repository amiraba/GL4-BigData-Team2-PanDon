/**
 * Created by Vyndee on 28/05/2017.
 */
/**
 * Created by Vyndee on 25/04/2017.
 */
jQuery(document).ready(function ($) {

    console.log("Hello profile user");
    var user = JSON.parse(localStorage.getItem("user"));

    if (user != null) {
        $("#full-name").text = user.firstName + " " + user.lastName;
    }

});