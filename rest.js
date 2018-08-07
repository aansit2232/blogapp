var dotenv=require("dotenv");
   dotenv.config();
var express=require("express"),
    mongoose=require("mongoose"),
    bodyparser=require("body-parser"),
    app=express(),
    expresssanitizer=require("express-sanitizer"),
    methodoverride=require("method-override");

//APP CONFIGR
var url=process.env.DATABASEURL||"mongodb://localhost/blogapp"
mongoose.connect(url);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));

// mongoose/model config
var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});
var Blog=mongoose.model("blogs", blogschema);


//Restfull routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,item){
        if(err){
            console.log(err);
        }
        else{
             res.render("index",{blogs:item});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});
// CREATE ROUTE
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err,item){
      if(err){
          res.render("new");
      } 
      else{
           res.redirect("/blogs");
         }
   });
});
// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    var Id=req.params.id;
    Blog.findById(Id,function(err,item){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blogs:item});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,founditem){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blogs:founditem});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    //console.log(req.body.blog.title);
Blog.findByIdAndUpdate(req.params.id , req.body.blog,function(err,updateitem){
    if(err){
        res.redirect("/blogs");
    }
    else{
        //console.log(updateitem);
        res.redirect("/blogs/"+ req.params.id);
    }
});
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});
//console.log(process.env.PORT);
app.listen((process.env.PORT)||3000,function(){
    console.log("server is connected");
});

