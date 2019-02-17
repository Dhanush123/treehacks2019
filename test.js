var request = require("request");

var options = {
    method: 'POST',
    url: 'https://gateway.watsonplatform.net/visual-recognition/api/v3/classify',
    qs:
    {
        url: 'https://firebasestorage.googleapis.com/v0/b/treehacks2018-59cb6.appspot.com/o/142db025-e044-4c70-be0c-7dc127c7a1e2.jpg?alt=media',
        token: 'ceb11960-67a9-4343-bb10-7d54110238d9',
        version: '2016-05-17%0A'
    },
    headers:
    {
        'Postman-Token': '8d959d16-d517-4dd8-8e0d-14b9eb800407',
        'cache-control': 'no-cache',
        Authorization: 'Basic YXBpa2V5Ok5JMTI3aVd0LW5TUERVWlE5eS02U2h2TGxkR2ZMUnJsQ1hYRkxJZDN5aFpf',
        'Content-Type': 'application/json',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: { apikey: 'NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ' }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});