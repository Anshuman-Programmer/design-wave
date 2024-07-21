import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import user from './users'
import image from './images'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.get('/test/:123', (c) => {
    console.log(c.req.param(""))
    return c.json({
        message: 'Hello Next.js!',
    })
})

const routes = app
    .route("/user", user)
    .route("/image", image)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes