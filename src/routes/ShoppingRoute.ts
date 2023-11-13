import express, { Request, Response, NextFunction } from 'express'
import { GetAvialableOffers, GetFoodAvailibility, GetFoodIn30Min, GetResturantById, GetTopResturant, SearchFood } from '../controllers';

const router = express.Router();
/*  Food Avaialibity  */
router.get('/:pincode', GetFoodAvailibility)

/*  Top Resturants  */
router.get('/top-resturant/:pincode', GetTopResturant)

/*  Food Avaialible in 30 min  */
router.get('/food-in-30-min/:pincode', GetFoodIn30Min)

/*  Search Foods  */
router.get('/search/:pincode', SearchFood)

/*  By Resturant By Id */
router.get('/restuant/:id', GetResturantById)

/* Get available offers */
router.get('/offers/:pincode', GetAvialableOffers)

export { router as ShoppingRoute };