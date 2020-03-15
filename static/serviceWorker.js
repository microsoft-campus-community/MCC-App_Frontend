self.addEventListener('install', function(event) {
	var offlinePage = new Request('offline');
	event.waitUntil(
	  fetch(offlinePage).then(function(response) {
		return caches.open('pwabuilder-offline').then(function(cache) {
		  return cache.put(offlinePage, response);
		});
	}));
  });
  
  //If any fetch fails, it will show the offline page.
  //Maybe this should be limited to HTML documents?
  
  self.addEventListener('fetch', function(event) {
	event.respondWith(
	  fetch(event.request).catch(function(error) {
		return caches.open('pwabuilder-offline').then(function(cache) {
		  return cache.match('offline');
		});
	  }
	));
  });
  
  self.addEventListener("activate", event => {
  });