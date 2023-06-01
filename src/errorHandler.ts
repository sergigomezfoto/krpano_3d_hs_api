// Middleware dels errors
const errorHandler = (err, req, res, next) => {
    console.error(err); 
    res.status(500).json({ error: err.message }); 
  };
  
  // carregarnos try-catch
  const queryErrorHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);


export { errorHandler, queryErrorHandler };
