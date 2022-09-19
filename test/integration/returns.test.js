const { mongoose } = require('mongoose');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');
const { Movie } = require('../../models/movie');
const moment = require('moment');

describe('/api/returns', () => {
   let server;
   let rental;
   let customerId;
   let movieId;
   let token;

   const exec = () => {
      return request(server)
         .post('/api/returns')
         .set('x-auth-token', token)
         .send({ customerId, movieId });
   };

   beforeEach(async () => {
      server = require('../../index');

      customerId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();

      const movie = new Movie({
         _id: movieId,
         title: 'title',
         genre: { name: 'genre' },
         numberInStock: 5,
         dailyRentalRate: 1,
      });
      await movie.save();

      rental = new Rental({
         customer: {
            _id: customerId,
            name: 'name1',
            phone: '123456',
         },
         movie: {
            _id: movieId,
            title: 'title',
            dailyRentalRate: 1,
         },
      });
      await rental.save();

      token = new User().generateAuthToken();
   });
   afterEach(async () => {
      await server.close();
      await Rental.deleteMany({});
      await Movie.deleteMany({});
   });

   it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
   });

   it('should return 400 if customerId not provided', async () => {
      customerId = '';
      const res = await exec();
      expect(res.status).toBe(400);
   });

   it('should return 400 if movieId not provided', async () => {
      movieId = '';
      const res = await exec();
      expect(res.status).toBe(400);
   });

   it('should return 404 if retal for customer/movie not found', async () => {
      await Rental.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
   });

   it('should return 400 if rental already processed', async () => {
      rental.dateReturned = Date.now();
      await rental.save();
      const res = await exec();
      expect(res.status).toBe(400);
   });

   it('should return 200 if rental succefuly returned', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
   });

   it('should set the returnDate is input is valid', async () => {
      const res = await exec();

      const rentalDb = await Rental.findById(rental._id);
      const diff = new Date() - rentalDb.dateReturned;
      expect(diff).toBeLessThan(10 * 1000);
   });

   it('should set the rentalFee if input is valid', async () => {
      rental.dateOut = moment().add(-7, 'days').toDate();
      await rental.save();

      await exec();

      const rentalDb = await Rental.findById(rental._id);
      expect(rentalDb.rentalFee).toBe(7);
   });

   it('should increase the movie stock if input is valid', async () => {
      let movie = await Movie.findById(rental.movie._id);
      const movieSockBefore = movie.numberInStock;
      await exec();

      movie = await Movie.findById(rental.movie._id);
      const movieSockAfter = movie.numberInStock;
      expect(movieSockAfter).toBeGreaterThan(movieSockBefore);
   });

   it('should return the rental if input is valid', async () => {
      const res = await exec();

      const rentalDb = await Rental.findById(rental._id);
      expect(Object.keys(res.body)).toEqual(
         expect.arrayContaining([
            'dateOut',
            'dateReturned',
            'rentalFee',
            'customer',
            'movie',
         ])
      );
   });
});
