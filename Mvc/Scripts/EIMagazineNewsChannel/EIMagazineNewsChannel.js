$(document).ready(function () {
    //var ad1Class = $('.ad1div').val();
    //if (ad1Class !== undefined) {
    //    if ($('#sas_' + ad1Class).html().indexOf("img") !== "-1") {
    //        $('#sas_' + ad1Class).html('');
    //        $('#sas_' + ad1Class).html("<img src='https://via.placeholder.com/1170X200?text=Ad' alt='Advertisement' />");
    //    }
    //}

    //if (ad2Class !== undefined) {
    //    var ad2Class = $('.ad2div').val();
    //    if ($('#sas_' + ad2Class).html().indexOf("img") !== "-1") {
    //        $('#sas_' + ad2Class).html('');
    //        $('#sas_' + ad2Class).html("<img src='https://via.placeholder.com/585X400?text=Ad' alt='Advertisement' />");
    //    }
    //}

    //if (ad3Class !== undefined) {
    //    var ad3Class = $('.ad3div').val();
    //    if ($('#sas_' + ad3Class).html().indexOf("img") !== "-1") {
    //        $('#sas_' + ad3Class).html('');
    //        $('#sas_' + ad3Class).html("<img src='https://via.placeholder.com/1170X200?text=Ad' alt='Advertisement' />");
    //    }
    //}

});

/*Fix for accessibility issue of iframe in Electro Magazine page*/
$(window).on("load", function () {
    $("iframe").removeAttr("width height scrolling frameborder");
    $("iframe").attr("title", "Advertisement iframe");
});