const mongoose = require('mongoose');
//To have acess to mongoose.schema more easily
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } }
// create our Schemas
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    //replace every img url to add a custom width
    return this.url.replace('/upload', '/upload/w_200');
});

const GymSchema = new Schema({
    title: String,
    images: [ImageSchema],
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

GymSchema.virtual('properties.popUpMarkup').get(function () {

    return `<strong><a href="/gyms/${this._id}">${this.title} </a><strong>`;
});

GymSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Gym', GymSchema);