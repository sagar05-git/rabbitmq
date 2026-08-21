// export const TryCatch = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             console.error('Error in TryCatch:', error);
//             next(error);
//         }
//     };
// };

export const TryCatch = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error in TryCatch:', error);
            next(error);
        }
    };
};