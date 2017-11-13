/**
 * Created by Vyndee on 28/05/2017.
 */
/**
 * Created by Vyndee on 25/04/2017.
 */
jQuery(document).ready(function ($) {

    console.log("Hello redirection");
    console.log(localStorage.getItem("user"));
    //window.location.reload(true);
    if (localStorage.getItem("user") === undefined || !localStorage.getItem("user")) {
        window.location.href = "login";
    }

});