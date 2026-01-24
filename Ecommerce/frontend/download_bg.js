import fs from 'fs';
import https from 'https';
import path from 'path';

const url = "https://media.istockphoto.com/id/1064083590/photo/winter-scene-snowfall-in-the-woods.jpg?s=2048x2048&w=is&k=20&c=g_2y97bBk_Jbc0IHGBIl9cjNH7iQSbcyW3Fr6oSmuRY=";
const dest = path.join('public', 'images', 'page-bg.jpg');

const file = fs.createWriteStream(dest);
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close();
        console.log("Download completed");
    });
}).on('error', function (err) {
    fs.unlink(dest, () => { });
    console.error("Error downloading image:", err.message);
});
