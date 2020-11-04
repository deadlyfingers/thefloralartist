(function() {

  var _accessControlAllowOrigin = app.functionsAccessControlAllowOrigin;
  var _postContactFormURL = app.postContactFormURL;

  function handleSubmit(event) {
    event.preventDefault();
    var formData = new FormData(this);
    const json = JSON.stringify(Object.fromEntries(formData));
    send(json);
  };

  function send(body) {
    fetch(`${_postContactFormURL}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/plain",
        'Access-Control-Allow-Origin': _accessControlAllowOrigin
      },
      body
    })
    .then(
      function(response) {
        if (response.status === 200 || response.status === 202) {
          response.text().then(function(data) {
            showMessage(data);
          });
        } else {
          showMessage('Oops there was a problem. Status Code: ' +
          response.status);
          return;
        }
      }
    )
    .catch(function(err) {
      console.error('Fetch Error: ', err);
      showMessage(err);
    });
  }

  function showMessage(message) {
    contactElement.setAttribute('hidden', true);
    messageElement.textContent = message;
  }

  var messageElement = document.getElementById("message");
  var contactElement = document.getElementById("contact");
  contactElement.addEventListener("submit", handleSubmit.bind(contactElement));

})();