const List = require('../models/list');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const lists = await List.find({}).populate('popupText');
    res.render('lists/index', { lists });
};

module.exports.renderNewForm = (req, res) => {
    res.render('lists/new');
};

module.exports.createAdventure = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.list.location,
        limit: 1
    }).send();
    const list = new List(req.body.list);
    list.geometry = geoData.body.features[0].geometry;
    list.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    list.author = req.user._id;
    await list.save();
    console.log(list);
    req.flash('success', 'Successfully made a new adventure!')
    res.redirect(`/lists/${list._id}`);
};

module.exports.showAdventure = async (req, res,) => {
    // a nested populate, we're saying populate all the reviews from the 
    // reviews array on the one campground we're finding, then populate on 
    // each one of them their author, and then seperately, populate the one 
    // author on this list in "List.findById"
    const list = await List.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!list) {
        req.flash('error', 'Cannot find that adventure!');
        return res.redirect('/lists');
    }
    res.render('lists/show', { list });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
        req.flash('error', 'Cannot find the adventure!');
        return res.redirect('/lists');
    }
    res.render('./lists/edit', { list });
};

module.exports.updateAdventure = async (req, res) => {
    const { id } = req.params;
    const list = await List.findByIdAndUpdate(id, { ...req.body.list }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    list.images.push(...imgs);
    await list.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // pull from the images array all images where the filename of that image is in req.body.deleteImages array
        await list.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated adventure!');
    res.redirect(`/lists/${list._id}`);
};

module.exports.deleteAdventure = async (req, res) => {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted adventure!');
    res.redirect('/lists');
};