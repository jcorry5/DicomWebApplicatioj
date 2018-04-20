

$(document).ready(function () {
    
    var imageType = false;
    var canvas, canvas2, context;
    var MAX_HEIGHT = window.innerHeight;
    var imagedata;
    var imageOpen = false;
    var byteArray;
    var dicom = false;

    //Event handler to open test image for tutorial
    var openTest = document.getElementById('openTestImage');
    openTest.addEventListener('click', function () {

        openTestImage();

    });


    //function to open test image, image loacted in web application folder
    function openTestImage() {

        var base_image = new Image();
        canvas = document.getElementById("image-canvas");
        canvas2 = document.getElementById("anno-canvas");
        context = canvas.getContext("2d");
        // wait for image to load before drawing canvas
        base_image.onload = function () {

            canvas.width = base_image.width;
            canvas.height = base_image.height;
            canvas2.width = base_image.width;
            canvas2.height = base_image.height;

            context.drawImage(base_image, 0, 0);
            imageOpen = true;
        };
        base_image.src = "../images/test.jpg";
        imageType = true;
        document.getElementById('workingFile').innerHTML = "testing";


    }

    //event handler and function to remove all annotations from canvas
    //completely erases canvas and redraws the image from the root folder. 
    // second function is called in the drawing.js file to reset all variables and clears all annotation coordinated from json array
    $('#LoadLocal').click(function () {
        erase();

    });

    $('#erase').click(function () {
        erase();
    });

    function erase() {
        canvas = document.getElementById("image-canvas");
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        if (imageType === false) {
            render(imagedata);
        } else {
            openTestImage();
        }
    }

    //event listener for the drag and drop area on application, this one for opening standard image files
    var imageFile = document.getElementById("imagefile");
    imageFile.addEventListener("change", loadImageFromDrop, false);


    document.getElementById('imagefile').addEventListener('change', function (e) {

        var file = e.target.files[0];

        var imageType = 'image.*';
        //verify that it is an image file or else throw an error
        if (file.type.match(imageType)) {

            loadImageFromDrop(file);
            //get file name from the drop this will be used in the database to get annotations at a later date, when the file is reloaded.

            var fullPath = document.getElementById('imagefile').value;
            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
                document.getElementById('workingFile').innerHTML = filename;

            }
        } else {
            alert("file not supported");
        }

    });
    // drag and drop functions,  explicitly states that the file being dropped is a copy
    var target = document.getElementById("dropZone");
    target.addEventListener("dragover", function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }, true);
    target.addEventListener("drop", function (e) {
        e.preventDefault();

        //verify that it is an image file
        const file = e.dataTransfer.files[0];
        var imageType = 'image.*';

        if (file.type.match(imageType)) {

            loadImageFromDrop(file);
            document.getElementById('workingFile').innerHTML = e.dataTransfer.files[0].name;
        } else {
            alert("file not supported");
        }


        //adds the file name to the html, used later as a key within the database to retrieve annotations at later date

    }, true);

    // file reader to reader images either selected through drag and drop or by the file input selection
    function loadImageFromDrop(src) {


        var reader = new FileReader();
        reader.onload = function (e) {
            render(e.target.result);
        };

        reader.readAsDataURL(src);


    }

    //function that renders the image files added to the application
    // also resizes image if too large, and hides the file selection divs and shows the canvases
    function render(evt) {
        imagedata = evt;


        $('#canvasWrapper').show();
        $('#fileSelectdiv').hide();
        $('#closeImage').show();
        $('#right-side-menu').show();

        canvas = document.getElementById("image-canvas");
        canvas2 = document.getElementById("anno-canvas");
        var image = new Image();
        image.onload = function () {

            if (image.height > MAX_HEIGHT) {
                image.width *= MAX_HEIGHT / image.height;
                image.height = MAX_HEIGHT;
            }
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.width;
            canvas.height = image.height;
            canvas2.width = image.width;
            canvas2.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            imageType = false;
        };
        image.src = evt;
    }

    document.getElementById('LoadLocal').addEventListener('click', function () {
        if (imageType === false) {
            render(imagedata);
            imageOpen = true;
        } else {
            openTestImage();

        }
    });




    document.getElementById('undo').addEventListener('click', function () {
        RedrawCanvas();
    });

    function RedrawCanvas() {
        if (!dicom) {
            if (imageType === false) {
                render(imagedata);
                imageOpen = true;
            } else {
                openTestImage();
            }
        } else {
            parseByteArray(byteArray);
        }

    }

    // download function to download the image as a .png file with the annotations on the image.

    var button = document.getElementById('downloadImage');
    button.addEventListener('click', function (e) {
        try {
            var dataURL = canvas.toDataURL('image/png');
            button.href = dataURL;
        } catch (err) {
            console.log("storage failed:" + err);
        }

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EVERYTHING FROM HERE IS FOR PARSING AND LOADING DICOM FILES


    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

    // this function gets called once the user drops the file onto the div
    function handleFileSelect(evt) {
        
        evt.stopPropagation();
        evt.preventDefault();

        // Get the FileList object that contains the list of files that were dropped
        const files = evt.dataTransfer.files;

        // this UI is only built for a single file so just dump the first one
        file = files[0];
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        loadAndViewImage(imageId);
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    const dropZone = document.getElementById('dropZoneDicom');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);



    let loaded = false;
 
    function loadAndViewImage(imageId) {
        "use strict";
        const element = document.getElementById('cornerstoneDiv');
        const start = new Date().getTime();
        loading(imageId);
        function loading(imageId) {
            cornerstone.loadImage(imageId).then(function (image) {
                console.log(image);
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                document.getElementById('toggleModalityLUT').checked = (viewport.modalityLUT !== undefined);
                document.getElementById('toggleVOILUT').checked = (viewport.voiLUT !== undefined);
                cornerstone.displayImage(element, image, viewport);
                if (loaded === false) {
                    cornerstoneTools.mouseInput.enable(element);
                    cornerstoneTools.mouseWheelInput.enable(element);
                    cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                    cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
                    cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                    cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
                    cornerstoneTools.imageStats.enable(element);
                    loaded = true;
                }



                document.getElementById('patientId').textContent = image.data.string('x00100020');
                document.getElementById('patientName').textContent = image.data.string('x00100010');
                document.getElementById('patientDob').textContent = image.data.string('x20010101');
                document.getElementById('patientSex').textContent = image.data.string('x00100040');
                document.getElementById('studyInformation').textContent = image.data.string('x00081030');
                document.getElementById('studyId').textContent = image.data.string('x00200010');
                document.getElementById('bodyPart').textContent = image.data.string('x00180015');
                document.getElementById('sopInstanceUid').textContent = image.data.string('x00080018');
                document.getElementById('referencedSOPClassUID').textContent = image.data.string('x00100020');
                document.getElementById('manufacturer').textContent = image.data.string('x00080070');
                document.getElementById('institution').textContent = image.data.string('x00080080');


                $('#canvasWrapper').show();
                $('#fileSelectdiv').hide();
                $('#closeImage').show();
                $('#right-side-menu').show();
            }, function (err) {
                alert(err);

            });
        }
        
    }


    const element = document.getElementById('cornerstoneDiv');
    cornerstone.enable(element);

    document.getElementById('dicomfile').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        loadAndViewImage(imageId);
    });

    document.getElementById('toggleModalityLUT').addEventListener('click', function () {
        const applyModalityLUT = document.getElementById('toggleModalityLUT').checked;
        console.log('applyModalityLUT=', applyModalityLUT);
        const image = cornerstone.getImage(element);
        const viewport = cornerstone.getViewport(element);
        if (applyModalityLUT) {
            viewport.modalityLUT = image.modalityLUT;
        } else {
            viewport.modalityLUT = undefined;
        }
        cornerstone.setViewport(element, viewport);
    });

    document.getElementById('toggleVOILUT').addEventListener('click', function () {
        const applyVOILUT = document.getElementById('toggleVOILUT').checked;
        console.log('applyVOILUT=', applyVOILUT);
        const image = cornerstone.getImage(element);
        const viewport = cornerstone.getViewport(element);
        if (applyVOILUT) {
            viewport.voiLUT = image.voiLUT;
        } else {
            viewport.voiLUT = undefined;
        }
        cornerstone.setViewport(element, viewport);
    });



});


