const Topic = require('../models/topic');

module.exports.newTopic = async (req, res) => {
    const {topics} = req.body;

    if(!topics) throw new ExpressError('No topic', 400);
    if(topics === "Unknown") throw new ExpressError('Cannot create topic called Unknown', 400);

    const newTopic = new Topic({
        name: topics,
        user: req.user._id
    })
    
    await newTopic.save();
    res.redirect('/setup');
}

module.exports.deleteTopic = async (req, res) => {
    const {topicId} = req.params;
 
    const topic = await Topic.findById(topicId)
    await topic.remove();

    res.redirect('/setup');
}