export const printRoutes = (app, basePath = '') => {
    console.log('Accessible Routes:');

    const  cleanPath = (path) => {
        return path
            .replace(/\^/g, '') // Remove leading ^
            .replace(/\(\?=.+?\)/g, '') // Remove (?=...) expressions
            .replace(/\\\//g, '/') // Replace escaped slashes
            .replace(/\?\(\=\/\|.*?\)\$/, '') // Remove optional endings
            .replace(/\?\(\=\/\|.*?\)/g, '') // Remove optional in-betweens
            .replace(/\/?\?$/, ''); // Remove trailing /?
    }


    const listRoutes = (stack, currentPath) => {
        stack.forEach((middleware) => {
            if (middleware.route) {
                // Direct route
                const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
                console.log(`[${methods}] ${currentPath}${cleanPath(middleware.route.path)}`);
            } else if (middleware.name === 'router' || middleware.handle.stack) {
                // Nested router
                const nestedPath = middleware.regexp?.source ? cleanPath(middleware.regexp.source) : '';
                listRoutes(middleware.handle.stack, currentPath + nestedPath);
            }
        });
    }

    listRoutes(app._router.stack, basePath);
}
