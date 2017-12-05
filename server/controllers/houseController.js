import db from '../models';
export const houseController = {};

houseController.post = (req, res) => {
    const { decoded, body: { position } } = req;
    if(
        !position ||
        !position.lat ||
        !position.long
    ) {
        return res.status(422).json({
            success: false,
            error: 'Must provide a `position` object with `lat` and `long`'
        })
    }
    const house = new db.House();
    house.creator = decoded;
    house.votes.push({ vote: 1, creator: decoded });
    house.position = position;
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

houseController.getOne = (req, res) => {
    const { id } = req.params;
    db.House.findById(id)
        .then( house => {
            if(house === null) {
                return res.status(404).json({
                    success: false,
                    error: `Not Found: No house with id: '${id}'`
                })
            }
            return res.status(200).json({
                success: true,
                data: house
            });
        }).catch( err => {
        return res.status(500).json({
            message: err
        });
    });
};

// TODO prevent revotes from same person
houseController.submitVote = (req, res) => {
    const { params: { id }, body, decoded } = req;
    db.House.findOne({ _id: id, "votes.creator": decoded })
        .then(vote => {
            if(vote !== null) {
                db.House.update(
                    { _id: id, "votes.creator": decoded },
                    { $set: {"votes.$.vote": body.vote} },
                    { new: true },
                    (error, data) => {
                        if(error){
                            return res.status(500).json({
                                success: false,
                                error
                            })
                        }
                        if(data) {
                            return res.status(200).json({
                                success: true,
                                data: 'Vote updated!'
                            })
                        }
                    })
            } else {
                db.House.update(
                    { _id: id },
                    { $push: {"votes": { vote: body.vote, creator: decoded }} },
                    { new: true },
                    (error, data) => {
                        if(error){
                            return res.status(500).json({
                                success: false,
                                error
                            })
                        }
                        if(data) {
                            return res.status(200).json({
                                success: true,
                                data: 'New vote added!'
                            })
                        }
                    })
            }
        });
};

export default houseController;