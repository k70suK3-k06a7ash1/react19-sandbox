// @ts-ignore
import { useActionState, useOptimistic, use, cache } from "react";
import { Effect, Either } from "effect";
import { Schema } from "@effect/schema";
import { createContext, Suspense } from "react";

const SiteContext = createContext({ name: "" });

const ApiResponse = Schema.Struct({ title: Schema.String });

interface ApiResponse extends Schema.Schema.Type<typeof ApiResponse> {}

const program: Effect.Effect<ApiResponse, Error> = Effect.gen(function* (_) {
  const response = yield* Effect.tryPromise({
    try: () => fetch("https://syntax.fm/api/shows/latest"),
    catch: () => new Error("failed"),
  });
  if (!response.ok) {
    return yield* Effect.fail(new Error());
  }
  const json = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: () => new Error("error"),
  });
  return yield* _(
    json,
    Schema.decodeUnknownEither(ApiResponse),
    Either.mapLeft(() => new Error())
  );
});

function Footer() {
  const { name } = use(SiteContext);
  return (
    <footer>
      <p>©{name}</p>
    </footer>
  );
}

const Podcast = () => {
  const podcast = use<ApiResponse>(Effect.runPromise(program));

  return (
    <>
      <h2>{podcast.title}</h2>
      <meta property="og:title" content={podcast.title} />
    </>
  );
};
function App() {
  return (
    // @ts-ignore
    <SiteContext value={{ name: "Bob" }}>
      <Suspense fallback={<>loading</>}>
        <Podcast />
      </Suspense>
      <Footer />
    </SiteContext>
  );
}

export default App;
