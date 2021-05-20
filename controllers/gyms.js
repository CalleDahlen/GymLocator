const Gym = require('../models/gym');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    //find all gyms
    const gyms = await Gym.find({});
    //render the index template of gyms and send gyms with it.
    res.render('gyms/index', { gyms });
};

module.exports.renderNewForm = (req, res) => {
    res.render('gyms/new');
};

module.exports.createGym = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send()

    const gym = new Gym(req.body.gym);
    gym.geometry = geoData.body.features[0].geometry;
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.author = req.user._id;
    await gym.save();
    console.log(gym);
    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`);
};

module.exports.showGym = async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(gym);
    if (!gym) {
        req.flash('error', 'Cannot find that gym');
        return res.redirect('/gyms')
    }
    res.render('gyms/show', { gym });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash('error', 'Cannot find that gym');
        return res.redirect('/gyms')
    }
    res.render('gyms/edit', { gym });

};

module.exports.editGym = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    //find the gym by id then spread the infomation from the edit form which we grouped by gym
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.images.push(...imgs);
    gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated the gym!')
    res.redirect(`/gyms/${gym._id}`);

};

module.exports.deleteGym = async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    req.flash('success', 'Successfully removed gym!')
    res.redirect('/gyms');
};