const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utilis/appError');
const catchAsync = require('../utilis/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //get tour data from collection
  const tours = await Tour.find();
  //build template

  //render template

  res.status(200).render('overview', {
    tours,
    title: 'All Tours',
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name ', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name}  Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
