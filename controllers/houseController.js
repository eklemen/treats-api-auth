import db from './../models';
export const houseController = {};

houseController.post = (req, res) => {
    // const { userId } = req.body;
    const house = new db.House();
    house.save().then( newHouse => {
        return res.status(200).json({
            success: true,
            data: newHouse
        })
    }).catch( err => {
        return res.status(500).json({
            message: err
        })
    })
};

houseController.getAll = (req, res) => {
    db.House.find({})
        .then( houses => {
            return res.status(200).json({
                success: true,
                data: houses
            });
        }).catch( err => {
        return res.status(500).json({
            message: err
        });
    });
};

houseController.submitVote = (req, res) => {
    const { params: { id }, body } = req;
    db.House.findByIdAndUpdate({_id: id},
        { "$push": { votes: body } },
        (err, data) => {
            // console.log('data', data);
            data.votes.push(body);
            if(err || body.vote === 0) {
                return res.status(500).json({
                    error: err || 'Number must be 1 or -1'
                });
            }
            return res.status(200).json({
                success: true,
                data
            })
    })
};

export default houseController;