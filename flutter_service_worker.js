'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "39f703dd18c5f848953d53eb642da348",
"assets/assets/code_icon_blue.png": "664ad81431fe783aada2993ec1956648",
"assets/assets/cpp_icon_blue.png": "e78a6bf1737b185040c672f3d3ee50e7",
"assets/assets/flutter_icon.png": "55dfd6cd822d6d0681cfcb1ed8d8155e",
"assets/assets/flutter_icon_blue.png": "b8b503b27798342524c1ed9e48ed050d",
"assets/assets/fortnite_home_screen_card_image.jpg": "09ee44fedca291fd5ba0fa640497d49c",
"assets/assets/fortnite_image.png": "e097339f603ac8f17026b18d4869702e",
"assets/assets/fortnite_logo.png": "57f3ee3603548ed9d223a5270fbd4103",
"assets/assets/github_icon.png": "6c7a68b9a1d30a61bbc31d8401f3dbd1",
"assets/assets/Glitter_lobby_music.mp3": "074799a637d7e1a8ee4b0f1ee548ed90",
"assets/assets/home_screen_about_me_card_image.jpg": "249a99468d55feebb370150f1f505626",
"assets/assets/home_screen_contact_me_card_image.jpg": "87f6009baa1d7016711a45acbf150bed",
"assets/assets/home_screen_sliver_appbar_image.jpg": "8a11c9b164d008e213273fc9854841a3",
"assets/assets/html5_icon_orange.png": "26c88ed588aaaaa228f13aace04843b6",
"assets/assets/instagram_icon.png": "d25b387b5b8c27759c775d4863d4d742",
"assets/assets/javascript_icon_green.png": "f1e200054dc661cd33a8b71d51600048",
"assets/assets/java_icon.png": "8a06434f622a0bb8debe47706f2a10e5",
"assets/assets/linkedin_icon.png": "ee74670f87f81131e9ed93b7c7a7999e",
"assets/assets/me.jpg": "defb3baff04c2d50c50a1378f92a0d80",
"assets/assets/mongodb_icon.png": "72509ceb027d8350fdea5a628129da90",
"assets/assets/python_icon.png": "0a36a7ad451947483a7a3694f1db3414",
"assets/assets/SashankVisweshwaran-CB.EN.U4CSE18354.pdf": "f776b9068c83216c97a87c908197e960",
"assets/assets/sql_icon.png": "4e1696990fb88c1847b9fbad8ed10957",
"assets/assets/twitter_icon.png": "be208b45aee183c2c99cde94239cc150",
"assets/FontManifest.json": "578a90404d5c0ff560cf68099e7eac11",
"assets/fonts/JosefinSans-VariableFont_wght.ttf": "324a513cb9c683dc30777bdbccf59995",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/fonts/Quicksand-VariableFont.ttf": "f9baef8ac0d836e6486419e282e42336",
"assets/NOTICES": "ba9814e4c41efaeb3bf0e4528e6d2596",
"assets/packages/community_material_icon/fonts/materialdesignicons-webfont.ttf": "3e722fd57a6db80ee119f0e2c230ccff",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"favicon.png": "f3bcfa8898426c15d8a4beb6375d2957",
"icons/Icon-192.png": "c58675fa2ec8075bbadabea0372ebeb7",
"icons/Icon-512.png": "efc6b5e597dc0aa06adb09a93d2523d5",
"index.html": "85d38cdf619cb2107fc3f62233219f39",
"/": "85d38cdf619cb2107fc3f62233219f39",
"main.dart.js": "d55a5e801cf5c35df55003079a2a0bb2",
"manifest.json": "8829ec6f4483e1f7ac5cd815d98ee4e1",
"version.json": "b5e4cef367263d353610340132fad550"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
