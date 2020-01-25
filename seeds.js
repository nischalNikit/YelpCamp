//Packages
var mongoose = require("mongoose");

//Schema
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

//Seed Data
var data = [
    {
        name:"Clouds Rest",
        image:"https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=753&q=80",
        description:"Bacon ipsum dolor amet bresaola pork pork chop fatback ball tip chicken tri-tip drumstick t-bone chislic ground round bacon tenderloin beef ribs. Bacon pork belly t-bone rump chuck meatloaf filet mignon. Meatloaf picanha swine fatback bacon. Chislic tenderloin meatloaf, cupim turducken ball tip buffalo leberkas flank venison fatback kielbasa. Hamburger biltong shank brisket, alcatra leberkas turducken filet mignon pork loin pig ribeye. Brisket pancetta ribeye spare ribs chislic venison ham jerky shank shoulder kielbasa short loin sirloin cow bresaola."
    },
    {
        name:"Honey Nectar",
        image:"https://images.unsplash.com/photo-1474490734583-97db53a03902?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=749&q=80",
        description:"Bacon ipsum dolor amet bresaola pork pork chop fatback ball tip chicken tri-tip drumstick t-bone chislic ground round bacon tenderloin beef ribs. Bacon pork belly t-bone rump chuck meatloaf filet mignon. Meatloaf picanha swine fatback bacon. Chislic tenderloin meatloaf, cupim turducken ball tip buffalo leberkas flank venison fatback kielbasa. Hamburger biltong shank brisket, alcatra leberkas turducken filet mignon pork loin pig ribeye. Brisket pancetta ribeye spare ribs chislic venison ham jerky shank shoulder kielbasa short loin sirloin cow bresaola."
    },
    {
        name:"Thunder Escape",
        image:"https://images.unsplash.com/photo-1510002507184-45227b3a3524?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80",
        description:"Bacon ipsum dolor amet bresaola pork pork chop fatback ball tip chicken tri-tip drumstick t-bone chislic ground round bacon tenderloin beef ribs. Bacon pork belly t-bone rump chuck meatloaf filet mignon. Meatloaf picanha swine fatback bacon. Chislic tenderloin meatloaf, cupim turducken ball tip buffalo leberkas flank venison fatback kielbasa. Hamburger biltong shank brisket, alcatra leberkas turducken filet mignon pork loin pig ribeye. Brisket pancetta ribeye spare ribs chislic venison ham jerky shank shoulder kielbasa short loin sirloin cow bresaola."
    }
]


//Removing all the data in the database
function seedDB() {
    Campground.deleteMany({},function(error){
        if(error){
            console.log("Error!");
        }

        else {
            console.log("Removed Campgrounds data.");
            //Add some campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(error,newCampground){
                    if(error){
                        console.log("Error!");
                    }
                    else{
                        Comment.create({
                            text:"Bacon ipsum dolor amet landjaeger rump ball tip capicola t-bone.",
                            author:"Homer"
                        },function(error,comment){
                            if(error){
                                console.log("Error");
                            }
                            else{
                                newCampground.comments.push(comment);
                                newCampground.save();
                                console.log("Created new Campgrounds data");
                            }
                        });
                    }
                });
            });
        }    
    });
}

//Exporting the function
module.exports = seedDB;


