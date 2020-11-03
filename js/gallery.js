(function() {

  var _galleryURL = app.galleryURL;
  var _imgURL = app.imgURL;
  var _accessControlAllowOrigin = app.storageAccessControlAllowOrigin;

  // lazy load gallery images
  function lazyLoadImages() {
    const observer = new IntersectionObserver((entries, observer) => {
      for (entry of entries) {
        if (entry.isIntersecting && !entry.target.getAttribute('src')) {
          entry.target.setAttribute('src',  entry.target.getAttribute('data-src'));
        }
      }
    },
    {threshold: 0.1});
    const targets = document.querySelectorAll("img", "#gallery");
    console.log(targets);
    for (target of targets) {
      observer.observe(target);
    };
  }

  // add gallery images
  function generate(images, imgURL) {
    var gallery = document.getElementById('gallery');
    var row = document.createElement("div");
    row.className = "row";
    var i = 0;
    var len = images.length;
    var filename = '';
    while (i < len) {
      filename = images[i];
      var a = document.createElement("a");
      a.href = imgURL + filename;
      a.setAttribute('data-fslightbox', 'gallery');
      a.className = "col-xs-12 col-sm-6 col-md-4 col-lg-3";
      var img = document.createElement("img");
      // img.src = imgURL + filename;
      img.setAttribute('data-src', imgURL + filename);
      img.alt = filename;
      a.appendChild(img);
      row.appendChild(a);
      i++;
    }
    gallery.appendChild(row);
    lazyLoadImages();
    refreshFsLightbox();
  }

  fetch(`${_galleryURL}`, {
    headers: {
      "Accept": "application/json",
      'Access-Control-Allow-Origin': _accessControlAllowOrigin
    },
  })
  .then(
    function(response) {
      if (response.status !== 200) {
        console.warn('Oops there was a problem. Status Code: ' +
          response.status);
        return;
      }

      response.json().then(function(data) {
        generate(data.images, _imgURL);
      });
    }
  )
  .catch(function(err) {
    console.error('Fetch Error: ', err);
  });

})();