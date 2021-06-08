var Youtube = require('youtube-node');
var youtube = new Youtube();

var keyword = 'FOSS4G';
var limit = 10;

var items;
var item;
var title;
var id;
var URL;

    youtube.setKey('ここに入力');

    youtube.addParam('order', 'viewCount');
    youtube.addParam('type', 'video');
    youtube.addParam('regionCode', 'JP');

    youtube.search(keyword, limit, function(err, result) {
        if (err) { console.log(err); return; }
            items = result["items"];
            for (var i in items) {
                item = items[i];
                title = item["snippet"]["title"];
                id = item["id"]["videoId"];
                URL = "https://www.youtube.com/watch?v=" + id;

                console.log("title : " + title);
                console.log("URL : " + URL);
                console.log("-------------------------------");
            }
    })