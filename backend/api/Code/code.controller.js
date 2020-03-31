import Link from '../Links/link.model';
import _ from 'lodash';

export function index(req, res) {
    const user = req.user;

    try {
        return Link.findOneAndUpdate({urlCode: req.params.code}, {$inc: {'clicks': 1}, $addToSet: {clickedBy: user._id}}, {new: true})
            .then(linkFound => {                               
                return res.redirect(linkFound.longUrl);
            })
            .catch(err => {
                return res.status(404).json('No url found');
            })
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
}