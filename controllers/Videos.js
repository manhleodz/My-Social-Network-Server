const { Videos } = require("../models");

const postVideos = async (req, res, next) => {
    try {
        const data = req.body.link;
        const PostId = req.body.PostId;
        const UserId = req.user.id;

        const listVideos = []

        data.map(video => (
            listVideos.push({
                link: video,
                UserId: UserId,
                PostId: PostId
            })
        ))

        await Videos.bulkCreate(listVideos);

        res.status(200).json("Upload successful");
    } catch (err) {
        res.status(400).json({
            message: "Upload failed",
            error: err.message
        });
    }
}

module.exports = {
    postVideos
}