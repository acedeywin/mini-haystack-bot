As one might expect, this code makes a request to the GitHub API to fetch my user data. It then parses the response, outputs the number of public repos attributed to my GitHub account and finally prints “Hello!” to the screen. Execution goes from top to bottom.

Contrast that with the equivalent JavaScript version:

fetch('https://api.github.com/users/jameshibbard')
  .then(res => res.json())
  .then(json => console.log(json.public_repos));
console.log("Hello!");
