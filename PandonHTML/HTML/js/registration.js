/**
 * Created by Vyndee on 25/04/2017.
 */
jQuery(document).ready(function ($) {

    console.log("Hello Login");

    $("#registration_form").submit(function (e) {
        e.preventDefault();
        var data = getData($("#registration_form"));
        console.log(data);

        var progress = $(".loading-progress").progressTimer({

            timeLimit: 10,
            onFinish: function () {
                console.log('completed!');
            }
        });

        $.ajax({
            url: "http://localhost:3000/api/user/register",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response, status) {

                console.log("Success");
                progress.progressTimer('complete');
                console.log(response, status);
                window.location.href = "home.html";
            },
            error: function (response, status, error) {
                console.log("Error");
                console.log(response, status, error);
                progress.progressTimer('error', {

                    errorText: 'ERROR!',

                    onFinish: function () {
                        //alert('There was an error processing your information!');
                    }
                });

                $.notify({
                    // options
                    message: "Erreur de  S'inscrire "
                }, {
                    // settings
                    type: 'danger'
                });

            }
        })
    });


    $("#btn_inscription").click(function (e) {
        $("#registration_form").submit();
    });

    function getData(form) {
        var data = form.serializeArray();
        var indexed_array = {};

        $.map(data, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

});