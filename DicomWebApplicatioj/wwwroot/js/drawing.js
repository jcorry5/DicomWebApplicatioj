var canvasx, canvasy, width, height, DbJson, TouchClientX, TouchClientY, db, objectStore, request, i, comment, object;
var canvas = document.getElementById('anno-canvas');
var imageCanvas = document.getElementById('image-canvas');
var context = imageCanvas.getContext('2d');
var ctx = canvas.getContext('2d');
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;
var penWidth = 2;
var colour = 'black';
var shape = 'Rectangle';
var label = 'numberFirst';
var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var nextChar = "A";
var char = 0;
var num = 0;
var JsonArrayOfShapes = [];
var arrayofundoneAnnotations = [];
var shapesUndone = false;
var AnotationsSaved = true;
var save = false;
var numberofthingsundone = 0;
var menu = document.getElementById('annotationlist');
var note = document.getElementById("notifications");
var commentToggle = "ON";
var annotationNum = 0;
var shapeDone = false;

//turns the ability to add comments on and off, is off by default
function toggleComment(onOFF) {
    commentToggle = onOFF;
}

//sets the shape that will be drawn on the canvas ie, rectandgle, line, arrow etc.
// rectangle by default.
function shapes(choice) {
    shape = choice;
}

//the the thickness of the line that will be drawn.
function penSize(size) {
    penWidth = size;
    document.getElementById("pensize").innerHTML = penWidth;
}

//colour of the annotations drawn

function colourChoice(choice) {
    colour = choice;
}

//dictates whether each annotation drawn will have numbers or letters, or in the case of quadrants, which one comes first,
// for example // numberFirst would mean  quadrants labelled, 1A, 1B, 1C, 1D
function labelFormat(format) {
    label = format;
}



