// @ts-ignore
import { useActionState, useOptimistic, use, cache } from "react";
import { createContext, Suspense } from "react";

const SiteContext = createContext({ name: "" });

type PodcastShow = {
  title: string;
};
function Footer() {
  const { name } = use(SiteContext);
  return (
    <footer>
      <p>©{name}</p>
    </footer>
  );
}

const Podcast = cache(() => {
  const podcast = use(
    fetch("https://syntax.fm/api/shows/latest").then(
      (x) => x.json() as Promise<PodcastShow>
    )
  );

  return (
    <>
      <h2>{podcast.title}</h2>
      <meta property="og:title" content={podcast.title} />
    </>
  );
});
function App() {
  // const [name, setName] = useState(0);
  // const [optimisticName, setOptimisticName] = useOptimistic(name);
  // const [error, submitAction, isPending] = useActionState(async () => {
  //   const error = false;
  //   if (error) {
  //     // You can return any result of the action.
  //     // Here, we return only the error.
  //     return error;
  //   }

  //   // handle success
  // }, 0);
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

// const container = document.getElementById("app");
// if (!container) throw new Error("no container found");
