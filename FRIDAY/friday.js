if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        // microphone permission granted
      })
      .catch(function(error) {
        // microphone permission denied
      });
  }
  
  // Initialize a new instance of the SpeechRecognition API
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  // Get references to the HTML elements
  const micButton = document.getElementById('speak-btn');
  const responseArea = document.getElementById('response-area');
  
  // Add a click event listener to the mic button
  micButton.addEventListener('click', startSpeechRecognition);
  
  function startSpeechRecognition() {
    // Change the text on the mic button to indicate that the assistant is listening
    micButton.innerHTML = 'Listening...';
  
    // Start the SpeechRecognition API
    recognition.start();
  
    // Add an event listener for the onresult event
    recognition.onresult = function(event) {
      // Extract the transcribed text from the event results
      const transcript = event.results[0][0].transcript;
  
      // Send the transcribed text to the Python script using an AJAX request
      $.ajax({
        url: '/assistant',
        type: 'POST',
        data: { 'text': transcript },
        success: function(response) {
          // Display the response in the text area
          appendResponse(response);
        },
        error: function(xhr, status, error) {
          console.log(xhr.status + ' ' + error);
        }
      });
    }
  
    // Add an event listener for the onend event
    recognition.onend = function() {
      // Change the text on the mic button back to the original text
      micButton.innerHTML = 'Speak';
  
      // Reset the SpeechRecognition API
      recognition.stop();
    }
  }
  
  function appendResponse(response) {
    // Create a new paragraph element to display the response
    const paragraph = document.createElement('p');
  
    // Set the text of the paragraph element to the response
    paragraph.textContent = response;
  
    // Append the paragraph element to the response area
    responseArea.appendChild(paragraph);
  }
  