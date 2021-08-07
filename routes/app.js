const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to using static files
router.use(express.static('public'));


// GET request for app route (public page)
router.get('/', (req, res) => {
    console.log(req.session.info);
    res.render('app', req.session.info);
})


// GET request for user profile
router.get('/dashboard', (req, res) => {
    res.render('dashboard', req.session.info);
})



// POST router to get bids and bidders
router.post('/', (req, res) => {

    // getting the updated amount itemname and the bidder name
    const {bidAmount, itemname, username} = req.body;

    // now we search through the bid schema and find the item with itemname
    Bid.findOneAndUpdate({bidname: itemname},

        {
            bidprice: bidAmount,

            // pushing the username and bidding amount to the existing array
            $push: {
                bidders: {username: username, bidAmount: bidAmount}
            }
        })
        .then(bid => {
            
            Bid.find({}, (err, bids) => {
                if (err) {
                    res.status('404').send('something went wrong');
                }

                req.session.info.bids = bids

                res.render('app', req.session.info);

            })

        })
        .catch(err => console.log(err))
        
})


module.exports = router;
