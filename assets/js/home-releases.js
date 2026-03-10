(function () {
  var dataTag = document.getElementById("homeReleasesData");
  var container = document.getElementById("homeReleases");
  if (!dataTag || !container) return;

  var releases = [];
  try {
    releases = JSON.parse(dataTag.textContent || "[]");
  } catch (e) {
    return;
  }

  if (!Array.isArray(releases) || releases.length === 0) return;

  for (var i = releases.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = releases[i];
    releases[i] = releases[j];
    releases[j] = temp;
  }

  var picks = releases.slice(0, 2);
  var html = picks
    .map(function (release) {
      var title = release.title || "Untitled";
      var url = release.url || "#";
      var label = release.label || "release";
      var description = release.description || "";

      return (
        "<div class=\"release-card\" role=\"listitem\">" +
        "<div class=\"release-card-header\">" +
        "<a class=\"release-title\" href=\"" +
        url +
        "\">" +
        title +
        "</a>" +
        "<span class=\"release-tag\">" +
        label +
        "</span>" +
        "</div>" +
        "<p class=\"release-desc\">" +
        description +
        "</p>" +
        "</div>"
      );
    })
    .join("");

  container.innerHTML = html;
})();
