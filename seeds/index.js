const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const List = require('../models/list');

mongoose.connect('mongodb://localhost:27017/bucket-list', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await List.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const list = new List({
            // YOUR USER ID
            author: '603802daee57074a857d08e8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error nisi dignissimos rerum tempore et vero, repellat possimus quisquam, maiores atque molestiae tenetur magnam qui illum, inventore impedit ab dolorum suscipit.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/droq6k9sk/image/upload/v1614352695/BucketList/sni4xhu8fkskwm2ugo7d.jpg',
                    filename: 'BucketList/sni4xhu8fkskwm2ugo7d'
                },
                {
                    url: 'https://res.cloudinary.com/droq6k9sk/image/upload/v1614352695/BucketList/i6bdowbqkxsnieq5nokl.jpg',
                    filename: 'BucketList/i6bdowbqkxsnieq5nokl'
                }
            ]
        })
        await list.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})