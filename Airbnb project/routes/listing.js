const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// index Route:
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

// new route:
router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new.ejs");
})

// Show Route:
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "This listing doesnot exists!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}))

// create route:
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing added ✔ ");
    res.redirect("/listings");
})
);

// edit route:
router.get("/:id/edit",isLoggedIn,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing doesnot exists!");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}))

// update route:
router.put("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Changes saved ✔ ");
    res.redirect(`/listings/${id}`);
}))

// delete route:
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully ✔ ");
    res.redirect("/listings");
}))

module.exports = router;