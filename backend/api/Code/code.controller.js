import Link from '../Links/link.model';

export function index(req, res) {
    try {
        return Link.findOne({urlCode: req.params.code})
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