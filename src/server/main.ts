import Koa from "koa";
import Router from "@koa/router";

const port = Number(process.env.PORT || "5000");
const app = new Koa();

const router = new Router();
router.get("/listings", async (ctx) => {
  ctx.body = `Root listing`;
});
router.get("/listing/:id", async (ctx) => {
  ctx.body = `Listing ${ctx.params.id}`;
});

app.use(router.routes());

app.listen(port);

console.log(`Running API on port ${port}`);
