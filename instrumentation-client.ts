import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/demo-posts/*/unlock",
      method: "POST",
    },
  ],
});
