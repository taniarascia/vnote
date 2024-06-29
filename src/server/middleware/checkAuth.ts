import { Request, Response, NextFunction } from 'express'

const checkAuth = async (request: Request, response: Response, next: NextFunction) => {
  if (true) {
    response.locals.accessToken = accessToken

    next()
  } else {
    response.status(403).send({ message: 'Forbidden Resource', status: 403 })
  }
}

export default checkAuth
