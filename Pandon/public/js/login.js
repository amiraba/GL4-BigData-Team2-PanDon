/**
 * Created by Vyndee on 25/04/2017.
 */
jQuery(document).ready(function ($) {

    console.log("Hello Login");

    $("#loginForm").submit(function (e) {
        e.preventDefault();
        var data = getData($("#loginForm"));
        console.log(data);

        var progress = $(".loading-progress").progressTimer({

            timeLimit: 10,
            onFinish: function () {
                console.log('completed!');
            }
        });

        /* $.ajax({
         url: 'http://52.48.41.252:3000/api/strict/users',
         headers: {
         'authorization': localStorage.getItem("token"),
         'Content-Type': 'application/json'
         },
         method: 'GET',
         success: function (data) {
         console.log('succes: ' + data);
         $.ajax({
         url: "http://localhost:3000/donations",
         method: "POST",

         success: function (donations) {

         }

         })
         }
         });*/
        $.ajax({
            url: "http://52.48.41.252:3000/api/user/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response, status) {

                console.log("Success");
                progress.progressTimer('complete');
                console.log(response, status);


                console.log(response);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.data));

                setTimeout(function () {
                    window.location.replace("http://localhost:3000/");
                }, 500);

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
                    message: 'Erreur de se connecter'
                }, {
                    // settings
                    type: 'danger'
                });


            }
        })
    });


    $("#btn").click(function (e) {
        $("#loginForm").submit();
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