



$(document).ready(function () {
    // configuring view on initilization
    $('#ColourPaletteAcc').hide();
    $('#shapeAccordaian').hide();
    $('#canvasWrapper').hide();
    $('#right-side-menu').show();
    $('#controlMenuButton').hide();
    $('#closeImage').hide();
    $('#data').hide();
    $('#imageControls').hide();
    $('#ServerControls').hide();
    $('#LocalControls').hide();
    $('#right-side-menu').hide();
    $('#dicomData').hide();
    $('#savedAnnotations').hide();

    $('#DicomData').click(function () {
        $('#dicomData').show();
        $('#savedAnnotations').hide();
    });

    $('#AnnotationData').click(function () {
        $('#dicomData').hide();
        $('#savedAnnotations').show();
    });

    //setting up tooltips for annotation controls
    $('[data-toggle="tooltop"]').tooltip();

    //toggles the view for the Dicom data
    $('#DicomDatabtn').click(function () {
        $('#DicomData').show();
        $('#savedAnnotations').hide();
    });


    //toggles the view for the annotation list from database
    $('#AnnotationDatabtn').click(function () {
        $('#savedAnnotations').show();

    });
    //toggles the views for the local db controls
    $('#DataControl').click(function () {
        $('#LocalControls').show();
        $('#DatabaseMenu').hide();
    });

    //toggles the views for the server controls
    $('#ServerControl').click(function () {
        $('#ServerControls').show();
        $('#DatabaseMenu').hide();
    });

    //
    $('#LoadLocal').click(function () {
        $('#LocalControls').show();
        $('#DatabaseMenu').hide();
    });
    $('#CloseServer').click(function () {
        $('#ServerControls').hide();
        $('#DatabaseMenu').show();

    });
    $('#CloseLocal').click(function () {
        $('#LocalControls').hide();
        $('#DatabaseMenu').show();
    });




    $('#controlMenuButton').click(function () {
        $('#side-menu').show();
        $('#controlMenuButton').hide();
    });

    $('#closebutton').click(function () {
        $('#side-menu').hide();
        $('#controlMenuButton').show();
    });

    $('#colourdrop').click(function () {
        if ($('#ColourPaletteAcc').is(':hidden')) {
            $('#ColourPaletteAcc').show();
            $('#imageControls').hide();
            $('#shapeAccordaian').hide();
        } else {
            $('#ColourPaletteAcc').hide();
        }

    });

    $('#DataControl').click(function () {
        if ($('#data').is(':hidden')) {
            $('#data').show();
        } else {
            $('#data').hide();
        }
    });

    $('#ImageControl').click(function () {

        if ($('#imageControls').is(':hidden')) {
            $('#imageControls').show();
            $('#shapeAccordaian').hide();
            $('#ColourPaletteAcc').hide();
        } else {
            $('#imageControls').hide();
        }
    });





    $('#shapeAccbutton').click(function () {
        if ($('#shapeAccordaian').is(':hidden')) {
            $('#shapeAccordaian').show();
            $('#imageControls').hide();
            $('#ColourPaletteAcc').hide();
        } else {
            $('#shapeAccordaian').hide();
        }

    });

    $('#openTestImage').click(function () {
        openImageDisplay();

    });

    $('#closeSidebar').click(function () {
        $('#right-side-menu').hide();
    });

    function openImageDisplay() {
        $('#canvasWrapper').show();
        $('#fileSelectdiv').hide();
        $('#closeImage').show();
        $('#right-side-menu').show();
        $('#erase').show();
        $('#right-side-menu').show();
    }




});

