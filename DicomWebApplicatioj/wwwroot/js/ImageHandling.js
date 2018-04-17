
$(document).ready(function () {
    var imageType = false;
    var canvas, canvas2, context;
    var MAX_HEIGHT = window.innerHeight;
    var imagedata;
    var imageOpen = false;


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

        const file = e.target.files[0];

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


        $(document).ready(function () {
            $('#canvasDiv').show();
            $('#fileSelectdiv').hide();
            $('#closeImage').show();
            $('#right-side-menu').show();
        });
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

        if (imageType === false) {
            render(imagedata);
            imageOpen = true;
        } else {
            openTestImage();
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


    //document.getElementById('openTestDicom').addEventListener('click', function () {
    //    OpenTestDicomImage();
    //});


    //function OpenTestDicomImage() {
    //    var file = new File();
    //    file = file.source('../images/test.dcm');
    //    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    //    loadAndViewImage(imageId);
    //}



    ////handles the drag and drop events of the dicom files
    //function handleDragOver(evt) {
    //    evt.stopPropagation();
    //    evt.preventDefault();
    //    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    //}






    //// this function gets called once the user drops the file onto the div
    //function handleFileSelect(evt) {
    //    evt.stopPropagation();
    //    evt.preventDefault();

    //    // Get the FileList object that contains the list of files that were dropped
    //    const files = evt.dataTransfer.files;

    //    // this UI is only built for a single file so just dump the first one
    //    file = files[0];
    //    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    //    console.log("IMAGEid");
    //    loadAndViewImage(imageId);
    //    console.log("handling");
    //}


    //let loaded = false;

    //function loadAndViewImage(imageId) {
    //    $(document).ready(function () {
    //        $('#canvasDiv').show();
    //        $('#fileSelectdiv').hide();
    //        $('#closeImage').show();
    //        $('#right-side-menu').show();
    //    });

    //    const element = document.getElementById('cornerstoneDiv');

    //    const start = new Date().getTime();

    //    cornerstone.loadImage(imageId).then(function (image) {
    //        console.log("here");
    //        const viewport = cornerstone.getDefaultViewportForImage(element, image);
    //        //document.getElementById('toggleModalityLUT').checked = (viewport.modalityLUT !== undefined);
    //        //document.getElementById('toggleVOILUT').checked = (viewport.voiLUT !== undefined);
    //        cornerstone.displayImage(element, image, viewport);
    //        if (loaded === false) {
    //            cornerstoneTools.mouseInput.enable(element);
    //            cornerstoneTools.mouseWheelInput.enable(element);
    //            cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
    //            cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    //            cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
    //            cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

    //            cornerstoneTools.imageStats.enable(element);
    //            loaded = true;
    //        }

    //        function getTransferSyntax() {
    //            const value = image.data.string('x00020010');
    //            return value + ' [' + uids[value] + ']';
    //        }

    //        function getSopClass() {
    //            const value = image.data.string('x00080016');
    //            return value + ' [' + uids[value] + ']';
    //        }

    //        function getPixelRepresentation() {
    //            const value = image.data.uint16('x00280103');
    //            if (value === undefined) {
    //                return;
    //            }
    //            return value + (value === 0 ? ' (unsigned)' : ' (signed)');
    //        }

    //        function getPlanarConfiguration() {
    //            const value = image.data.uint16('x00280006');
    //            if (value === undefined) {
    //                return;
    //            }
    //            return value + (value === 0 ? ' (pixel)' : ' (plane)');
    //        }



    //    }, function (err) {
    //        alert(JSON.stringify(err));
    //        console.log(err);
    //        });


    //}

    ////initializing the cornerstone library to deal
    //cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    //const element = document.getElementById('canvasDiv');
    //cornerstone.enable(element);

    //document.getElementById('dicomfile').addEventListener('change', function (e) {
    //    // Add the file to the cornerstoneFileImageLoader and get unique
    //    // number for that file
    //    const file = e.target.files[0];
    //    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    //    console.log("IMAGEid");
    //    loadAndViewImage(imageId);
    //    console.log("handling");
    //});



    //// Setup the dnd listeners.
    //var dropZone = document.getElementById('dropZoneDicom');
    //dropZone.addEventListener('dragover', handleDragOver, false);
    //dropZone.addEventListener('drop', handleFileSelect, false);

    ////function getBlobUrl(url) {
    ////    const baseUrl = window.URL || window.webkitURL;
    ////    const blob = new Blob([`importScripts('${url}')`], { type: 'application/javascript' });
    ////    console.log("failing here?");
    ////    return baseUrl.createObjectURL(blob);

    ////}
    //////web workers and codecs to decode and parse the dicom files.
    ////const webWorkerUrl = getBlobUrl('~/js/conerstoneWADOImageLoaderWebWorker.js');
    ////const codecsUrl = getBlobUrl('~/js/conerstoneWADOImageLoaderCodecs.js');


    ////initialize the loader to handle the dicom files
    //try {

    //    window.cornerstoneWADOImageLoader.webWorkerManager.initialize({
    //        maxWebWorkers: 4,
    //        startWebWorkersOnDemand: true,
    //        webWorkerPath: '../dist/cornerstoneWADOImageLoaderWebWorker.js',
    //       webWorkerTaskPaths: [],
    //        taskConfiguration: {
    //            decodeTask: {
    //                loadCodecsOnStartup: true,
    //                initializeCodecsOnStartup: false,
    //                codecsPath: '../dist/cornerstoneWADOImageLoaderCodecs.js',
    //                usePDFJS: false,
    //                strict: false
    //            }
    //        }
    //    });
    //} catch (error) {
    //    throw new Error('cornerstoneWADOImageLoader is not loaded');
    //}



});


