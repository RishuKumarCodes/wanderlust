const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Post review Route:
router.post("/", validateReview, async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    console.log(req.body.review)
    await newReview.save();
    req.flash("success", "Review posted ✔ ");
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})

//delete review route:
router.delete("/:reviewId",
    wrapAsync(async(req, res)=>{
        let {id, reviewId} = req.params;
        
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review removed ");
        res.redirect(`/listings/${id}`)
    }))

    module.exports = router;