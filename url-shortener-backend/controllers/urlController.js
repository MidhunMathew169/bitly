const Url = require('../models/Url');
const { nanoid } = require('nanoid');

//
exports.createShortUrl = async (req,res) => {
    try {
        const { originalUrl } = req.body;
        let formattedUrl = originalUrl;

        if(!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            formattedUrl = "https://" + originalUrl;
        }
        
        if (!originalUrl) {
        return res.status(400).json({
            success:false,
            message: "Original URL is required" 
            });
        }

        //generate unique short id
        const shortId = nanoid(8);

        const newUrl = new Url({
            user: req.user.id,
            originalUrl: formattedUrl,
            shortId
        });

        await newUrl.save();

        //build full shortened link
        const fullShortUrl = `${process.env.BASE_URL}/${shortId}`;

        res.status(201).json({
            success: true,
            message: 'URL shortened successfully',
            shortUrl: fullShortUrl,
            url: newUrl,
            clicks: newUrl.clicks,
            createdAt: newUrl.createdAt
        });
    } catch (error) {
        console.error("Error creating short URL:",error);
        res.status(500).json({
            success:false,
            message:'Server error'
        })
    }
}

//Get all URLs for logged-in user
exports.getUserUrls = async (req,res) => {
    try {
        const urls = await Url.find({ user:req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            count: urls.length,
            urls
        });
    } catch (error) {
        console.error("Error fetching user URLs:", error);
        res.status(500).json({ message: "Server error" });
    }
}

//Redirect to original URL
exports.redirectToUrl = async (req,res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({shortId});

        if(!url){
            return res.status(404).json({
            success: false,
            message: 'URL not found'
            });
        }

        //increment clicks
        url.clickCount += 1;
        await url.save();

        res.redirect(url.originalUrl);

    } catch (error) {
        console.error('Redirect error:',error);
        res.status(500).json({
            success: false,
            message: 'Error redirecting to URL'
        });
    }
};

//Delete a URL
exports.deleteUrl = async(req,res) => {
    try {
        if(!req.params.id){
            return res.status(400).json({
                success: false,
                message: 'URL ID is required'
            });
        }

        const url = await Url.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if(!url){
            return res.status(404).json({
            success: false,
            message: 'URL not found or unauthorized'
            });
        }

        await url.deleteOne();

        res.json({
            success: true,
            message: 'URL deleted successfully'
        });
    } catch (error) {
        console.error('Delete URL error:',error);
        res.status(500).json({
            success: false,
            message: 'Error deleting URL'
        });
    }
};