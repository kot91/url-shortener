//route to urlshortener as either homepage, shortened URL or new URL
module.exports = function(app, db){
    app.route('/')
    .get(function(req, res){
        res.sendfile('index.html');
    });
    
    
    app.route('/new')
    .get(function(req, res){
       res.render('index', {
           err: "Error: You need to add a proper url"
       }); 
    });
};

