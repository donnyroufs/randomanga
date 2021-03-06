import expressLoader from './express';
import express from 'express'
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('../models/user').default,
  };
  const mangaModel = {
    name: 'mangaModel',
    model: require('../models/manga').default,
  };
  const dailyMangaModel = {
    name: 'dailyMangaModel',
    model: require('../models/daily-manga').default,
  };
  const mangaLikesModel = {
    name: 'mangaLikesModel',
    model: require('../models/manga-likes').default,
  };
  const randomListModel = {
    name: 'randomListModel',
    model: require('../models/random-list').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [userModel, mangaModel, dailyMangaModel, mangaLikesModel, randomListModel],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
