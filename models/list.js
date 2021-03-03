const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});
// use a virtual to insert /w_200 to our url to add parameters to the image size in cloudinary
// now we have access to img.thumbnail instead of img.url in edit.ejs
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200')
});

const opts = { toJSON: { virtuals: true } };


const BucketListSchema = new Schema({
    title: String,
    images: [ImageSchema],
    // the geometry is for working with mapbox to get the geolocation of a place and store it in mongo 
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


BucketListSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/lists/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});



BucketListSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
// deletes all reviews for a BucketList adventure when the adventure is deleted
/* 
the id for review, is somewhere in doc.reviews is what the deletaMany() function
is saying 
*/

module.exports = mongoose.model('BucketList', BucketListSchema);