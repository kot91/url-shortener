
module.exports = function(app,db){
    //lookup url, attempt to redirect
    app.route('/:url')
    .get(handleGet);
    
    //get everything after /new/ and send it to handlePost. Verification occurs in handlePost
    app.get('/new/*', handlePost);
    
    
    //find the url and redirect
    function handleGet(req, res){
        var url = process.env.APP_URL + '/'+ req.params.url;
        console.log(url);
        if (url != process.env.APP_URL + 'favicon.ico'){
            findUrl(url, db, res);
        }
    }
    
    //submit url to db and redirect to shortened url
    function handlePost(req, res){
        var urlObj = {};
        var url = req.params[0];
        if (validateURL(url)){
            urlObj = {
                "original_url": url,
                "shortened_url": process.env.APP_URL + '/' +  linkGen()
            };
            res.send(urlObj);
            save(urlObj, db);
        }
        else
        {
            urlObj = {
                "error": "wrong url format. Ensure valid protocol and actual website."
            };
            res.send(urlObj);
        }
    }
    
    function save(obj, db){
      db.collection('sites').save(obj, function(err, result){
          if (err) throw err;
      });
    }
    
    //does the short-url exist in db?
    function findUrl(url, db, res){
        db.collection('sites').findOne({shortened_url: url}, function(err, result){
            if (err) throw err;
            
            if (result){
                res.redirect(result.original_url);
            }
            else{
                res.send({"error": "url not found in db."});
            }
            
        });
    }

    
    //generates a 4 digit key that will be associated with the original link and appended on to https://jt-urlshortener.herokuapp.com/ to redirect
    function linkGen() {
        // Generates random four digit number for link
        var num = Math.floor(100000 + Math.random() * 900000);
        return num.toString().substring(0, 4);
    }

      function validateURL(url) {
        // Checks to see if it is an actual url
        // Regex from https://gist.github.com/dperini/729294
        var regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        return regex.test(url);
    }
    
};
