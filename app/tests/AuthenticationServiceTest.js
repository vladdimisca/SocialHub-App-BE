var chai = require('chai');
const assert = chai.assert;

describe('User Storage Test', function() {
    it('Registers a dummy user', async () => {
        result = await authenticationService.register(dummyUser);
        assert(result instanceof Error === false, "An error occured during register");
    })

    it('Checks if user is registered twice', async () => {
        var error;
        try{
            result = await authenticationService.register(dummyUser);
        }catch(err){
            error = err;
        }

        assert(error.code === 402);
    })

    it('Deletes user table', async () => {
        result = await userStorageService.storageIsInitiated();
        assert( result === true);
        result = await userStorageService.storageDelete();
        result = await userStorageService.storageIsInitiated();
        assert( result === false);
    })
})