let englishtext = "";
let hinditext = "";

// Initialize webcam
async function initWebcam() {
    const webcam = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;
    webcam.classList.remove('hidden');
    $('#upload-zone').addClass('hidden'); // Hide upload zone when using webcam
    $('#capture-button').removeClass('hidden'); // Show capture button
    $('#sendbutton').addClass('hidden'); // Hide submit button
}

// Capture photo from webcam
function capturePhoto() {
    const webcam = document.getElementById('webcam');
    const imagebox = $('#imagebox');
    const canvas = document.createElement('canvas');
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(webcam, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    imagebox.attr('src', imageData).removeClass('hidden');
    $('#retake-button').removeClass('hidden'); // Show retake button
    $('#capture-button').addClass('hidden'); // Hide capture button
    $('#sendbutton').removeClass('hidden'); // Show submit button
}

// Retake photo
function retakePhoto() {
    $('#imagebox').addClass('hidden'); // Hide the image box
    $('#retake-button').addClass('hidden'); // Hide retake button
    $('#capture-button').removeClass('hidden'); // Show capture button again
}

// Toggle upload zone visibility
function toggleUploadZone() {
    $('#upload-zone').toggleClass('hidden');
    $('#webcam').addClass('hidden'); // Hide webcam when using upload
    $('#capture-button').addClass('hidden'); // Hide capture button
    $('#sendbutton').removeClass('hidden'); // Show submit button
}

// Process the image
function processImage() {
    englishtext = "";
    hinditext = "";
    hideInterface();

    const imagebox = $('#imagebox');
    const input = $('#imageinput')[0];
    let formData = new FormData();

    if (input.files && input.files[0]) {
        formData.append('image', input.files[0]);
    } else {
        const imageData = imagebox.attr('src').split(',')[1]; // Get base64 data
        const byteString = atob(imageData);
        const ab = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ab[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/jpeg' });
        formData.append('image', blob);
    }

    $.ajax({
        url: "http://localhost:8080/detectObject",
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        error: function(data) {
            console.log("upload error", data);
            updateInterface();
        },
        success: function(data) {
            console.log(data);
            const bytestring = data['status'];
            const image = bytestring.split('\'')[1];
            englishtext = data['englishmessage'];
            hinditext = data['hindimessage'];
            imagebox.attr('src', 'data:image/jpeg;base64,' + image);
            updateInterface();
        }
    });
}

// Handle file upload
function readUrl(input) {
    const imagebox = $('#imagebox');
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            imagebox.attr('src', e.target.result).removeClass('hidden');
            $('#sendbutton').removeClass('hidden'); // Show submit button
            $('#retake-button').addClass('hidden'); // Hide retake button
            $('#capture-button').addClass('hidden'); // Hide capture button
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function myResizeFunction2(y){
	if (y.matches) {
		imagebox.width(640);
		imagebox.height(640);
		// appName = $('.title-wrap');
		// appName.css({"font-size": "35px !important"}); //not working as expected
	}
	else {
		imagebox.width(940);
		imagebox.height(740);
		// appName = $('.title-wrap');
		// appName.css({"font-size": "50px !important"}) ; //not working
		// appName.style.fontSize = "50px"; // not working
	}
}
function myResizeFunction1(x) {
	imagebox = $('#imagebox');
	
	if(x.matches){
		imagebox.width(360);
		imagebox.height(360);
		// appName = $('.title-wrap');
		// appName.css({"font-size": "25px !important"})
	}
	else{ 
		let y = window.matchMedia("(max-width:1050px)");
		myResizeFunction2(y);
		y.addListener(myResizeFunction2);//attach event listener on every change
	}
}
function resizeImage(){
	
	let x = window.matchMedia("(max-width:700px)");
	myResizeFunction1(x);
	x.addListener(myResizeFunction1);
	
}

function hideInterface(){
	$(".loading").hide();
	let progresstext = document.querySelector('.text');
	progresstext.style.display = "none";//hide completed text
	hideButtons();
	function hideButtons(){
		$("#voice-english-output").hide();
		$("#voice-hindi-output").hide();
	}
}

function updateInterface(){
	$(".loading").show();
	progress();

	// show voice output after 18s approx
	setTimeout(
		function () {
			showTarget();
		}, 10000
	);

	function showTarget() {
		$("#voice-english-output").show();
		$("#voice-hindi-output").show();
	}
}

function progress() {
	let percent = document.querySelector('.percent');
	let progress = document.querySelector('.progress');
	let text = document.querySelector('.text');
	let count = 12;//4
	let per = 8;//16
	let loading = setInterval(animateProgress, 100);

	function animateProgress() {
		if (count == 100 && per == 360) {
			percent.classList.add("text-blink")
			percent.innerText = "Audio File Generated!! Click Get Speech Out"
			percent.style.fontSize = "20px";

			text.style.display = "block";
			clearInterval(loading);
		}
		else {
			per = per + 4;
			count = count + 1;
			progress.style.width = per + 'px';
			// percent.textContent = count + '%';
			percent.innerText = count + '%';
		}
	}
}

function changeColor(){
	let sendButton = document.querySelector("#sendbutton");
	// let sendButton = document.getElementById("sendbutton");
	sendButton.style.backgroundColor = "orange";
	sendButton.style.color = "black";
}