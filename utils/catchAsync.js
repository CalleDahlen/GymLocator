
//Create a function that accepts another function and runs it then, if need be will catch errors and pass them to next.
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);

    }
}