$(document).ready(function () {

    // warning message shown if you try to close the browser before all annotations are saved.
    window.onbeforeunload = function (e) {
        var dialog = "All annotations may not have been saved. Are you sure you want to leave?";
        if (!AnotationsSaved) {
            e.returnValue = dialog;
            return dialog;
        }

    };

    //if the erase button is used, gestures whether to keep the annotations in the array so they can be redone with the redo button.
    $('#erase').click(function () {
        annotationNum = 0;

        num = 0;
        char = 0;
        shapeDone = false;
        JsonArrayOfShapes = [];
        shapesUndone = false;
        arrayofundoneAnnotations = [];
        menu.innerHTML = "";


    });


    //keeps the notification panel scrolled to the bottom as new notifications are made.
    function updateScroll() {
        var element = document.getElementById("notificationsDiv");
        element.scrollTop = element.scrollHeight;
    }
    //interval set for up dating the scroll on the notification panel
    setInterval(updateScroll, 500);

    //keeps the annotation panel scrolled to the bottom as new notifications are made.
    function updateScrollList() {
        var element = document.getElementById("listDiv");
        element.scrollTop = element.scrollHeight;
    }
    //interval set for up dating the scroll on the annotations panel panel
    setInterval(updateScrollList, 500);



    $('#closeImage').click(function () {

        context.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        $('#canvasDiv').hide();
        $('#closeImage').hide();
        $('#erase').hide();
        $('#fileSelectdiv').show();
        $('#right-side-menu').hide();

    });


    //function called to get the current letter of the alphabet for the annotations
    function getAlphabet() {

        var nextChar = str.charAt(char);
        return nextChar;
    }

    //iterates up through the alphabet when functions called to annotate the canvas
    function iterateAlphabet() {

        nextChar = str.charAt(char);
        if (char < str.length) {
            char++;
        } else {
            char = 0;
        }
        return nextChar;
    }


    //simple function to iterate up through the numbers for the annotations
    function iterateNumbers() {
        num++;
        return num;
    }


    //add event listeners for each of the touch events
    // using e.preventDefault to stop the touch events from scrolling around the page.
    // the target for the thouch events is the canvas that will be drawn on.
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);

    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);

    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);


    //instead of writing out addition functions on how to handle touch events
    //dispatch the event to the mouse events, and let the prewritten code take over.
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);


    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);


    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    //Mousedown
    $(canvas).on('mousedown', function (e) {
        down(e);
    });

    //Mouseup
    $(canvas).on('mouseup', function (e) {
        up(e);
    });

    //Mousemove
    $(canvas).on('mousemove', function (e) {
        move(e);

    });

    //gets the offset of the mouse and sets the X and Y coordinates for use in drawing the images
    function down(e) {
        canvasx = $(canvas).offset().left;
        canvasy = $(canvas).offset().top;
        last_mousex = parseInt(e.clientX - canvasx);
        last_mousey = parseInt(e.clientY - canvasy);
        mousedown = true;

    }


    document.onkeydown = KeyPress;

    //called on mouse up if there was any annotations undone before this was called in drawing new ones, this function will clear the array
    function up(e) {

        shapeDone = true;
        if (shapesUndone) {
            arrayofundoneAnnotations = [];
            shapesUndone = false;

        }
        //prompts the user if they want to add comments to the diagrams that can be saved.
        if (commentToggle === "ON") {
            comment = prompt("comment:");

        }
        //if comments are turned on, creates a list note of the comment made.
        var listItem = document.createElement('li');
        if (label === 'numberFirst' && commentToggle === "ON") {

            listItem.innerHTML = shape + " " + parseInt(num + 1) + ": " + comment;
            menu.appendChild(listItem);
        } else if (label === 'letterFirst' && commentToggle === "ON") {

            listItem.innerHTML = shape + " " + getAlphabet() + ": " + comment;
            menu.appendChild(listItem);
        }
        if (label === 'numberFirst' && commentToggle === "OFF") {

            listItem.innerHTML = shape + " " + parseInt(num + 1);
            menu.appendChild(listItem);
        } else if (label === 'letterFirst' && commentToggle === "OFF") {

            listItem.innerHTML = shape + " " + getAlphabet();
            menu.appendChild(listItem);
        }


        //mouse down becomes false, so the upper canvas gets wiped clean the pernament annotation is added to the canvas with the image,
        //calls the context to begin the drawing of the shape and sets the variables to be used in the drawing.
        mousedown = false;
        context.beginPath();
        context.strokeStyle = colour;
        context.lineWidth = penWidth;
        context.font = "12px Arial";
        width = mousex - last_mousex;
        height = mousey - last_mousey;
        DrawShape();
        AnotationsSaved = false;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pushToArray();

    }

    //depending on the shape required, this function draws the shape required and the labels in their appropriate format on top.

    function DrawShape() {
        switch (shape) {
            case 'Rectangle':
                var y;
                if (mousey > last_mousey) {
                    y = mousey;
                } else {
                    y = last_mousey;
                }

                rect(context, width, height);
                context.lineWidth = 2;
                if (label === 'numberFirst') {
                    console.log(label);
                    context.strokeText(iterateNumbers(), (mousex + last_mousex) / 2, y + 20);

                } else if (label === 'letterFirst') {
                    console.log(label);
                    context.strokeText(iterateAlphabet(), (mousex + last_mousex) / 2, y + 20);

                }


                break;

            case 'Line':

                line(context);
                context.lineWidth = 2;
                if (label === 'numberFirst') {
                    context.strokeText(iterateNumbers(), ((mousex + last_mousex) / 2) + 20, ((mousey + last_mousey) / 2) + 20);
                } else if (label === 'letterFirst') {
                    context.strokeText(iterateAlphabet(), ((mousex + last_mousex) / 2) + 20, ((mousey + last_mousey) / 2) + 20);
                }
                break;

            case 'Arrow':
                arrow(context);
                context.lineWidth = 2;
                if (label === 'numberFirst') {
                    context.strokeText(iterateNumbers(), ((mousex + last_mousex) / 2) + 20, ((mousey + last_mousey) / 2) + 20);
                } else if (label === 'letterFirst') {
                    context.strokeText(iterateAlphabet(), ((mousex + last_mousex) / 2) + 20, ((mousey + last_mousey) / 2) + 20);
                }

                break;
            case 'Quadrilateral':
                quad(context);
                context.lineWidth = 2;
                if (label === 'numberFirst') {
                    num++;
                    context.strokeText(num + iterateAlphabet(), mousex, mousey);
                    context.strokeText(num + iterateAlphabet(), last_mousex, mousey);
                    context.strokeText(num + iterateAlphabet(), mousex, last_mousey);
                    context.strokeText(num + iterateAlphabet(), last_mousex, last_mousey);
                } else if (label === 'letterFirst') {
                    char++;
                    context.strokeText(getAlphabet() + iterateNumbers(), mousex, mousey);
                    context.strokeText(getAlphabet() + iterateNumbers(), last_mousex, mousey);
                    context.strokeText(getAlphabet() + iterateNumbers(), mousex, last_mousey);
                    context.strokeText(getAlphabet() + iterateNumbers(), last_mousex, last_mousey);

                }


                break;
        }
    }

    //move function that draws on the top most canvas, clears on every call to allow smooth animation of the function drawing.
    function move(e) {
        mousex = parseInt(e.clientX - canvasx);
        mousey = parseInt(e.clientY - canvasy);
        if (mousedown) {

            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            ctx.beginPath();
            ctx.strokeStyle = colour;
            ctx.lineWidth = penWidth;
            var width = mousex - last_mousex;
            var height = mousey - last_mousey;
            switch (shape) {
                case 'Rectangle':

                    rect(ctx, width, height);
                    break;

                case 'Line':
                    line(ctx);
                    break;

                case 'Arrow':
                    arrow(ctx);
                    break;
                case 'Quadrilateral':
                    quad(ctx);
                    break;
            }

        }
    }

    //draws the lines if the variable is set
    function line(context) {
        context.moveTo(last_mousex, last_mousey);
        context.lineTo(mousex, mousey);
        context.stroke();


    }

    //draws the guadrilaterals, using  four bezier curves, 
    function quad(context) {
        context.moveTo(last_mousex, last_mousey + (mousey - last_mousey) / 2);
        context.bezierCurveTo(last_mousex, last_mousey, mousex, last_mousey, mousex, last_mousey + (mousey - last_mousey) / 2);
        context.bezierCurveTo(mousex, mousey, last_mousex, mousey, last_mousex, last_mousey + (mousey - last_mousey) / 2);
        context.closePath();
        context.stroke();
        // drawing quadrant lines
        var midX = (mousex - last_mousex) / 2 + last_mousex;
        var midY = (mousey - last_mousey) / 2 + last_mousey;
        //horizontal lines to be drawn
        context.beginPath();
        context.strokeStyle = colour;
        context.lineWidth = penWidth;
        context.moveTo(last_mousex, midY);
        context.lineTo(mousex, midY);
        context.stroke();


        //vertical lines to be drawn.
        context.beginPath();
        context.strokeStyle = colour;
        context.lineWidth = penWidth;
        context.moveTo(midX, last_mousey);
        context.lineTo(midX, mousey);
        context.stroke();
    }

    //simple draws the rectangles.
    function rect(context, width, height) {
        context.rect(last_mousex, last_mousey, width, height);
        context.stroke();
    }


    //draws arrows on the canvas
    function arrow(context) {
        context.moveTo(last_mousex, last_mousey);
        var headlen = 10;   // length of head in pixels
        var angle = Math.atan2(mousey - last_mousey, mousex - last_mousex);
        context.lineTo(mousex, mousey);
        context.lineTo(mousex - headlen * Math.cos(angle - Math.PI / 6), mousey - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(mousex, mousey);
        context.lineTo(mousex - headlen * Math.cos(angle + Math.PI / 6), mousey - headlen * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }

    //called by the redo button an clears and redraws all the annotations
    $('#redo').click(function () {
        redo();
    });

    function redo() {
        if (shapesUndone) {
            if (numberofthingsundone !== 0) {
                var returned = arrayofundoneAnnotations.pop();

                JsonArrayOfShapes.push(returned);

                Redrawing(JsonArrayOfShapes.length - 1);

                numberofthingsundone--;



            } else {
                document.getElementById("errorMessages").innerHTML = "Nothing annotations found to redraw.";
            }

        } else {
            document.getElementById("errorMessages").innerHTML = "Nothing annotations found to redraw.";
        }
    }





    //sets the variables and begins the context to  the annotations, 
    function Redrawing(index) {
        context.beginPath();

        context.strokeStyle = JsonArrayOfShapes[index].colour;
        context.lineWidth = JsonArrayOfShapes[index].pensize;
        shape = JsonArrayOfShapes[index].shape;
        mousex = JsonArrayOfShapes[index].X;
        mousey = JsonArrayOfShapes[index].Y;
        last_mousex = JsonArrayOfShapes[index].lastX;
        last_mousey = JsonArrayOfShapes[index].lastY;
        width = mousex - last_mousex;
        height = mousey - last_mousey;
        label = JsonArrayOfShapes[index].LabelFormat;


        var listItem = document.createElement('li');
        if (label === 'numberFirst' && commentToggle === "ON") {

            listItem.innerHTML = shape + " " + parseInt(num + 1) + ": " + comment;
            menu.appendChild(listItem);
        } else if (label === 'letterFirst' && commentToggle === "ON") {

            listItem.innerHTML = shape + " " + getAlphabet() + ": " + comment;
            menu.appendChild(listItem);
        }
        if (label === 'numberFirst' && commentToggle === "OFF") {

            listItem.innerHTML = shape + " " + parseInt(num + 1);
            menu.appendChild(listItem);
        } else if (label === 'letterFirst' && commentToggle === "OFF") {

            listItem.innerHTML = shape + " " + getAlphabet();
            menu.appendChild(listItem);
        }


        DrawShape();
    }

    //draws all shaes currently in the array to be done, because the canvas doesn't remember where the annotations are, this function 
    //clears the canvas and redraws it, before redrawing all the annotations
    function drawAll() {
        try {

            setTimeout(function () {
                console.log(JsonArrayOfShapes);
                for (var j = 0; j < JsonArrayOfShapes.length; j++) {

                    Redrawing(j);

                }
            }, 500);
        } catch (err) {
            console.log(err);

        }
    }


    //called by the undo button, this function is called to remove the last annotation dones in the array
    // this removed annotation is placed into a second array in case the annotation has to be redrawn.
    // again there is a set delay in place to allow the image to be redrawn.

    $('#undo').click(function () {
        undo();
    });

    //shortcut key set up to undo functions using control+
    function KeyPress(e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode === 90 && evtobj.ctrlKey) undo();
    }

    function undo() {
        try {
            if (num > 0) {
                menu.innerHTML = "";
                var removedObject = JsonArrayOfShapes.pop();
                context.clearRect(0, 0, canvas.width, canvas.height);
                char = 0;
                num = 0;

                setTimeout(function () {

                    for (var j = 0; j < JsonArrayOfShapes.length; j++) {

                        Redrawing(j);

                    }
                }, 500);

                arrayofundoneAnnotations.push(removedObject);
                shapesUndone = true;

                numberofthingsundone++;

            } else {
                document.getElementById('errorMessages').innerHTML = "Nothing to undo";
            }

            //displays error in cole if there is a problem
        } catch (err) {
            console.log(err);
        }
    }

    //called when a new annotation is drawn or when an annotation is redrawn, pushes the object to an array that will be used for temporary storage.
    function pushToArray() {

        object = {
            'annotationNum': ++annotationNum,
            'filename': document.getElementById("workingFile").innerHTML,
            'shape': shape,
            'pensize': penWidth,
            'colour': colour,
            'X': mousex,
            'Y': mousey,
            'lastX': last_mousex,
            'lastY': last_mousey,
            'LabelFormat': label,
            'Comment': comment
        };

        JsonArrayOfShapes.push(object);

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////LOCAL DATABASE CONTROLS
    ////////////////////////////////////
    //using onload function to initialize the database on the page loading.

    note.innerHTML += "<li>Application opened.</li>";
    window.indexedDB = window.indexedDB || window.webkitIndexedDb || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbversion = 5;

    request = indexedDB.open("ImageAnotations", dbversion);

    //called automatically if the request is successful.
    request.onsuccess = function (e) {
        note.innerHTML += "<li>Database created.</li>";
        console.log("success creating database");
        db = request.result;

        //may be deprecated, used for google chrome.
        if (db.setversion) {
            if (db.version !== dbversion) {
                var setversion = db.setversion(dbversion);
                setversion.onsuccess = function () {
                    createobjectstore(db);

                };
            }
        }


        //called automatically if there is a problem with the database.
        db.onerror = function (e) {
            alert("database error: " + e.target.errorCode);
        };
    };

    //called automatically if there is an error in processing the request to open the database
    request.onerror = function (e) {
        console.log("Error creating / accessing IndexedDB database");
        note.innerHTML += "<li>Error creating / accessing IndexedDB database.</li>";
    };


    //called if there is a difference in version numbers in the databases, onbjects in the old database will be destroyed if not accounted for.
    request.onupgradeneeded = function (e) {
        var db = e.target.result;

        //called if there is a problem with the database
        db.onerror = function (event) {
            console.log("error loading database.");
            note.innerHTML += "<li>Error loading database.</li>";
        };

        // creating the objectStore used to store the values. keypath will be the file name used so when reloaded can be used as the search criteria
        objectStore = db.createObjectStore('Annotation', { keyPath: 'FileID', autoIncrement: true });

        //
        objectStore.createIndex('filename', 'filename', { unique: false });
        objectStore.createIndex("annotationNum", "annotationNum", { unique: false });
        objectStore.createIndex("shape", "shape", { unique: false });
        objectStore.createIndex("pensize", "pensize", { unique: false });
        objectStore.createIndex("colour", "colour", { unique: false });
        objectStore.createIndex("X", "X", { unique: false });
        objectStore.createIndex("Y", "Y", { unique: false });
        objectStore.createIndex("LastX", "LastX", { unique: false });
        objectStore.createIndex("LastY", "LastY", { unique: false });
        objectStore.createIndex("labelFormat", "labelFormat", { unique: false });
        objectStore.createIndex("Comment", "Comment", { unique: false });

        console.log("objectStore created");
        note.innerHTML += "<li>Ojectstore created.</li>";



    };
    document.getElementById("SearchLocal").addEventListener('click', function(){
        search();
    });
    function search() {
        var count=0;
        var trans = db.transaction('Annotation', 'readonly');
        var store = trans.objectStore('Annotation');
        var index = store.index('annotationNum');
        trans.onerror = function (e) {
            console.log("something went wrong searching local database");

        };
        var cursorRequest = index.openCursor();
        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;
            
            if (cursor) {
                if (cursor.value.filename === document.getElementById("workingFile").innerHTML) {
                    count++;
                }

                cursor.continue;
            }



        };
        note.innerHTML += '<li style"color : green;">There are ' +count+' previous annotations for this file found in the local database.</li>';
    }

    //loads the data from the local database which is then added to the array of shapes and redrawn.
    $('#LoadLocal').click(function () {

        if (shapeDone === true) {

            var conn = confirm("Any annotations made before loading will be erased.");
        }
        if (conn === true) {
            menu.innerHTML = "";
            num = 0;
            char = 0;
            JsonArrayOfShapes = [];
            var trans = db.transaction('Annotation', 'readonly');
            var store = trans.objectStore('Annotation');
            var index = store.index('annotationNum');
            trans.onerror = function (e) {
                console.log("something went wrong loading data");

            };


            //cursor moves down the array adding in all annotation that match the file name of the image opened.
            var cursorRequest = index.openCursor();
            cursorRequest.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    if (cursor.value.filename === document.getElementById("workingFile").innerHTML) {
                        annotationNum = cursor.value.annotationNum;
                        shape = cursor.value.shape;
                        penWidth = cursor.value.pensize;
                        colour = String(cursor.value.colour);
                        mousex = parseInt(cursor.value.X);
                        mousey = parseInt(cursor.value.Y);
                        last_mousex = parseInt(cursor.value.lastX);
                        last_mousey = parseInt(cursor.value.lastY);
                        comment = cursor.value.Comment;
                        label = String(cursor.value.LabelFormat);
                        pushToArray();


                    }

                    cursor.continue();
                }

            };
            console.log("finished");
            note.innerHTML += "<li>All available objects loaded.</li>";
            drawAll();
        }

    });




    //event handler to delete all annotations found of the present file
    $('#deleteall').click(function () {


        deleteall();
        console.log("deleted");
        note.innerHTML += "<li>Database cleared.</li>";


    });

    //function that will delete all annotations saved in the local database.
    function deleteall() {
        var fileDelete = document.getElementById("workingFile");
        console.log(fileDelete);
        var transaction = db.transaction(["Annotation"], "readwrite");
        var store = transaction.objectStore('Annotation');
        var index = store.index('filename');
        var cursorRequest = index.openKeyCursor();
        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                if (cursor.key === document.getElementById('workingFile').innerHTML) {
                    var objectStoreRequest = store.delete(cursor.primaryKey);
                }



                cursor.continue();
            }


        };

    }

    $('#saveLocal').click(function () {

        var transaction = db.transaction(["Annotation"], "readwrite");
        transaction.onsuccess = function (e) {
            console.log("transaction sucessful");
        };

        transaction.onerror = function (event) {
            console.log("transaction error on saving shapes.");
        };

        //cycle through the array of shapes adding each one to the database.
        for (var j = 0; j < JsonArrayOfShapes.length; j++) {


            // call the object store that's already been added to the database
            var objectStore = transaction.objectStore("Annotation");
            var objectStoreRequest = objectStore.add(JsonArrayOfShapes[j]);

            objectStoreRequest.onsuccess = function (event) {
                AnotationsSaved = true;
                console.log("array success fully saved to database");
                note.innerHTML += "<li>Annotations successfully saved.</li>";
            };

            objectStoreRequest.onerror = function (event) {
                console.log("something went wrong");
            };
            // Make a request to add our newItem object to the object store


        }
    });

    //when the save annotation button is used, this function cycles throufh the array and adds them into the database.
    $("#saveServer").bind("click", function () {
        var Annotations = JSON.stringify(JsonArrayOfShapes);
        console.log(Annotations);

        $.ajax(
            {


                url: "/Annotations/PassData",
                type: 'post',
                data: Annotations,
                dataType: "json",
                contentType: "application/json",
                traditional: true,
                error: function (request) {
                    alert(request.statusText);
                },
                success: function (result) {
                    note.innerHTML += "<li>Annotations successfully saved to server.</li>";

                }

            }
        );


    });
    $("#LoadServer").bind("click", function () {

        $.ajax(
            {


                url: '/Annotations/GetData',
                type: 'get',
                data: {get_param: 'Value'},
                dataType: "json",
                contentType: "application/json",
                traditional: true,
                error: function (request) {
                    alert(request.statusText);
                },
                success: function (result) {
                    note.innerHTML += "<li>Annotations successfully saved to server.</li>";

                }

            }
        );


    });

    $("#updateServer").bind("click", function () {
        if (JsonArrayOfShapes !== []) {
            var Annotations = JSON.stringify(JsonArrayOfShapes);
            $.ajax(
                {


                    url: "/Annotations/UpdateData",
                    type: 'post',
                    data: Annotations,
                    dataType: "json",
                    contentType: "application/json",
                    traditional: true,
                    error: function (request) {
                        alert(request.statusText);
                    },
                    success: function (result) {
                        note.innerHTML += "<li>Annotations deleted on server.</li>";

                    }

                }
            );
        } else {
            document.getElementById("errorMessages").innerHTML = "There is no data to update datebase.";
        }

        console.log(Annotations);




    });

    $("#DeleteServer").bind("click", function () {
        var Annotations = JSON.stringify([{

            'annotationNum': 8,
            'filename': document.getElementById("workingFile").innerHTML,
            'shape': shape,
            'pensize': penWidth,
            'colour': colour,
            'X': 0,
            'Y': 0,
            'lastX': 0,
            'lastY': 0,
            'LabelFormat': label,
            'Comment': comment

        }]);

        var filename = JSON.stringify(document.getElementById("workingFile").innerHTML);

        $.ajax(
            {


                url: "/Annotations/DeleteAllData",
                type: 'get',
                data: filename,
                dataType: "String",
                contentType: "application/json",
                traditional: true,
                error: function (request) {
                    alert(request.statusText);
                },
                success: function (result) {
                    note.innerHTML += "<li>All annotations deleted from server.</li>";

                }

            }
        );




    });
});







