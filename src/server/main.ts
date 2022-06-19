import Koa from "koa";

const port = Number(process.env.PORT || "5000");
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello world!";
});

app.listen(port);

console.log(`Running API on port ${port}`);
